"use client";

import { useMemo, useState, useCallback } from "react";
import { useAppStore } from "@/stores/appStore";
import { MapPanel } from "@/components/map/MapPanel";
import { KnowledgePanel } from "@/components/knowledge/KnowledgePanel";
import { PersonDetailPanel } from "@/components/person/PersonDetailPanel";
import { useTimelineEvents } from "@/hooks/useTimelineEvents";
import { formatYear } from "@/lib/date-utils";
import { MOCK_DYNASTIES, MOCK_EVENTS, MOCK_PERSONS, MOCK_PLACES } from "@/services/mock-data";
import type { HistoricalEvent, Person, Dynasty } from "@/lib/types";
import { ArrowLeft, MapPin, Users, BookOpen } from "lucide-react";

// ===== 朝代核心区域视口（用于地图 flyTo） =====
const DYNASTY_VIEWPORTS: Record<number, { longitude: number; latitude: number; zoom: number }> = {
  1:  { longitude: 112.0, latitude: 34.3, zoom: 6 },   // 夏 - 河南中西部
  2:  { longitude: 114.3, latitude: 34.8, zoom: 6 },   // 商 - 河南北部
  3:  { longitude: 108.9, latitude: 34.3, zoom: 6 },   // 西周 - 镐京
  4:  { longitude: 112.5, latitude: 34.6, zoom: 5 },   // 东周 - 洛阳
  5:  { longitude: 108.7, latitude: 34.3, zoom: 6 },   // 秦 - 咸阳
  6:  { longitude: 108.9, latitude: 34.3, zoom: 5 },   // 西汉 - 长安
  7:  { longitude: 112.5, latitude: 34.6, zoom: 5 },   // 东汉 - 洛阳
  8:  { longitude: 118.8, latitude: 32.1, zoom: 5 },   // 三国 - 建康
  9:  { longitude: 112.5, latitude: 34.6, zoom: 5 },   // 西晋 - 洛阳
  10: { longitude: 118.8, latitude: 32.1, zoom: 5 },   // 东晋 - 建康
  11: { longitude: 112.0, latitude: 33.0, zoom: 4 },   // 南北朝
  12: { longitude: 108.9, latitude: 34.3, zoom: 5 },   // 隋 - 长安
  13: { longitude: 108.9, latitude: 34.3, zoom: 5 },   // 唐 - 长安
  14: { longitude: 112.0, latitude: 34.0, zoom: 5 },   // 五代十国
  15: { longitude: 114.4, latitude: 34.8, zoom: 6 },   // 北宋 - 开封
  16: { longitude: 120.2, latitude: 30.3, zoom: 6 },   // 南宋 - 临安
  17: { longitude: 116.4, latitude: 39.9, zoom: 5 },   // 元 - 大都
  18: { longitude: 116.4, latitude: 39.9, zoom: 5 },   // 明 - 北京
  19: { longitude: 116.4, latitude: 39.9, zoom: 5 },   // 清 - 北京
};

