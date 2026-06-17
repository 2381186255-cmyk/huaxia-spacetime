"""
华夏时空 - FastAPI空间分析服务
用于处理复杂的空间运算请求（pgRouting路径规划等）
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import asyncpg
import json

app = FastAPI(title="华夏时空 - 空间分析服务", version="1.0.0")

# CORS配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 数据库连接池
pool: Optional[asyncpg.Pool] = None


@app.on_event("startup")
async def startup():
    global pool
    import os
    database_url = os.getenv(
        "DATABASE_URL",
        "postgresql://huaxia:huaxia_dev_2024@localhost:5432/huaxia_spacetime"
    )
    pool = await asyncpg.create_pool(database_url, max_size=10)


@app.on_event("shutdown")
async def shutdown():
    if pool:
        await pool.close()


# ===== 请求模型 =====

class PointModel(BaseModel):
    type: str
    coordinates: list[float]


class RouteRequest(BaseModel):
    start: PointModel
    end: PointModel
    dynasty_id: Optional[int] = None
    route_type: Optional[str] = None
    weight: Optional[str] = "distance"


class BufferRequest(BaseModel):
    geom: dict
    radius_km: float


class AggregateRequest(BaseModel):
    bbox: list[float]  # [xmin, ymin, xmax, ymax]
    year: Optional[float] = None
    dynasty_id: Optional[int] = None
    group_by: Optional[str] = None


# ===== 路径规划 =====

@app.post("/spatial/route")
async def find_route(req: RouteRequest):
    """最短路径规划（pgRouting dijkstra）"""
    async with pool.acquire() as conn:
        # 找最近节点
        start_node = await conn.fetchrow(
            """
            SELECT source as node_id,
                   ST_Distance(
                     ST_Transform(ST_SetSRID(ST_MakePoint($1, $2), 4326), 3857),
                     ST_Transform(geom, 3857)
                   ) / 1000 as distance_km
            FROM historical_routes
            WHERE ($3::int IS NULL OR dynasty_id = $3)
              AND ($4::text IS NULL OR route_type = $4)
            ORDER BY distance_km
            LIMIT 1
            """,
            req.start.coordinates[0], req.start.coordinates[1],
            req.dynasty_id, req.route_type
        )

        end_node = await conn.fetchrow(
            """
            SELECT source as node_id,
                   ST_Distance(
                     ST_Transform(ST_SetSRID(ST_MakePoint($1, $2), 4326), 3857),
                     ST_Transform(geom, 3857)
                   ) / 1000 as distance_km
            FROM historical_routes
            WHERE ($3::int IS NULL OR dynasty_id = $3)
              AND ($4::text IS NULL OR route_type = $4)
            ORDER BY distance_km
            LIMIT 1
            """,
            req.end.coordinates[0], req.end.coordinates[1],
            req.dynasty_id, req.route_type
        )

        if not start_node or not end_node:
            raise HTTPException(status_code=404, detail="No route network found near the specified points")

        # pgRouting最短路径
        route = await conn.fetchrow(
            """
            SELECT
              ST_AsGeoJSON(ST_LineMerge(ST_Union(r.geom))) as route_geom,
              SUM(r.cost) as total_cost
            FROM pgr_dijkstra(
              'SELECT id, source, target, cost, reverse_cost FROM historical_routes
               WHERE ($1::int IS NULL OR dynasty_id = $1)
               AND ($2::text IS NULL OR route_type = $2)',
              $3, $4,
              directed := false
            ) AS path
            JOIN historical_routes r ON path.edge = r.id
            """,
            req.dynasty_id, req.route_type,
            start_node['node_id'], end_node['node_id']
        )

        if not route or not route['route_geom']:
            raise HTTPException(status_code=404, detail="No route found between the specified points")

        # 计算距离
        distance = await conn.fetchrow(
            """
            SELECT ST_Length(
              ST_Transform(ST_GeomFromGeoJSON($1), 3857)
            ) / 1000 as distance_km
            """,
            route['route_geom']
        )

        return {
            "distance_km": round(distance['distance_km'], 1) if distance else 0,
            "estimated_days": round(distance['distance_km'] / 30) if distance else 0,
            "route": {
                "type": "Feature",
                "geometry": json.loads(route['route_geom']),
                "properties": {
                    "waypoints": [
                        {"name": "起点", "geom": req.start.coordinates},
                        {"name": "终点", "geom": req.end.coordinates},
                    ]
                }
            }
        }


# ===== 缓冲区 =====

@app.post("/spatial/buffer")
async def create_buffer(req: BufferRequest):
    """生成缓冲区"""
    async with pool.acquire() as conn:
        result = await conn.fetchrow(
            """
            SELECT
              ST_AsGeoJSON(
                ST_Transform(
                  ST_Buffer(
                    ST_Transform(ST_GeomFromGeoJSON($1), 3857),
                    $2 * 1000
                  ),
                  4326
                )
              ) as geom_geojson,
              ST_Area(
                ST_Transform(
                  ST_Buffer(
                    ST_Transform(ST_GeomFromGeoJSON($1), 3857),
                    $2 * 1000
                  ),
                  3857
                )
              ) / 1000000 as area_km2
            """,
            json.dumps(req.geom), req.radius_km
        )

        if not result:
            raise HTTPException(status_code=500, detail="Buffer calculation failed")

        return {
            "buffer": json.loads(result['geom_geojson']),
            "area_km2": round(float(result['area_km2']), 2)
        }


# ===== 空间聚合 =====

@app.post("/spatial/aggregate")
async def spatial_aggregate(req: AggregateRequest):
    """空间聚合统计"""
    async with pool.acquire() as conn:
        conditions = ["hp.geom && ST_MakeEnvelope($1, $2, $3, $4, 4326)"]
        params = [req.bbox[0], req.bbox[1], req.bbox[2], req.bbox[3]]
        param_idx = 5

        if req.year is not None:
            conditions.append(f"hp.start_year <= ${param_idx} AND hp.end_year >= ${param_idx}")
            params.append(req.year)
            param_idx += 1

        if req.dynasty_id is not None:
            conditions.append(f"hp.dynasty_id = ${param_idx}")
            params.append(req.dynasty_id)
            param_idx += 1

        where_clause = " AND ".join(conditions)

        if req.group_by:
            rows = await conn.fetch(
                f"""
                SELECT
                  hp.{req.group_by} as group_key,
                  COUNT(*) as count,
                  ST_AsGeoJSON(ST_Union(hp.geom)) as geom_geojson
                FROM historical_places hp
                WHERE {where_clause}
                GROUP BY hp.{req.group_by}
                """,
                *params
            )

            features = []
            total = 0
            for row in rows:
                total += row['count']
                features.append({
                    "type": "Feature",
                    "geometry": json.loads(row['geom_geojson']),
                    "properties": {
                        "group_key": row['group_key'],
                        "count": row['count'],
                    }
                })

            return {
                "count": total,
                "area_km2": 0,
                "features": {"type": "FeatureCollection", "features": features}
            }

        # 不分组
        count_row = await conn.fetchrow(
            f"SELECT COUNT(*) as total FROM historical_places hp WHERE {where_clause}",
            *params
        )

        return {
            "count": count_row['total'] if count_row else 0,
            "area_km2": 0,
            "features": {"type": "FeatureCollection", "features": []}
        }


# ===== 健康检查 =====

@app.get("/health")
async def health():
    async with pool.acquire() as conn:
        result = await conn.fetchrow("SELECT 1 as ok")
        return {"status": "healthy", "database": "up" if result else "down"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
