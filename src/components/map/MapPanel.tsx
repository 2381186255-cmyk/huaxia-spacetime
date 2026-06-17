"use client";

import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { Map, Source, Layer, NavigationControl, Popup, MapRef } from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import type { FilterSpecification, StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useAppStore } from "@/stores/appStore";
import { formatYear } from "@/lib/date-utils";
import { PLACE_TYPE_LABELS } from "@/lib/constants";
import { MOCK_TERRITORIES, MOCK_PLACES } from "@/services/mock-data";
import type { FeatureCollection, Point, LineString, MultiPolygon, Position } from "geojson";
import type { HistoricalEvent } from "@/lib/types";

// ===== 中文暗色底图样式 =====
// 使用 CARTO 暗色无标注底图 + 中文地名标注图层
const DARK_MAP_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    'carto-dark': {
      type: 'raster',
      tiles: [
        'https://basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}@2x.png'
      ],
      tileSize: 256,
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
    }
  },
  layers: [{
    id: 'carto-dark-layer',
    type: 'raster',
    source: 'carto-dark',
    minzoom: 0,
    maxzoom: 19
  }],
  glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
};

// ===== CCTS 中華文明之時空基礎架構 WMTS 朝代图层映射 =====
const CCTS_DYNASTY_LAYERS: Record<number, string> = {
  1: 'shang',          // 夏(用商时期近似)
  2: 'shang',          // 商
  3: 'Xijhou',         // 西周
  4: 'spring_autumn',  // 东周/春秋
  5: 'bc0210',         // 秦
  6: 'bc0007',         // 西汉
  7: 'ad0140',         // 东汉
  8: 'ad0262',         // 三国
  9: 'ad0281',         // 西晋
  10: 'ad0382',        // 东晋
  11: 'ad0497',        // 南北朝
  12: 'ad0612',        // 隋
  13: 'ad0741',        // 唐
  14: 'ad0741',        // 五代(用唐近似)
  15: 'ad1111',        // 北宋
  16: 'ad1208',        // 南宋
  17: 'ad1330',        // 元
  18: 'ad1582',        // 明
  19: 'ad1820',        // 清
};

// 根据年份推算当前朝代 ID
function getCurrentDynastyId(year: number): number | null {
  if (year < -2070) return null;
  if (year <= -1600) return 1;  // 夏
  if (year <= -1046) return 2;  // 商
  if (year <= -771) return 3;   // 西周
  if (year <= -256) return 4;   // 东周
  if (year <= -206) return 5;   // 秦
  if (year <= 8) return 6;      // 西汉
  if (year <= 220) return 7;    // 东汉
  if (year <= 280) return 8;    // 三国
  if (year <= 316) return 9;    // 西晋
  if (year <= 420) return 10;   // 东晋
  if (year <= 589) return 11;   // 南北朝
  if (year <= 618) return 12;   // 隋
  if (year <= 907) return 13;   // 唐
  if (year <= 960) return 14;   // 五代十国
  if (year <= 1127) return 15;  // 北宋
  if (year <= 1279) return 16;  // 南宋
  if (year <= 1368) return 17;  // 元
  if (year <= 1644) return 18;  // 明
  if (year <= 1912) return 19;  // 清
  return null;
}

// 构建 CCTS WMTS 瓦片 URL
function getCctsTileUrl(layer: string): string {
  const baseUrl =
    process.env.NEXT_PUBLIC_CCTS_WMTS_URL ||
    "https://gis.sinica.edu.tw/ccts/wmts";
  return `${baseUrl}?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=${layer}&STYLE=_null&FORMAT=image/png&TILEMATRIXSET=GoogleMapsCompatible&TILEMATRIX={z}&TILECOL={x}&TILEROW={y}`;
}