export function DynastyHistoryView() {
  const {
    selectedDynastyId,
    currentYear,
    setSelectedDynastyId,
    setSelectedEventId,
    setMode,
    setTimeRange,
    setMapViewport,
  } = useAppStore();

  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [personEvents, setPersonEvents] = useState<HistoricalEvent[]>([]);

  // 当前选中的朝代
  const selectedDynasty = useMemo(
    () => MOCK_DYNASTIES.find((d) => d.id === selectedDynastyId) ?? null,
    [selectedDynastyId]
  );

  // 按朝代过滤事件和人物
  const dynastyEvents = useMemo(
    () => MOCK_EVENTS.filter((e) => e.dynasty?.id === selectedDynastyId),
    [selectedDynastyId]
  );

  const dynastyPersons = useMemo(
    () => MOCK_PERSONS.filter((p) => p.dynasty_id === selectedDynastyId),
    [selectedDynastyId]
  );

  // 朝代都城
  const dynastyCapital = useMemo(() => {
    if (!selectedDynastyId) return null;
    const capital = MOCK_PLACES.find(
      (p) => p.dynasty_id === selectedDynastyId && p.place_type === "capital"
    );
    return capital ?? null;
  }, [selectedDynastyId]);

  // 根据 currentYear 实时过滤
  const { visibleEvents, activeEvents } = useTimelineEvents({
    events: dynastyEvents,
    windowYears: 30,
  });

  // 选择朝代
  const handleSelectDynasty = useCallback(
    (dynasty: Dynasty) => {
      setSelectedDynastyId(dynasty.id);
      setTimeRange({ start: dynasty.start_year, end: dynasty.end_year });
      // 地图 flyTo 朝代核心区域
      const viewport = DYNASTY_VIEWPORTS[dynasty.id];
      if (viewport) {
        setMapViewport(viewport);
      }
    },
    [setSelectedDynastyId, setTimeRange, setMapViewport]
  );

  // 返回朝代选择
  const handleBack = useCallback(() => {
    setSelectedDynastyId(null);
  }, [setSelectedDynastyId]);

  const handleDeepExplore = (eventId: number) => {
    setSelectedEventId(eventId);
    setMode("event");
  };

  const handlePersonClick = async (personId: number) => {
    try {
      const res = await fetch(`/api/persons/${personId}`);
      const data = await res.json();
      setSelectedPerson(data);
      setPersonEvents(data.events || []);
    } catch {
      // ignore
    }
  };

  // ===== 朝代选择网格（未选中朝代时） =====
  if (selectedDynastyId === null) {
    return <DynastySelectionGrid onSelectDynasty={handleSelectDynasty} />;
  }

  // ===== 朝代详情视图（选中朝代后） =====
  return (
    <div className="flex-1 flex min-h-0 relative">
      <MapPanel events={visibleEvents} onMarkerClick={handleDeepExplore} />

      <div className="flex flex-col w-72 shrink-0">
        {/* 朝代头部栏 */}
        <div className="px-3 py-2 border-b border-border">
          <div className="flex items-center gap-2">
            <button
              onClick={handleBack}
              className="p-1 rounded hover:bg-surface-elevated text-text-tertiary hover:text-text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            {selectedDynasty && (
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: selectedDynasty.color }}
                />
                <h2 className="text-sm font-semibold text-text-primary truncate">
                  {selectedDynasty.name}
                </h2>
              </div>
            )}
          </div>
          <p className="text-[10px] text-text-tertiary mt-0.5 ml-7">
            {selectedDynasty
              ? `${formatYear(selectedDynasty.start_year)} — ${formatYear(selectedDynasty.end_year)}`
              : "选择朝代"}
            {currentYear !== null && (
              <span className="ml-1">
                · <span className="text-accent font-medium">{formatYear(currentYear)}</span>
                {" "}正在发生 {activeEvents.length} 件
              </span>
            )}
          </p>
        </div>

        {/* 朝代信息侧边栏 */}
        {selectedDynasty && (
          <DynastyInfoSidebar
            dynasty={selectedDynasty}
            capital={dynastyCapital}
            eventCount={dynastyEvents.length}
            personCount={dynastyPersons.length}
          />
        )}

        {/* 知识面板 */}
        <div className="flex-1 overflow-hidden">
          <KnowledgePanel
            events={visibleEvents}
            isLoading={false}
            onDeepExplore={handleDeepExplore}
            onPersonClick={handlePersonClick}
          />
        </div>
      </div>

      {/* 人物详情面板 */}
      {selectedPerson && (
        <PersonDetailPanel
          person={selectedPerson}
          relatedEvents={personEvents}
          onClose={() => setSelectedPerson(null)}
          onEventClick={handleDeepExplore}
        />
      )}
    </div>
  );
}

