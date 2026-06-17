// 华夏时空 - pgRouting路径规划服务

import { query } from '@/services/db';
import type { RouteResult } from '@/lib/types';
import type { Feature, LineString } from 'geojson';

/**
 * 最短路径规划
 * @param startLng 起点经度
 * @param startLat 起点纬度
 * @param endLng 终点经度
 * @param endLat 终点纬度
 * @param dynastyId 朝代ID（筛选对应时期的路网）
 * @param routeType 路线类型（land/river/canal/sea）
 */
export async function findShortestRoute(
  startLng: number,
  startLat: number,
  endLng: number,
  endLat: number,
  dynastyId?: number,
  routeType?: string
): Promise<RouteResult> {
  // 1. 找到起终点附近最近的路线节点
  const nearestStart = await findNearestNode(startLng, startLat, dynastyId, routeType);
  const nearestEnd = await findNearestNode(endLng, endLat, dynastyId, routeType);

  if (!nearestStart || !nearestEnd) {
    throw new Error('No route network found near the specified points');
  }

  // 2. 使用pgRouting的dijkstra算法计算最短路径
  const routeResult = await query(
    `SELECT
       ST_AsGeoJSON(ST_LineMerge(ST_Union(r.geom))) as route_geom,
       SUM(r.cost) as total_cost,
       array_agg(r.name ORDER BY seq) as route_names
     FROM pgr_dijkstra(
       'SELECT id, source, target, cost, reverse_cost FROM historical_routes
        WHERE ($4::int IS NULL OR dynasty_id = $4)
        AND ($5::text IS NULL OR route_type = $5)',
       $1,
       $2,
       directed := false
     ) AS path
     JOIN historical_routes r ON path.edge = r.id`,
    [nearestStart.node_id, nearestEnd.node_id, dynastyId, dynastyId, routeType]
  );

  if (routeResult.rows.length === 0 || !routeResult.rows[0].route_geom) {
    throw new Error('No route found between the specified points');
  }

  const row = routeResult.rows[0];
  const routeGeom: Feature<LineString> = {
    type: 'Feature',
    geometry: JSON.parse(row.route_geom),
    properties: {},
  };

  // 3. 计算距离
  const distanceResult = await query(
    `SELECT ST_Length(
       ST_Transform(ST_GeomFromGeoJSON($1), 3857)
     ) / 1000 as distance_km`,
    [JSON.stringify(routeGeom.geometry)]
  );

  const distanceKm = parseFloat(distanceResult.rows[0]?.distance_km || '0');

  return {
    distance_km: Math.round(distanceKm * 10) / 10,
    estimated_days: Math.ceil(distanceKm / 30), // 假设日行30公里
    route: {
      ...routeGeom,
      properties: {
        waypoints: [
          { name: '起点', geom: [startLng, startLat] as [number, number] },
          { name: '终点', geom: [endLng, endLat] as [number, number] },
        ],
      },
    },
  };
}

/**
 * 查找最近的路线网络节点
 */
async function findNearestNode(
  lng: number,
  lat: number,
  dynastyId?: number,
  routeType?: string
): Promise<{ node_id: number; distance: number } | null> {
  const result = await query(
    `SELECT source as node_id,
       ST_Distance(
         ST_Transform(ST_SetSRID(ST_MakePoint($1, $2), 4326), 3857),
         ST_Transform(geom, 3857)
       ) / 1000 as distance_km
     FROM historical_routes
     WHERE ($3::int IS NULL OR dynasty_id = $3)
       AND ($4::text IS NULL OR route_type = $4)
     ORDER BY distance_km
     LIMIT 1`,
    [lng, lat, dynastyId, routeType]
  );

  return (result.rows[0] as { node_id: number; distance: number }) || null;
}

/**
 * 构建路线网络拓扑（初始化时调用）
 */
export async function buildRouteTopology(tolerance: number = 0.0001): Promise<void> {
  await query(`SELECT pgr_createTopology('historical_routes', $1, 'geom', 'id')`, [tolerance]);
  await query(`SELECT pgr_analyzeGraph('historical_routes', $1, 'geom', 'id')`, [tolerance]);
}