// ===== 中文地名 GeoJSON（基于 MOCK_PLACES） =====
const chinesePlacesGeoJSON: FeatureCollection<Point> = {
  type: "FeatureCollection",
  features: MOCK_PLACES.map((place) => ({
    type: "Feature" as const,
    geometry: place.geom.geometry,
    properties: {
      name: place.name,
      modernName: place.modern_name || "",
      placeType: place.place_type,
      importance: place.place_type === "capital" ? 1 : 2,
    },
  })),
};

// 扩展事件类型，支持时间透明度
interface TimelineEvent extends HistoricalEvent {
  timeOpacity?: number;
  timeStatus?: string;
}

interface MapPanelProps {
  events?: TimelineEvent[];
  onMarkerClick?: (eventId: number) => void;
  selectedEventId?: number | null;
}

// ===== 疆域地块 GeoJSON =====
const territoryGeoJSON: FeatureCollection<MultiPolygon> = {
  type: "FeatureCollection",
  features: MOCK_TERRITORIES.map((t) => ({
    type: "Feature" as const,
    geometry: t.geom,
    properties: {
      dynastyId: t.dynasty_id,
      dynastyName: t.dynasty_name,
      color: t.color,
      startYear: t.start_year,
      endYear: t.end_year,
    },
  })),
};

