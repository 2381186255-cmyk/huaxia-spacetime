// 华夏时空 - Zustand全局状态仓库

import { create } from 'zustand';
import type { AppMode, SpatialTool, BasemapType, MapViewport } from '@/lib/types';
import { DEFAULT_VIEWPORT } from '@/lib/constants';

export interface AppState {
  // ===== 模式状态 =====
  currentMode: AppMode;
  previousMode: AppMode;

  // ===== 时间状态 =====
  currentYear: number | null;
  timeRange: { start: number; end: number };
  isPlaying: boolean;
  playbackSpeed: number;

  // ===== 默认模式状态 =====
  todayDate: { month: number; day: number };

  // ===== 断代史状态 =====
  selectedDynastyId: number | null;

  // ===== 事件模式状态 =====
  selectedEventId: number | null;
  territoryYear: number | null;
  showTerritoryDiff: boolean;

  // ===== 地图状态 =====
  mapViewport: MapViewport;
  activeLayers: string[];
  basemapType: BasemapType;

  // ===== 知识面板状态 =====
  panelTab: 'events' | 'person' | 'document' | 'causality';
  selectedPersonId: number | null;

  // ===== 空间运算状态 =====
  spatialTool: SpatialTool;
  spatialResult: Record<string, unknown> | null;

  // ===== Actions =====
  setMode: (mode: AppMode) => void;
  setCurrentYear: (year: number | null | ((prev: number | null) => number | null)) => void;
  setTimeRange: (range: { start: number; end: number }) => void;
  setPlaying: (playing: boolean) => void;
  togglePlaying: () => void;
  setPlaybackSpeed: (speed: number) => void;
  setTodayDate: (date: { month: number; day: number }) => void;
  setSelectedDynastyId: (id: number | null) => void;
  setSelectedEventId: (id: number | null) => void;
  setTerritoryYear: (year: number | null) => void;
  setShowTerritoryDiff: (show: boolean) => void;
  setMapViewport: (viewport: Partial<MapViewport>) => void;
  setActiveLayers: (layers: string[]) => void;
  addActiveLayer: (layer: string) => void;
  removeActiveLayer: (layer: string) => void;
  setBasemapType: (type: BasemapType) => void;
  setPanelTab: (tab: AppState['panelTab']) => void;
  setSelectedPersonId: (id: number | null) => void;
  setSpatialTool: (tool: SpatialTool) => void;
  setSpatialResult: (result: Record<string, unknown> | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // ===== 初始状态 =====
  currentMode: 'today',
  previousMode: 'today',
  currentYear: null,
  timeRange: { start: -2070, end: 1912 },
  isPlaying: false,
  playbackSpeed: 1,
  todayDate: { month: 1, day: 1 },
  selectedDynastyId: null,
  selectedEventId: null,
  territoryYear: null,
  showTerritoryDiff: false,
  mapViewport: { ...DEFAULT_VIEWPORT },
  activeLayers: ['places-today'],
  basemapType: 'modern',
  panelTab: 'events',
  selectedPersonId: null,
  spatialTool: 'none',
  spatialResult: null,

  // ===== Actions =====
  setMode: (mode) =>
    set((state) => ({
      previousMode: state.currentMode,
      currentMode: mode,
    })),

  setCurrentYear: (year) =>
    set((state) => ({
      currentYear: typeof year === 'function' ? year(state.currentYear) : year,
    })),

  setTimeRange: (range) => set({ timeRange: range }),

  setPlaying: (playing) => set({ isPlaying: playing }),

  togglePlaying: () => set((state) => ({ isPlaying: !state.isPlaying })),

  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),

  setTodayDate: (date) => set({ todayDate: date }),

  setSelectedDynastyId: (id) => set({ selectedDynastyId: id }),

  setSelectedEventId: (id) => set({ selectedEventId: id }),

  setTerritoryYear: (year) => set({ territoryYear: year }),

  setShowTerritoryDiff: (show) => set({ showTerritoryDiff: show }),

  setMapViewport: (viewport) =>
    set((state) => ({
      mapViewport: { ...state.mapViewport, ...viewport },
    })),

  setActiveLayers: (layers) => set({ activeLayers: layers }),

  addActiveLayer: (layer) =>
    set((state) => ({
      activeLayers: state.activeLayers.includes(layer)
        ? state.activeLayers
        : [...state.activeLayers, layer],
    })),

  removeActiveLayer: (layer) =>
    set((state) => ({
      activeLayers: state.activeLayers.filter((l) => l !== layer),
    })),

  setBasemapType: (type) => set({ basemapType: type }),

  setPanelTab: (tab) => set({ panelTab: tab }),

  setSelectedPersonId: (id) => set({ selectedPersonId: id }),

  setSpatialTool: (tool) => set({ spatialTool: tool }),

  setSpatialResult: (result) => set({ spatialResult: result }),
}));
