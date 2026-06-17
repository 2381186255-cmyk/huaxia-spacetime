// 华夏时空 - 核心类型定义

import type { Feature, FeatureCollection, Point, MultiPolygon, LineString } from 'geojson';

// ===== 朝代 =====
export interface Dynasty {
  id: number;
  name: string;
  name_en?: string;
  start_year: number;
  end_year: number;
  color: string;
  description?: string;
  sort_order: number;
}

// ===== 空间实体 =====
export interface HistoricalPlace {
  id: number;
  name: string;
  name_en?: string;
  modern_name?: string;
  start_year: number;
  end_year: number;
  geom: Feature<Point>;
  detail_level: 1 | 2 | 3;
  dynasty_id?: number;
  place_type?: string;
  external_refs: Record<string, string>;
  metadata?: Record<string, unknown>;
}

export interface HistoricalRegion {
  id: number;
  name: string;
  name_en?: string;
  start_year: number;
  end_year: number;
  geom: Feature<MultiPolygon>;
  detail_level: 1 | 2 | 3;
  dynasty_id?: number;
  parent_id?: number;
  region_type?: string;
  external_refs: Record<string, string>;
  metadata?: Record<string, unknown>;
}

// ===== 事件 =====
export type EventType =
  | 'war'
  | 'political'
  | 'cultural'
  | 'economic'
  | 'disaster'
  | 'diplomatic'
  | 'rebellion'
  | 'reform'
  | 'founding'
  | 'collapse'
  | 'other';

export interface HistoricalEvent {
  id: number;
  name: string;
  name_en?: string;
  start_year: number;
  end_year?: number;
  start_month?: number;
  start_day?: number;
  end_month?: number;
  end_day?: number;
  lunar_month?: number;
  lunar_day?: number;
  is_lunar: boolean;
  event_type: EventType;
  dynasty_id?: number;
  importance: 1 | 2 | 3 | 4 | 5;
  detail_level: 1 | 2 | 3;
  description?: string;
  summary?: string;
  external_refs: Record<string, string>;
  metadata?: Record<string, unknown>;
  // 关联数据（查询时可选填充）
  places?: EventPlace[];
  persons?: EventPerson[];
  dynasty?: Dynasty;
}

export interface EventPlace {
  id: number;
  name: string;
  modern_name?: string;
  geom: Feature<Point>;
  role?: string;
}

export interface EventPerson {
  id: number;
  name: string;
  role?: string;
}

// ===== 事件势力地块 =====
export interface EventTerritory {
  id: number;
  event_id: number;
  faction: string;
  faction_color: string;
  start_year: number;
  end_year: number;
  geom: Feature<MultiPolygon>;
  properties: Record<string, unknown>;
  keyframe_order: number;
}

// ===== 人物 =====
export type PersonType =
  | 'emperor'
  | 'official'
  | 'general'
  | 'scholar'
  | 'artisan'
  | 'merchant'
  | 'other';

export interface Person {
  id: number;
  name: string;
  name_en?: string;
  courtesy_name?: string;
  art_name?: string;
  birth_year?: number;
  death_year?: number;
  dynasty_id?: number;
  person_type?: PersonType;
  description?: string;
  summary?: string;
  external_refs: Record<string, string>;
  metadata?: Record<string, unknown>;
}

export interface PersonRelation {
  id: number;
  from_person_id: number;
  to_person_id: number;
  relation_type: string;
  description?: string;
}

// ===== 文献 =====
export type DocType =
  | 'classic'
  | 'history'
  | 'philosophy'
  | 'poetry'
  | 'law'
  | 'geography'
  | 'other';

export interface Document {
  id: number;
  title: string;
  title_en?: string;
  author?: string;
  dynasty_id?: number;
  doc_type?: DocType;
  start_year?: number;
  end_year?: number;
  description?: string;
  summary?: string;
  external_refs: Record<string, string>;
  metadata?: Record<string, unknown>;
}

// ===== 因果链 =====
export interface EventCausality {
  id: number;
  cause_event_id: number;
  effect_event_id: number;
  causality_type: string;
  description?: string;
  strength: 1 | 2 | 3 | 4 | 5;
}

export interface CausalityNode {
  event_id: number;
  event_name: string;
  type: 'cause' | 'effect';
  causality_type: string;
  strength: number;
}

// ===== 历史路线 =====
export interface HistoricalRoute {
  id: number;
  name?: string;
  route_type?: 'land' | 'river' | 'canal' | 'sea';
  dynasty_id?: number;
  start_year?: number;
  end_year?: number;
  geom: Feature<LineString>;
  cost?: number;
  reverse_cost?: number;
  metadata?: Record<string, unknown>;
}

// ===== API响应类型 =====
export interface PaginatedResponse<T> {
  total: number;
  page: number;
  limit: number;
  data: T[];
}

export interface TodayEventsResponse {
  date: { month: number; day: number };
  total: number;
  page: number;
  limit: number;
  events: HistoricalEvent[];
}

export interface EventDetailResponse extends HistoricalEvent {
  territories?: EventTerritory[];
  causality?: CausalityNode[];
  documents?: Document[];
}

export interface RouteResult {
  distance_km: number;
  estimated_days?: number;
  route: Feature<LineString, {
    waypoints: Array<{ name: string; geom: [number, number] }>;
  }>;
}

export interface BufferResult {
  buffer: Feature<MultiPolygon>;
  area_km2: number;
}

export interface SpatialAggregateResult {
  count: number;
  area_km2: number;
  features: FeatureCollection;
}

// ===== 模式类型 =====
export type AppMode = 'today' | 'general' | 'dynasty' | 'event';
export type SpatialTool = 'none' | 'measure' | 'buffer' | 'route' | 'select';
export type BasemapType = 'modern' | 'ccts' | 'ancient_overlay';

// ===== 地图视口 =====
export interface MapViewport {
  longitude: number;
  latitude: number;
  zoom: number;
  bearing?: number;
  pitch?: number;
}

// ===== 外部API结果类型 =====
export interface CHGISPlace {
  chgis_id: string;
  name: string;
  name_py: string;
  year_range: [number, number];
  geom: Feature<Point>;
  url: string;
}

export interface CBDBPerson {
  cbdb_id: number;
  name: string;
  name_en?: string;
  birth_year?: number;
  death_year?: number;
  dynasty?: string;
  offices: Array<{
    office_name: string;
    start_year?: number;
    end_year?: number;
  }>;
  kinship_relations: Array<{
    relation_type: string;
    related_person_id: number;
    related_person_name: string;
  }>;
  associations: Array<{
    assoc_type: string;
    associated_person_id: number;
    associated_person_name: string;
  }>;
}

export interface CTextDocument {
  ctext_id: string;
  title: string;
  author?: string;
  content?: string;
  url: string;
}

export interface CTextSearchResult {
  ctext_id: string;
  title: string;
  author?: string;
  excerpt?: string;
  url: string;
}
