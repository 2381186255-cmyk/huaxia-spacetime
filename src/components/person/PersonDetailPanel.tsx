"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/stores/appStore";
import { formatYear } from "@/lib/date-utils";
import { PERSON_TYPE_LABELS, EVENT_TYPE_LABELS } from "@/lib/constants";
import {
  X, ChevronRight, Crown, Shield, BookOpen, Users, MapPin
} from "lucide-react";
import type { Person, HistoricalEvent } from "@/lib/types";

interface PersonDetailPanelProps {
  person: Person | null;
  relatedEvents?: HistoricalEvent[];
  onClose: () => void;
  onEventClick?: (eventId: number) => void;
}

const personTypeIcons: Record<string, React.ElementType> = {
  emperor: Crown,
  official: Shield,
  general: Shield,
  scholar: BookOpen,
};

export function PersonDetailPanel({
  person,
  relatedEvents = [],
  onClose,
  onEventClick,
}: PersonDetailPanelProps) {
  if (!person) return null;

  const TypeIcon = personTypeIcons[person.person_type || ""] || Users;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 320, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 320, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="absolute right-0 top-0 bottom-0 w-80 bg-surface border-l border-border z-20 flex flex-col shadow-xl"
      >
        {/* 头部 */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold text-text-primary">人物简介</h3>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-surface-elevated text-text-tertiary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 人物信息 */}
        <div className="px-4 py-4 border-b border-border">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
              <TypeIcon className="w-6 h-6 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold text-text-primary">{person.name}</h2>
              {person.name_en && (
                <p className="text-[10px] text-text-tertiary">{person.name_en}</p>
              )}
              <div className="flex items-center gap-2 mt-1">
                {person.person_type && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-accent/15 text-accent">
                    {PERSON_TYPE_LABELS[person.person_type] || person.person_type}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 别名 */}
          {(person.courtesy_name || person.art_name) && (
            <div className="mt-3 flex gap-3 text-[10px]">
              {person.courtesy_name && (
                <div>
                  <span className="text-text-tertiary">字</span>{" "}
                  <span className="text-text-secondary">{person.courtesy_name}</span>
                </div>
              )}
              {person.art_name && (
                <div>
                  <span className="text-text-tertiary">号</span>{" "}
                  <span className="text-text-secondary">{person.art_name}</span>
                </div>
              )}
            </div>
          )}

          {/* 生卒年 */}
          {(person.birth_year || person.death_year) && (
            <div className="mt-2 text-[10px] text-text-secondary">
              {person.birth_year ? formatYear(person.birth_year) : "?"}
              {" — "}
              {person.death_year ? formatYear(person.death_year) : "?"}
              {person.birth_year && person.death_year && (
                <span className="text-text-tertiary ml-1">
                  (享年 {person.death_year - person.birth_year} 岁)
                </span>
              )}
            </div>
          )}

          {/* 简介 */}
          {person.summary && (
            <p className="mt-3 text-[11px] text-text-secondary leading-relaxed">
              {person.summary}
            </p>
          )}

          {person.description && (
            <p className="mt-2 text-[10px] text-text-tertiary leading-relaxed">
              {person.description}
            </p>
          )}
        </div>

        {/* 相关事件 */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-3">
            <h4 className="text-[11px] font-medium text-text-tertiary mb-2">
              相关事件 ({relatedEvents.length})
            </h4>
            {relatedEvents.length === 0 ? (
              <p className="text-[10px] text-text-tertiary text-center py-4">
                暂无关联事件
              </p>
            ) : (
              <div className="space-y-2">
                {relatedEvents.map((event) => (
                  <div
                    key={event.id}
                    className="group p-2.5 rounded-lg bg-surface-elevated/50 border border-border/50 hover:border-border cursor-pointer transition-all"
                    onClick={() => onEventClick?.(event.id)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-medium text-text-primary truncate">
                          {event.name}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[9px] text-text-tertiary">
                            {formatYear(event.start_year)}
                          </span>
                          {event.event_type && (
                            <span className="text-[9px] px-1 py-0 rounded bg-background text-text-tertiary">
                              {EVENT_TYPE_LABELS[event.event_type] || event.event_type}
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-3 h-3 text-text-tertiary group-hover:text-accent transition-colors shrink-0 mt-0.5" />
                    </div>

                    {event.summary && (
                      <p className="text-[9px] text-text-tertiary mt-1 line-clamp-2">
                        {event.summary}
                      </p>
                    )}

                    {(event.places || []).length > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="w-2.5 h-2.5 text-text-tertiary" />
                        <span className="text-[9px] text-text-tertiary">
                          {event.places!.map(p => p.name).join("、")}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
