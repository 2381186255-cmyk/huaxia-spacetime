// 华夏时空 - PostGIS缓冲区计算服务

import { query } from '@/services/db';
import type { BufferResult } from '@/lib/types';

/**
 * 生成缓冲区
 * @param geom GeoJSON几何体（Point或LineString）
 * @param radiusKm 缓冲半径（公里）
 */
export async function createBuffer(
  geom: Record<string, unknown>,
  radiusKm: number
): Promise<BufferResult> {
  const result = await query(
    `SELECT
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
       ) / 1000000 as area_km2`,
    [JSON.stringify(geom), radiusKm]
  );

  const row = result.rows[0];
  if (!row) {
    throw new Error('Buffer calculation failed');
  }

  return {
    buffer: JSON.parse(row.geom_geojson),
    area_km2: parseFloat(row.area_km2),
  };
}
