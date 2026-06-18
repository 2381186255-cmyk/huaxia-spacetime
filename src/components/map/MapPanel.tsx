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

// ===== 现代深色底图样式 =====
const MODERN_MAP_STYLE: StyleSpecification = {
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

// ===== 纯黑结构底图样式 =====
// 以纯黑为基底，让古地图瓦片成为唯一视觉结构，增强光亮对比
const BLACK_MAP_STYLE: StyleSpecification = {
  version: 8,
  sources: {},
  layers: [{
    id: 'black-background',
    type: 'background',
    paint: {
      'background-color': '#000000',
    },
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

// ===== 古代水系结构 GeoJSON（纯黑古图模式下发光显示） =====
const ANCIENT_STRUCTURE_GEOJSON: FeatureCollection<LineString> = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature" as const,
      geometry: {
        type: "LineString" as const,
        coordinates: [
          [96, 35], [98, 36], [100, 36.5], [102, 36], [104, 35.5], [106, 35], [108, 34.5],
          [110, 34], [112, 34.5], [114, 35], [116, 35.5], [118, 36], [120, 37], [122, 38],
        ],
      },
      properties: { type: "water", name: "黄河" },
    },
    {
      type: "Feature" as const,
      geometry: {
        type: "LineString" as const,
        coordinates: [
          [90, 33], [95, 32], [100, 31], [105, 30.5], [110, 30], [115, 30.5], [120, 31.5],
          [122, 32],
        ],
      },
      properties: { type: "water", name: "长江" },
    },
    {
      type: "Feature" as const,
      geometry: {
        type: "LineString" as const,
        coordinates: [
          [108, 23], [110, 24], [112, 25], [114, 26], [116, 27],
        ],
      },
      properties: { type: "water", name: "珠江" },
    },
    {
      type: "Feature" as const,
      geometry: {
        type: "LineString" as const,
        coordinates: [
          [110, 32], [112, 33], [114, 34], [116, 35], [118, 36],
        ],
      },
      properties: { type: "route", name: "南北干线" },
    },
  ],
};

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
  features: MOCK_TERRITORIES.map((t, index) => ({
    type: "Feature" as const,
    id: index,
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
    if (currentYear === null) return ["boolean", true] as FilterSpecification;
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

  // 地块 hover（使用 feature-state 实现高亮）
  const hoveredFeatureRef = useRef<{ source: string; id: string | number } | null>(null);
  const handleTerritoryHover = useCallback((e: maplibregl.MapMouseEvent) => {
    const map = e.target;
    const features = queryTerritoryFeatures(e);

    // 清除上一个高亮
    if (hoveredFeatureRef.current) {
      try {
        map.setFeatureState(
          { source: hoveredFeatureRef.current.source, id: hoveredFeatureRef.current.id },
          { hover: false }
        );
      } catch {
        // ignore
      }
      hoveredFeatureRef.current = null;
    }

    if (features.length > 0) {
      const feature = features[0];
      const featureId = feature.id as string | number;
      setHoveredTerritory(String(featureId));
      e.target.getCanvas().style.cursor = "pointer";
      try {
        map.setFeatureState(
          { source: "territories", id: featureId },
          { hover: true }
        );
        hoveredFeatureRef.current = { source: "territories", id: featureId };
      } catch {
        // ignore
      }
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
        // 纯黑古图模式：不依赖外部 CCTS 瓦片，使用自定义发光结构图层
        // 添加发光水系/路网结构
        if (!map.getSource('ancient-structure')) {
          map.addSource('ancient-structure', {
            type: 'geojson',
            data: ANCIENT_STRUCTURE_GEOJSON,
          });
        }
        const structureLayers: { id: string; paint: maplibregl.LineLayerSpecification['paint'] }[] = [
          {
            id: 'ancient-structure-outer-glow',
            paint: {
              'line-color': '#ffffff',
              'line-width': ['interpolate', ['linear'], ['zoom'], 3, 5, 6, 10, 10, 16],
              'line-opacity': 0.08,
              'line-blur': 8,
            },
          },
          {
            id: 'ancient-structure-glow',
            paint: {
              'line-color': '#4fc3f7',
              'line-width': ['interpolate', ['linear'], ['zoom'], 3, 3, 6, 6, 10, 9],
              'line-opacity': 0.35,
              'line-blur': 5,
            },
          },
          {
            id: 'ancient-structure-core',
            paint: {
              'line-color': '#e1f5fe',
              'line-width': ['interpolate', ['linear'], ['zoom'], 3, 1.2, 6, 2.2, 10, 3.5],
              'line-opacity': 0.9,
            },
          },
        ];
        structureLayers.forEach((layer) => {
          if (!map.getLayer(layer.id)) {
            map.addLayer({
              id: layer.id,
              type: 'line',
              source: 'ancient-structure',
              filter: ['==', ['get', 'type'], 'water'],
              paint: layer.paint,
            });
          }
        });
      } else {
        // 叠加模式：古地图瓦片叠加在暗色底图之上
        try {
          map.addLayer({
            id: 'ccts-overlay-layer',
            type: 'raster',
            source: 'ccts-tiles',
            paint: {
              'raster-opacity': 0.55,
              'raster-saturation': -0.9,
              'raster-contrast': 0.75,
              'raster-hue-rotate': 0,
            },
          }, 'territory-glow'); // 插入到疆域光晕层之前，使疆域显示在最上层
        } catch {
          // 忽略图层已存在或添加失败
        }
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
        mapStyle={basemapType === 'ccts' ? BLACK_MAP_STYLE : MODERN_MAP_STYLE}
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
              "text-color": "#ffffff",
              "text-halo-color": "#000000",
              "text-halo-width": 3,
              "text-halo-blur": 1,
              "text-opacity": [
                "interpolate", ["linear"], ["zoom"],
                2, 0,
                4, 0.9,
                6, 1,
              ],
            }}
            minzoom={3}
          />
        </Source>

        {/* ===== 疆域地块图层 ===== */}
        <Source id="territories" type="geojson" data={territoryGeoJSON}>
          {/* 地块外光晕层 - 大范围柔和发光 */}
          <Layer
            id="territory-glow"
            type="fill"
            beforeId="chinese-place-labels"
            filter={territoryFilter}
            layout={{ "visibility": showTerritories ? "visible" : "none" }}
            paint={{
              "fill-color": ["get", "color"],
              "fill-opacity": 0.18,
            }}
          />
          {/* 地块填充 - 明显提高可见度 */}
          <Layer
            id="territory-fill"
            type="fill"
            beforeId="chinese-place-labels"
            filter={territoryFilter}
            layout={{ "visibility": showTerritories ? "visible" : "none" }}
            paint={{
              "fill-color": ["get", "color"],
              "fill-opacity": [
                "case",
                ["boolean", ["feature-state", "hover"], false],
                0.55,
                0.38,
              ],
            }}
          />
          {/* 地块内层 - 增强层次感 */}
          <Layer
            id="territory-fill-inner"
            type="fill"
            beforeId="chinese-place-labels"
            filter={territoryFilter}
            layout={{ "visibility": showTerritories ? "visible" : "none" }}
            paint={{
              "fill-color": "#000000",
              "fill-opacity": [
                "case",
                ["boolean", ["feature-state", "hover"], false],
                0.10,
                0.05,
              ],
            }}
          />
          {/* 地块主边界 - 更粗的实线 */}
          <Layer
            id="territory-border"
            type="line"
            beforeId="chinese-place-labels"
            filter={territoryFilter}
            layout={{ "visibility": showTerritories ? "visible" : "none" }}
            paint={{
              "line-color": ["get", "color"],
              "line-width": [
                "interpolate", ["linear"], ["zoom"],
                3, 2,
                6, 3.5,
                10, 5,
              ],
              "line-opacity": 1,
              "line-blur": 0,
            }}
          />
          {/* 地块高光边界 - 更亮的轮廓 */}
          <Layer
            id="territory-border-highlight"
            type="line"
            beforeId="chinese-place-labels"
            filter={territoryFilter}
            layout={{ "visibility": showTerritories ? "visible" : "none" }}
            paint={{
              "line-color": "#ffffff",
              "line-width": [
                "case",
                ["boolean", ["feature-state", "hover"], false],
                2,
                1,
              ],
              "line-opacity": [
                "case",
                ["boolean", ["feature-state", "hover"], false],
                0.85,
                0.45,
              ],
            }}
          />
          {/* 地块名称标注 */}
          <Layer
            id="territory-labels"
            type="symbol"
            beforeId="chinese-place-labels"
            filter={territoryFilter}
            layout={{
              "visibility": showTerritories ? "visible" : "none",
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
                  1, 28, 2, 24, 3, 20, 4, 18, 5, 16],
                "circle-color": ["get", "dynastyColor"],
                "circle-opacity": ["*", ["get", "timeOpacity"], 0.18],
                "circle-blur": 1,
              }}
            />
            {/* 中层光晕 */}
            <Layer
              id="place-glow"
              type="circle"
              paint={{
                "circle-radius": ["interpolate", ["linear"], ["get", "importance"],
                  1, 20, 2, 16, 3, 14, 4, 12, 5, 10],
                "circle-color": ["get", "dynastyColor"],
                "circle-opacity": ["*", ["get", "timeOpacity"], 0.35],
                "circle-blur": 0.6,
              }}
            />
            {/* 标记主体 - 带描边 */}
            <Layer
              id="place-markers"
              type="circle"
              paint={{
                "circle-radius": ["interpolate", ["linear"], ["get", "importance"],
                  1, 10, 2, 8, 3, 6.5, 4, 5.5, 5, 4.5],
                "circle-color": ["get", "dynastyColor"],
                "circle-opacity": ["get", "timeOpacity"],
                "circle-stroke-width": 2.5,
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
                  1, 4, 2, 3.5, 3, 3, 4, 2.5, 5, 2],
                "circle-color": "#ffffff",
                "circle-opacity": ["*", ["get", "timeOpacity"], 1],
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
              "text-color": "#ffffff",
              "text-halo-color": "#000000",
              "text-halo-width": 3,
              "text-halo-blur": 1,
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

      {/* 左上角：图层 + 图例合并面板 */}
      <div className="absolute top-3 left-3 z-10">
        <MapOverlayPanel events={events} />
      </div>

      {/* 左下角：底图切换 */}
      <div className="absolute bottom-4 left-4 z-10">
        <BasemapSwitcher />
      </div>
    </div>
  );
}

// ===== 图层 + 图例合并面板 =====
function MapOverlayPanel({ events }: { events: HistoricalEvent[] }) {
  const { activeLayers, addActiveLayer, removeActiveLayer } = useAppStore();

  const layers = [
    { id: "territories", label: "疆域" },
    { id: "routes", label: "路线" },
  ];

  const dynastySet = new globalThis.Map<string, string>();
  events.forEach((e) => {
    if (e.dynasty && !dynastySet.has(e.dynasty.name)) {
      dynastySet.set(e.dynasty.name, e.dynasty.color);
    }
  });

  return (
    <div className="bg-surface/70 backdrop-blur-xl rounded-lg p-2 border border-border/40 shadow-lg shadow-black/40 text-[10px]">
      {/* 图层开关 - 横向排列 */}
      <div className="flex items-center gap-1.5 mb-1.5">
        {layers.map((layer) => {
          const isActive = activeLayers.includes(layer.id);
          return (
            <button
              key={layer.id}
              onClick={() => isActive ? removeActiveLayer(layer.id) : addActiveLayer(layer.id)}
              className={`flex items-center gap-1 px-2 py-1 rounded transition-all duration-200 ${
                isActive ? "bg-accent/20 text-accent" : "text-text-tertiary hover:text-text-secondary"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-accent" : "bg-border"}`} />
              {layer.label}
            </button>
          );
        })}
      </div>

      {/* 朝代图例 - 紧凑横排 */}
      {dynastySet.size > 0 && (
        <div className="flex flex-wrap gap-x-2 gap-y-0.5 max-w-[200px] pt-1.5 border-t border-border/30">
          {Array.from(dynastySet.entries()).map(([name, color]) => (
            <div key={name} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-text-tertiary">{name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ===== 底图切换 =====
function BasemapSwitcher() {
  const { basemapType, setBasemapType } = useAppStore();

  return (
    <div className="flex gap-0.5 bg-surface/70 backdrop-blur-xl rounded-lg p-0.5 border border-border/40 shadow-lg shadow-black/40">
      {(["modern", "ccts", "ancient_overlay"] as const).map((type) => (
        <button
          key={type}
          onClick={() => setBasemapType(type)}
          className={`px-2 py-1 rounded text-[10px] font-medium transition-all duration-200 ${
            basemapType === type
              ? "bg-accent/80 text-white"
              : "text-text-tertiary hover:text-text-primary"
          }`}
        >
          {type === "modern" ? "现代" : type === "ccts" ? "纯黑古图" : "叠加"}
        </button>
      ))}
    </div>
  );
}
