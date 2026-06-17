"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/stores/appStore";
import { formatYear } from "@/lib/date-utils";
import { EVENT_TYPE_LABELS, PERSON_TYPE_LABELS, PLACE_TYPE_LABELS } from "@/lib/constants";
import {
  Search, X, Clock, MapPin, User, BookOpen, ArrowRight
} from "lucide-react";
import type { HistoricalEvent, Person, HistoricalPlace } from "@/lib/types";

interface SearchResult {
  events: HistoricalEvent[];
  persons: Person[];
  places: HistoricalPlace[];
}

export function GlobalSearch() {
  const { setMode, setSelectedEventId, setSelectedPersonId, setSelectedDynastyId } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult>({ events: [], persons: [], places: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [isMac] = useState(() =>
    typeof window !== "undefined" && /mac|darwin|iphone|ipad/i.test(navigator.userAgent)
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const shortcutLabel = isMac ? "⌘K" : "Ctrl+K";

  // 快捷键 Cmd/Ctrl + K 打开搜索
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 聚焦输入框
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // 搜索
  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults({ events: [], persons: [], places: [] });
      return;
    }
    setIsLoading(true);
    try {
      const [eventsRes, personsRes, placesRes] = await Promise.all([
        fetch(`/api/events?q=${encodeURIComponent(q)}&limit=5`).then(r => r.json()),
        fetch(`/api/persons?q=${encodeURIComponent(q)}&limit=5`).then(r => r.json()),
        fetch(`/api/places?q=${encodeURIComponent(q)}&limit=5`).then(r => r.json()),
      ]);
      setResults({
        events: eventsRes.events || [],
        persons: personsRes.persons || [],
        places: placesRes.places || [],
      });
    } catch {
      setResults({ events: [], persons: [], places: [] });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 防抖搜索
  useEffect(() => {
    const timer = setTimeout(() => doSearch(query), 300);
    return () => clearTimeout(timer);
  }, [query, doSearch]);

  const hasResults = results.events.length > 0 || results.persons.length > 0 || results.places.length > 0;

  const handleEventClick = (eventId: number) => {
    setSelectedEventId(eventId);
    setMode("event");
    setIsOpen(false);
  };

  const handlePersonClick = (personId: number) => {
    setSelectedPersonId(personId);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* 触发按钮 */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-surface-elevated/50 border border-border/50 text-text-tertiary hover:text-text-secondary hover:border-border transition-colors text-[11px]"
      >
        <Search className="w-3.5 h-3.5" />
        <span>搜索...</span>
        <kbd className="ml-2 text-[9px] px-1 py-0.5 rounded bg-background text-text-tertiary border border-border/50">
          {shortcutLabel}
        </kbd>
      </button>

      {/* 搜索面板 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-[420px] bg-surface border border-border rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            {/* 搜索输入 */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
              <Search className="w-4 h-4 text-text-tertiary shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索事件、人物、地点..."
                className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-tertiary outline-none"
              />
              {query && (
                <button
                  onClick={() => { setQuery(""); setResults({ events: [], persons: [], places: [] }); }}
                  className="p-0.5 rounded hover:bg-surface-elevated text-text-tertiary"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <kbd className="text-[9px] px-1 py-0.5 rounded bg-background text-text-tertiary border border-border/50">
                ESC
              </kbd>
            </div>

            {/* 搜索结果 */}
            <div className="max-h-[400px] overflow-y-auto">
              {isLoading && (
                <div className="flex items-center justify-center py-8">
                  <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                </div>
              )}

              {!isLoading && !query && (
                <div className="py-8 text-center text-text-tertiary text-xs">
                  输入关键词开始搜索
                </div>
              )}

              {!isLoading && query && !hasResults && (
                <div className="py-8 text-center text-text-tertiary text-xs">
                  未找到与 &quot;{query}&quot; 相关的结果
                </div>
              )}

              {/* 事件结果 */}
              {results.events.length > 0 && (
                <div className="py-2">
                  <div className="px-4 py-1.5 flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-text-tertiary" />
                    <span className="text-[10px] font-medium text-text-tertiary uppercase tracking-wider">
                      事件
                    </span>
                  </div>
                  {results.events.map((event) => (
                    <button
                      key={`event-${event.id}`}
                      onClick={() => handleEventClick(event.id)}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-surface-elevated transition-colors text-left"
                    >
                      <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-text-primary truncate">
                          {event.name}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[9px] text-text-tertiary">
                            {formatYear(event.start_year)}
                          </span>
                          {event.dynasty && (
                            <>
                              <span className="text-[9px] text-text-tertiary">·</span>
                              <span className="text-[9px] text-text-tertiary">{event.dynasty.name}</span>
                            </>
                          )}
                          {event.event_type && (
                            <span className="text-[9px] px-1 py-0 rounded bg-background text-text-tertiary">
                              {EVENT_TYPE_LABELS[event.event_type] || event.event_type}
                            </span>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="w-3 h-3 text-text-tertiary shrink-0" />
                    </button>
                  ))}
                </div>
              )}

              {/* 人物结果 */}
              {results.persons.length > 0 && (
                <div className="py-2 border-t border-border/50">
                  <div className="px-4 py-1.5 flex items-center gap-1.5">
                    <User className="w-3 h-3 text-text-tertiary" />
                    <span className="text-[10px] font-medium text-text-tertiary uppercase tracking-wider">
                      人物
                    </span>
                  </div>
                  {results.persons.map((person) => (
                    <button
                      key={`person-${person.id}`}
                      onClick={() => handlePersonClick(person.id)}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-surface-elevated transition-colors text-left"
                    >
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-text-primary truncate">
                          {person.name}
                          {person.courtesy_name && (
                            <span className="text-text-tertiary ml-1">字{person.courtesy_name}</span>
                          )}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {person.person_type && (
                            <span className="text-[9px] px-1 py-0 rounded bg-background text-text-tertiary">
                              {PERSON_TYPE_LABELS[person.person_type] || person.person_type}
                            </span>
                          )}
                          {person.birth_year && (
                            <span className="text-[9px] text-text-tertiary">
                              {formatYear(person.birth_year)}—{person.death_year ? formatYear(person.death_year) : "?"}
                            </span>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="w-3 h-3 text-text-tertiary shrink-0" />
                    </button>
                  ))}
                </div>
              )}

              {/* 地点结果 */}
              {results.places.length > 0 && (
                <div className="py-2 border-t border-border/50">
                  <div className="px-4 py-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-text-tertiary" />
                    <span className="text-[10px] font-medium text-text-tertiary uppercase tracking-wider">
                      地点
                    </span>
                  </div>
                  {results.places.map((place) => (
                    <div
                      key={`place-${place.id}`}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-surface-elevated transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-text-primary truncate">
                          {place.name}
                          {place.modern_name && place.modern_name !== place.name && (
                            <span className="text-text-tertiary ml-1">今{place.modern_name}</span>
                          )}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {place.place_type && (
                            <span className="text-[9px] px-1 py-0 rounded bg-background text-text-tertiary">
                              {PLACE_TYPE_LABELS[place.place_type] || place.place_type}
                            </span>
                          )}
                          <span className="text-[9px] text-text-tertiary">
                            {formatYear(place.start_year)}
                            {place.end_year !== place.start_year && `—${formatYear(place.end_year)}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 底部提示 */}
            {query && hasResults && (
              <div className="px-4 py-2 border-t border-border/50 text-[9px] text-text-tertiary flex items-center justify-between">
                <span>按 Enter 查看更多</span>
                <span>{shortcutLabel} 随时搜索</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
