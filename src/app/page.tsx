"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/stores/appStore";
import { Header } from "@/components/layout/Header";
import { TodayInHistoryView } from "@/components/modes/TodayInHistoryView";
import { GeneralHistoryView } from "@/components/modes/GeneralHistoryView";
import { DynastyHistoryView } from "@/components/modes/DynastyHistoryView";
import { EventDetailView } from "@/components/modes/EventDetailView";
import { TimelinePanel } from "@/components/timeline/TimelinePanel";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";

export default function HomePage() {
  const { currentMode, setCurrentYear, timeRange } = useAppStore();

  // 模式切换时重置时间状态
  useEffect(() => {
    switch (currentMode) {
      case "today":
        setCurrentYear(null);
        break;
      case "general":
        setCurrentYear(-2070);
        break;
      case "dynasty":
        setCurrentYear(timeRange.start);
        break;
      case "event":
        setCurrentYear(null);
        break;
    }
  }, [currentMode, setCurrentYear, timeRange]);

  return (
    <div className="h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex min-h-0 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex min-h-0"
          >
            <ErrorBoundary>
              {currentMode === "today" && <TodayInHistoryView />}
            </ErrorBoundary>
            <ErrorBoundary>
              {currentMode === "general" && <GeneralHistoryView />}
            </ErrorBoundary>
            <ErrorBoundary>
              {currentMode === "dynasty" && <DynastyHistoryView />}
            </ErrorBoundary>
            <ErrorBoundary>
              {currentMode === "event" && <EventDetailView />}
            </ErrorBoundary>
          </motion.div>
        </AnimatePresence>
      </main>

      <ErrorBoundary>
        {currentMode !== "event" && <TimelinePanel />}
      </ErrorBoundary>
    </div>
  );
}