// ===== 朝代选择网格组件 =====
function DynastySelectionGrid({ onSelectDynasty }: { onSelectDynasty: (dynasty: Dynasty) => void }) {
  // 为每个朝代计算事件数量
  const dynastyEventCounts = useMemo(() => {
    const counts = new Map<number, number>();
    MOCK_EVENTS.forEach((e) => {
      if (e.dynasty?.id) {
        counts.set(e.dynasty.id, (counts.get(e.dynasty.id) || 0) + 1);
      }
    });
    return counts;
  }, []);

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      {/* 标题区域 */}
      <div className="px-6 pt-8 pb-4">
        <h1 className="text-2xl font-bold text-text-primary">断代史</h1>
        <p className="text-sm text-text-tertiary mt-1">选择一个朝代，探索其历史脉络</p>
      </div>

      {/* 朝代网格 */}
      <div className="px-6 pb-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {MOCK_DYNASTIES.map((dynasty) => {
          const eventCount = dynastyEventCounts.get(dynasty.id) || 0;
          const duration = dynasty.end_year - dynasty.start_year;

          return (
            <button
              key={dynasty.id}
              onClick={() => onSelectDynasty(dynasty)}
              className="group text-left p-4 rounded-xl border border-border/50 bg-surface-elevated/30 hover:bg-surface-elevated hover:border-border transition-all duration-200"
            >
              {/* 朝代名称与色点 */}
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-3 h-3 rounded-full shrink-0 transition-all"
                  style={{ backgroundColor: dynasty.color }}
                />
                <span className="text-base font-bold text-text-primary group-hover:text-accent transition-colors truncate">
                  {dynasty.name}
                </span>
              </div>

              {/* 时间范围 */}
              <p className="text-[11px] text-text-tertiary mb-1.5">
                {formatYear(dynasty.start_year)} — {formatYear(dynasty.end_year)}
              </p>

              {/* 简介 */}
              {dynasty.description && (
                <p className="text-[10px] text-text-secondary line-clamp-2 leading-relaxed mb-2">
                  {dynasty.description}
                </p>
              )}

              {/* 底部统计 */}
              <div className="flex items-center gap-3 text-[10px] text-text-tertiary">
                <span>共{duration}年</span>
                {eventCount > 0 && (
                  <span className="flex items-center gap-0.5">
                    <BookOpen className="w-2.5 h-2.5" />
                    {eventCount}件事件
                  </span>
                )}
              </div>

              {/* 底部色条 */}
              <div
                className="mt-3 h-0.5 rounded-full opacity-30 group-hover:opacity-60 transition-opacity"
                style={{ backgroundColor: dynasty.color }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ===== 朝代信息侧边栏 =====
function DynastyInfoSidebar({
  dynasty,
  capital,
  eventCount,
  personCount,
}: {
  dynasty: Dynasty;
  capital: { name: string; modern_name?: string } | null;
  eventCount: number;
  personCount: number;
}) {
  const duration = dynasty.end_year - dynasty.start_year;

  return (
    <div className="px-3 py-3 border-b border-border bg-surface-elevated/30">
      {/* 朝代名称 */}
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-4 h-4 rounded-full shrink-0"
          style={{ backgroundColor: dynasty.color }}
        />
        <h3
          className="text-lg font-bold"
          style={{ color: dynasty.color }}
        >
          {dynasty.name}
        </h3>
        {dynasty.name_en && (
          <span className="text-[10px] text-text-tertiary">{dynasty.name_en}</span>
        )}
      </div>

      {/* 时间范围 */}
      <p className="text-xs text-text-secondary mb-2">
        {formatYear(dynasty.start_year)} — {formatYear(dynasty.end_year)}，共{duration}年
      </p>

      {/* 统计信息 */}
      <div className="flex items-center gap-3">
        {capital && (
          <span className="flex items-center gap-1 text-[10px] text-text-tertiary">
            <MapPin className="w-3 h-3" />
            都城：{capital.name}
            {capital.modern_name && capital.modern_name !== capital.name && (
              <span className="text-text-tertiary">（今{capital.modern_name}）</span>
            )}
          </span>
        )}
        <span className="flex items-center gap-1 text-[10px] text-text-tertiary">
          <BookOpen className="w-3 h-3" />
          {eventCount}件事件
        </span>
        <span className="flex items-center gap-1 text-[10px] text-text-tertiary">
          <Users className="w-3 h-3" />
          {personCount}位人物
        </span>
      </div>
    </div>
  );
}