export function MapPanel({ events = [], onMarkerClick, selectedEventId }: MapPanelProps) {
  const { mapViewport, setMapViewport, currentMode, currentYear, activeLayers, addActiveLayer, removeActiveLayer, basemapType, setBasemapType, selectedDynastyId } = useAppStore();
  const mapRef = useRef<MapRef>(null);
  const [popupInfo, setPopupInfo] = useState<{
    longitude: number;
    latitude: number;
    placeName: string;
    modernName?: string;
    eventName: string;
    year: number;
    dynasty?: string;
    dynastyColor?: string;
    placeType?: string;
    eventId: number;
  } | null>(null);
  const [hoveredTerritory, setHoveredTerritory] = useState<string | null>(null);
  const cctsErrorCountRef = useRef(0);
  const cctsErrorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [territoryPopup, setTerritoryPopup] = useState<{
    longitude: number;
    latitude: number;
    dynastyName: string;
    startYear: number;
    endYear: number;
    color: string;
  } | null>(null);

  // 地块是否可见：通史和断代模式默认显示，或用户手动开启
  const showTerritories = activeLayers.includes("territories") || currentMode === "general" || currentMode === "dynasty";

  // 时间过滤：基于 currentYear 过滤疆域地块
  const territoryFilter: FilterSpecification = useMemo(() => {
    if (currentYear === null) return ["all"];
    return [
      "all",
      ["<=", ["get", "startYear"], currentYear],
      [">=", ["get", "endYear"], currentYear],
    ] as FilterSpecification;
  }, [currentYear]);

  // 地点标记 GeoJSON
  const placesGeoJSON: FeatureCollection<Point> = useMemo(() => {
    const features = events.flatMap((event) =>
      (event.places || []).map((place) => ({
        type: "Feature" as const,
        geometry: place.geom.geometry,
        properties: {
          eventId: event.id,
          eventName: event.name,
          placeName: place.name,
          modernName: place.modern_name || "",
          year: event.start_year,
          dynasty: event.dynasty?.name || "",
          dynastyColor: event.dynasty?.color || "#c41e3a",
          placeType: (place as unknown as Record<string, unknown>).place_type as string || "",
          importance: event.importance,
          timeOpacity: event.timeOpacity ?? 1,
        },
      }))
    );
    return { type: "FeatureCollection", features };
  }, [events]);

  // 事件连线 GeoJSON
  const routesGeoJSON: FeatureCollection<LineString> = useMemo(() => {
    const features = events.flatMap((event) => {
      const places = event.places || [];
      if (places.length < 2) return [];
      const coords = places
        .map((p) => p.geom.geometry.coordinates)
        .filter((c): c is number[] => c.length === 2);
      if (coords.length < 2) return [];
      return [{
        type: "Feature" as const,
        geometry: { type: "LineString" as const, coordinates: coords },
        properties: {
          eventId: event.id,
          eventName: event.name,
          dynastyColor: event.dynasty?.color || "#c41e3a",
          timeOpacity: event.timeOpacity ?? 1,
        },
      }];
    });
    return { type: "FeatureCollection", features };
  }, [events]);

  // 安全查询地块图层（图层可能不存在）
  const queryTerritoryFeatures = useCallback((e: maplibregl.MapMouseEvent) => {
    const map = e.target;
    const style = map.getStyle();
    const hasTerritoryLayer = style?.layers?.some(l => l.id === "territory-fill");
    if (!hasTerritoryLayer) return [];
    return map.queryRenderedFeatures(e.point, { layers: ["territory-fill"] });
  }, []);

  // 地块点击：飞行到地块中心
  const handleTerritoryClick = useCallback((e: maplibregl.MapMouseEvent) => {
    const features = queryTerritoryFeatures(e);
    if (features.length > 0) {
      const props = features[0].properties;
      const geom = features[0].geometry as MultiPolygon;
      const allCoords = geom.coordinates.flat(2) as Position[];
      if (allCoords.length > 0) {
        const avgLng = allCoords.reduce((s, c) => s + c[0], 0) / allCoords.length;
        const avgLat = allCoords.reduce((s, c) => s + c[1], 0) / allCoords.length;
        mapRef.current?.flyTo({ center: [avgLng, avgLat], zoom: 5, duration: 1500, curve: 1.4, easing: (t: number) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2 });
      }
      setTerritoryPopup({
        longitude: e.lngLat.lng,
        latitude: e.lngLat.lat,
        dynastyName: props.dynastyName,
        startYear: props.startYear,
        endYear: props.endYear,
        color: props.color,
      });
    } else {
      setTerritoryPopup(null);
    }
  }, [queryTerritoryFeatures]);

  // 地块 hover
  const handleTerritoryHover = useCallback((e: maplibregl.MapMouseEvent) => {
    const features = queryTerritoryFeatures(e);
    if (features.length > 0) {
      setHoveredTerritory(features[0].id as string);
      e.target.getCanvas().style.cursor = "pointer";
    } else {
      setHoveredTerritory(null);
      e.target.getCanvas().style.cursor = "";
    }
  }, [queryTerritoryFeatures]);

  // 地点标记点击
  const handleMapClick = useCallback(
    (e: maplibregl.MapMouseEvent) => {
      // 先检查地块
      const territoryFeatures = queryTerritoryFeatures(e);
      if (territoryFeatures.length > 0) {
        handleTerritoryClick(e);
        return;
      }

      // 再检查地点标记
      const style = e.target.getStyle();
      const hasPlaceLayer = style?.layers?.some(l => l.id === "place-markers");
      if (hasPlaceLayer) {
        const features = e.target.queryRenderedFeatures(e.point, {
          layers: ["place-markers"],
        });
        if (features.length > 0) {
          const props = features[0].properties;
          const coords = (features[0].geometry as Point).coordinates;
          setPopupInfo({
            longitude: coords[0],
            latitude: coords[1],
            placeName: props.placeName,
            modernName: props.modernName,
            eventName: props.eventName,
            year: props.year,
            dynasty: props.dynasty,
            dynastyColor: props.dynastyColor,
            placeType: props.placeType,
            eventId: props.eventId,
          });
          mapRef.current?.flyTo({ center: [coords[0], coords[1]], zoom: 7, duration: 1200, curve: 1.4, easing: (t: number) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2 });
          onMarkerClick?.(props.eventId);
          return;
        }
      }

      setPopupInfo(null);
      setTerritoryPopup(null);
    },
    [onMarkerClick, handleTerritoryClick, queryTerritoryFeatures]
  );

  // 鼠标移动
  const handleMouseMove = useCallback((e: maplibregl.MapMouseEvent) => {
    handleTerritoryHover(e);
  }, [handleTerritoryHover]);

  const interactiveLayers = showTerritories
    ? ["place-markers", "territory-fill"]
    : ["place-markers"];

  // ===== CCTS 古地图图层管理 =====
  // 根据 basemapType 和当前朝代动态添加/移除 CCTS WMTS 图层
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    // 确定当前朝代
    const activeDynastyId = selectedDynastyId ?? (currentYear != null ? getCurrentDynastyId(currentYear) : null);
    const cctsLayer = activeDynastyId != null ? CCTS_DYNASTY_LAYERS[activeDynastyId] : undefined;

    // 是否需要显示 CCTS 图层
    const showCcts = (basemapType === 'ccts' || basemapType === 'ancient_overlay') && cctsLayer;

    // 清理已有 CCTS 图层
    const removeCctsLayers = () => {
      if (map.getLayer('ccts-basemap-layer')) {
        map.removeLayer('ccts-basemap-layer');
      }
      if (map.getLayer('ccts-overlay-layer')) {
        map.removeLayer('ccts-overlay-layer');
      }
      if (map.getSource('ccts-tiles')) {
        map.removeSource('ccts-tiles');
      }
    };

    // 控制暗色底图可见性
    const cartoLayer = map.getLayer('carto-dark-layer');
    if (cartoLayer) {
      map.setLayoutProperty(
        'carto-dark-layer',
        'visibility',
        basemapType === 'ccts' ? 'none' : 'visible'
      );
    }

    if (!showCcts) {
      removeCctsLayers();
      return;
    }

    // 移除旧图层再添加新的（图层名可能变化）
    removeCctsLayers();

    const tileUrl = getCctsTileUrl(cctsLayer);

    let cleanupFn: (() => void) | null = null;

    try {
      map.addSource('ccts-tiles', {
        type: 'raster',
        tiles: [tileUrl],
        tileSize: 256,
        attribution: '&copy; <a href="https://ccts.ascc.sinica.edu.tw/">CCTS 中研院</a>',
      });

      if (basemapType === 'ccts') {
        // 古地图底图模式：不透明，替代暗色底图
        map.addLayer({
          id: 'ccts-basemap-layer',
          type: 'raster',
          source: 'ccts-tiles',
          paint: {
            'raster-opacity': 1,
          },
        }, 'chinese-place-labels'); // 插入到地名标注之前
      } else {
        // 叠加模式：半透明叠加在暗色底图之上
        map.addLayer({
          id: 'ccts-overlay-layer',
          type: 'raster',
          source: 'ccts-tiles',
          paint: {
            'raster-opacity': 0.7,
          },
        }, 'territory-glow'); // 插入到疆域光晕层之前，使疆域显示在最上层
      }

      // 瓦片加载错误降级：连续失败时自动切回现代底图
      const handleCctsError = (e: maplibregl.MapLibreEvent & { error?: Error; sourceId?: string; source?: { id?: string } }) => {
        const srcId = e.sourceId || e.source?.id;
        if (srcId !== 'ccts-tiles') return;
        cctsErrorCountRef.current += 1;
        if (cctsErrorTimerRef.current) clearTimeout(cctsErrorTimerRef.current);
        cctsErrorTimerRef.current = setTimeout(() => {
          cctsErrorCountRef.current = 0;
        }, 3000);
        if (cctsErrorCountRef.current >= 5) {
          console.warn('CCTS 古地图瓦片加载失败次数过多，已自动降级到现代底图');
          cctsErrorCountRef.current = 0;
          if (cctsErrorTimerRef.current) clearTimeout(cctsErrorTimerRef.current);
          setBasemapType('modern');
        }
      };
      map.on('error', handleCctsError);

      cleanupFn = () => {
        map.off('error', handleCctsError);
        if (cctsErrorTimerRef.current) clearTimeout(cctsErrorTimerRef.current);
      };
    } catch (e) {
      // 图层/源可能已存在或添加失败，静默处理
      console.warn('CCTS WMTS 图层添加失败:', e);
    }

    return cleanupFn || undefined;
  }, [basemapType, currentYear, selectedDynastyId, setBasemapType]);

  return (
    <div className="relative flex-1 min-w-0">
      <Map
        ref={mapRef}
        mapLib={maplibregl}
        initialViewState={{
          longitude: mapViewport.longitude,
          latitude: mapViewport.latitude,
          zoom: mapViewport.zoom,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle={DARK_MAP_STYLE}
        onMove={(e) =>
          setMapViewport({
            longitude: e.viewState.longitude,
            latitude: e.viewState.latitude,
            zoom: e.viewState.zoom,
          })
        }
        onClick={handleMapClick}
        onMouseMove={handleMouseMove}
        interactiveLayerIds={interactiveLayers}
      >
        <NavigationControl position="top-right" />

        {/* ===== 中文地名标注图层 ===== */}
        <Source id="chinese-places" type="geojson" data={chinesePlacesGeoJSON}>
          <Layer
            id="chinese-place-labels"
            type="symbol"
            layout={{
              "text-field": ["get", "name"],
              "text-size": [
              "interpolate", ["linear"], ["zoom"],
              3, 10,
              6, 12,
              10, 14,
            ],
              "text-anchor": "top",
              "text-offset": [0, 0.8],
              "text-optional": true,
              "text-allow-overlap": false,
              "text-ignore-placement": false,
              "visibility": "visible",
              "text-letter-spacing": 0.08,
            }}
            paint={{
              "text-color": "#e0d8c8",
              "text-halo-color": "#0a0a14",
              "text-halo-width": 2.5,
              "text-opacity": [
                "interpolate", ["linear"], ["zoom"],
                2, 0,
                4, 0.85,
                6, 1,
              ],
            }}
            minzoom={3}
          />
        </Source>

        {/* ===== 疆域地块图层 ===== */}
        {showTerritories && (
          <Source id="territories" type="geojson" data={territoryGeoJSON}>
            {/* 地块外光晕层 - 大范围柔和发光 */}
            <Layer
              id="territory-glow"
              type="fill"
              filter={territoryFilter}
              paint={{
                "fill-color": ["get", "color"],
                "fill-opacity": [
                  "interpolate", ["linear"], ["zoom"],
                  3, 0.04,
                  6, 0.08,
                  10, 0.12,
                ],
              }}
            />
            {/* 地块填充 - 带渐变效果 */}
            <Layer
              id="territory-fill"
              type="fill"
              filter={territoryFilter}
              paint={{
                "fill-color": ["get", "color"],
                "fill-opacity": [
                  "interpolate", ["linear"], ["zoom"],
                  3, ["case", ["boolean", ["feature-state", "hover"], false], 0.45, 0.28],
                  6, ["case", ["boolean", ["feature-state", "hover"], false], 0.40, 0.22],
                  10, ["case", ["boolean", ["feature-state", "hover"], false], 0.35, 0.18],
                ],
              }}
            />
            {/* 地块内层 - 增加层次感 */}
            <Layer
              id="territory-fill-inner"
              type="fill"
              filter={territoryFilter}
              paint={{
                "fill-color": ["get", "color"],
                "fill-opacity": [
                  "case",
                  ["boolean", ["feature-state", "hover"], false],
                  0.15,
                  0.08,
                ],
              }}
            />
            {/* 地块主边界 - 粗实线 */}
            <Layer
              id="territory-border"
              type="line"
              filter={territoryFilter}
              paint={{
                "line-color": ["get", "color"],
                "line-width": [
                  "interpolate", ["linear"], ["zoom"],
                  3, 1.5,
                  6, 2.5,
                  10, 3,
                ],
                "line-opacity": 0.9,
                "line-blur": 0.5,
              }}
            />
            {/* 地块高光边界 - 细亮线 */}
            <Layer
              id="territory-border-highlight"
              type="line"
              filter={territoryFilter}
              paint={{
                "line-color": "#ffffff",
                "line-width": [
                  "case",
                  ["boolean", ["feature-state", "hover"], false],
                  1.2,
                  0.6,
                ],
                "line-opacity": [
                  "case",
                  ["boolean", ["feature-state", "hover"], false],
                  0.6,
                  0.25,
                ],
              }}
            />
            {/* 地块名称标注 */}
            <Layer
              id="territory-labels"
              type="symbol"
              filter={territoryFilter}
              layout={{
                "text-field": ["get", "dynastyName"],
                "text-size": [
                  "interpolate", ["linear"], ["zoom"],
                  3, 11,
                  6, 13,
                  10, 15,
                ],
                "text-anchor": "center",
                "text-optional": true,
                "text-letter-spacing": 0.1,
              }}
              paint={{
                "text-color": "#ffffff",
                "text-halo-color": ["get", "color"],
                "text-halo-width": 2.5,
                "text-opacity": 0.95,
              }}
            />
          </Source>
        )}

        {/* ===== 事件连线图层 ===== */}
        {routesGeoJSON.features.length > 0 && (
          <Source id="routes" type="geojson" data={routesGeoJSON}>
            {/* 连线外光晕 */}
            <Layer
              id="route-lines-glow"
              type="line"
              paint={{
                "line-color": ["get", "dynastyColor"],
                "line-width": 6,
                "line-opacity": ["*", ["get", "timeOpacity"], 0.15],
                "line-blur": 4,
              }}
            />
            {/* 连线主体 - 流动虚线 */}
            <Layer
              id="route-lines"
              type="line"
              paint={{
                "line-color": ["get", "dynastyColor"],
                "line-width": [
                  "interpolate", ["linear"], ["zoom"],
                  3, 1.5,
                  6, 2,
                  10, 2.5,
                ],
                "line-opacity": ["*", ["get", "timeOpacity"], 0.7],
                "line-dasharray": [2, 2],
              }}
            />
          </Source>
        )}

        {/* ===== 地点标记图层 ===== */}
        {placesGeoJSON.features.length > 0 && (
          <Source id="places" type="geojson" data={placesGeoJSON}>
            {/* 外层大光晕 - 营造氛围 */}
            <Layer
              id="place-aura"
              type="circle"
              paint={{
                "circle-radius": ["interpolate", ["linear"], ["get", "importance"],
                  1, 24, 2, 20, 3, 16, 4, 14, 5, 12],
                "circle-color": ["get", "dynastyColor"],
                "circle-opacity": ["*", ["get", "timeOpacity"], 0.08],
                "circle-blur": 1,
              }}
            />
            {/* 中层光晕 */}
            <Layer
              id="place-glow"
              type="circle"
              paint={{
                "circle-radius": ["interpolate", ["linear"], ["get", "importance"],
                  1, 16, 2, 13, 3, 11, 4, 9, 5, 7],
                "circle-color": ["get", "dynastyColor"],
                "circle-opacity": ["*", ["get", "timeOpacity"], 0.2],
                "circle-blur": 0.8,
              }}
            />
            {/* 标记主体 - 带描边 */}
            <Layer
              id="place-markers"
              type="circle"
              paint={{
                "circle-radius": ["interpolate", ["linear"], ["get", "importance"],
                  1, 8, 2, 6.5, 3, 5, 4, 4, 5, 3],
                "circle-color": ["get", "dynastyColor"],
                "circle-opacity": ["get", "timeOpacity"],
                "circle-stroke-width": 2,
                "circle-stroke-color": "#ffffff",
                "circle-stroke-opacity": ["get", "timeOpacity"],
              }}
            />
            {/* 标记中心高光点 */}
            <Layer
              id="place-markers-core"
              type="circle"
              paint={{
                "circle-radius": ["interpolate", ["linear"], ["get", "importance"],
                  1, 3, 2, 2.5, 3, 2, 4, 1.5, 5, 1],
                "circle-color": "#ffffff",
                "circle-opacity": ["*", ["get", "timeOpacity"], 0.9],
              }}
            />
            <Layer
              id="place-labels"
              type="symbol"
              layout={{
                "text-field": ["get", "placeName"],
                "text-size": [
                  "interpolate", ["linear"], ["zoom"],
                  3, 9,
                  6, 11,
                  10, 12,
                ],
                "text-offset": [0, 1.5],
                "text-anchor": "top",
                "text-optional": true,
                "text-letter-spacing": 0.05,
              }}
              paint={{
                "text-color": "#f5f5f5",
                "text-halo-color": "#000000",
                "text-halo-width": 2,
                "text-opacity": ["get", "timeOpacity"],
              }}
            />
          </Source>
        )}

        {/* ===== 地点详情弹窗 ===== */}
        {popupInfo && (
          <Popup
            longitude={popupInfo.longitude}
            latitude={popupInfo.latitude}
            anchor="bottom"
            onClose={() => setPopupInfo(null)}
            closeButton={true}
            closeOnClick={false}
            maxWidth="260px"
            className="map-popup-enhanced"
          >
            <div className="text-xs min-w-[180px] p-1">
              <div className="flex items-center gap-2 mb-2">
                {popupInfo.dynastyColor && (
                  <div
                    className="w-3 h-3 rounded-full shrink-0 ring-2 ring-white/20"
                    style={{ backgroundColor: popupInfo.dynastyColor, boxShadow: `0 0 8px ${popupInfo.dynastyColor}80` }}
                  />
                )}
                <span className="font-semibold text-text-primary text-[14px] tracking-wide">{popupInfo.placeName}</span>
              </div>
              {popupInfo.modernName && popupInfo.modernName !== popupInfo.placeName && (
                <p className="text-[10px] text-text-tertiary mb-1.5 italic">今 {popupInfo.modernName}</p>
              )}
              {popupInfo.placeType && (
                <span className="inline-block text-[9px] px-2 py-0.5 rounded-full bg-accent/15 text-accent mb-2 border border-accent/20">
                  {PLACE_TYPE_LABELS[popupInfo.placeType] || popupInfo.placeType}
                </span>
              )}
              <div className="pt-2 border-t border-border/60">
                <p className="text-[11px] text-text-primary font-medium leading-relaxed">{popupInfo.eventName}</p>
                <p className="text-[10px] text-text-tertiary mt-0.5">
                  {formatYear(popupInfo.year)}{popupInfo.dynasty ? ` · ${popupInfo.dynasty}` : ""}
                </p>
              </div>
              <button
                className="mt-2.5 w-full text-center text-[10px] py-1.5 rounded-md bg-accent/15 text-accent hover:bg-accent/25 transition-all duration-200 border border-accent/20 hover:border-accent/40"
                onClick={() => onMarkerClick?.(popupInfo.eventId)}
              >
                查看事件详情 →
              </button>
            </div>
          </Popup>
        )}

        {/* ===== 疆域地块弹窗 ===== */}
        {territoryPopup && (
          <Popup
            longitude={territoryPopup.longitude}
            latitude={territoryPopup.latitude}
            anchor="bottom"
            onClose={() => setTerritoryPopup(null)}
            closeButton={true}
            closeOnClick={false}
            maxWidth="220px"
            className="map-popup-enhanced"
          >
            <div className="text-xs min-w-[160px] p-1">
              <div className="flex items-center gap-2 mb-1.5">
                <div
                  className="w-3.5 h-3.5 rounded shrink-0 ring-2 ring-white/20"
                  style={{ backgroundColor: territoryPopup.color, boxShadow: `0 0 8px ${territoryPopup.color}80` }}
                />
                <span className="font-semibold text-text-primary text-[14px] tracking-wide">{territoryPopup.dynastyName}</span>
              </div>
              <p className="text-[10px] text-text-secondary">
                {formatYear(territoryPopup.startYear)} — {formatYear(territoryPopup.endYear)}
              </p>
              <p className="text-[9px] text-text-tertiary mt-1.5 pt-1.5 border-t border-border/40">
                延续 <span className="text-accent font-medium">{territoryPopup.endYear - territoryPopup.startYear}</span> 年
              </p>
            </div>
          </Popup>
        )}
      </Map>

      {/* 图层控制 */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        <LayerControl />
        <MapLegend events={events} />
      </div>

      {/* 底图切换 */}
      <div className="absolute bottom-4 left-4 z-10">
        <BasemapSwitcher />
      </div>
    </div>
  );
}

// ===== 图层控制 =====
function LayerControl() {
  const { activeLayers, addActiveLayer, removeActiveLayer } = useAppStore();

  const layers = [
    { id: "territories", label: "疆域地块", icon: "🗺️" },
    { id: "routes", label: "事件路线", icon: "↗️" },
  ];

  return (
    <div className="bg-surface/95 backdrop-blur-md rounded-xl p-2.5 border border-border/70 shadow-lg shadow-black/30 text-[10px]">
      <p className="text-text-tertiary mb-2 font-medium tracking-wide">图层</p>
      {layers.map((layer) => {
        const isActive = activeLayers.includes(layer.id);
        return (
          <button
            key={layer.id}
            onClick={() => isActive ? removeActiveLayer(layer.id) : addActiveLayer(layer.id)}
            className={`flex items-center gap-1.5 w-full px-2 py-1.5 rounded-md transition-all duration-200 ${
              isActive ? "bg-accent/15 text-accent shadow-sm" : "text-text-tertiary hover:text-text-secondary hover:bg-surface-elevated/50"
            }`}
          >
            <span className="text-[11px]">{layer.icon}</span>
            <span>{layer.label}</span>
            <span className={`ml-auto w-2 h-2 rounded-full transition-all duration-200 ${isActive ? "bg-accent shadow-sm shadow-accent/50" : "bg-border"}`} />
          </button>
        );
      })}
    </div>
  );
}

// ===== 图例 =====
function MapLegend({ events }: { events: HistoricalEvent[] }) {
  const dynastySet = new globalThis.Map<string, string>();
  events.forEach((e) => {
    if (e.dynasty && !dynastySet.has(e.dynasty.name)) {
      dynastySet.set(e.dynasty.name, e.dynasty.color);
    }
  });

  if (dynastySet.size === 0) return null;

  return (
    <div className="bg-surface/95 backdrop-blur-md rounded-xl p-2.5 border border-border/70 shadow-lg shadow-black/30 text-[10px]">
      <p className="text-text-tertiary mb-1.5 font-medium tracking-wide">朝代图例</p>
      <div className="flex flex-wrap gap-x-3 gap-y-1 max-w-[220px]">
        {Array.from(dynastySet.entries()).map(([name, color]) => (
          <div key={name} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}80` }} />
            <span className="text-text-secondary">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== 底图切换 =====
function BasemapSwitcher() {
  const { basemapType, setBasemapType } = useAppStore();

  return (
    <div className="flex gap-1 bg-surface/95 backdrop-blur-md rounded-xl p-1 border border-border/70 shadow-lg shadow-black/30">
      {(["modern", "ccts", "ancient_overlay"] as const).map((type) => (
        <button
          key={type}
          onClick={() => setBasemapType(type)}
          className={`px-2.5 py-1.5 rounded-md text-[10px] font-medium transition-all duration-200 ${
            basemapType === type
              ? "bg-accent text-white shadow-sm shadow-accent/40"
              : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated/50"
          }`}
        >
          {type === "modern" ? "现代" : type === "ccts" ? "古地图" : "叠加"}
        </button>
      ))}
    </div>
  );
}
