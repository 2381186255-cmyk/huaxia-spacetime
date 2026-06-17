"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/stores/appStore";
import { formatYear } from "@/lib/date-utils";
import { EVENT_TYPE_LABELS, PERSON_TYPE_LABELS } from "@/lib/constants";
import {
  Filter, ExternalLink, ChevronRight, BookOpen, User, FileText,
  Crown, Shield, MapPin
} from "lucide-react";
import type { HistoricalEvent, Person } from "@/lib/types";

interface KnowledgePanelProps {
  events?: HistoricalEvent[];
  isLoading?: boolean;
  onDeepExplore?: (eventId: number) => void;
  onPersonClick?: (personId: number) => void;
}

export function KnowledgePanel({
  events = [],
  isLoading = false,
  onDeepExplore,
  onPersonClick,
}: KnowledgePanelProps) {
  const { panelTab, setPanelTab, selectedDynastyId } = useAppStore();
  const [filterType, setFilterType] = useState<string>("all");
  const [persons, setPersons] = useState<Person[]>([]);
  const [personsLoading, setPersonsLoading] = useState(false);

  const filteredEvents =
    filterType === "all"
      ? events
      : events.filter((e) => e.event_type === filterType);

  const eventTypes = Array.from(new Set(events.map((e) => e.event_type)));

  // 加载人物数据
  useEffect(() => {
    if (panelTab !== "person") return;
    const fetchPersons = async () => {
      setPersonsLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedDynastyId) params.set("dynasty_id", String(selectedDynastyId));
        else params.set("q", "帝"); // 默认搜索帝王
        const res = await fetch(`/api/persons?${params}`);
        const data = await res.json();
        setPersons(data.persons || []);
      } catch {
        setPersons([]);
      } finally {
        setPersonsLoading(false);
      }
    };
    fetchPersons();
  }, [panelTab, selectedDynastyId]);

  return (
    <div
      className="w-80 bg-surface/75 backdrop-blur-xl border-l border-border/50 flex flex-col shrink-0"
      style={{ boxShadow: "-8px 0 32px rgba(0, 0, 0, 0.45), 1px 0 0 rgba(255, 255, 255, 0.04) inset" }}
    >
      {/* 面板头部 */}
      <div className="h-10 flex items-center justify-between px-3 border-b border-border">
        <div className="flex items-center gap-1">
          {[
            { id: "events" as const, icon: BookOpen, label: "事件" },
            { id: "person" as const, icon: User, label: "人物" },
            { id: "document" as const, icon: FileText, label: "文献" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setPanelTab(tab.id)}
              className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                panelTab === tab.id
                  ? "bg-accent/15 text-accent"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <tab.icon className="w-3 h-3" />
              {tab.label}
            </button>
          ))}
        </div>
        <button className="p-1 rounded hover:bg-surface-elevated text-text-tertiary">
          <Filter className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 筛选标签 */}
      {panelTab === "events" && eventTypes.length > 0 && (
        <div className="flex gap-1 px-3 py-2 border-b border-border overflow-x-auto">
          <button
            onClick={() => setFilterType("all")}
            className={`px-2 py-0.5 rounded-full text-[10px] whitespace-nowrap transition-colors ${
              filterType === "all"
                ? "bg-accent/20 text-accent"
                : "bg-surface-elevated text-text-tertiary hover:text-text-secondary"
            }`}
          >
            全部
          </button>
          {eventTypes.map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-2 py-0.5 rounded-full text-[10px] whitespace-nowrap transition-colors ${
                filterType === type
                  ? "bg-accent/20 text-accent"
                  : "bg-surface-elevated text-text-tertiary hover:text-text-secondary"
              }`}
            >
              {EVENT_TYPE_LABELS[type] || type}
            </button>
          ))}
        </div>
      )}

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {isLoading || personsLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          </div>
        ) : panelTab === "events" ? (
          <AnimatePresence mode="popLayout">
            {filteredEvents.map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                index={index}
                onDeepExplore={onDeepExplore}
              />
            ))}
          </AnimatePresence>
        ) : panelTab === "person" ? (
          persons.length === 0 ? (
            <div className="text-center text-text-tertiary text-xs py-8">
              暂无人物数据
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {persons.map((person, index) => (
                <PersonCard
                  key={person.id}
                  person={person}
                  index={index}
                  onClick={onPersonClick}
                />
              ))}
            </AnimatePresence>
          )
        ) : (
          <div className="text-center text-text-tertiary text-xs py-8">
            选择事件以查看相关文献
          </div>
        )}
      </div>
    </div>
  );
}

function EventCard({
  event,
  index,
  onDeepExplore,
}: {
  event: HistoricalEvent;
  index: number;
  onDeepExplore?: (eventId: number) => void;
}) {
  const { setSelectedEventId, setMode } = useAppStore();

  const handleDeepExplore = () => {
    setSelectedEventId(event.id);
    setMode("event");
    onDeepExplore?.(event.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ delay: index * 0.03 }}
      className="group p-3 rounded-lg bg-surface-elevated/50 border border-border/50 hover:border-border hover:bg-surface-elevated transition-all cursor-pointer"
      onClick={handleDeepExplore}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-xs font-medium text-text-primary truncate">
            {event.name}
          </h3>
          <p className="text-[10px] text-text-tertiary mt-0.5">
            {formatYear(event.start_year)}
            {event.dynasty ? ` · ${event.dynasty.name}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {event.event_type && (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-background text-text-tertiary">
              {EVENT_TYPE_LABELS[event.event_type] || event.event_type}
            </span>
          )}
          {event.dynasty && (
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: event.dynasty.color }}
            />
          )}
        </div>
      </div>

      {event.summary && (
        <p className="text-[10px] text-text-secondary mt-1.5 line-clamp-2 leading-relaxed">
          {event.summary}
        </p>
      )}

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-1">
          {(event.places || []).slice(0, 2).map((place) => (
            <span
              key={place.id}
              className="flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded bg-background text-text-tertiary"
            >
              <MapPin className="w-2 h-2" />
              {place.name}
            </span>
          ))}
          {(event.persons || []).length > 0 && (
            <span className="flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded bg-background text-text-tertiary">
              <User className="w-2 h-2" />
              {event.persons!.map(p => p.name).join("、")}
            </span>
          )}
        </div>
        <button className="flex items-center gap-0.5 text-[10px] text-accent opacity-0 group-hover:opacity-100 transition-opacity">
          深度探索
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {event.external_refs && Object.keys(event.external_refs).length > 0 && (
        <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-border/30">
          {Object.entries(event.external_refs).map(([key, url]) => (
            <a
              key={key}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-0.5 text-[9px] text-text-tertiary hover:text-accent transition-colors"
            >
              <ExternalLink className="w-2.5 h-2.5" />
              {key.toUpperCase()}
            </a>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function PersonCard({
  person,
  index,
  onClick,
}: {
  person: Person;
  index: number;
  onClick?: (personId: number) => void;
}) {
  const typeIcon: Record<string, React.ElementType> = {
    emperor: Crown,
    official: Shield,
    general: Shield,
  };
  const Icon = typeIcon[person.person_type || ""] || User;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ delay: index * 0.03 }}
      className="group p-3 rounded-lg bg-surface-elevated/50 border border-border/50 hover:border-border hover:bg-surface-elevated transition-all cursor-pointer"
      onClick={() => onClick?.(person.id)}
    >
      <div className="flex items-start gap-2.5">
        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="text-xs font-medium text-text-primary truncate">
              {person.name}
            </h3>
            {person.courtesy_name && (
              <span className="text-[9px] text-text-tertiary">字{person.courtesy_name}</span>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            {person.person_type && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-background text-text-tertiary">
                {PERSON_TYPE_LABELS[person.person_type] || person.person_type}
              </span>
            )}
            {person.birth_year && (
              <span className="text-[9px] text-text-tertiary">
                {formatYear(person.birth_year)}—{person.death_year ? formatYear(person.death_year) : "?"}
              </span>
            )}
          </div>
          {person.summary && (
            <p className="text-[10px] text-text-secondary mt-1 line-clamp-2 leading-relaxed">
              {person.summary}
            </p>
          )}
        </div>
        <ChevronRight className="w-3 h-3 text-text-tertiary group-hover:text-accent transition-colors shrink-0 mt-1" />
      </div>
    </motion.div>
  );
}
