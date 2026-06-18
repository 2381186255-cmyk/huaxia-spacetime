"use client";

import { useRef, useEffect, useMemo, useCallback, useState } from "react";
import * as d3 from "d3";
import { useAppStore } from "@/stores/appStore";
import { MIN_YEAR, MAX_YEAR, TIMELINE } from "@/lib/constants";
import { MOCK_DYNASTIES } from "@/services/mock-data";
import { formatYear } from "@/lib/date-utils";
import { COMMON_ERA_NAMES } from "@/lib/era-name";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";

interface TimelineMarker {
  year: number;
  id: number;
  name: string;
  dynasty?: { name: string; color: string };
  importance: number;
}

interface TimelinePanelProps {
  markers?: TimelineMarker[];
}

// Era name lookup: find the era name for a given year
function lookupEraName(year: number): { eraName: string; dynastyName: string } | null {
  // Sort by start_year descending so more recent eras take priority
  const entries = Object.entries(COMMON_ERA_NAMES).sort(
    (a, b) => b[1].start_year - a[1].start_year
  );
  for (const [name, info] of entries) {
    // Assume each era lasts ~30 years as a rough estimate if no end year
    const eraEnd = info.start_year + 60;
    if (year >= info.start_year && year <= eraEnd) {
      const eraYear = Math.round(year - info.start_year + 1);
      const suffix = eraYear <= 10 ? ["元", "二", "三", "四", "五", "六", "七", "八", "九", "十"][eraYear - 1] ?? `${eraYear}` : `${eraYear}`;
      return {
        eraName: `${name}${suffix}载`,
        dynastyName: info.dynasty,
      };
    }
  }
  return null;
}

// Find which dynasty a year belongs to
function findDynastyForYear(year: number) {
  return MOCK_DYNASTIES.find(
    (d) => year >= d.start_year && year <= d.end_year
  ) ?? null;
}

