"use client";

import { useMemo } from "react";
import { useAppStore } from "@/stores/appStore";
import type { HistoricalEvent } from "@/lib/types";

type EventTimeStatus = "active" | "recent" | "upcoming" | "past";

interface TimelineEvent extends HistoricalEvent {
  timeStatus: EventTimeStatus;
  timeDistance: number; // 距 currentYear 的年数（绝对值）
  timeOpacity: number; // 0~1 透明度，用于地图标记
}

interface UseTimelineEventsOptions {
  events: HistoricalEvent[];
  /** 当前年份前后显示多少年，默认根据模式自动计算 */
  windowYears?: number;
}

/**
 * 根据时间轴 currentYear 实时过滤事件
 * - active: 事件正在发生（currentYear 在事件时间范围内）
 * - recent: 事件刚结束（在窗口内但已过去）
 * - upcoming: 事件即将发生（在窗口内但还未到）
 * - past: 事件远在过去（窗口外）
 */
export function useTimelineEvents({ events, windowYears }: UseTimelineEventsOptions) {
  const { currentYear, currentMode } = useAppStore();

  // 根据模式决定时间窗口
  const window = useMemo(() => {
    if (windowYears !== undefined) return windowYears;
    switch (currentMode) {
      case "general": return 80;
      case "dynasty": return 30;
      case "today": return 200; // 今日历史模式显示全部
      default: return 80;
    }
  }, [windowYears, currentMode]);

  const timelineEvents = useMemo(() => {
    if (currentYear === null || currentMode === "today") {
      // 无时间选择或今日模式，全部显示为 active
      return events.map((e) => ({
        ...e,
        timeStatus: "active" as EventTimeStatus,
        timeDistance: 0,
        timeOpacity: 1,
      }));
    }

    const endYear = (e: HistoricalEvent) => e.end_year ?? e.start_year;

    return events
      .map((e) => {
        const eStart = e.start_year;
        const eEnd = endYear(e);
        const distance = currentYear < eStart
          ? eStart - currentYear
          : currentYear > eEnd
            ? currentYear - eEnd
            : 0;

        let status: EventTimeStatus;
        if (distance === 0) {
          status = "active"; // 当前年份在事件时间范围内
        } else if (currentYear < eStart && distance <= window) {
          status = "upcoming";
        } else if (currentYear > eEnd && distance <= window) {
          status = "recent";
        } else {
          status = "past";
        }

        // 透明度：active=1, 距离越远越淡，超过窗口为0.1
        const opacity = distance === 0
          ? 1
          : distance >= window
            ? 0.08
            : Math.max(0.15, 1 - (distance / window) * 0.85);

        return {
          ...e,
          timeStatus: status,
          timeDistance: distance,
          timeOpacity: opacity,
        };
      })
      .sort((a, b) => {
        // active 优先，然后按距离排序
        if (a.timeStatus === "active" && b.timeStatus !== "active") return -1;
        if (a.timeStatus !== "active" && b.timeStatus === "active") return 1;
        return a.timeDistance - b.timeDistance;
      });
  }, [events, currentYear, window, currentMode]);

  // 可见事件（在窗口内的）
  const visibleEvents = useMemo(
    () => timelineEvents.filter((e) => e.timeStatus !== "past"),
    [timelineEvents]
  );

  // 活跃事件（正在发生的）
  const activeEvents = useMemo(
    () => timelineEvents.filter((e) => e.timeStatus === "active"),
    [timelineEvents]
  );

  return { timelineEvents, visibleEvents, activeEvents };
}
