// 华夏时空 - 常量定义

// 时间范围
export const MIN_YEAR = -2070;  // 夏朝约前2070年
export const MAX_YEAR = 1912;   // 清朝结束

// 事件类型映射
export const EVENT_TYPE_LABELS: Record<string, string> = {
  war: '战争',
  political: '政治',
  cultural: '文化',
  economic: '经济',
  disaster: '灾害',
  diplomatic: '外交',
  rebellion: '起义',
  reform: '改革',
  founding: '建立',
  collapse: '覆灭',
  other: '其他',
};

// 人物类型映射
export const PERSON_TYPE_LABELS: Record<string, string> = {
  emperor: '帝王',
  official: '官员',
  general: '将领',
  scholar: '学者',
  artisan: '工匠',
  merchant: '商人',
  other: '其他',
};

// 文献类型映射
export const DOC_TYPE_LABELS: Record<string, string> = {
  classic: '经',
  history: '史',
  philosophy: '子',
  poetry: '集',
  law: '法',
  geography: '地',
  other: '其他',
};

// 关系类型映射
export const RELATION_TYPE_LABELS: Record<string, string> = {
  father: '父',
  mother: '母',
  son: '子',
  daughter: '女',
  spouse: '配偶',
  brother: '兄弟',
  teacher: '师',
  student: '徒',
  colleague: '同僚',
  friend: '友',
  patron: '赞助者',
  superior: '上级',
  subordinate: '下属',
};

// 因果类型映射
export const CAUSALITY_TYPE_LABELS: Record<string, string> = {
  direct: '直接原因',
  indirect: '间接原因',
  background: '背景因素',
  trigger: '导火索',
  consequence: '后果',
};

// 地点类型映射
export const PLACE_TYPE_LABELS: Record<string, string> = {
  capital: '都城',
  prefecture: '州/府',
  county: '县',
  battlefield: '战场',
  port: '港口',
  pass: '关隘',
  mountain: '山',
  river: '河流',
  lake: '湖泊',
  other: '其他',
};

// 地图默认视口
export const DEFAULT_VIEWPORT = {
  longitude: 108,
  latitude: 34,
  zoom: 4,
  bearing: 0,
  pitch: 0,
};

// 模式对应的地图视口
export const MODE_VIEWPORTS: Record<string, { longitude: number; latitude: number; zoom: number }> = {
  today: { longitude: 108, latitude: 34, zoom: 4 },
  general: { longitude: 108, latitude: 34, zoom: 3.5 },
};

// 缓存TTL（秒）
export const CACHE_TTL = {
  API_RESPONSE: 86400,       // 24小时
  EXTERNAL_DATA: 86400,      // 24小时
  LUNAR_CONVERT: 2592000,    // 30天
  TEXT_CONTENT: 604800,      // 7天
} as const;

// 分页默认值
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// 时间轴配置
export const TIMELINE = {
  WIDTH: 1200,
  GENERAL_EXPONENT: 0.4,    // 通史模式幂函数指数
  TODAY_EXPONENT: 0.6,      // 默认模式幂函数指数
  PLAYBACK_INTERVAL: 100,   // 播放更新间隔(ms)
} as const;
