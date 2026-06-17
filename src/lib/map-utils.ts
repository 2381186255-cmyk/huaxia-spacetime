// 华夏时空 - 地图辅助函数

import type { MapViewport, AppMode } from '@/lib/types';
import { DEFAULT_VIEWPORT, MODE_VIEWPORTS } from '@/lib/constants';

/**
 * 获取模式对应的地图视口
 */
export function getModeViewport(mode: AppMode, options?: { dynastyId?: number; eventId?: number }): MapViewport {
  if (mode === 'dynasty' && options?.dynastyId) {
    return getDynastyViewport(options.dynastyId);
  }
  if (mode === 'event' && options?.eventId) {
    return getEventViewport(options.eventId);
  }
  return MODE_VIEWPORTS[mode] || DEFAULT_VIEWPORT;
}

/**
 * 朝代核心区域视口
 */
function getDynastyViewport(dynastyId: number): MapViewport {
  // 各朝代核心区域映射
  const dynastyViewports: Record<number, MapViewport> = {
    1: { longitude: 111.5, latitude: 34.5, zoom: 5 },   // 夏
    2: { longitude: 114.3, latitude: 36.0, zoom: 5 },   // 商
    3: { longitude: 108.9, latitude: 34.3, zoom: 5 },   // 西周（镐京）
    4: { longitude: 112.5, latitude: 34.7, zoom: 5 },   // 东周（洛邑）
    5: { longitude: 108.9, latitude: 34.3, zoom: 5 },   // 秦（咸阳）
    6: { longitude: 108.9, latitude: 34.3, zoom: 5 },   // 西汉（长安）
    8: { longitude: 112.5, latitude: 34.7, zoom: 5 },   // 东汉（洛阳）
    9: { longitude: 112.0, latitude: 33.0, zoom: 4 },   // 三国
    13: { longitude: 108.9, latitude: 34.3, zoom: 5 },  // 隋（长安）
    14: { longitude: 108.9, latitude: 34.3, zoom: 5 },  // 唐（长安）
    16: { longitude: 114.3, latitude: 34.8, zoom: 5 },  // 北宋（开封）
    17: { longitude: 120.2, latitude: 30.3, zoom: 5 },  // 南宋（临安）
    20: { longitude: 116.4, latitude: 39.9, zoom: 5 },  // 元（大都）
    21: { longitude: 116.4, latitude: 39.9, zoom: 5 },  // 明（北京）
    22: { longitude: 116.4, latitude: 39.9, zoom: 5 },  // 清（北京）
  };
  return dynastyViewports[dynastyId] || DEFAULT_VIEWPORT;
}

/**
 * 事件核心区域视口
 */
function getEventViewport(eventId: number): MapViewport {
  // 实际应从数据库查询事件地点后计算中心
  return DEFAULT_VIEWPORT;
}

/**
 * 根据GeoJSON特征集合计算最佳视口
 */
export function fitViewportToFeatures(
  features: Array<{ geom: { type: string; coordinates: unknown } }>
): MapViewport {
  if (features.length === 0) return DEFAULT_VIEWPORT;

  // 简单计算所有点坐标的平均值
  let sumLng = 0, sumLat = 0, count = 0;
  for (const f of features) {
    const coords = extractCoordinates(f.geom);
    for (const [lng, lat] of coords) {
      sumLng += lng;
      sumLat += lat;
      count++;
    }
  }

  if (count === 0) return DEFAULT_VIEWPORT;

  return {
    longitude: sumLng / count,
    latitude: sumLat / count,
    zoom: Math.max(3, 8 - Math.log2(count)),
  };
}

/**
 * 从GeoJSON几何体中提取坐标对
 */
function extractCoordinates(geom: { type: string; coordinates: unknown }): [number, number][] {
  const coords: [number, number][] = [];
  const c = geom.coordinates as unknown;

  if (geom.type === 'Point') {
    coords.push(c as [number, number]);
  } else if (geom.type === 'LineString') {
    coords.push(...(c as [number, number][]));
  } else if (geom.type === 'MultiPoint' || geom.type === 'Polygon') {
    for (const ring of c as [number, number][][]) {
      if (Array.isArray(ring[0])) {
        coords.push(...(ring as [number, number][]));
      } else {
        coords.push(ring as unknown as [number, number]);
      }
    }
  } else if (geom.type === 'MultiPolygon') {
    for (const polygon of c as [number, number][][][]) {
      for (const ring of polygon) {
        coords.push(...(ring as [number, number][]));
      }
    }
  }

  return coords;
}

/**
 * MapLibre图层过滤表达式：基于年份过滤
 */
export function createYearFilter(year: number): unknown[] {
  return ['all',
    ['<=', 'start_year', year],
    ['>=', 'end_year', year],
  ];
}

/**
 * MapLibre图层过滤表达式：基于年份范围过滤
 */
export function createYearRangeFilter(startYear: number, endYear: number): unknown[] {
  return ['all',
    ['<=', 'start_year', endYear],
    ['>=', 'end_year', startYear],
  ];
}
