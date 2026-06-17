"use client";

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { useAppStore } from "@/stores/appStore";
import { MapPanel } from "@/components/map/MapPanel";
import { formatYear } from "@/lib/date-utils";
import { EVENT_TYPE_LABELS } from "@/lib/constants";
import { MOCK_EVENTS, MOCK_PERSONS } from "@/services/mock-data";
import type { HistoricalEvent, EventType } from "@/lib/types";
import type { FeatureCollection, MultiPolygon } from "geojson";
import {
  ArrowLeft,
  Play,
  Pause,
  MapPin,
  Users,
  Clock,
  ChevronRight,
} from "lucide-react";

// ===== 安史之乱势力地块时间切片 =====
interface TerritorySlice {
  time: number;
  label: string;
  faction: string;
  color: string;
  narrative: string;
  geom: FeatureCollection<MultiPolygon>;
}

const ANSHI_TERRITORIES: TerritorySlice[] = [
  {
    time: 755.92,
    label: "天宝十四载·十一月",
    faction: "叛军",
    color: "#DC2626",
    narrative:
      "安禄山以讨伐杨国忠为名，于范阳起兵，率十五万大军南下。叛军势如破竹，河北诸郡望风而降。",
    geom: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "MultiPolygon",
            coordinates: [
              [
                [
                  [115, 40],
                  [117, 40.5],
                  [118, 39],
                  [117, 37],
                  [115, 36],
                  [113, 37],
                  [114, 39],
                  [115, 40],
                ],
              ],
            ],
          },
          properties: { faction: "叛军", color: "#DC2626" },
        },
      ],
    },
  },
  {
    time: 756.0,
    label: "天宝十四载·十二月",
    faction: "叛军",
    color: "#DC2626",
    narrative:
      "叛军攻陷东都洛阳。安禄山在洛阳称帝，国号大燕。朝廷震惊，急调兵抵御。",
    geom: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "MultiPolygon",
            coordinates: [
              [
                [
                  [113, 40],
                  [116, 41],
                  [118, 40],
                  [119, 38],
                  [117, 36],
                  [114, 35],
                  [112, 36],
                  [111, 38],
                  [112, 39],
                  [113, 40],
                ],
              ],
            ],
          },
          properties: { faction: "叛军", color: "#DC2626" },
        },
      ],
    },
  },
  {
    time: 756.5,
    label: "至德元载·六月",
    faction: "叛军",
    color: "#DC2626",
    narrative:
      "潼关失守，哥舒翰兵败。唐玄宗仓皇出逃蜀地，马嵬驿兵变，杨贵妃赐死。太子李亨在灵武即位，是为肃宗。叛军攻入长安。",
    geom: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "MultiPolygon",
            coordinates: [
              [
                [
                  [108, 41],
                  [112, 42],
                  [116, 41],
                  [119, 39],
                  [118, 36],
                  [115, 34],
                  [112, 34],
                  [109, 34],
                  [107, 36],
                  [106, 38],
                  [107, 40],
                  [108, 41],
                ],
              ],
            ],
          },
          properties: { faction: "叛军", color: "#DC2626" },
        },
      ],
    },
  },
  {
    time: 757.0,
    label: "至德二载",
    faction: "唐军",
    color: "#2563EB",
    narrative:
      "郭子仪、李光弼率朔方军反攻。借回纥骑兵之助，先后收复长安、洛阳。安禄山已被其子安庆绪所杀，叛军内部分裂。",
    geom: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "MultiPolygon",
            coordinates: [
              [
                [
                  [106, 40],
                  [110, 42],
                  [114, 41],
                  [116, 39],
                  [115, 36],
                  [112, 34],
                  [109, 34],
                  [107, 36],
                  [105, 38],
                  [106, 40],
                ],
              ],
            ],
          },
          properties: { faction: "唐军", color: "#2563EB" },
        },
      ],
    },
  },
  {
    time: 763.0,
    label: "宝应二年",
    faction: "唐军",
    color: "#2563EB",
    narrative:
      "史思明亦被其子史朝义所杀。唐军再度借回纥之力，最终平定叛乱。然藩镇割据已成，唐朝由盛转衰，再未恢复昔日辉煌。",
    geom: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "MultiPolygon",
            coordinates: [
              [
                [
                  [100, 38],
                  [104, 42],
                  [108, 43],
                  [112, 42],
                  [116, 41],
                  [120, 38],
                  [120, 34],
                  [118, 30],
                  [114, 28],
                  [110, 26],
                  [106, 28],
                  [102, 30],
                  [98, 34],
                  [98, 36],
                  [100, 38],
                ],
              ],
            ],
          },
          properties: { faction: "唐军", color: "#2563EB" },
        },
      ],
    },
  },
];