export function TimelinePanel({ markers = [] }: TimelinePanelProps) {
  const {
    currentMode,
    currentYear,
    setCurrentYear,
    timeRange,
    isPlaying,
    togglePlaying,
    playbackSpeed,
    setPlaybackSpeed,
  } = useAppStore();

  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const rafRef = useRef<number | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(TIMELINE.WIDTH);

  // 测量容器宽度，避免在 render 中读取 ref
  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const updateWidth = () => setContainerWidth(el.clientWidth || TIMELINE.WIDTH);
    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 根据当前年份计算年号信息
  const eraInfo = useMemo(() => {
    if (currentYear === null) return null;
    const era = lookupEraName(currentYear);
    const dynasty = findDynastyForYear(currentYear);
    if (era) {
      return { eraName: era.eraName, dynastyName: era.dynastyName, color: dynasty?.color ?? "#888" };
    }
    if (dynasty) {
      return { eraName: dynasty.name, dynastyName: dynasty.name, color: dynasty.color };
    }
    return null;
  }, [currentYear]);

  // 根据模式选择Scale
  const scale = useMemo(() => {
    const width = containerWidth;

    if (currentMode === "general" || currentMode === "today") {
      return d3
        .scalePow()
        .exponent(currentMode === "general" ? 0.4 : 0.6)
        .domain([MIN_YEAR, MAX_YEAR])
        .range([40, width - 40])
        .clamp(true);
    }

    if (currentMode === "dynasty") {
      return d3
        .scaleLinear()
        .domain([timeRange.start, timeRange.end])
        .range([40, width - 40]);
    }

    if (currentMode === "event") {
      return d3
        .scaleTime()
        .domain([
          new Date(Math.floor(timeRange.start), 0, 1),
          new Date(Math.floor(timeRange.end), 0, 1),
        ])
        .range([40, width - 40]);
    }

    return d3.scaleLinear().domain([MIN_YEAR, MAX_YEAR]).range([40, width - 40]);
  }, [currentMode, timeRange, containerWidth]);

  // 播放逻辑
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentYear((prev) => {
        if (prev === null) return timeRange.start;
        const next = prev + playbackSpeed * 0.5;
        if (next > timeRange.end) {
          return timeRange.end;
        }
        return next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, timeRange, setCurrentYear]);

  // 绘制时间轴
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = 120;

    // Defs: gradient background + glow filter
    const defs = svg.append("defs");

    // Subtle gradient background
    const bgGrad = defs
      .append("linearGradient")
      .attr("id", "timeline-bg")
      .attr("x1", "0%").attr("y1", "0%")
      .attr("x2", "0%").attr("y2", "100%");
    bgGrad.append("stop").attr("offset", "0%").attr("stop-color", "#1a1a2e").attr("stop-opacity", 0.6);
    bgGrad.append("stop").attr("offset", "100%").attr("stop-color", "#16213e").attr("stop-opacity", 0.3);

    // Glow filter for active dynasty band
    const glowFilter = defs.append("filter").attr("id", "dynasty-glow");
    glowFilter.append("feGaussianBlur").attr("stdDeviation", "3").attr("result", "coloredBlur");
    const feMerge = glowFilter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Background rect
    svg
      .append("rect")
      .attr("x", 0).attr("y", 0)
      .attr("width", width).attr("height", height)
      .attr("fill", "url(#timeline-bg)");

    // === Dynasty color bands (Gantt chart style) ===
    const bandY = 10;
    const bandHeight = 28;
    const axisY = bandY + bandHeight + 8; // axis line position

    MOCK_DYNASTIES.forEach((dynasty) => {
      const x1 = scale(dynasty.start_year);
      const x2 = scale(dynasty.end_year);
      const bandWidth = Math.max(x2 - x1, 2);

      const isActive = currentYear !== null &&
        currentYear >= dynasty.start_year &&
        currentYear <= dynasty.end_year;

      const bandGroup = svg.append("g")
        .attr("cursor", "pointer")
        .on("click", () => {
          const midYear = (dynasty.start_year + dynasty.end_year) / 2;
          setCurrentYear(midYear);
        });

      // Band rectangle
      bandGroup
        .append("rect")
        .attr("x", x1)
        .attr("y", bandY)
        .attr("width", bandWidth)
        .attr("height", bandHeight)
        .attr("rx", 3)
        .attr("fill", dynasty.color)
        .attr("opacity", isActive ? 0.8 : 0.5)
        .attr("filter", isActive ? "url(#dynasty-glow)" : null);

      // Dynasty name text inside band
      if (bandWidth > 24) {
        bandGroup
          .append("text")
          .attr("x", x1 + bandWidth / 2)
          .attr("y", bandY + bandHeight / 2 + 4)
          .attr("text-anchor", "middle")
          .attr("fill", "#fff")
          .attr("font-size", bandWidth > 50 ? 10 : 8)
          .attr("font-weight", isActive ? 700 : 400)
          .attr("opacity", isActive ? 1 : 0.85)
          .text(dynasty.name);
      }
    });

    // === Main axis line ===
    svg
      .append("line")
      .attr("x1", 40)
      .attr("y1", axisY)
      .attr("x2", width - 40)
      .attr("y2", axisY)
      .attr("stroke", "#404040")
      .attr("stroke-width", 1);

    // === Tick marks ===
    const ticks = scale.ticks(10);
    ticks.forEach((t) => {
      const x = scale(t);
      svg
        .append("line")
        .attr("x1", x)
        .attr("y1", axisY - 4)
        .attr("x2", x)
        .attr("y2", axisY + 4)
        .attr("stroke", "#525252")
        .attr("stroke-width", 1);

      const label =
        typeof t === "number"
          ? formatYear(t)
          : d3.timeFormat("%Y")(t as Date);

      svg
        .append("text")
        .attr("x", x)
        .attr("y", axisY + 18)
        .attr("text-anchor", "middle")
        .attr("fill", "#737373")
        .attr("font-size", 9)
        .text(label);
    });

    // === Event markers ===
    markers.forEach((m) => {
      const x = scale(m.year);
      const radius = m.importance <= 2 ? 5 : m.importance === 3 ? 4 : 3;
      svg
        .append("circle")
        .attr("cx", x)
        .attr("cy", axisY)
        .attr("r", radius)
        .attr("fill", m.dynasty?.color || "#c41e3a")
        .attr("opacity", 0.8)
        .attr("cursor", "pointer")
        .on("click", () => setCurrentYear(m.year));
    });

    // === Cursor ===
    if (currentYear !== null) {
      const cx = scale(currentYear);

      // Red vertical line
      svg
        .append("line")
        .attr("x1", cx)
        .attr("y1", bandY - 2)
        .attr("x2", cx)
        .attr("y2", axisY + 8)
        .attr("stroke", "#ef4444")
        .attr("stroke-width", 2);

      // Year label above cursor
      const yearLabel = formatYear(Math.round(currentYear));
      const labelWidth = yearLabel.length * 7 + 12;
      svg
        .append("rect")
        .attr("x", cx - labelWidth / 2)
        .attr("y", bandY - 20)
        .attr("width", labelWidth)
        .attr("height", 16)
        .attr("rx", 3)
        .attr("fill", "#ef4444");
      svg
        .append("text")
        .attr("x", cx)
        .attr("y", bandY - 8)
        .attr("text-anchor", "middle")
        .attr("fill", "#fff")
        .attr("font-size", 10)
        .attr("font-weight", 600)
        .text(yearLabel);

      // Circular handle on the axis
      svg
        .append("circle")
        .attr("cx", cx)
        .attr("cy", axisY)
        .attr("r", 6)
        .attr("fill", "#ef4444")
        .attr("stroke", "#fff")
        .attr("stroke-width", 2)
        .attr("cursor", "grab");
    }
  }, [scale, markers, currentYear, setCurrentYear]);

  // === Drag support ===
  const getYearFromPointer = useCallback(
    (clientX: number) => {
      if (!svgRef.current) return null;
      const rect = svgRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const year = scale.invert(x);
      if (typeof year === "number") {
        return Math.max(MIN_YEAR, Math.min(MAX_YEAR, year));
      }
      return null;
    },
    [scale]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      e.preventDefault();
      setIsDragging(true);
      (e.target as Element).setPointerCapture?.(e.pointerId);
      const year = getYearFromPointer(e.clientX);
      if (year !== null) {
        setCurrentYear(year);
      }
    },
    [getYearFromPointer, setCurrentYear]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (!isDragging) return;
      e.preventDefault();

      // Throttle via requestAnimationFrame
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        const year = getYearFromPointer(e.clientX);
        if (year !== null) {
          setCurrentYear(year);
        }
        rafRef.current = null;
      });
    },
    [getYearFromPointer, setCurrentYear, isDragging]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="timeline-panel bg-surface/60 backdrop-blur-2xl border-t border-border/30 shrink-0 relative"
      style={{
        height: 120,
        boxShadow: "0 -12px 40px rgba(0, 0, 0, 0.5)",
      }}
    >
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ cursor: isDragging ? "grabbing" : "pointer" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />

      {/* Era name display */}
      {eraInfo && (
        <div
          className="absolute left-4 bottom-2 flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium"
          style={{
            backgroundColor: eraInfo.color + "30",
            color: eraInfo.color,
            border: `1px solid ${eraInfo.color}40`,
          }}
        >
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ backgroundColor: eraInfo.color }}
          />
          {eraInfo.eraName}
        </div>
      )}

      {/* 播放控制 */}
      <div className="absolute top-2 right-4 flex items-center gap-2">
        <button
          onClick={() => setCurrentYear(timeRange.start)}
          className="p-1 rounded hover:bg-surface-elevated text-text-secondary"
        >
          <SkipBack className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={togglePlaying}
          className="p-1.5 rounded bg-accent/20 hover:bg-accent/30 text-accent"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </button>
        <button
          onClick={() => setCurrentYear(timeRange.end)}
          className="p-1 rounded hover:bg-surface-elevated text-text-secondary"
        >
          <SkipForward className="w-3.5 h-3.5" />
        </button>
        <select
          value={playbackSpeed}
          onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
          className="bg-surface-elevated border border-border rounded px-1.5 py-0.5 text-[10px] text-text-secondary"
        >
          <option value={0.5}>0.5x</option>
          <option value={1}>1x</option>
          <option value={2}>2x</option>
          <option value={5}>5x</option>
        </select>
      </div>
    </div>
  );
}
