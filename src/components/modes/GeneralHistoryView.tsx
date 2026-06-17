"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import { useAppStore } from "@/stores/appStore";
import { MapPanel } from "@/components/map/MapPanel";
import { KnowledgePanel } from "@/components/knowledge/KnowledgePanel";
import { PersonDetailPanel } from "@/components/person/PersonDetailPanel";
import { useTimelineEvents } from "@/hooks/useTimelineEvents";
import { formatYear } from "@/lib/date-utils";
import { swrFetcher } from "@/lib/api-client";
import type { HistoricalEvent, Person } from "@/lib/types";

export function GeneralHistoryView() {
  const { currentYear, setSelectedEventId, setMode } = useAppStore();
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [personEvents, setPersonEvents] = useState<HistoricalEvent[]>([]);

  // 一次性加载全部事件
  const { data, isLoading, error } = useSWR<{ events: HistoricalEvent[] }>(
    "/api/events?detail_level=1&importance=3",
    swrFetcher,
    { revalidateOnFocus: false }
  );

  const allEvents: HistoricalEvent[] = data?.events || [];

  // 根据 currentYear 实时过滤
  const { visibleEvents, activeEvents } = useTimelineEvents({ events: allEvents });

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

  return (
    <div className="flex-1 flex min-h-0 relative">
      {error ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-accent mb-2 text-sm">数据加载失败</p>
            <p className="text-xs text-text-tertiary mb-3">{error.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-3 py-1.5 rounded bg-accent/15 text-accent text-xs hover:bg-accent/25 transition-colors"
            >
              重新加载
            </button>
          </div>
        </div>
      ) : (
        <>
          <MapPanel events={visibleEvents} onMarkerClick={handleDeepExplore} />

          <div className="flex flex-col w-80 shrink-0">
            <div className="px-3 py-2 border-b border-border">
              <h2 className="text-xs font-medium text-text-primary">通史概览</h2>
              <p className="text-[10px] text-text-tertiary mt-0.5">
                {currentYear !== null ? (
                  <>
                    <span className="text-accent font-medium">{formatYear(currentYear)}</span>
                    <span className="ml-1">
                      · 正在发生 {activeEvents.length} 件，可见 {visibleEvents.length} 件
                    </span>
                  </>
                ) : (
                  "拖动时间轴浏览历史"
                )}
              </p>
            </div>
            <div className="flex-1 overflow-hidden">
              <KnowledgePanel
                events={visibleEvents}
                isLoading={isLoading}
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
        </>
      )}
    </div>
  );
}
