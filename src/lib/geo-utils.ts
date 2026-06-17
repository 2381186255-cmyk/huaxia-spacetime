// 华夏时空 - 前端Turf.js空间运算封装

import * as turf from '@turf/turf';
import type { Feature, FeatureCollection, GeoJsonProperties, MultiPolygon, Point, LineString, Polygon } from 'geojson';

/**
 * 计算两点间距离（公里）
 */
export function calculateDistance(
  from: [number, number],
  to: [number, number]
): number {
  const fromPoint = turf.point(from);
  const toPoint = turf.point(to);
  return turf.distance(fromPoint, toPoint, { units: 'kilometers' });
}

/**
 * 计算多边形面积（平方公里）
 */
export function calculateArea(feature: Feature<Polygon | MultiPolygon>): number {
  return turf.area(feature) / 1_000_000; // m² → km²
}

/**
 * 生成缓冲区
 */
export function createBuffer(
  feature: Feature<Point | LineString | Polygon>,
  radiusKm: number
): Feature<Polygon> {
  return turf.buffer(feature, radiusKm, { units: 'kilometers' }) as Feature<Polygon>;
}

/**
 * 计算多边形质心
 */
export function getCentroid(feature: Feature<Polygon | MultiPolygon>): Feature<Point> {
  return turf.centroid(feature);
}

/**
 * 判断点是否在多边形内
 */
export function isPointInPolygon(
  point: Feature<Point>,
  polygon: Feature<Polygon | MultiPolygon>
): boolean {
  return turf.booleanPointInPolygon(point, polygon);
}

/**
 * 计算两个多边形的交集
 */
export function intersect(
  poly1: Feature<Polygon | MultiPolygon>,
  poly2: Feature<Polygon | MultiPolygon>
): Feature<MultiPolygon> | null {
  const result = turf.intersect(turf.featureCollection([poly1, poly2]));
  return result as Feature<MultiPolygon> | null;
}

/**
 * 计算多边形并集
 */
export function union(
  poly1: Feature<Polygon | MultiPolygon>,
  poly2: Feature<Polygon | MultiPolygon>
): Feature<MultiPolygon> | null {
  return turf.union(turf.featureCollection([poly1, poly2])) as Feature<MultiPolygon> | null;
}

/**
 * 简化几何体（降低精度以提升渲染性能）
 */
export function simplify(
  feature: Feature<Polygon | MultiPolygon | LineString>,
  tolerance: number = 0.01
): Feature<Polygon | MultiPolygon | LineString> {
  return turf.simplify(feature, { tolerance, highQuality: false });
}

/**
 * 计算沿线的指定距离点
 */
export function alongLine(
  line: Feature<LineString>,
  distanceKm: number
): Feature<Point> {
  return turf.along(line, distanceKm, { units: 'kilometers' });
}

/**
 * 计算线的总长度（公里）
 */
export function lineLength(line: Feature<LineString>): number {
  return turf.length(line, { units: 'kilometers' });
}

/**
 * 空间聚合：将点按距离聚类
 */
export function clusterPoints(
  points: FeatureCollection<Point>,
  radiusKm: number
): FeatureCollection<Point> {
  const clustered = turf.clustersDbscan(points, radiusKm, { units: 'kilometers', minPoints: 1 });
  return clustered as FeatureCollection<Point>;
}

/**
 * 生成BBox
 */
export function getBBox(feature: Feature | FeatureCollection): number[] {
  return turf.bbox(feature);
}

/**
 * BBox转GeoJSON多边形
 */
export function bboxToPolygon(bbox: number[]): Feature<Polygon> {
  return turf.bboxPolygon(bbox as [number, number, number, number]);
}
