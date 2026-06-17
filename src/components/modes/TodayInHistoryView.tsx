"use client";

import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { useAppStore } from "@/stores/appStore";
import { MapPanel } from "@/components/map/MapPanel";
import { KnowledgePanel } from "@/components/knowledge/KnowledgePanel";
import { PersonDetailPanel } from "@/components/person/PersonDetailPanel";
import { getTodayMonthDay } from "@/lib/date-utils";
import { swrFetcher } from "@/lib/api-client";
import type { HistoricalEvent, Person } from "@/lib/types";

export function TodayInHistoryView() {
  const { todayDate, setTodayDate, setSelectedEventId, setMode, selectedPersonId, setSelectedPersonId } = useAppStore();
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [personEvents, setPersonEvents] = useState<HistoricalEvent[]>([]);

  useEffect(() => {
    // 仅在初始默认值时更新为真实日期
    if (todayDate.month === 1 && todayDate.day === 1) {
      const now = new Date();
      const realMonth = now.getMonth() + 1;
      const realDay = now.getDate();
      // 避免在1月1日时无限循环
      if (realMonth !== 1 || realDay !== 1) {
        setTodayDate({ month: realMonth, day: realDay });
      }
    }
  }, []); // 只在挂载时执行一次

  const { data, isLoading, error } = useSWR<{ events: HistoricalEvent[] }>(
    todayDate
      ? `/api/events/today?month=${todayDate.month}&day=${todayDate.day}`
      : null,
    swrFetcher,
    { revalidateOnFocus: false, onError: () => {} }
  );

  const events: HistoricalEvent[] = data?.events || [];

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
          <MapPanel events={events} onMarkerClick={handleDeepExplore} />

          <div className="flex flex-col w-80 shrink-0">
            <div className="px-3 py-2 border-b border-border">
              <h2 className="text-xs font-medium text-text-primary">
                {todayDate.month}月{todayDate.day}日 · 历史上的今天
              </h2>
              <p className="text-[10px] text-text-tertiary mt-0.5">
                共 {events.length} 条记录
              </p>
            </div>
            <div className="flex-1 overflow-hidden">
              <KnowledgePanel
                events={events}
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