// ===== 事件类型颜色 =====
const EVENT_TYPE_COLORS: Record<string, string> = {
  war: "#DC2626",
  political: "#7C3AED",
  cultural: "#EC4899",
  economic: "#F59E0B",
  disaster: "#6B7280",
  diplomatic: "#3B82F6",
  rebellion: "#EF4444",
  reform: "#10B981",
  founding: "#8B5CF6",
  collapse: "#6B7280",
  other: "#9CA3AF",
};

// ===== 事件类型排序 =====
const EVENT_TYPE_ORDER: EventType[] = [
  "war",
  "rebellion",
  "political",
  "reform",
  "founding",
  "collapse",
  "diplomatic",
  "cultural",
  "economic",
  "disaster",
  "other",
];

// ===== 播放速度选项 =====
const SPEED_OPTIONS = [0.5, 1, 2] as const;

export function EventDetailView() {
  const {
    selectedEventId,
    setSelectedEventId,
    territoryYear,
    setTerritoryYear,
    showTerritoryDiff,
    setShowTerritoryDiff,
    setMode,
    previousMode,
  } = useAppStore();

  // 事件模式播放状态
  const [isEventPlaying, setIsEventPlaying] = useState(false);
  const [eventSpeed, setEventSpeed] = useState<0.5 | 1 | 2>(1);
  const playTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 获取当前选中事件
  const selectedEvent = useMemo(
    () => MOCK_EVENTS.find((e) => e.id === selectedEventId) ?? null,
    [selectedEventId]
  );

  // 判断是否为安史之乱（有详细时间切片）
  const isAnshiEvent = selectedEventId === 9;

  // 获取当前事件的时间切片
  const territorySlices = useMemo(() => {
    if (isAnshiEvent) return ANSHI_TERRITORIES;
    return null;
  }, [isAnshiEvent]);

  // 当前时间索引
  const currentTimeIndex = useMemo(() => {
    if (!territorySlices || territoryYear === null) return 0;
    let idx = 0;
    for (let i = territorySlices.length - 1; i >= 0; i--) {
      if (territoryYear >= territorySlices[i].time) {
        idx = i;
        break;
      }
    }
    return idx;
  }, [territorySlices, territoryYear]);

  // 当前切片
  const currentSlice = territorySlices
    ? territorySlices[currentTimeIndex]
    : null;

  // 下一个切片（用于过渡）
  const nextSlice = territorySlices
    ? territorySlices[Math.min(currentTimeIndex + 1, territorySlices.length - 1)]
    : null;

  // 事件时间范围
  const eventTimeRange = useMemo(() => {
    if (!selectedEvent) return { start: 0, end: 0 };
    return {
      start: selectedEvent.start_year,
      end: selectedEvent.end_year ?? selectedEvent.start_year,
    };
  }, [selectedEvent]);

  // 初始化 territoryYear
  useEffect(() => {
    if (selectedEventId && territoryYear === null) {
      setTerritoryYear(eventTimeRange.start);
    }
  }, [selectedEventId, territoryYear, eventTimeRange.start, setTerritoryYear]);

  // 清理播放定时器
  useEffect(() => {
    return () => {
      if (playTimerRef.current) {
        clearInterval(playTimerRef.current);
      }
    };
  }, []);

  // 播放逻辑
  useEffect(() => {
    if (isEventPlaying && territorySlices) {
      const step = 0.02 * eventSpeed;
      playTimerRef.current = setInterval(() => {
        const currentTerritoryYear = useAppStore.getState().territoryYear;
        if (currentTerritoryYear === null) {
          setTerritoryYear(eventTimeRange.start);
          return;
        }
        const next = currentTerritoryYear + step;
        if (next >= eventTimeRange.end) {
          setIsEventPlaying(false);
          setTerritoryYear(eventTimeRange.end);
          return;
        }
        setTerritoryYear(next);
      }, 50);
    } else {
      if (playTimerRef.current) {
        clearInterval(playTimerRef.current);
        playTimerRef.current = null;
      }
    }
    return () => {
      if (playTimerRef.current) {
        clearInterval(playTimerRef.current);
        playTimerRef.current = null;
      }
    };
  }, [isEventPlaying, eventSpeed, territorySlices, eventTimeRange, setTerritoryYear]);

  // 切换播放
  const togglePlay = useCallback(() => {
    if (!isEventPlaying && territoryYear !== null && territoryYear >= eventTimeRange.end) {
      setTerritoryYear(eventTimeRange.start);
    }
    setIsEventPlaying((prev) => !prev);
  }, [isEventPlaying, territoryYear, eventTimeRange, setTerritoryYear]);

  // 返回事件列表
  const handleBackToList = useCallback(() => {
    setSelectedEventId(null);
    setTerritoryYear(null);
    setIsEventPlaying(false);
  }, [setSelectedEventId, setTerritoryYear]);

  // 返回上一模式
  const handleBack = useCallback(() => {
    setMode(previousMode);
  }, [setMode, previousMode]);

  // 按事件类型分组
  const groupedEvents = useMemo(() => {
    const groups = new Map<EventType, HistoricalEvent[]>();
    for (const type of EVENT_TYPE_ORDER) {
      const events = MOCK_EVENTS.filter((e) => e.event_type === type);
      if (events.length > 0) {
        groups.set(type, events);
      }
    }
    return groups;
  }, []);

  // 构建地图显示的事件数据
  const mapEvents = useMemo(() => {
    if (!selectedEvent) return [];
    return [selectedEvent];
  }, [selectedEvent]);

  // ===== 无事件选中：事件选择列表 =====
  if (selectedEventId === null) {
    return (
      <div className="flex-1 flex flex-col min-h-0 bg-surface">
        {/* 顶栏 */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border shrink-0">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 text-[11px] text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            返回
          </button>
          <h2 className="text-sm font-semibold text-text-primary">事件探索</h2>
          <span className="text-[10px] text-text-tertiary">
            共 {MOCK_EVENTS.length} 个历史事件
          </span>
        </div>

        {/* 事件分组列表 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {Array.from(groupedEvents.entries()).map(([type, events]) => (
            <div key={type}>
              {/* 类型标题 */}
              <div className="flex items-center gap-2 mb-2.5">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: EVENT_TYPE_COLORS[type] }}
                />
                <h3 className="text-[11px] font-semibold text-text-secondary">
                  {EVENT_TYPE_LABELS[type] || type}
                </h3>
                <span className="text-[9px] text-text-tertiary">
                  {events.length}
                </span>
              </div>

              {/* 事件卡片网格 */}
              <div className="grid grid-cols-2 gap-2">
                {events.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => setSelectedEventId(event.id)}
                    className="text-left p-3 rounded-lg bg-surface-elevated border border-border hover:border-accent/40 hover:bg-accent/5 transition-all group"
                  >
                    <div className="flex items-start gap-2">
                      <div
                        className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                        style={{
                          backgroundColor: event.dynasty?.color || "#9CA3AF",
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[12px] font-medium text-text-primary truncate">
                            {event.name}
                          </span>
                        </div>
                        <p className="text-[10px] text-text-tertiary mt-0.5">
                          {formatYear(event.start_year)}
                          {event.end_year && event.end_year !== event.start_year
                            ? ` - ${formatYear(event.end_year)}`
                            : ""}
                          {event.dynasty ? ` · ${event.dynasty.name}` : ""}
                        </p>
                        {event.summary && (
                          <p className="text-[10px] text-text-secondary mt-1 line-clamp-2 leading-relaxed">
                            {event.summary}
                          </p>
                        )}
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span
                            className="text-[9px] px-1.5 py-0.5 rounded-full"
                            style={{
                              backgroundColor:
                                EVENT_TYPE_COLORS[event.event_type] + "20",
                              color: EVENT_TYPE_COLORS[event.event_type],
                            }}
                          >
                            {EVENT_TYPE_LABELS[event.event_type] ||
                              event.event_type}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ===== 有事件选中：地图 + 详情面板 =====
  return (
    <div className="flex-1 flex min-h-0">
      {/* 左侧：地图区域 */}
      <div className="flex-1 relative flex flex-col min-h-0">
        {/* 地图 */}
        <div className="flex-1 relative flex flex-col min-h-0">
          <MapPanel
            events={mapEvents}
            onMarkerClick={() => {}}
            selectedEventId={selectedEventId}
          />

          {/* 势力图例 */}
          {territorySlices && (
            <div className="absolute top-4 left-4 bg-surface/90 backdrop-blur rounded-lg p-3 border border-border z-10">
              <h4 className="text-[10px] font-medium text-text-secondary mb-2">
                势力分布
              </h4>
              <div className="space-y-1.5">
                {Array.from(
                  new Map(
                    territorySlices.map((s) => [s.faction, s.color])
                  ).entries()
                ).map(([name, color]) => (
                  <div key={name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-sm"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-[10px] text-text-secondary">
                      {name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 叙事面板 */}
          {currentSlice && (
            <div className="absolute bottom-20 left-4 right-4 max-w-md z-10">
              <div className="bg-surface/95 backdrop-blur rounded-lg p-3 border border-border shadow-lg">
                <div className="flex items-center gap-2 mb-1.5">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: currentSlice.color }}
                  />
                  <span className="text-[11px] font-semibold text-text-primary">
                    {currentSlice.label}
                  </span>
                  <span
                    className="text-[9px] px-1.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor: currentSlice.color + "20",
                      color: currentSlice.color,
                    }}
                  >
                    {currentSlice.faction}
                  </span>
                </div>
                <p className="text-[10px] text-text-secondary leading-relaxed">
                  {currentSlice.narrative}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 事件时间滑块 */}
        {selectedEvent && eventTimeRange.start !== eventTimeRange.end && (
          <div className="shrink-0 bg-surface border-t border-border px-4 py-3">
            {/* 时间轴标签 */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-text-tertiary">
                {formatYear(eventTimeRange.start)}
              </span>
              <span className="text-[11px] font-medium text-text-primary">
                {territoryYear !== null
                  ? formatYear(territoryYear)
                  : formatYear(eventTimeRange.start)}
              </span>
              <span className="text-[10px] text-text-tertiary">
                {formatYear(eventTimeRange.end)}
              </span>
            </div>

            {/* 滑块 */}
            <div className="relative">
              <input
                type="range"
                min={eventTimeRange.start}
                max={eventTimeRange.end}
                step={0.01}
                value={territoryYear ?? eventTimeRange.start}
                onChange={(e) => setTerritoryYear(parseFloat(e.target.value))}
                className="w-full accent-accent h-1.5"
              />

              {/* 关键帧标记 */}
              {territorySlices &&
                territorySlices.map((slice, idx) => {
                  const range = eventTimeRange.end - eventTimeRange.start;
                  if (range === 0) return null;
                  const pct =
                    ((slice.time - eventTimeRange.start) / range) * 100;
                  return (
                    <div
                      key={idx}
                      className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2 border-white shadow-sm"
                      style={{
                        left: `${pct}%`,
                        backgroundColor: slice.color,
                        transform: `translate(-50%, -50%)`,
                      }}
                      title={slice.label}
                    />
                  );
                })}
            </div>

            {/* 控制栏 */}
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                {/* 播放/暂停 */}
                <button
                  onClick={togglePlay}
                  className="flex items-center justify-center w-7 h-7 rounded-full bg-accent text-white hover:bg-accent/80 transition-colors"
                >
                  {isEventPlaying ? (
                    <Pause className="w-3.5 h-3.5" />
                  ) : (
                    <Play className="w-3.5 h-3.5 ml-0.5" />
                  )}
                </button>

                {/* 速度控制 */}
                <div className="flex items-center gap-1">
                  {SPEED_OPTIONS.map((speed) => (
                    <button
                      key={speed}
                      onClick={() => setEventSpeed(speed)}
                      className={`text-[9px] px-1.5 py-0.5 rounded transition-colors ${
                        eventSpeed === speed
                          ? "bg-accent/15 text-accent font-medium"
                          : "text-text-tertiary hover:text-text-secondary"
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>

              {/* 变化对比开关 */}
              <label className="flex items-center gap-1.5 text-[10px] text-text-secondary cursor-pointer">
                <input
                  type="checkbox"
                  checked={showTerritoryDiff}
                  onChange={(e) => setShowTerritoryDiff(e.target.checked)}
                  className="accent-accent"
                />
                变化对比
              </label>
            </div>
          </div>
        )}
      </div>

      {/* 右侧：事件详情面板 */}
      <div className="w-80 bg-surface border-l border-border flex flex-col shrink-0 overflow-y-auto">
        {/* 返回按钮 */}
        <button
          onClick={handleBackToList}
          className="flex items-center gap-1.5 px-3 py-2 text-[11px] text-text-secondary hover:text-text-primary border-b border-border transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          返回事件列表
        </button>

        {selectedEvent ? (
          <div className="p-4 space-y-4">
            {/* 标题 */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                {selectedEvent.dynasty && (
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: selectedEvent.dynasty.color }}
                  />
                )}
                <h1 className="text-base font-bold text-text-primary">
                  {selectedEvent.name}
                </h1>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-3 h-3 text-text-tertiary" />
                <p className="text-[11px] text-text-tertiary">
                  {formatYear(selectedEvent.start_year)}
                  {selectedEvent.end_year &&
                  selectedEvent.end_year !== selectedEvent.start_year
                    ? ` - ${formatYear(selectedEvent.end_year)}`
                    : ""}
                  {selectedEvent.dynasty
                    ? ` · ${selectedEvent.dynasty.name}`
                    : ""}
                </p>
                <span
                  className="text-[9px] px-1.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor:
                      EVENT_TYPE_COLORS[selectedEvent.event_type] + "20",
                    color: EVENT_TYPE_COLORS[selectedEvent.event_type],
                  }}
                >
                  {EVENT_TYPE_LABELS[selectedEvent.event_type] ||
                    selectedEvent.event_type}
                </span>
              </div>
            </div>

            {/* 摘要 */}
            {selectedEvent.summary && (
              <p className="text-[11px] text-text-secondary leading-relaxed">
                {selectedEvent.summary}
              </p>
            )}

            {/* 详细描述 */}
            {selectedEvent.description && (
              <div className="pt-2 border-t border-border">
                <h3 className="text-[10px] font-medium text-text-tertiary uppercase tracking-wider mb-2">
                  详细描述
                </h3>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  {selectedEvent.description}
                </p>
              </div>
            )}

            {/* 关联人物 */}
            {selectedEvent.persons && selectedEvent.persons.length > 0 && (
              <div className="pt-2 border-t border-border">
                <div className="flex items-center gap-1.5 mb-2">
                  <Users className="w-3 h-3 text-text-tertiary" />
                  <h3 className="text-[10px] font-medium text-text-tertiary uppercase tracking-wider">
                    关联人物
                  </h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedEvent.persons.map((person) => {
                    const personData = MOCK_PERSONS.find(
                      (p) => p.id === person.id
                    );
                    return (
                      <span
                        key={person.id}
                        className="text-[10px] px-2 py-1 rounded bg-surface-elevated text-text-secondary border border-border"
                      >
                        {person.name}
                        {person.role ? (
                          <span className="text-text-tertiary ml-1">
                            {person.role}
                          </span>
                        ) : personData?.person_type ? (
                          <span className="text-text-tertiary ml-1">
                            {personData.person_type}
                          </span>
                        ) : null}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 关联地点 */}
            {selectedEvent.places && selectedEvent.places.length > 0 && (
              <div className="pt-2 border-t border-border">
                <div className="flex items-center gap-1.5 mb-2">
                  <MapPin className="w-3 h-3 text-text-tertiary" />
                  <h3 className="text-[10px] font-medium text-text-tertiary uppercase tracking-wider">
                    关联地点
                  </h3>
                </div>
                <div className="space-y-1.5">
                  {selectedEvent.places.map((place) => (
                    <div
                      key={place.id}
                      className="flex items-center gap-2 text-[10px] text-text-secondary p-1.5 rounded bg-surface-elevated border border-border"
                    >
                      <MapPin className="w-3 h-3 text-accent shrink-0" />
                      <span className="font-medium text-text-primary">
                        {place.name}
                      </span>
                      {place.modern_name &&
                        place.modern_name !== place.name && (
                          <span className="text-text-tertiary">
                            今{place.modern_name}
                          </span>
                        )}
                      {place.role && (
                        <span className="text-text-tertiary ml-auto">
                          {place.role}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 外部来源 */}
            {selectedEvent.external_refs &&
              Object.keys(selectedEvent.external_refs).length > 0 && (
                <div className="pt-2 border-t border-border">
                  <h3 className="text-[10px] font-medium text-text-tertiary uppercase tracking-wider mb-2">
                    数据来源
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(selectedEvent.external_refs).map(
                      ([key, url]) => (
                        <a
                          key={key}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] px-2 py-1 rounded bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
                        >
                          {key.toUpperCase()}
                        </a>
                      )
                    )}
                  </div>
                </div>
              )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-32 text-text-tertiary text-xs">
            事件未找到
          </div>
        )}
      </div>
    </div>
  );
}
