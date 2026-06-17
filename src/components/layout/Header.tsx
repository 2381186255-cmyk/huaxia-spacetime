"use client";

import { useAppStore } from "@/stores/appStore";
import { Map, Clock, BookOpen, CalendarDays, Layers } from "lucide-react";
import { motion } from "framer-motion";
import { GlobalSearch } from "@/components/search/GlobalSearch";

const modes = [
  { id: "today" as const, label: "今日历史", icon: CalendarDays },
  { id: "general" as const, label: "通史", icon: BookOpen },
  { id: "dynasty" as const, label: "断代史", icon: Clock },
  { id: "event" as const, label: "事件", icon: Map },
];

export function Header() {
  const { currentMode, setMode } = useAppStore();

  return (
    <header className="h-12 flex items-center justify-between px-4 bg-surface border-b border-border shrink-0 z-50">
      <div className="flex items-center gap-3">
        <Layers className="w-5 h-5 text-gold" />
        <h1
          className="text-sm font-semibold tracking-wide text-gold"
          style={{
            fontFamily: '"Noto Serif SC", "PingFang SC", "Microsoft YaHei", serif',
            textShadow: '0 0 12px rgba(201, 168, 76, 0.3)',
          }}
        >
          华夏时空
        </h1>
      </div>

      <nav className="flex items-center gap-1">
        {modes.map((mode) => {
          const isActive = currentMode === mode.id;
          const Icon = mode.icon;
          return (
            <button
              key={mode.id}
              onClick={() => setMode(mode.id)}
              className="relative px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="mode-indicator"
                  className="absolute inset-0 bg-gold/15 rounded-md"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span
                className={`relative flex items-center gap-1.5 ${
                  isActive ? "text-gold" : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {mode.label}
              </span>
            </button>
          );
        })}
      </nav>

      <GlobalSearch />
    </header>
  );
}
