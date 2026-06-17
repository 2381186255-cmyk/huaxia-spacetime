// 华夏时空 - Store Selectors
// 用于优化组件渲染，避免不必要的重渲染

import type { AppState } from './appStore';

// 仅选择模式相关状态
export const selectMode = (state: AppState) => ({
  currentMode: state.currentMode,
  previousMode: state.previousMode,
});

// 仅选择时间相关状态
export const selectTime = (state: AppState) => ({
  currentYear: state.currentYear,
  timeRange: state.timeRange,
  isPlaying: state.isPlaying,
  playbackSpeed: state.playbackSpeed,
});

// 仅选择地图相关状态
export const selectMap = (state: AppState) => ({
  mapViewport: state.mapViewport,
  activeLayers: state.activeLayers,
  basemapType: state.basemapType,
});

// 仅选择事件模式状态
export const selectEventMode = (state: AppState) => ({
  selectedEventId: state.selectedEventId,
  territoryYear: state.territoryYear,
  showTerritoryDiff: state.showTerritoryDiff,
});

// 仅选择知识面板状态
export const selectKnowledgePanel = (state: AppState) => ({
  panelTab: state.panelTab,
  selectedPersonId: state.selectedPersonId,
});

// 仅选择空间运算状态
export const selectSpatial = (state: AppState) => ({
  spatialTool: state.spatialTool,
  spatialResult: state.spatialResult,
});
