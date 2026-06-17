// 华夏时空 - 空间聚合统计服务

import { query } from '@/services/db';
import type { SpatialAggregateResult } from '@/lib/types';

/**
 * 空间聚合：在指定范围内统计事件/地点数量
 * @param bbox 边界框 [xmin, ymin, xmax, ymax]
 * @param year 年份（可选）
 * @param dynastyId 朝代ID（可选）
 * @param groupBy 分组字段（event_type / dynasty_id / place_type）
 */
export async function spatialAggregate(
  bbox: [number, number, number, number],
  options?: {
    year?: number;
    dynastyId?: number;
    groupBy?: 'event_type' | 'dynasty_id' | 'place_type';
  }
): Promise<SpatialAggregateResult> {
  const { year, dynastyId, groupBy } = options || {};

  // 构建动态WHERE条件
  const conditions: string[] = [
    `hp.geom && ST_MakeEnvelope($1, $2, $3, $4, 4326)`,
  ];
  const params: unknown[] = [...bbox];
  let paramIdx = 5;

  if (year !== undefined) {
    conditions.push(`hp.start_year <= $${paramIdx} AND hp.end_year >= $${paramIdx}`);
    params.push(year);
    paramIdx++;
  }

  if (dynastyId !== undefined) {
    conditions.push(`hp.dynasty_id = $${paramIdx}`);
    params.push(dynastyId);
    paramIdx++;
  }

  const whereClause = conditions.join(' AND ');

  // 按分组聚合
  if (groupBy) {
    const result = await query(
      `SELECT
         hp.${groupBy} as group_key,
         COUNT(*) as count,
         ST_AsGeoJSON(ST_Union(hp.geom)) as geom_geojson
       FROM historical_places hp
       WHERE ${whereClause}
       GROUP BY hp.${groupBy}`,
      params
    );

    const features = result.rows.map(row => ({
      type: 'Feature' as const,
      geometry: JSON.parse(row.geom_geojson),
      properties: {
        group_key: row.group_key,
        count: parseInt(row.count),
      },
    }));

    return {
      count: result.rows.reduce((sum, r) => sum + parseInt(r.count), 0),
      area_km2: 0,
      features: {
        type: 'FeatureCollection',
        features,
      },
    };
  }

  // 不分组：简单统计
  const countResult = await query(
    `SELECT COUNT(*) as total FROM historical_places hp WHERE ${whereClause}`,
    params
  );

  const featuresResult = await query(
    `SELECT
       hp.id,
       hp.name,
       hp.start_year,
       hp.end_year,
       ST_AsGeoJSON(hp.geom) as geom_geojson
     FROM historical_places hp
     WHERE ${whereClause}
     LIMIT 1000`,
    params
  );

  const features = featuresResult.rows.map(row => ({
    type: 'Feature' as const,
    geometry: JSON.parse(row.geom_geojson),
    properties: {
      id: row.id,
      name: row.name,
      start_year: row.start_year,
      end_year: row.end_year,
    },
  }));

  return {
    count: parseInt(countResult.rows[0]?.total || '0'),
    area_km2: 0,
    features: {
      type: 'FeatureCollection',
      features,
    },
  };
}

/**
 * 计算指定区域的面积
 */
export async function calculateArea(
  geom: Record<string, unknown>
): Promise<number> {
  const result = await query(
    `SELECT ST_Area(ST_Transform(ST_GeomFromGeoJSON($1), 3857)) / 1000000 as area_km2`,
    [JSON.stringify(geom)]
  );
  return parseFloat(result.rows[0]?.area_km2 || '0');
}

/**
 * 计算两点间距离
 */
export async function calculateDistance(
  startLng: number,
  startLat: number,
  endLng: number,
  endLat: number
): Promise<number> {
  const result = await query(
    `SELECT ST_Distance(
       ST_Transform(ST_SetSRID(ST_MakePoint($1, $2), 4326), 3857),
       ST_Transform(ST_SetSRID(ST_MakePoint($3, $4), 4326), 3857)
     ) / 1000 as distance_km`,
    [startLng, startLat, endLng, endLat]
  );
  return parseFloat(result.rows[0]?.distance_km || '0');
}
