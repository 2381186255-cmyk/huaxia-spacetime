// 华夏时空 - Mock数据服务（无Docker降级模式）
// 当环境变量 USE_MOCK=true 时，API路由使用此模块返回示例数据

import type { HistoricalEvent, Dynasty, HistoricalPlace, Person } from '@/lib/types';

// ===== 朝代数据 =====
export const MOCK_DYNASTIES: Dynasty[] = [
  { id: 1, name: '夏', name_en: 'Xia', start_year: -2070, end_year: -1600, color: '#8B4513', description: '中国第一个世袭制王朝', sort_order: 1 },
  { id: 2, name: '商', name_en: 'Shang', start_year: -1600, end_year: -1046, color: '#DAA520', description: '甲骨文与青铜器时代', sort_order: 2 },
  { id: 3, name: '西周', name_en: 'Western Zhou', start_year: -1046, end_year: -771, color: '#2E8B57', description: '分封制与礼乐文明', sort_order: 3 },
  { id: 4, name: '东周', name_en: 'Eastern Zhou', start_year: -770, end_year: -256, color: '#4682B4', description: '春秋战国，百家争鸣', sort_order: 4 },
  { id: 5, name: '秦', name_en: 'Qin', start_year: -221, end_year: -206, color: '#1C1C1C', description: '大一统帝国建立', sort_order: 5 },
  { id: 6, name: '西汉', name_en: 'Western Han', start_year: -202, end_year: 8, color: '#DC143C', description: '丝绸之路开辟', sort_order: 6 },
  { id: 7, name: '东汉', name_en: 'Eastern Han', start_year: 25, end_year: 220, color: '#B22222', description: '造纸术与佛教传入', sort_order: 7 },
  { id: 8, name: '三国', name_en: 'Three Kingdoms', start_year: 220, end_year: 280, color: '#8B0000', description: '魏蜀吴鼎立', sort_order: 8 },
  { id: 9, name: '西晋', name_en: 'Western Jin', start_year: 265, end_year: 316, color: '#556B2F', description: '短暂统一', sort_order: 9 },
  { id: 10, name: '东晋', name_en: 'Eastern Jin', start_year: 317, end_year: 420, color: '#6B8E23', description: '偏安江南', sort_order: 10 },
  { id: 11, name: '南北朝', name_en: 'Southern & Northern Dynasties', start_year: 420, end_year: 589, color: '#708090', description: '民族融合与佛教兴盛', sort_order: 11 },
  { id: 12, name: '隋', name_en: 'Sui', start_year: 581, end_year: 618, color: '#FF8C00', description: '大运河与科举制', sort_order: 12 },
  { id: 13, name: '唐', name_en: 'Tang', start_year: 618, end_year: 907, color: '#FFD700', description: '盛世辉煌，万国来朝', sort_order: 13 },
  { id: 14, name: '五代十国', name_en: 'Five Dynasties', start_year: 907, end_year: 960, color: '#A0522D', description: '分裂割据', sort_order: 14 },
  { id: 15, name: '北宋', name_en: 'Northern Song', start_year: 960, end_year: 1127, color: '#4169E1', description: '文治盛世与科技高峰', sort_order: 15 },
  { id: 16, name: '南宋', name_en: 'Southern Song', start_year: 1127, end_year: 1279, color: '#6495ED', description: '偏安江南与文化繁荣', sort_order: 16 },
  { id: 17, name: '元', name_en: 'Yuan', start_year: 1271, end_year: 1368, color: '#006400', description: '蒙古帝国与东西交流', sort_order: 17 },
  { id: 18, name: '明', name_en: 'Ming', start_year: 1368, end_year: 1644, color: '#8B0000', description: '郑和下西洋与长城', sort_order: 18 },
  { id: 19, name: '清', name_en: 'Qing', start_year: 1644, end_year: 1912, color: '#FFD700', description: '最后的封建王朝', sort_order: 19 },
];

// ===== 地点数据 =====
const pt = (lon: number, lat: number): HistoricalPlace['geom'] => ({
  type: 'Feature',
  geometry: { type: 'Point', coordinates: [lon, lat] },
  properties: {},
});

export const MOCK_PLACES: HistoricalPlace[] = [
  // ---- 都城 (capital) ----
  { id: 1, name: '镐京', modern_name: '西安', start_year: -1046, end_year: -771, dynasty_id: 3, place_type: 'capital', geom: pt(108.9, 34.26), detail_level: 1, external_refs: {} },
  { id: 2, name: '咸阳', modern_name: '咸阳', start_year: -350, end_year: -206, dynasty_id: 5, place_type: 'capital', geom: pt(108.71, 34.33), detail_level: 1, external_refs: {} },
  { id: 3, name: '长安', modern_name: '西安', start_year: -202, end_year: 220, dynasty_id: 6, place_type: 'capital', geom: pt(108.9, 34.26), detail_level: 1, external_refs: {} },
  { id: 4, name: '洛阳', modern_name: '洛阳', start_year: -770, end_year: 220, dynasty_id: 4, place_type: 'capital', geom: pt(112.45, 34.62), detail_level: 1, external_refs: {} },
  { id: 5, name: '建康', modern_name: '南京', start_year: 229, end_year: 589, dynasty_id: 8, place_type: 'capital', geom: pt(118.78, 32.06), detail_level: 1, external_refs: {} },
  { id: 6, name: '开封', modern_name: '开封', start_year: 960, end_year: 1127, dynasty_id: 15, place_type: 'capital', geom: pt(114.35, 34.79), detail_level: 1, external_refs: {} },
  { id: 7, name: '临安', modern_name: '杭州', start_year: 1127, end_year: 1279, dynasty_id: 16, place_type: 'capital', geom: pt(120.15, 30.28), detail_level: 1, external_refs: {} },
  { id: 8, name: '大都', modern_name: '北京', start_year: 1271, end_year: 1368, dynasty_id: 17, place_type: 'capital', geom: pt(116.4, 39.9), detail_level: 1, external_refs: {} },
  { id: 9, name: '应天府', modern_name: '南京', start_year: 1368, end_year: 1420, dynasty_id: 18, place_type: 'capital', geom: pt(118.78, 32.06), detail_level: 1, external_refs: {} },
  { id: 10, name: '北京', modern_name: '北京', start_year: 1420, end_year: 1912, dynasty_id: 18, place_type: 'capital', geom: pt(116.4, 39.9), detail_level: 1, external_refs: {} },
  { id: 15, name: '殷墟', modern_name: '安阳', start_year: -1300, end_year: -1046, dynasty_id: 2, place_type: 'capital', geom: pt(114.35, 36.1), detail_level: 1, external_refs: {} },
  { id: 16, name: '雒邑', modern_name: '洛阳', start_year: -770, end_year: -256, dynasty_id: 4, place_type: 'capital', geom: pt(112.45, 34.62), detail_level: 1, external_refs: {} },
  { id: 17, name: '许昌', modern_name: '许昌', start_year: 196, end_year: 220, dynasty_id: 8, place_type: 'capital', geom: pt(113.85, 34.03), detail_level: 1, external_refs: {} },
  { id: 18, name: '成都', modern_name: '成都', start_year: 221, end_year: 263, dynasty_id: 8, place_type: 'capital', geom: pt(104.07, 30.67), detail_level: 1, external_refs: {} },
  { id: 19, name: '建业', modern_name: '南京', start_year: 229, end_year: 280, dynasty_id: 8, place_type: 'capital', geom: pt(118.78, 32.06), detail_level: 1, external_refs: {} },
  { id: 20, name: '平城', modern_name: '大同', start_year: 398, end_year: 494, dynasty_id: 11, place_type: 'capital', geom: pt(113.3, 40.08), detail_level: 1, external_refs: {} },
  { id: 21, name: '大兴', modern_name: '西安', start_year: 581, end_year: 618, dynasty_id: 12, place_type: 'capital', geom: pt(108.9, 34.26), detail_level: 1, external_refs: {} },
  { id: 22, name: '盛京', modern_name: '沈阳', start_year: 1625, end_year: 1644, dynasty_id: 19, place_type: 'capital', geom: pt(123.43, 41.8), detail_level: 1, external_refs: {} },
  { id: 43, name: '南阳', modern_name: '南阳', start_year: 25, end_year: 220, dynasty_id: 7, place_type: 'capital', geom: pt(112.53, 33.0), detail_level: 2, external_refs: {} },
  { id: 44, name: '邺城', modern_name: '临漳', start_year: 204, end_year: 580, dynasty_id: 8, place_type: 'capital', geom: pt(114.45, 36.33), detail_level: 2, external_refs: {} },
  { id: 47, name: '灵武', modern_name: '灵武', start_year: 756, end_year: 757, dynasty_id: 13, place_type: 'capital', geom: pt(106.34, 38.1), detail_level: 2, external_refs: {} },
  // ---- 战场 (battlefield) ----
  { id: 11, name: '赤壁', modern_name: '赤壁', start_year: 208, end_year: 208, dynasty_id: 7, place_type: 'battlefield', geom: pt(113.9, 29.85), detail_level: 1, external_refs: {} },
  { id: 12, name: '长平', modern_name: '高平', start_year: -260, end_year: -260, dynasty_id: 4, place_type: 'battlefield', geom: pt(112.88, 35.8), detail_level: 1, external_refs: {} },
  { id: 23, name: '巨鹿', modern_name: '平乡', start_year: -207, end_year: -207, dynasty_id: 5, place_type: 'battlefield', geom: pt(114.95, 37.07), detail_level: 1, external_refs: {} },
  { id: 24, name: '官渡', modern_name: '中牟', start_year: 200, end_year: 200, dynasty_id: 8, place_type: 'battlefield', geom: pt(113.97, 34.72), detail_level: 1, external_refs: {} },
  { id: 25, name: '夷陵', modern_name: '宜昌', start_year: 222, end_year: 222, dynasty_id: 8, place_type: 'battlefield', geom: pt(111.45, 30.7), detail_level: 1, external_refs: {} },
  { id: 26, name: '涿鹿', modern_name: '涿鹿', start_year: -2600, end_year: -2600, dynasty_id: 1, place_type: 'battlefield', geom: pt(115.2, 40.38), detail_level: 2, external_refs: {} },
  { id: 28, name: '崖山', modern_name: '新会', start_year: 1279, end_year: 1279, dynasty_id: 16, place_type: 'battlefield', geom: pt(113.08, 22.35), detail_level: 1, external_refs: {} },
  { id: 29, name: '虎门', modern_name: '东莞', start_year: 1840, end_year: 1840, dynasty_id: 19, place_type: 'battlefield', geom: pt(113.72, 22.79), detail_level: 1, external_refs: {} },
  { id: 48, name: '马嵬坡', modern_name: '兴平', start_year: 756, end_year: 756, dynasty_id: 13, place_type: 'battlefield', geom: pt(108.48, 34.3), detail_level: 2, external_refs: {} },
  { id: 52, name: '钓鱼城', modern_name: '合川', start_year: 1243, end_year: 1279, dynasty_id: 16, place_type: 'battlefield', geom: pt(106.28, 29.98), detail_level: 2, external_refs: {} },
  { id: 53, name: '九江', modern_name: '九江', start_year: 383, end_year: 383, dynasty_id: 10, place_type: 'battlefield', geom: pt(115.97, 29.73), detail_level: 2, external_refs: {} },
  // ---- 关隘 (pass) ----
  { id: 13, name: '玉门关', modern_name: '敦煌', start_year: -121, end_year: 907, dynasty_id: 6, place_type: 'pass', geom: pt(93.5, 40.3), detail_level: 1, external_refs: {} },
  { id: 14, name: '山海关', modern_name: '秦皇岛', start_year: 1381, end_year: 1644, dynasty_id: 18, place_type: 'pass', geom: pt(119.75, 40.0), detail_level: 1, external_refs: {} },
  { id: 27, name: '潼关', modern_name: '潼关', start_year: -196, end_year: 1644, dynasty_id: 6, place_type: 'pass', geom: pt(110.24, 34.54), detail_level: 1, external_refs: {} },
  { id: 38, name: '雁门关', modern_name: '代县', start_year: -300, end_year: 1644, dynasty_id: 4, place_type: 'pass', geom: pt(112.88, 39.22), detail_level: 1, external_refs: {} },
  { id: 39, name: '剑门关', modern_name: '剑阁', start_year: -300, end_year: 1644, dynasty_id: 4, place_type: 'pass', geom: pt(105.57, 32.15), detail_level: 1, external_refs: {} },
  { id: 40, name: '函谷关', modern_name: '灵宝', start_year: -770, end_year: 220, dynasty_id: 4, place_type: 'pass', geom: pt(110.95, 34.5), detail_level: 1, external_refs: {} },
  // ---- 文化遗址 (cultural) ----
  { id: 30, name: '曲阜', modern_name: '曲阜', start_year: -551, end_year: 1912, dynasty_id: 4, place_type: 'cultural', geom: pt(117.0, 35.58), detail_level: 1, external_refs: {} },
  { id: 31, name: '敦煌', modern_name: '敦煌', start_year: -111, end_year: 1368, dynasty_id: 6, place_type: 'cultural', geom: pt(94.66, 40.14), detail_level: 1, external_refs: {} },
  { id: 32, name: '龙门', modern_name: '洛阳', start_year: 493, end_year: 907, dynasty_id: 11, place_type: 'cultural', geom: pt(112.47, 34.56), detail_level: 1, external_refs: {} },
  { id: 33, name: '云冈', modern_name: '大同', start_year: 460, end_year: 524, dynasty_id: 11, place_type: 'cultural', geom: pt(113.14, 40.12), detail_level: 1, external_refs: {} },
  { id: 34, name: '泰山', modern_name: '泰安', start_year: -2000, end_year: 1912, dynasty_id: 1, place_type: 'cultural', geom: pt(117.1, 36.25), detail_level: 1, external_refs: {} },
  { id: 45, name: '兰亭', modern_name: '绍兴', start_year: 353, end_year: 353, dynasty_id: 10, place_type: 'cultural', geom: pt(120.58, 30.0), detail_level: 2, external_refs: {} },
  // ---- 贸易路线 (trade) ----
  { id: 35, name: '喀什', modern_name: '喀什', start_year: -60, end_year: 1368, dynasty_id: 6, place_type: 'trade', geom: pt(75.99, 39.47), detail_level: 2, external_refs: {} },
  { id: 36, name: '泉州', modern_name: '泉州', start_year: 960, end_year: 1368, dynasty_id: 15, place_type: 'trade', geom: pt(118.59, 24.87), detail_level: 1, external_refs: {} },
  { id: 37, name: '广州', modern_name: '广州', start_year: -214, end_year: 1912, dynasty_id: 6, place_type: 'trade', geom: pt(113.26, 23.13), detail_level: 1, external_refs: {} },
  { id: 49, name: '涿郡', modern_name: '北京', start_year: 581, end_year: 618, dynasty_id: 12, place_type: 'trade', geom: pt(116.4, 39.9), detail_level: 2, external_refs: {} },
  { id: 50, name: '余杭', modern_name: '杭州', start_year: 581, end_year: 618, dynasty_id: 12, place_type: 'trade', geom: pt(120.15, 30.28), detail_level: 2, external_refs: {} },
  // ---- 起义/事件地 (rebellion/other) ----
  { id: 41, name: '阳城', modern_name: '登封', start_year: -209, end_year: -209, dynasty_id: 5, place_type: 'rebellion', geom: pt(113.05, 34.45), detail_level: 2, external_refs: {} },
  { id: 46, name: '会稽', modern_name: '绍兴', start_year: -210, end_year: 420, dynasty_id: 4, place_type: 'cultural', geom: pt(120.58, 30.0), detail_level: 2, external_refs: {} },
  { id: 51, name: '武昌', modern_name: '武汉', start_year: 1911, end_year: 1911, dynasty_id: 19, place_type: 'rebellion', geom: pt(114.35, 30.59), detail_level: 1, external_refs: {} },
  // ---- 外交 (diplomatic) ----
  { id: 54, name: '雅安', modern_name: '雅安', start_year: 641, end_year: 641, dynasty_id: 13, place_type: 'diplomatic', geom: pt(103.0, 30.0), detail_level: 2, external_refs: {} },
  { id: 55, name: '拉萨', modern_name: '拉萨', start_year: 633, end_year: 907, dynasty_id: 13, place_type: 'diplomatic', geom: pt(91.11, 29.65), detail_level: 2, external_refs: {} },
  { id: 56, name: '尼布楚', modern_name: '涅尔琴斯克', start_year: 1689, end_year: 1689, dynasty_id: 19, place_type: 'diplomatic', geom: pt(115.55, 51.38), detail_level: 2, external_refs: {} },
  { id: 57, name: '威海卫', modern_name: '威海', start_year: 1895, end_year: 1895, dynasty_id: 19, place_type: 'battlefield', geom: pt(122.12, 37.51), detail_level: 2, external_refs: {} },
  { id: 58, name: '天京', modern_name: '南京', start_year: 1853, end_year: 1864, dynasty_id: 19, place_type: 'rebellion', geom: pt(118.78, 32.06), detail_level: 2, external_refs: {} },
  { id: 59, name: '金田', modern_name: '桂平', start_year: 1851, end_year: 1851, dynasty_id: 19, place_type: 'rebellion', geom: pt(110.08, 23.39), detail_level: 2, external_refs: {} },
  { id: 60, name: '土木堡', modern_name: '怀来', start_year: 1449, end_year: 1449, dynasty_id: 18, place_type: 'battlefield', geom: pt(115.58, 40.38), detail_level: 2, external_refs: {} },
  // ---- 夏朝地点 ----
  { id: 61, name: '阳城', modern_name: '登封告成', start_year: -2070, end_year: -2061, dynasty_id: 1, place_type: 'capital', geom: pt(113.05, 34.45), detail_level: 2, external_refs: {} },
  { id: 62, name: '阳翟', modern_name: '禹州', start_year: -2061, end_year: -2057, dynasty_id: 1, place_type: 'capital', geom: pt(113.48, 34.16), detail_level: 2, external_refs: {} },
  { id: 63, name: '斟鄩', modern_name: '偃师二里头', start_year: -2018, end_year: -1600, dynasty_id: 1, place_type: 'capital', geom: pt(112.78, 34.72), detail_level: 1, external_refs: {} },
  { id: 64, name: '安邑', modern_name: '夏县', start_year: -2070, end_year: -2000, dynasty_id: 1, place_type: 'capital', geom: pt(111.22, 35.12), detail_level: 2, external_refs: {} },
  { id: 65, name: '帝丘', modern_name: '濮阳', start_year: -1976, end_year: -1949, dynasty_id: 1, place_type: 'capital', geom: pt(115.03, 35.76), detail_level: 2, external_refs: {} },
  { id: 66, name: '涂山', modern_name: '蚌埠怀远', start_year: -2070, end_year: -2070, dynasty_id: 1, place_type: 'cultural', geom: pt(117.2, 32.95), detail_level: 2, external_refs: {} },
  { id: 67, name: '鸣条', modern_name: '封丘', start_year: -1600, end_year: -1600, dynasty_id: 1, place_type: 'battlefield', geom: pt(114.42, 35.03), detail_level: 2, external_refs: {} },
  { id: 68, name: '南巢', modern_name: '巢湖', start_year: -1600, end_year: -1600, dynasty_id: 1, place_type: 'cultural', geom: pt(117.87, 31.62), detail_level: 2, external_refs: {} },
  { id: 69, name: '有仍', modern_name: '济宁任城', start_year: -1948, end_year: -1948, dynasty_id: 1, place_type: 'cultural', geom: pt(116.59, 35.41), detail_level: 2, external_refs: {} },
  { id: 70, name: '有虞', modern_name: '虞城', start_year: -1948, end_year: -1940, dynasty_id: 1, place_type: 'cultural', geom: pt(115.87, 34.4), detail_level: 2, external_refs: {} },
  // ---- 商朝地点 ----
  { id: 71, name: '亳', modern_name: '商丘', start_year: -1600, end_year: -1300, dynasty_id: 2, place_type: 'capital', geom: pt(115.65, 34.42), detail_level: 1, external_refs: {} },
  { id: 72, name: '牧野', modern_name: '新乡', start_year: -1046, end_year: -1046, dynasty_id: 2, place_type: 'battlefield', geom: pt(113.9, 35.3), detail_level: 1, external_refs: {} },
  { id: 73, name: '鹿台', modern_name: '淇县', start_year: -1100, end_year: -1046, dynasty_id: 2, place_type: 'cultural', geom: pt(114.2, 35.6), detail_level: 2, external_refs: {} },
  // ---- 西周地点 ----
  { id: 74, name: '丰京', modern_name: '西安', start_year: -1100, end_year: -1046, dynasty_id: 3, place_type: 'capital', geom: pt(108.77, 34.2), detail_level: 2, external_refs: {} },
  { id: 75, name: '镐池', modern_name: '西安', start_year: -1046, end_year: -771, dynasty_id: 3, place_type: 'capital', geom: pt(108.85, 34.25), detail_level: 2, external_refs: {} },
  { id: 76, name: '犬丘', modern_name: '兴平', start_year: -771, end_year: -771, dynasty_id: 3, place_type: 'battlefield', geom: pt(108.49, 34.3), detail_level: 2, external_refs: {} },
  // ---- 东周列国都城 ----
  { id: 77, name: '临淄', modern_name: '淄博', start_year: -859, end_year: -221, dynasty_id: 4, place_type: 'capital', geom: pt(118.31, 36.83), detail_level: 1, external_refs: {} },
  { id: 78, name: '郢', modern_name: '荆州', start_year: -689, end_year: -278, dynasty_id: 4, place_type: 'capital', geom: pt(112.24, 30.33), detail_level: 1, external_refs: {} },
  { id: 79, name: '邯郸', modern_name: '邯郸', start_year: -386, end_year: -228, dynasty_id: 4, place_type: 'capital', geom: pt(114.54, 36.63), detail_level: 1, external_refs: {} },
  { id: 80, name: '大梁', modern_name: '开封', start_year: -364, end_year: -225, dynasty_id: 4, place_type: 'capital', geom: pt(114.35, 34.8), detail_level: 1, external_refs: {} },
  { id: 81, name: '寿春', modern_name: '寿县', start_year: -241, end_year: -223, dynasty_id: 4, place_type: 'capital', geom: pt(116.78, 32.57), detail_level: 1, external_refs: {} },
  // ---- 秦汉地点 ----
  { id: 82, name: '陈城', modern_name: '淮阳', start_year: -209, end_year: -208, dynasty_id: 5, place_type: 'rebellion', geom: pt(114.88, 33.73), detail_level: 1, external_refs: {} },
  { id: 83, name: '芒砀山', modern_name: '永城', start_year: -209, end_year: -209, dynasty_id: 5, place_type: 'rebellion', geom: pt(116.35, 34.03), detail_level: 1, external_refs: {} },
  { id: 84, name: '未央宫', modern_name: '西安', start_year: -200, end_year: 8, dynasty_id: 6, place_type: 'capital', geom: pt(108.87, 34.28), detail_level: 1, external_refs: {} },
  { id: 85, name: '阳关', modern_name: '敦煌', start_year: -121, end_year: 907, dynasty_id: 6, place_type: 'pass', geom: pt(94.15, 40.1), detail_level: 1, external_refs: {} },
  // ---- 三国两晋南北朝地点 ----
  { id: 86, name: '襄阳', modern_name: '襄阳', start_year: 190, end_year: 589, dynasty_id: 8, place_type: 'capital', geom: pt(112.14, 32.04), detail_level: 1, external_refs: {} },
  { id: 87, name: '合肥', modern_name: '合肥', start_year: 200, end_year: 589, dynasty_id: 8, place_type: 'capital', geom: pt(117.27, 31.86), detail_level: 1, external_refs: {} },
  // ---- 隋唐五代地点 ----
  { id: 88, name: '扬州', modern_name: '扬州', start_year: 581, end_year: 907, dynasty_id: 13, place_type: 'trade', geom: pt(119.42, 32.39), detail_level: 1, external_refs: {} },
  { id: 89, name: '渤海国', modern_name: '宁安', start_year: 698, end_year: 926, dynasty_id: 13, place_type: 'capital', geom: pt(129.5, 42.9), detail_level: 2, external_refs: {} },
  { id: 90, name: '大理', modern_name: '大理', start_year: 738, end_year: 960, dynasty_id: 13, place_type: 'capital', geom: pt(100.23, 25.59), detail_level: 2, external_refs: {} },
  { id: 91, name: '汴州', modern_name: '开封', start_year: 907, end_year: 960, dynasty_id: 14, place_type: 'capital', geom: pt(114.35, 34.8), detail_level: 1, external_refs: {} },
  // ---- 宋金地点 ----
  { id: 92, name: '中都', modern_name: '北京', start_year: 1153, end_year: 1215, dynasty_id: 15, place_type: 'capital', geom: pt(116.4, 39.9), detail_level: 1, external_refs: {} },
  { id: 93, name: '鄂州', modern_name: '武汉', start_year: 1127, end_year: 1279, dynasty_id: 16, place_type: 'capital', geom: pt(114.3, 30.6), detail_level: 2, external_refs: {} },
  { id: 94, name: '上京', modern_name: '阿城', start_year: 1115, end_year: 1153, dynasty_id: 15, place_type: 'capital', geom: pt(126.97, 45.5), detail_level: 2, external_refs: {} },
  // ---- 元朝地点 ----
  { id: 95, name: '上都', modern_name: '正蓝旗', start_year: 1256, end_year: 1368, dynasty_id: 17, place_type: 'capital', geom: pt(116.1, 42.7), detail_level: 1, external_refs: {} },
  { id: 96, name: '和林', modern_name: '哈尔和林', start_year: 1220, end_year: 1260, dynasty_id: 17, place_type: 'capital', geom: pt(104.05, 47.2), detail_level: 1, external_refs: {} },
  // ---- 明朝地点 ----
  { id: 97, name: '顺天府', modern_name: '北京', start_year: 1420, end_year: 1644, dynasty_id: 18, place_type: 'capital', geom: pt(116.4, 39.9), detail_level: 1, external_refs: {} },
  { id: 98, name: '承天府', modern_name: '钟祥', start_year: 1531, end_year: 1644, dynasty_id: 18, place_type: 'capital', geom: pt(112.58, 30.95), detail_level: 2, external_refs: {} },
  { id: 99, name: '嘉峪关', modern_name: '嘉峪关', start_year: 1372, end_year: 1644, dynasty_id: 18, place_type: 'pass', geom: pt(98.29, 39.77), detail_level: 1, external_refs: {} },
  // ---- 清朝地点 ----
  { id: 100, name: '京师', modern_name: '北京', start_year: 1644, end_year: 1912, dynasty_id: 19, place_type: 'capital', geom: pt(116.4, 39.9), detail_level: 1, external_refs: {} },
  { id: 101, name: '圆明园', modern_name: '北京', start_year: 1707, end_year: 1860, dynasty_id: 19, place_type: 'cultural', geom: pt(116.28, 40.01), detail_level: 1, external_refs: {} },
  { id: 102, name: '避暑山庄', modern_name: '承德', start_year: 1703, end_year: 1912, dynasty_id: 19, place_type: 'cultural', geom: pt(117.93, 40.97), detail_level: 2, external_refs: {} },
  { id: 103, name: '马关', modern_name: '下关', start_year: 1895, end_year: 1895, dynasty_id: 19, place_type: 'diplomatic', geom: pt(130.97, 33.95), detail_level: 2, external_refs: {} },
  // ---- 丝绸之路沿线 (Silk Road) ----
  { id: 104, name: '楼兰', modern_name: '若羌', start_year: -176, end_year: 630, dynasty_id: 6, place_type: 'trade', geom: pt(89.55, 40.5), detail_level: 1, external_refs: {} },
  { id: 105, name: '高昌', modern_name: '吐鲁番', start_year: -60, end_year: 640, dynasty_id: 6, place_type: 'trade', geom: pt(89.18, 42.95), detail_level: 1, external_refs: {} },
  { id: 106, name: '龟兹', modern_name: '库车', start_year: -60, end_year: 907, dynasty_id: 6, place_type: 'religious', geom: pt(82.96, 41.72), detail_level: 1, external_refs: {} },
  { id: 107, name: '于阗', modern_name: '和田', start_year: -60, end_year: 1006, dynasty_id: 6, place_type: 'trade', geom: pt(79.93, 37.11), detail_level: 1, external_refs: {} },
  { id: 108, name: '撒马尔罕', modern_name: '撒马尔罕', start_year: -329, end_year: 1368, dynasty_id: 6, place_type: 'trade', geom: pt(66.96, 39.65), detail_level: 2, external_refs: {} },
  { id: 109, name: '且末', modern_name: '且末', start_year: -60, end_year: 640, dynasty_id: 6, place_type: 'trade', geom: pt(85.53, 38.15), detail_level: 2, external_refs: {} },
  { id: 110, name: '莎车', modern_name: '莎车', start_year: -60, end_year: 907, dynasty_id: 6, place_type: 'trade', geom: pt(77.24, 38.42), detail_level: 2, external_refs: {} },
  // ---- 大运河沿线 (Grand Canal) ----
  { id: 111, name: '通州', modern_name: '北京通州', start_year: 605, end_year: 1912, dynasty_id: 12, place_type: 'trade', geom: pt(116.66, 39.9), detail_level: 2, external_refs: {} },
  { id: 112, name: '临清', modern_name: '临清', start_year: 605, end_year: 1912, dynasty_id: 12, place_type: 'trade', geom: pt(115.7, 36.83), detail_level: 2, external_refs: {} },
  { id: 113, name: '济宁', modern_name: '济宁', start_year: 605, end_year: 1912, dynasty_id: 12, place_type: 'trade', geom: pt(116.59, 35.41), detail_level: 2, external_refs: {} },
  { id: 114, name: '淮安', modern_name: '淮安', start_year: 605, end_year: 1912, dynasty_id: 12, place_type: 'trade', geom: pt(119.02, 33.6), detail_level: 2, external_refs: {} },
  { id: 115, name: '镇江', modern_name: '镇江', start_year: 605, end_year: 1912, dynasty_id: 12, place_type: 'trade', geom: pt(119.45, 32.19), detail_level: 2, external_refs: {} },
  { id: 116, name: '苏州', modern_name: '苏州', start_year: -514, end_year: 1912, dynasty_id: 12, place_type: 'trade', geom: pt(120.62, 31.3), detail_level: 1, external_refs: {} },
  { id: 117, name: '常州', modern_name: '常州', start_year: 605, end_year: 1912, dynasty_id: 12, place_type: 'trade', geom: pt(119.97, 31.81), detail_level: 2, external_refs: {} },
  { id: 118, name: '无锡', modern_name: '无锡', start_year: 605, end_year: 1912, dynasty_id: 12, place_type: 'trade', geom: pt(120.31, 31.57), detail_level: 2, external_refs: {} },
  // ---- 边疆关隘 (Border Fortresses) ----
  { id: 119, name: '居庸关', modern_name: '北京昌平', start_year: -300, end_year: 1644, dynasty_id: 18, place_type: 'pass', geom: pt(116.07, 40.29), detail_level: 1, external_refs: {} },
  { id: 120, name: '紫荆关', modern_name: '易县', start_year: -300, end_year: 1644, dynasty_id: 18, place_type: 'pass', geom: pt(115.17, 39.43), detail_level: 2, external_refs: {} },
  { id: 121, name: '娘子关', modern_name: '平定', start_year: -200, end_year: 1644, dynasty_id: 18, place_type: 'pass', geom: pt(113.98, 37.97), detail_level: 2, external_refs: {} },
  { id: 122, name: '镇南关', modern_name: '凭祥', start_year: 1368, end_year: 1912, dynasty_id: 18, place_type: 'pass', geom: pt(106.72, 21.99), detail_level: 2, external_refs: {} },
  { id: 123, name: '偏关', modern_name: '偏关', start_year: 1368, end_year: 1644, dynasty_id: 18, place_type: 'pass', geom: pt(111.51, 39.44), detail_level: 2, external_refs: {} },
  { id: 124, name: '平型关', modern_name: '繁峙', start_year: 1368, end_year: 1644, dynasty_id: 18, place_type: 'pass', geom: pt(113.96, 39.35), detail_level: 2, external_refs: {} },
  // ---- 宗教文化 (Religious & Cultural) ----
  { id: 125, name: '莫高窟', modern_name: '敦煌', start_year: 366, end_year: 1368, dynasty_id: 11, place_type: 'religious', geom: pt(94.81, 40.04), detail_level: 1, external_refs: {} },
  { id: 126, name: '大足石刻', modern_name: '大足', start_year: 650, end_year: 1240, dynasty_id: 13, place_type: 'religious', geom: pt(105.72, 29.71), detail_level: 2, external_refs: {} },
  { id: 127, name: '武当山', modern_name: '丹江口', start_year: 1368, end_year: 1644, dynasty_id: 18, place_type: 'religious', geom: pt(111.0, 32.4), detail_level: 2, external_refs: {} },
];

// ===== 事件数据 =====
export const MOCK_EVENTS: HistoricalEvent[] = [
  // ---- 夏 ----
  {
    id: 84, name: '大禹治水', name_en: 'Yu Tames the Flood',
    start_year: -2100, end_year: -2070,
    event_type: 'political', importance: 1, detail_level: 2,
    summary: '禹继承父业治理洪水，居外十三年过家门不敢入，治水过程中建立权威，划定九州。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[0], places: [MOCK_PLACES[59]], persons: [{ id: 66, name: '禹', role: '治水领袖' }],
    external_refs: {},
  },
  {
    id: 85, name: '涂山之会', name_en: 'Assembly at Tushan',
    start_year: -2070, end_year: -2070,
    event_type: 'political', importance: 2, detail_level: 2,
    summary: '禹大会诸侯于涂山，执玉帛者万国，标志夏朝建立。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[0], places: [MOCK_PLACES[64]], persons: [{ id: 66, name: '禹', role: '盟主' }],
    external_refs: {},
  },
  {
    id: 86, name: '启征有扈', name_en: 'Qi Conquers Youhu',
    start_year: -2057, end_year: -2057,
    event_type: 'war', importance: 2, detail_level: 2,
    summary: '启即位后击败有扈氏反抗，巩固世袭制，作《甘誓》。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[0], places: [], persons: [{ id: 67, name: '启', role: '统帅' }],
    external_refs: {},
  },
  {
    id: 87, name: '太康失国', name_en: 'Taikang Loses the Throne',
    start_year: -2018, end_year: -2018,
    event_type: 'collapse', importance: 2, detail_level: 2,
    summary: '太康荒淫失政，有穷氏后羿乘机夺取政权，夏朝中断数十年。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[0], places: [], persons: [{ id: 68, name: '太康', role: '失国君主' }, { id: 71, name: '后羿', role: '夺权者' }],
    external_refs: {},
  },
  {
    id: 88, name: '少康中兴', name_en: 'Shaokang Restoration',
    start_year: -1948, end_year: -1915,
    event_type: 'political', importance: 1, detail_level: 2,
    summary: '少康以弱胜强攻灭寒浞，恢复夏朝统治，中国历史上第一次中兴。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[0], places: [], persons: [{ id: 69, name: '少康', role: '中兴之主' }],
    external_refs: {},
  },
  {
    id: 73, name: '涿鹿之战', name_en: 'Battle of Zhuolu',
    start_year: -2600, end_year: -2600,
    event_type: 'war', importance: 2, detail_level: 2,
    summary: '黄帝与蚩尤在涿鹿大战，黄帝取胜，奠定华夏族基础。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[0], places: [MOCK_PLACES[26]], persons: [],
    external_refs: {},
  },
  {
    id: 16, name: '商汤灭夏建商', name_en: 'King Tang Founds the Shang Dynasty',
    start_year: -1600, end_year: -1600,
    event_type: 'founding', importance: 1, detail_level: 2,
    summary: '商汤率军与夏桀战于鸣条，夏军大败。桀被流放南巢，夏朝灭亡，商朝建立。商汤以仁德服人，任用伊尹为相，开创商朝五百年基业。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[1], places: [MOCK_PLACES[69], MOCK_PLACES[65]], persons: [{ id: 11, name: '商汤王', role: '开国君主' }, { id: 78, name: '伊尹', role: '宰相' }],
    external_refs: {},
  },
  // ---- 商 ----
  {
    id: 89, name: '伊尹辅政', name_en: 'Yi Yin Ministers the Shang',
    start_year: -1600, end_year: -1550,
    event_type: 'political', importance: 2, detail_level: 2,
    summary: '伊尹辅佐商汤灭夏建商，后又辅佐五代商王。太甲无道，伊尹将其放逐桐宫令其悔过，三年后还政，开创臣子训导君王之先例。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[1], places: [MOCK_PLACES[69]], persons: [{ id: 78, name: '伊尹', role: '宰相' }],
    external_refs: {},
  },
  {
    id: 17, name: '盘庚迁殷', name_en: 'Pan Geng Moves Capital to Yin',
    start_year: -1300, end_year: -1300,
    event_type: 'political', importance: 2, detail_level: 2,
    summary: '商王盘庚将国都迁至殷（今安阳），商朝由此复兴，故又称殷商。迁都后社会稳定，经济文化繁荣，甲骨文即始于殷墟时期。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[1], places: [MOCK_PLACES[10]], persons: [{ id: 73, name: '盘庚', role: '决策者' }],
    external_refs: {},
  },
  {
    id: 74, name: '武丁中兴', name_en: 'Wuding Revival',
    start_year: -1250, end_year: -1192,
    event_type: 'political', importance: 1, detail_level: 2,
    summary: '商王武丁在位期间，任用傅说为相，妇好为将，征伐四方，商朝达到鼎盛。甲骨文大量记载其卜辞与征伐事迹，青铜器制造亦达高峰。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[1], places: [MOCK_PLACES[10]], persons: [{ id: 74, name: '武丁', role: '中兴之主' }, { id: 77, name: '傅说', role: '宰相' }, { id: 75, name: '妇好', role: '将军' }],
    external_refs: {},
  },
  {
    id: 90, name: '妇好征伐', name_en: "Fu Hao's Military Campaigns",
    start_year: -1250, end_year: -1200,
    event_type: 'war', importance: 2, detail_level: 2,
    summary: '商王武丁之妻妇好多次率军出征，先后征伐土方、羌方、巴方、夷方等部族，战功赫赫，是中国历史上有据可查的第一位女将军。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[1], places: [MOCK_PLACES[10]], persons: [{ id: 75, name: '妇好', role: '统帅' }, { id: 74, name: '武丁', role: '商王' }],
    external_refs: {},
  },
  {
    id: 91, name: '牧野之战·商亡', name_en: 'Battle of Muye - Fall of Shang',
    start_year: -1046, end_year: -1046,
    event_type: 'war', importance: 1, detail_level: 2,
    summary: '周武王率诸侯联军在牧野击败商军，商纣王自焚于鹿台，商朝灭亡。商军阵前倒戈，纣王众叛亲离，六百年商朝终结。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[1], places: [MOCK_PLACES[70], MOCK_PLACES[71]], persons: [{ id: 76, name: '商纣王', role: '末代君主' }],
    external_refs: {},
  },
  // ---- 西周 ----
  {
    id: 1, name: '牧野之战', name_en: 'Battle of Muye',
    start_year: -1046, end_year: -1046, start_month: 2, start_day: 28,
    event_type: 'war', importance: 1, detail_level: 2,
    summary: '周武王率诸侯联军在牧野击败商纣王，商朝灭亡，西周建立。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[2], places: [MOCK_PLACES[10]], persons: [{ id: 13, name: '周武王', role: '统帅' }],
    external_refs: {},
  },
  {
    id: 75, name: '共和行政', name_en: 'Gonghe Regency',
    start_year: -841, end_year: -828,
    event_type: 'political', importance: 2, detail_level: 2,
    summary: '国人暴动驱逐周厉王，由周公、召公共同执政，史称共和行政。中国历史自此有确切纪年。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[2], places: [MOCK_PLACES[0]], persons: [],
    external_refs: {},
  },
  {
    id: 18, name: '国人暴动', name_en: 'Rebellion of the Guoren',
    start_year: -841, end_year: -841,
    event_type: 'rebellion', importance: 2, detail_level: 2,
    summary: '周厉王暴虐无道，国都镐京平民起义，驱逐厉王，开中国民众起义之先河。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[2], places: [MOCK_PLACES[0]], persons: [],
    external_refs: {},
  },
  {
    id: 19, name: '犬戎灭西周', name_en: 'Quanrong Sack of Haojing',
    start_year: -771, end_year: -771,
    event_type: 'collapse', importance: 1, detail_level: 2,
    summary: '犬戎攻破镐京，杀周幽王，西周灭亡。平王东迁洛邑，东周开始。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[2], places: [MOCK_PLACES[0]], persons: [{ id: 81, name: '周幽王', role: '末代君主' }],
    external_refs: {},
  },
  {
    id: 92, name: '文王演周易', name_en: 'King Wen Composes the I Ching',
    start_year: -1100, end_year: -1050,
    event_type: 'cultural', importance: 2, detail_level: 2,
    summary: '周文王被商纣王囚禁于羑里，在狱中推演八卦为六十四卦，作卦辞爻辞，奠定《周易》基础，为中华哲学源头之一。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[2], places: [MOCK_PLACES[72]], persons: [{ id: 12, name: '周文王', role: '作者' }],
    external_refs: {},
  },
  {
    id: 93, name: '周公制礼作乐', name_en: 'Duke of Zhou Establishes Rites and Music',
    start_year: -1040, end_year: -1030,
    event_type: 'cultural', importance: 1, detail_level: 2,
    summary: '周公旦在平定三监之乱后，制定礼乐制度，建立宗法分封体系，以礼治国，奠定周朝八百年制度根基，影响中华文明数千年。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[2], places: [MOCK_PLACES[0]], persons: [{ id: 79, name: '周公旦', role: '制度设计者' }],
    external_refs: {},
  },
  {
    id: 94, name: '封邦建国', name_en: 'Enfeoffment System Established',
    start_year: -1046, end_year: -1040,
    event_type: 'political', importance: 1, detail_level: 2,
    summary: '西周推行分封制，将宗室功臣分封各地建立诸侯国，以藩屏周。姜子牙封于齐，周公封于鲁，形成宗法分封的政治格局。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[2], places: [MOCK_PLACES[0]], persons: [{ id: 13, name: '周武王', role: '决策者' }, { id: 79, name: '周公旦', role: '执行者' }, { id: 80, name: '姜子牙', role: '受封者' }],
    external_refs: {},
  },
  {
    id: 95, name: '成康之治', name_en: 'Reign of Cheng and Kang',
    start_year: -1042, end_year: -996,
    event_type: 'political', importance: 2, detail_level: 2,
    summary: '周成王、周康王在位期间，周公辅政，天下安宁，刑错四十余年不用，史称成康之治，为西周鼎盛时期。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[2], places: [MOCK_PLACES[0]], persons: [{ id: 79, name: '周公旦', role: '辅政大臣' }],
    external_refs: {},
  },
  {
    id: 96, name: '烽火戏诸侯', name_en: 'Beacon Fires Fool the Lords',
    start_year: -771, end_year: -771,
    event_type: 'collapse', importance: 2, detail_level: 2,
    summary: '周幽王为博褒姒一笑，点燃烽火谎报军情，诸侯数次被骗后不再响应。犬戎入侵时无人来救，幽王被杀，西周灭亡。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[2], places: [MOCK_PLACES[74]], persons: [{ id: 81, name: '周幽王', role: '决策者' }],
    external_refs: {},
  },
  // ---- 东周 ----
  {
    id: 97, name: '平王东迁', name_en: 'King Ping Moves East',
    start_year: -770, end_year: -770,
    event_type: 'political', importance: 1, detail_level: 2,
    summary: '周平王因犬戎之乱东迁洛邑，东周开始，周天子权威衰落，诸侯争霸格局形成。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[3], places: [MOCK_PLACES[15]], persons: [],
    external_refs: {},
  },
  {
    id: 76, name: '管仲相齐', name_en: 'Guan Zhong Ministers Qi',
    start_year: -685, end_year: -645,
    event_type: 'political', importance: 2, detail_level: 2,
    summary: '齐桓公任用管仲为相，推行改革，齐国称霸，管仲成为千古名相典范。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[3], places: [], persons: [{ id: 23, name: '管仲', role: '宰相' }],
    external_refs: {},
  },
  {
    id: 22, name: '城濮之战', name_en: 'Battle of Chengpu',
    start_year: -632, end_year: -632,
    event_type: 'war', importance: 2, detail_level: 2,
    summary: '晋文公在城濮之战中以退避三舍之策击败楚军，确立霸主地位。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[3], places: [], persons: [],
    external_refs: {},
  },
  {
    id: 98, name: '弭兵之会', name_en: 'Mibing Peace Conference',
    start_year: -546, end_year: -546,
    event_type: 'diplomatic', importance: 2, detail_level: 2,
    summary: '宋国向戌发起弭兵之会，晋楚两国及十余诸侯国签订和平盟约，春秋争霸暂时缓和，中原获数十年和平。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[3], places: [], persons: [],
    external_refs: {},
  },
  {
    id: 23, name: '桂陵之战', name_en: 'Battle of Guiling',
    start_year: -354, end_year: -353,
    event_type: 'war', importance: 3, detail_level: 2,
    summary: '齐军用围魏救赵之计在桂陵击败魏军，孙膑以此战名扬天下。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[3], places: [], persons: [],
    external_refs: {},
  },
  {
    id: 20, name: '百家争鸣', name_en: 'Hundred Schools of Thought',
    start_year: -770, end_year: -221,
    event_type: 'cultural', importance: 1, detail_level: 2,
    summary: '春秋战国时期诸子百家竞相争鸣，儒、道、墨、法等学派纷呈，奠定中华思想文化根基。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[3], places: [], persons: [{ id: 36, name: '孔子', role: '儒家创始人' }, { id: 37, name: '老子', role: '道家创始人' }, { id: 38, name: '墨子', role: '墨家创始人' }],
    external_refs: {},
  },
  {
    id: 21, name: '孔子周游列国', name_en: "Confucius Travels Through the States",
    start_year: -497, end_year: -484,
    event_type: 'cultural', importance: 2, detail_level: 2,
    summary: '孔子率弟子周游列国十四年，推行仁政主张，虽未获重用，但其学说影响深远。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[3], places: [MOCK_PLACES[29]], persons: [{ id: 36, name: '孔子', role: '主角' }],
    external_refs: {},
  },
  {
    id: 24, name: '合纵连横', name_en: 'Vertical and Horizontal Alliances',
    start_year: -334, end_year: -221,
    event_type: 'diplomatic', importance: 2, detail_level: 2,
    summary: '苏秦合纵六国抗秦，张仪连横破纵事秦，纵横家左右战国格局。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[3], places: [], persons: [],
    external_refs: {},
  },
  {
    id: 2, name: '商鞅变法', name_en: 'Shang Yang Reforms',
    start_year: -356, end_year: -338,
    event_type: 'reform', importance: 1, detail_level: 2,
    summary: '秦孝公任用商鞅推行变法，废井田、开阡陌、行县制，秦国由此强盛。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[3], places: [MOCK_PLACES[1]], persons: [{ id: 8, name: '商鞅', role: '主导者' }],
    external_refs: {},
  },
  {
    id: 14, name: '长平之战', name_en: 'Battle of Changping',
    start_year: -260, end_year: -260,
    event_type: 'war', importance: 2, detail_level: 2,
    summary: '秦将白起坑杀赵军四十万，赵国元气大伤，六国再无力抗秦。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[3], places: [MOCK_PLACES[11]], persons: [{ id: 10, name: '白起', role: '秦军主将' }],
    external_refs: {},
  },
  {
    id: 99, name: '三家分晋', name_en: 'Partition of Jin',
    start_year: -453, end_year: -453,
    event_type: 'political', importance: 1, detail_level: 2,
    summary: '韩、赵、魏三家灭智氏，瓜分晋国领地，周天子正式承认三家为诸侯。春秋与战国的分界线，标志卿大夫专权取代诸侯争霸。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[3], places: [], persons: [],
    external_refs: {},
  },
  {
    id: 100, name: '秦灭六国', name_en: 'Qin Conquers the Six States',
    start_year: -230, end_year: -221,
    event_type: 'war', importance: 1, detail_level: 2,
    summary: '秦始皇十年间先后灭韩、赵、魏、楚、燕、齐六国，结束春秋战国五百余年分裂，建立大一统帝国。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[3], places: [], persons: [{ id: 1, name: '秦始皇', role: '统帅' }, { id: 10, name: '白起', role: '秦军将领' }],
    external_refs: {},
  },
  // ---- 秦 ----
  {
    id: 3, name: '秦统一六国', name_en: 'Qin Unification',
    start_year: -221, end_year: -221,
    event_type: 'founding', importance: 1, detail_level: 2,
    summary: '秦始皇统一六国，建立中国第一个中央集权制帝国，统一文字、度量衡。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[4], places: [MOCK_PLACES[1]], persons: [{ id: 1, name: '秦始皇', role: '皇帝' }],
    external_refs: {},
  },
  {
    id: 27, name: '焚书坑儒', name_en: 'Burning of Books and Burying of Scholars',
    start_year: -213, end_year: -212,
    event_type: 'cultural', importance: 2, detail_level: 2,
    summary: '秦始皇下令焚毁民间藏书，坑杀方士儒生，实行思想统一，对中国文化造成重大损失。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[4], places: [MOCK_PLACES[1]], persons: [{ id: 1, name: '秦始皇', role: '决策者' }],
    external_refs: {},
  },
  {
    id: 25, name: '陈胜吴广起义', name_en: 'Chen Sheng Wu Guang Rebellion',
    start_year: -209, end_year: -208,
    event_type: 'rebellion', importance: 1, detail_level: 2,
    summary: '陈胜、吴广在大泽乡揭竿而起，是中国历史上第一次大规模农民起义，动摇了秦朝根基。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[4], places: [MOCK_PLACES[40]], persons: [{ id: 53, name: '陈胜', role: '领袖' }, { id: 54, name: '吴广', role: '领袖' }],
    external_refs: {},
  },
  {
    id: 26, name: '巨鹿之战', name_en: 'Battle of Julu',
    start_year: -207, end_year: -207,
    event_type: 'war', importance: 1, detail_level: 2,
    summary: '项羽率楚军破釜沉舟，以少胜多击败秦军主力，秦朝名存实亡。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[4], places: [MOCK_PLACES[22]], persons: [],
    external_refs: {},
  },
  {
    id: 28, name: '楚汉之争', name_en: 'Chu-Han Contention',
    start_year: -206, end_year: -202,
    event_type: 'war', importance: 1, detail_level: 2,
    summary: '项羽与刘邦争夺天下，最终刘邦胜出，建立西汉。垓下之战项羽自刎乌江。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[4], places: [], persons: [{ id: 14, name: '汉高祖', role: '胜方' }, { id: 31, name: '韩信', role: '大将' }],
    external_refs: {},
  },
  // ---- 西汉 ----
  {
    id: 29, name: '文景之治', name_en: 'Rule of Wen and Jing',
    start_year: -180, end_year: -141,
    event_type: 'political', importance: 1, detail_level: 2,
    summary: '汉文帝、汉景帝推行休养生息政策，轻徭薄赋，社会经济繁荣，为汉武盛世奠定基础。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[5], places: [MOCK_PLACES[2]], persons: [],
    external_refs: {},
  },
  {
    id: 30, name: '罢黜百家独尊儒术', name_en: 'Exclusive Promotion of Confucianism',
    start_year: -134, end_year: -134,
    event_type: 'cultural', importance: 1, detail_level: 2,
    summary: '汉武帝采纳董仲舒建议，罢黜百家、独尊儒术，儒学成为官方意识形态，影响中国两千年。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[5], places: [MOCK_PLACES[2]], persons: [{ id: 2, name: '汉武帝', role: '决策者' }, { id: 40, name: '董仲舒', role: '建议者' }],
    external_refs: {},
  },
  {
    id: 4, name: '张骞出使西域', name_en: "Zhang Qian's Mission",
    start_year: -138, end_year: -126,
    event_type: 'diplomatic', importance: 1, detail_level: 2,
    summary: '张骞奉汉武帝之命出使西域，开辟丝绸之路，沟通东西方文明。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[5], places: [MOCK_PLACES[2], MOCK_PLACES[12]], persons: [{ id: 4, name: '张骞', role: '使臣' }, { id: 2, name: '汉武帝', role: '决策者' }],
    external_refs: {},
  },
  {
    id: 31, name: '汉武帝北击匈奴', name_en: "Emperor Wu's Campaigns against Xiongnu",
    start_year: -129, end_year: -119,
    event_type: 'war', importance: 1, detail_level: 2,
    summary: '汉武帝派卫青、霍去病多次北击匈奴，收复河套，封狼居胥，解除匈奴威胁。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[5], places: [], persons: [{ id: 32, name: '卫青', role: '大将' }, { id: 33, name: '霍去病', role: '大将' }],
    external_refs: {},
  },
  {
    id: 77, name: '白登之围', name_en: 'Siege of Baideng',
    start_year: -200, end_year: -200,
    event_type: 'war', importance: 2, detail_level: 2,
    summary: '汉高祖刘邦被匈奴冒顿单于围困于白登山，以和亲换取脱困，此后汉匈和亲数十年。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[5], places: [], persons: [{ id: 14, name: '汉高祖', role: '被围者' }],
    external_refs: {},
  },
  {
    id: 78, name: '七国之乱', name_en: 'Rebellion of the Seven States',
    start_year: -154, end_year: -154,
    event_type: 'rebellion', importance: 2, detail_level: 2,
    summary: '吴王刘濞等七国以"清君侧"为名叛乱，周亚夫三月平定，中央集权大大加强。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[5], places: [], persons: [],
    external_refs: {},
  },
  {
    id: 32, name: '昭君出塞', name_en: "Wang Zhaojun's Journey to the Frontier",
    start_year: -33, end_year: -33,
    event_type: 'diplomatic', importance: 2, detail_level: 2,
    summary: '王昭君自愿出塞和亲，嫁给匈奴呼韩邪单于，汉匈和平数十年。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[5], places: [], persons: [],
    external_refs: {},
  },
  {
    id: 33, name: '王莽篡汉', name_en: 'Wang Mang Usurpation',
    start_year: 8, end_year: 8,
    event_type: 'collapse', importance: 2, detail_level: 2,
    summary: '外戚王莽篡汉建立新朝，推行复古改制，天下大乱，绿林赤眉起义此起彼伏。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[5], places: [MOCK_PLACES[2]], persons: [{ id: 93, name: '王莽', role: '篡位者' }],
    external_refs: {},
  },
  {
    id: 101, name: '丝绸之路开通', name_en: 'Opening of the Silk Road',
    start_year: -119, end_year: -119,
    event_type: 'economic', importance: 1, detail_level: 2,
    summary: '汉武帝击败匈奴后，张骞再次出使西域，丝绸之路正式开通，东西方贸易与文化交流由此繁荣。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[5], places: [MOCK_PLACES[12]], persons: [{ id: 4, name: '张骞', role: '开拓者' }, { id: 2, name: '汉武帝', role: '决策者' }],
    external_refs: {},
  },
  // ---- 东汉 ----
  {
    id: 102, name: '光武中兴', name_en: 'Guangwu Restoration',
    start_year: 25, end_year: 57,
    event_type: 'political', importance: 2, detail_level: 2,
    summary: '刘秀建立东汉，统一全国，推行柔道治国，释放奴婢、减轻赋税，社会恢复安定繁荣，史称光武中兴。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[6], places: [MOCK_PLACES[3]], persons: [{ id: 15, name: '汉光武帝', role: '皇帝' }],
    external_refs: {},
  },
  {
    id: 34, name: '黄巾起义', name_en: 'Yellow Turban Rebellion',
    start_year: 184, end_year: 205,
    event_type: 'rebellion', importance: 1, detail_level: 2,
    summary: '张角以"苍天已死，黄天当立"为号发动起义，动摇东汉根基，开启群雄割据时代。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[6], places: [], persons: [],
    external_refs: {},
  },
  {
    id: 35, name: '佛教传入中国', name_en: 'Introduction of Buddhism to China',
    start_year: 67, end_year: 67,
    event_type: 'cultural', importance: 1, detail_level: 2,
    summary: '东汉明帝时佛教正式传入中国，白马寺建于洛阳，佛教开始在中国传播发展。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[6], places: [MOCK_PLACES[3]], persons: [],
    external_refs: {},
  },
  {
    id: 36, name: '班超通西域', name_en: "Ban Chao's Mission to the Western Regions",
    start_year: 73, end_year: 102,
    event_type: 'diplomatic', importance: 2, detail_level: 2,
    summary: '班超率三十六人出使西域，纵横捭阖三十年，恢复汉朝对西域的控制，重新打通丝绸之路。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[6], places: [MOCK_PLACES[12]], persons: [],
    external_refs: {},
  },
  {
    id: 37, name: '党锢之祸', name_en: 'Disasters of Partisan Prohibitions',
    start_year: 166, end_year: 184,
    event_type: 'political', importance: 2, detail_level: 2,
    summary: '宦官集团迫害士大夫，两次党锢之祸使东汉政治更加黑暗，加速王朝衰亡。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[6], places: [MOCK_PLACES[3]], persons: [],
    external_refs: {},
  },
  {
    id: 80, name: '张衡发明地动仪', name_en: "Zhang Heng's Seismoscope",
    start_year: 132, end_year: 132,
    event_type: 'cultural', importance: 2, detail_level: 2,
    summary: '张衡发明候风地动仪，是世界上最早的地震监测仪器，早于欧洲一千七百余年。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[6], places: [MOCK_PLACES[3]], persons: [{ id: 48, name: '张衡', role: '发明者' }],
    external_refs: {},
  },
  {
    id: 5, name: '赤壁之战', name_en: 'Battle of Red Cliffs',
    start_year: 208, end_year: 208, start_month: 12,
    event_type: 'war', importance: 1, detail_level: 2,
    summary: '孙刘联军在赤壁以火攻大败曹操，奠定三国鼎立格局。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[7], places: [MOCK_PLACES[10]], persons: [{ id: 5, name: '诸葛亮', role: '军师' }],
    external_refs: {},
  },
  // ---- 三国 ----
  {
    id: 38, name: '官渡之战', name_en: 'Battle of Guandu',
    start_year: 200, end_year: 200,
    event_type: 'war', importance: 1, detail_level: 2,
    summary: '曹操以少胜多击败袁绍，统一北方，成为三国格局形成的关键战役。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[7], places: [MOCK_PLACES[23]], persons: [{ id: 63, name: '曹操', role: '胜方统帅' }],
    external_refs: {},
  },
  {
    id: 39, name: '夷陵之战', name_en: 'Battle of Yiling',
    start_year: 222, end_year: 222,
    event_type: 'war', importance: 2, detail_level: 2,
    summary: '刘备为报关羽之仇伐吴，陆逊以火攻大败蜀军，三国疆域基本定型。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[7], places: [MOCK_PLACES[24]], persons: [{ id: 61, name: '刘备', role: '蜀方统帅' }],
    external_refs: {},
  },
  {
    id: 40, name: '诸葛亮北伐', name_en: "Zhuge Liang's Northern Expeditions",
    start_year: 227, end_year: 234,
    event_type: 'war', importance: 2, detail_level: 2,
    summary: '诸葛亮六出祁山北伐曹魏，虽未成功，但鞠躬尽瘁死而后已的精神流传千古。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[7], places: [MOCK_PLACES[17]], persons: [{ id: 5, name: '诸葛亮', role: '统帅' }],
    external_refs: {},
  },
  {
    id: 103, name: '三国鼎立', name_en: 'Tripartite Confrontation',
    start_year: 220, end_year: 280,
    event_type: 'political', importance: 1, detail_level: 2,
    summary: '曹丕篡汉建魏，刘备称帝建蜀汉，孙权称帝建东吴，三国鼎立格局正式形成，天下三分长达六十年。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[7], places: [MOCK_PLACES[17], MOCK_PLACES[18], MOCK_PLACES[19]], persons: [{ id: 63, name: '曹操', role: '魏国奠基者' }, { id: 61, name: '刘备', role: '蜀汉建立者' }, { id: 62, name: '孙权', role: '东吴建立者' }],
    external_refs: {},
  },
  // ---- 西晋 ----
  {
    id: 41, name: '司马炎建晋', name_en: 'Sima Yan Founds Jin Dynasty',
    start_year: 265, end_year: 265,
    event_type: 'founding', importance: 2, detail_level: 2,
    summary: '司马炎篡魏建立西晋，280年灭吴统一全国，但统一仅维持三十余年。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[8], places: [MOCK_PLACES[3]], persons: [{ id: 64, name: '司马炎', role: '皇帝' }],
    external_refs: {},
  },
  {
    id: 104, name: '西晋统一', name_en: 'Western Jin Unification',
    start_year: 280, end_year: 280,
    event_type: 'political', importance: 2, detail_level: 2,
    summary: '西晋灭东吴，结束自黄巾起义以来近百年的分裂局面，天下重归一统。但统一仅维持三十余年即因八王之乱而崩溃。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[8], places: [MOCK_PLACES[19]], persons: [{ id: 64, name: '司马炎', role: '皇帝' }],
    external_refs: {},
  },
  {
    id: 42, name: '八王之乱', name_en: 'Rebellion of the Eight Princes',
    start_year: 291, end_year: 306,
    event_type: 'rebellion', importance: 2, detail_level: 2,
    summary: '西晋八位藩王争夺中央权力，战乱持续十六年，严重削弱国力，导致五胡乱华。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[8], places: [MOCK_PLACES[3]], persons: [],
    external_refs: {},
  },
  {
    id: 43, name: '五胡乱华', name_en: 'Wu Hu Uprising',
    start_year: 304, end_year: 439,
    event_type: 'collapse', importance: 1, detail_level: 2,
    summary: '匈奴、鲜卑、羯、氐、羌五族纷纷建立政权，西晋灭亡，北方陷入长期战乱，汉族大规模南迁。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[8], places: [], persons: [],
    external_refs: {},
  },
  // ---- 东晋 ----
  {
    id: 6, name: '淝水之战', name_en: 'Battle of Fei River',
    start_year: 383, end_year: 383, start_month: 11,
    event_type: 'war', importance: 1, detail_level: 2,
    summary: '东晋以少胜多击败前秦，保全江南，南北对峙格局延续。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[9], places: [MOCK_PLACES[51]], persons: [{ id: 96, name: '谢安', role: '总指挥' }],
    external_refs: {},
  },
  {
    id: 44, name: '王羲之写兰亭序', name_en: 'Wang Xizhi Writes Lantingji Xu',
    start_year: 353, end_year: 353,
    event_type: 'cultural', importance: 2, detail_level: 2,
    summary: '王羲之在兰亭修禊时写下《兰亭集序》，被誉为天下第一行书，书法艺术达到巅峰。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[9], places: [MOCK_PLACES[44]], persons: [{ id: 46, name: '王羲之', role: '作者' }],
    external_refs: {},
  },
  // ---- 南北朝 ----
  {
    id: 45, name: '孝文帝改革', name_en: "Emperor Xiaowen's Reforms",
    start_year: 471, end_year: 499,
    event_type: 'reform', importance: 1, detail_level: 2,
    summary: '北魏孝文帝推行汉化改革，迁都洛阳、改汉姓、穿汉服、说汉语，促进民族大融合。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[10], places: [MOCK_PLACES[3]], persons: [{ id: 58, name: '孝文帝', role: '皇帝' }],
    external_refs: {},
  },
  {
    id: 46, name: '云冈石窟开凿', name_en: 'Construction of Yungang Grottoes',
    start_year: 460, end_year: 524,
    event_type: 'cultural', importance: 2, detail_level: 2,
    summary: '北魏在平城开凿云冈石窟，融合中西方艺术风格，是中国佛教艺术的巅峰之作。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[10], places: [MOCK_PLACES[33]], persons: [],
    external_refs: {},
  },
  {
    id: 47, name: '龙门石窟开凿', name_en: 'Construction of Longmen Grottoes',
    start_year: 493, end_year: 907,
    event_type: 'cultural', importance: 2, detail_level: 2,
    summary: '北魏孝文帝迁都洛阳后开始开凿龙门石窟，历经多朝营造，成为中国石刻艺术宝库。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[10], places: [MOCK_PLACES[32]], persons: [],
    external_refs: {},
  },
  {
    id: 79, name: '祖冲之算圆周率', name_en: 'Zu Chongzhi Calculates Pi',
    start_year: 480, end_year: 480,
    event_type: 'cultural', importance: 2, detail_level: 2,
    summary: '祖冲之将圆周率精确到小数点后第七位，领先世界近千年，是中国数学史上的里程碑。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[10], places: [], persons: [{ id: 49, name: '祖冲之', role: '数学家' }],
    external_refs: {},
  },
  {
    id: 105, name: '侯景之乱', name_en: 'Hou Jing Rebellion',
    start_year: 548, end_year: 552,
    event_type: 'rebellion', importance: 2, detail_level: 2,
    summary: '北朝降将侯景叛乱攻破建康，梁武帝饿死台城，江南经济文化遭受毁灭性打击，南朝由盛转衰。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[10], places: [MOCK_PLACES[4]], persons: [],
    external_refs: {},
  },
  // ---- 隋 ----
  {
    id: 7, name: '隋朝统一', name_en: 'Sui Unification',
    start_year: 589, end_year: 589,
    event_type: 'founding', importance: 1, detail_level: 2,
    summary: '隋文帝灭陈，结束近三百年的南北分裂，重新统一中国。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[11], places: [MOCK_PLACES[4]], persons: [{ id: 16, name: '隋文帝', role: '皇帝' }],
    external_refs: {},
  },
  {
    id: 48, name: '开凿大运河', name_en: 'Construction of the Grand Canal',
    start_year: 605, end_year: 610,
    event_type: 'economic', importance: 1, detail_level: 2,
    summary: '隋炀帝征发百万民工开凿大运河，贯通南北水运，虽耗尽民力，但造福后世千年。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[11], places: [MOCK_PLACES[48], MOCK_PLACES[49]], persons: [],
    external_refs: {},
  },
  {
    id: 49, name: '科举制创立', name_en: 'Establishment of the Imperial Examination System',
    start_year: 605, end_year: 605,
    event_type: 'political', importance: 1, detail_level: 2,
    summary: '隋炀帝设进士科，科举制度正式创立，打破了门阀世族垄断仕途的局面，影响中国一千三百年。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[11], places: [MOCK_PLACES[20]], persons: [],
    external_refs: {},
  },
  {
    id: 106, name: '开皇之治', name_en: 'Reign of Kaihuang',
    start_year: 581, end_year: 600,
    event_type: 'political', importance: 2, detail_level: 2,
    summary: '隋文帝开皇年间推行均田制、三省六部制，轻徭薄赋，户口大增，天下富庶，史称开皇之治。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[11], places: [MOCK_PLACES[16]], persons: [{ id: 16, name: '隋文帝', role: '皇帝' }],
    external_refs: {},
  },
  {
    id: 107, name: '三征高句丽', name_en: 'Three Campaigns against Goguryeo',
    start_year: 612, end_year: 614,
    event_type: 'war', importance: 2, detail_level: 2,
    summary: '隋炀帝三次亲征高句丽，动用兵力百万，均遭惨败，死伤无数，民怨沸腾，成为隋朝灭亡的重要原因。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[11], places: [], persons: [{ id: 97, name: '隋炀帝', role: '统帅' }],
    external_refs: {},
  },
  // ---- 唐 ----
  {
    id: 8, name: '贞观之治', name_en: 'Reign of Zhenguan',
    start_year: 627, end_year: 649,
    event_type: 'political', importance: 1, detail_level: 2,
    summary: '唐太宗李世民在位期间，政治清明、经济复苏、文化繁荣，史称贞观之治。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[12], places: [MOCK_PLACES[2]], persons: [{ id: 3, name: '唐太宗', role: '皇帝' }],
    external_refs: {},
  },
  {
    id: 50, name: '开元盛世', name_en: 'Kaiyuan Prosperity',
    start_year: 713, end_year: 741,
    event_type: 'political', importance: 1, detail_level: 2,
    summary: '唐玄宗开元年间，唐朝达到鼎盛，经济繁荣、文化灿烂、万国来朝，为中国封建社会巅峰。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[12], places: [MOCK_PLACES[2]], persons: [],
    external_refs: {},
  },
  {
    id: 9, name: '安史之乱', name_en: 'An Lushan Rebellion',
    start_year: 755, end_year: 763,
    event_type: 'rebellion', importance: 1, detail_level: 2,
    summary: '安禄山、史思明起兵叛乱，唐朝由盛转衰，藩镇割据局面形成。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[12], places: [MOCK_PLACES[2]], persons: [{ id: 9, name: '安禄山', role: '叛军首领' }],
    external_refs: {},
  },
  {
    id: 54, name: '马嵬坡之变', name_en: 'Incident at Mawei Station',
    start_year: 756, end_year: 756,
    event_type: 'collapse', importance: 2, detail_level: 2,
    summary: '安史之乱中唐玄宗逃往蜀地，禁军在马嵬坡哗变，杨贵妃被赐死，玄宗权威尽失。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[12], places: [MOCK_PLACES[47]], persons: [],
    external_refs: {},
  },
  {
    id: 51, name: '玄奘西行', name_en: "Xuanzang's Journey to the West",
    start_year: 627, end_year: 645,
    event_type: 'cultural', importance: 2, detail_level: 2,
    summary: '玄奘独自西行求法，历经十九年，带回大量佛经并翻译，著《大唐西域记》，为中印文化交流做出巨大贡献。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[12], places: [MOCK_PLACES[31]], persons: [{ id: 65, name: '玄奘', role: '求法者' }],
    external_refs: {},
  },
  {
    id: 52, name: '文成公主入藏', name_en: "Princess Wencheng's Marriage to Tibet",
    start_year: 641, end_year: 641,
    event_type: 'diplomatic', importance: 2, detail_level: 2,
    summary: '唐太宗将文成公主嫁给吐蕃赞普松赞干布，带去先进技术与文化，唐蕃关系和睦。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[12], places: [MOCK_PLACES[53]], persons: [],
    external_refs: {},
  },
  {
    id: 53, name: '黄巢起义', name_en: 'Huang Chao Rebellion',
    start_year: 875, end_year: 884,
    event_type: 'rebellion', importance: 2, detail_level: 2,
    summary: '黄巢率起义军转战大半个中国，攻入长安称帝，虽最终失败，但唐朝已名存实亡。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[12], places: [MOCK_PLACES[2]], persons: [{ id: 55, name: '黄巢', role: '领袖' }],
    external_refs: {},
  },
  {
    id: 108, name: '藩镇割据', name_en: 'Fanzhen Separatist Rule',
    start_year: 763, end_year: 907,
    event_type: 'political', importance: 2, detail_level: 2,
    summary: '安史之乱后，唐朝地方节度使拥兵自重，形成藩镇割据局面。中央权威衰弱，地方军阀各自为政，最终导致唐朝灭亡。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[12], places: [], persons: [],
    external_refs: {},
  },
  // ---- 五代十国 ----
  {
    id: 55, name: '陈桥兵变', name_en: 'Chenqiao Mutiny',
    start_year: 960, end_year: 960,
    event_type: 'founding', importance: 1, detail_level: 2,
    summary: '赵匡胤在陈桥驿被部下黄袍加身，兵不血刃夺取后周政权，建立北宋，结束五代乱局。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[13], places: [], persons: [{ id: 18, name: '宋太祖', role: '皇帝' }],
    external_refs: {},
  },
  // ---- 北宋 ----
  {
    id: 109, name: '杯酒释兵权', name_en: 'Relieving Generals over a Cup of Wine',
    start_year: 961, end_year: 961,
    event_type: 'political', importance: 2, detail_level: 2,
    summary: '宋太祖宴请禁军将领，劝其交出兵权，以和平方式解除武将权力，奠定宋代重文抑武格局。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[14], places: [MOCK_PLACES[5]], persons: [{ id: 18, name: '宋太祖', role: '决策者' }],
    external_refs: {},
  },
  {
    id: 56, name: '庆历新政', name_en: 'Qingli Reforms',
    start_year: 1043, end_year: 1045,
    event_type: 'reform', importance: 2, detail_level: 2,
    summary: '范仲淹上《答手诏条陈十事》，推行新政改革，因保守派反对仅一年即废。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[14], places: [MOCK_PLACES[5]], persons: [],
    external_refs: {},
  },
  {
    id: 15, name: '王安石变法', name_en: 'Wang Anshi Reforms',
    start_year: 1069, end_year: 1085,
    event_type: 'reform', importance: 1, detail_level: 2,
    summary: '宋神宗任用王安石推行新法，包括青苗法、保甲法等，因保守派反对最终失败。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[14], places: [MOCK_PLACES[5]], persons: [{ id: 6, name: '王安石', role: '主导者' }, { id: 108, name: '司马光', role: '反对者' }],
    external_refs: {},
  },
  {
    id: 57, name: '活字印刷发明', name_en: 'Invention of Movable Type Printing',
    start_year: 1040, end_year: 1040,
    event_type: 'cultural', importance: 1, detail_level: 2,
    summary: '毕昇发明活字印刷术，比欧洲古腾堡早约四百年，对世界文明传播产生深远影响。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[14], places: [], persons: [{ id: 109, name: '毕昇', role: '发明者' }],
    external_refs: {},
  },
  {
    id: 58, name: '澶渊之盟', name_en: 'Treaty of Chanyuan',
    start_year: 1004, end_year: 1004,
    event_type: 'diplomatic', importance: 1, detail_level: 2,
    summary: '北宋与辽在澶州订立和约，宋每年送辽岁币银十万两、绢二十万匹，换取百年和平，但亦开屈辱求和之端。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[14], places: [], persons: [],
    external_refs: {},
  },
  {
    id: 10, name: '靖康之变', name_en: 'Jingkang Incident',
    start_year: 1127, end_year: 1127,
    event_type: 'collapse', importance: 1, detail_level: 2,
    summary: '金兵攻破开封，掳走徽钦二帝，北宋灭亡。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[14], places: [MOCK_PLACES[5]], persons: [{ id: 59, name: '宋徽宗', role: '被俘皇帝' }],
    external_refs: {},
  },
  // ---- 南宋 ----
  {
    id: 110, name: '绍兴和议', name_en: 'Treaty of Shaoxing',
    start_year: 1141, end_year: 1141,
    event_type: 'diplomatic', importance: 2, detail_level: 2,
    summary: '南宋与金签订和议，宋向金称臣，每年纳贡银二十五万两、绢二十五万匹，以淮水为界，南北对峙格局确立。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[15], places: [], persons: [{ id: 103, name: '宋高宗', role: '决策者' }, { id: 104, name: '秦桧', role: '执行者' }],
    external_refs: {},
  },
  {
    id: 60, name: '岳飞抗金', name_en: 'Yue Fei Resists the Jin',
    start_year: 1130, end_year: 1142,
    event_type: 'war', importance: 2, detail_level: 2,
    summary: '岳飞率岳家军北伐抗金，屡建战功，却被秦桧以"莫须有"罪名害死，成为千古奇冤。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[15], places: [], persons: [{ id: 34, name: '岳飞', role: '统帅' }, { id: 104, name: '秦桧', role: '陷害者' }, { id: 103, name: '宋高宗', role: '决策者' }],
    external_refs: {},
  },
  {
    id: 59, name: '崖山海战', name_en: 'Battle of Yashan',
    start_year: 1279, end_year: 1279,
    event_type: 'war', importance: 1, detail_level: 2,
    summary: '元军攻灭南宋最后据点崖山，陆秀夫背幼帝投海，十万军民蹈海殉国，南宋灭亡。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[15], places: [MOCK_PLACES[27]], persons: [{ id: 105, name: '文天祥', role: '抗元名臣' }],
    external_refs: {},
  },
  // ---- 元 ----
  {
    id: 61, name: '马可波罗来华', name_en: 'Marco Polo Visits China',
    start_year: 1275, end_year: 1292,
    event_type: 'diplomatic', importance: 2, detail_level: 2,
    summary: '意大利旅行家马可波罗到达元朝大都，在华十七年，其游记向欧洲展示了东方的富庶。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[16], places: [MOCK_PLACES[7]], persons: [{ id: 110, name: '马可波罗', role: '旅行家' }],
    external_refs: {},
  },
  {
    id: 62, name: '郭守敬修授时历', name_en: 'Guo Shoujing Compiles the Shoushi Calendar',
    start_year: 1280, end_year: 1281,
    event_type: 'cultural', importance: 2, detail_level: 2,
    summary: '郭守敬编制《授时历》，以365.2425天为一年，与现行公历相同但早三百年，是古代历法的巅峰。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[16], places: [MOCK_PLACES[7]], persons: [{ id: 51, name: '郭守敬', role: '天文学家' }],
    external_refs: {},
  },
  {
    id: 111, name: '蒙古统一', name_en: 'Unification of the Mongol Tribes',
    start_year: 1206, end_year: 1206,
    event_type: 'founding', importance: 1, detail_level: 2,
    summary: '铁木真统一蒙古各部，在斡难河源召开忽里勒台大会，被推举为成吉思汗，建立大蒙古国，开启蒙古征服时代。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[16], places: [MOCK_PLACES[89]], persons: [{ id: 19, name: '成吉思汗', role: '大汗' }],
    external_refs: {},
  },
  {
    id: 112, name: '成吉思汗西征', name_en: "Genghis Khan's Western Campaigns",
    start_year: 1219, end_year: 1225,
    event_type: 'war', importance: 1, detail_level: 2,
    summary: '成吉思汗率蒙古大军西征花剌子模，攻陷撒马尔罕、布哈拉等重镇，蒙古势力延伸至中亚，打通东西方通道。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[16], places: [], persons: [{ id: 19, name: '成吉思汗', role: '统帅' }],
    external_refs: {},
  },
  {
    id: 113, name: '忽必烈建元', name_en: 'Kublai Khan Founds the Yuan Dynasty',
    start_year: 1271, end_year: 1271,
    event_type: 'founding', importance: 1, detail_level: 2,
    summary: '忽必烈取《易经》"大哉乾元"之意，改国号为"大元"，建立元朝，定都大都，标志着蒙古政权从游牧帝国向中原王朝的转变。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[16], places: [MOCK_PLACES[7]], persons: [{ id: 60, name: '忽必烈', role: '皇帝' }],
    external_refs: {},
  },
  {
    id: 114, name: '元朝统一', name_en: 'Yuan Unification of China',
    start_year: 1279, end_year: 1279,
    event_type: 'political', importance: 1, detail_level: 2,
    summary: '元军在崖山海战中消灭南宋最后势力，陆秀夫背幼帝投海，南宋灭亡。元朝完成全国统一，结束自唐末以来三百余年的分裂局面，首次由少数民族建立大一统王朝。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[16], places: [MOCK_PLACES[22]], persons: [{ id: 60, name: '忽必烈', role: '皇帝' }],
    external_refs: {},
  },
  {
    id: 115, name: '授时历颁布', name_en: 'Shoushi Calendar Promulgated',
    start_year: 1281, end_year: 1281,
    event_type: 'cultural', importance: 2, detail_level: 2,
    summary: '忽必烈颁行《授时历》，以365.2425日为一年，与现行格里高利历精度相同但早三百年。郭守敬为此在全国设立二十七个天文观测站，进行大规模天文实测。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[16], places: [MOCK_PLACES[7]], persons: [{ id: 51, name: '郭守敬', role: '天文学家' }, { id: 60, name: '忽必烈', role: '颁布者' }],
    external_refs: {},
  },
  {
    id: 116, name: '元末红巾军起义', name_en: 'Red Turban Rebellion',
    start_year: 1351, end_year: 1368,
    event_type: 'rebellion', importance: 1, detail_level: 2,
    summary: '韩山童、刘福通以"明王出世"为号发动红巾军起义，各地纷纷响应。朱元璋加入郭子兴部，后自立门户，最终推翻元朝，建立明朝。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[16], places: [], persons: [{ id: 20, name: '明太祖', role: '起义领袖' }],
    external_refs: {},
  },
  // ---- 明 ----
  {
    id: 63, name: '朱元璋建明', name_en: 'Zhu Yuanzhang Founds the Ming Dynasty',
    start_year: 1368, end_year: 1368,
    event_type: 'founding', importance: 1, detail_level: 2,
    summary: '朱元璋在应天府称帝建立明朝，北伐驱逐元廷，恢复汉人统治，推行一系列改革。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[17], places: [MOCK_PLACES[8]], persons: [{ id: 20, name: '明太祖', role: '皇帝' }],
    external_refs: {},
  },
  {
    id: 11, name: '郑和下西洋', name_en: "Zheng He's Voyages",
    start_year: 1405, end_year: 1433,
    event_type: 'diplomatic', importance: 1, detail_level: 2,
    summary: '明成祖派郑和七次下西洋，最远到达非洲东海岸，展示大明国威。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[17], places: [MOCK_PLACES[8]], persons: [{ id: 7, name: '郑和', role: '统帅' }],
    external_refs: {},
  },
  {
    id: 64, name: '戚继光抗倭', name_en: 'Qi Jiguang Fights the Wokou',
    start_year: 1555, end_year: 1567,
    event_type: 'war', importance: 2, detail_level: 2,
    summary: '戚继光在东南沿海抗击倭寇，创立鸳鸯阵法，基本肃清倭患，保卫海疆安宁。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[17], places: [MOCK_PLACES[36]], persons: [{ id: 35, name: '戚继光', role: '统帅' }],
    external_refs: {},
  },
  {
    id: 65, name: '土木堡之变', name_en: 'Tumu Crisis',
    start_year: 1449, end_year: 1449,
    event_type: 'war', importance: 2, detail_level: 2,
    summary: '明英宗亲征瓦剌，在土木堡被俘，明军精锐尽丧，于谦力主坚守北京，转危为安。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[17], places: [MOCK_PLACES[59]], persons: [],
    external_refs: {},
  },
  {
    id: 81, name: '靖难之役', name_en: 'Jingnan Campaign',
    start_year: 1399, end_year: 1402,
    event_type: 'war', importance: 2, detail_level: 2,
    summary: '燕王朱棣以"清君侧"为名起兵，经四年战争夺取帝位，迁都北京。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[17], places: [MOCK_PLACES[8], MOCK_PLACES[9]], persons: [],
    external_refs: {},
  },
  {
    id: 66, name: '李自成起义', name_en: 'Li Zicheng Rebellion',
    start_year: 1629, end_year: 1645,
    event_type: 'rebellion', importance: 2, detail_level: 2,
    summary: '李自成率农民军攻入北京，推翻明朝，但很快被清军击败，大顺政权覆灭。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[17], places: [MOCK_PLACES[9]], persons: [{ id: 56, name: '李自成', role: '领袖' }],
    external_refs: {},
  },
  {
    id: 117, name: '北京保卫战', name_en: 'Defense of Beijing',
    start_year: 1449, end_year: 1449,
    event_type: 'war', importance: 2, detail_level: 2,
    summary: '土木堡之变后，兵部尚书于谦力排众议坚守北京，拥立景帝，组织军民击退瓦剌围攻，保全明朝。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[17], places: [MOCK_PLACES[9]], persons: [],
    external_refs: {},
  },
  {
    id: 118, name: '万历新政', name_en: 'Wanli Reforms',
    start_year: 1572, end_year: 1582,
    event_type: 'reform', importance: 2, detail_level: 2,
    summary: '张居正任内阁首辅期间推行改革，清丈田亩、实行一条鞭法、整顿吏治考成法，国库充盈，明朝国力一度恢复。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[17], places: [MOCK_PLACES[9]], persons: [{ id: 116, name: '张居正', role: '首辅' }],
    external_refs: {},
  },
  {
    id: 119, name: '朝鲜之役', name_en: 'Japanese Invasions of Korea',
    start_year: 1592, end_year: 1598,
    event_type: 'war', importance: 2, detail_level: 2,
    summary: '丰臣秀吉入侵朝鲜，明朝应援出兵，经两次战役击退日军，维护东亚秩序，但耗资巨大，削弱明朝国力。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[17], places: [], persons: [],
    external_refs: {},
  },
  {
    id: 120, name: '东林党争', name_en: 'Donglin Factional Disputes',
    start_year: 1604, end_year: 1644,
    event_type: 'political', importance: 2, detail_level: 2,
    summary: '以东林书院为旗帜的士大夫集团与阉党等派系长期争斗，朝政内耗严重，加速明朝衰亡。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[17], places: [], persons: [],
    external_refs: {},
  },
  {
    id: 121, name: '明亡清兴', name_en: 'Fall of Ming and Rise of Qing',
    start_year: 1644, end_year: 1644,
    event_type: 'collapse', importance: 1, detail_level: 2,
    summary: '李自成攻入北京，崇祯帝自缢煤山，明朝灭亡。吴三桂引清军入关击败李自成，清朝定都北京，开始统治中国。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[17], places: [MOCK_PLACES[9], MOCK_PLACES[13]], persons: [{ id: 115, name: '明思宗', role: '末代皇帝' }, { id: 56, name: '李自成', role: '攻入北京' }],
    external_refs: {},
  },
  // ---- 清 ----
  {
    id: 82, name: '清军入关', name_en: 'Qing Forces Enter the Shanhai Pass',
    start_year: 1644, end_year: 1644,
    event_type: 'founding', importance: 1, detail_level: 2,
    summary: '吴三桂引清军入山海关，击败李自成，清朝定都北京，开始统治中国。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[18], places: [MOCK_PLACES[13]], persons: [],
    external_refs: {},
  },
  {
    id: 67, name: '康乾盛世', name_en: 'Kang-Qian Prosperity',
    start_year: 1661, end_year: 1796,
    event_type: 'political', importance: 1, detail_level: 2,
    summary: '康熙、雍正、乾隆三朝，疆域辽阔，经济繁荣，人口激增，为清朝鼎盛时期，但亦埋下衰败隐患。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[18], places: [MOCK_PLACES[9]], persons: [{ id: 21, name: '康熙帝', role: '皇帝' }, { id: 118, name: '雍正帝', role: '皇帝' }, { id: 22, name: '乾隆帝', role: '皇帝' }],
    external_refs: {},
  },
  {
    id: 72, name: '尼布楚条约', name_en: 'Treaty of Nerchinsk',
    start_year: 1689, end_year: 1689,
    event_type: 'diplomatic', importance: 2, detail_level: 2,
    summary: '清朝与沙俄签订《尼布楚条约》，划定东段边界，是中国首次与欧洲国家签订平等条约。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[18], places: [MOCK_PLACES[55]], persons: [{ id: 21, name: '康熙帝', role: '决策者' }],
    external_refs: {},
  },
  {
    id: 83, name: '收复台湾', name_en: 'Recovery of Taiwan',
    start_year: 1683, end_year: 1683,
    event_type: 'war', importance: 2, detail_level: 2,
    summary: '施琅率清军攻灭明郑政权，台湾纳入清朝版图，设台湾府隶属福建省。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[18], places: [], persons: [{ id: 21, name: '康熙帝', role: '决策者' }],
    external_refs: {},
  },
  {
    id: 70, name: '太平天国运动', name_en: 'Taiping Heavenly Kingdom Movement',
    start_year: 1851, end_year: 1864,
    event_type: 'rebellion', importance: 1, detail_level: 2,
    summary: '洪秀全创立拜上帝教，在金田起义建立太平天国，定都天京，持续十四年，是中国历史上规模最大的农民战争。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[18], places: [MOCK_PLACES[57], MOCK_PLACES[58]], persons: [{ id: 57, name: '洪秀全', role: '领袖' }, { id: 120, name: '曾国藩', role: '镇压者' }],
    external_refs: {},
  },
  {
    id: 12, name: '鸦片战争', name_en: 'First Opium War',
    start_year: 1840, end_year: 1842,
    event_type: 'war', importance: 1, detail_level: 2,
    summary: '英国以鸦片贸易为借口发动侵华战争，清朝战败，签订《南京条约》，中国开始沦为半殖民地。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[18], places: [MOCK_PLACES[9], MOCK_PLACES[28]], persons: [{ id: 30, name: '林则徐', role: '抗英官员' }],
    external_refs: {},
  },
  {
    id: 71, name: '甲午海战', name_en: 'First Sino-Japanese War',
    start_year: 1894, end_year: 1895,
    event_type: 'war', importance: 1, detail_level: 2,
    summary: '中日甲午战争，北洋水师全军覆没，签订《马关条约》割让台湾，民族危机空前严重。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[18], places: [MOCK_PLACES[56]], persons: [{ id: 121, name: '李鸿章', role: '北洋大臣' }],
    external_refs: {},
  },
  {
    id: 68, name: '洋务运动', name_en: 'Self-Strengthening Movement',
    start_year: 1861, end_year: 1895,
    event_type: 'reform', importance: 1, detail_level: 2,
    summary: '以"师夷长技以自强"为口号，引进西方技术与设备，创办近代工业与新式军队，但甲午战败标志其破产。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[18], places: [], persons: [{ id: 120, name: '曾国藩', role: '倡导者' }, { id: 121, name: '李鸿章', role: '核心人物' }, { id: 122, name: '左宗棠', role: '参与者' }],
    external_refs: {},
  },
  {
    id: 69, name: '戊戌变法', name_en: 'Hundred Days Reform',
    start_year: 1898, end_year: 1898,
    event_type: 'reform', importance: 2, detail_level: 2,
    summary: '光绪帝任用康有为、梁启超推行维新变法，仅百日即被慈禧太后发动政变镇压，谭嗣同等六君子殉难。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[18], places: [MOCK_PLACES[9]], persons: [{ id: 119, name: '慈禧太后', role: '镇压者' }],
    external_refs: {},
  },
  {
    id: 13, name: '辛亥革命', name_en: 'Xinhai Revolution',
    start_year: 1911, end_year: 1912,
    event_type: 'rebellion', importance: 1, detail_level: 2,
    summary: '武昌起义引发全国响应，清帝退位，结束两千余年的帝制，建立中华民国。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[18], places: [MOCK_PLACES[50]], persons: [{ id: 123, name: '孙中山', role: '革命领袖' }, { id: 124, name: '袁世凯', role: '逼退清帝' }],
    external_refs: {},
  },
  {
    id: 122, name: '平定三藩', name_en: 'Suppression of the Three Feudatories',
    start_year: 1673, end_year: 1681,
    event_type: 'war', importance: 2, detail_level: 2,
    summary: '康熙帝平定吴三桂、尚可喜、耿精忠三藩叛乱，消除分裂势力，巩固清朝统一。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[18], places: [MOCK_PLACES[95]], persons: [{ id: 21, name: '康熙帝', role: '统帅' }],
    external_refs: {},
  },
  {
    id: 123, name: '文字狱', name_en: 'Literary Inquisitions',
    start_year: 1661, end_year: 1796,
    event_type: 'cultural', importance: 2, detail_level: 2,
    summary: '清初至乾隆朝大兴文字狱，以言论罪人，株连甚广，严重压制思想自由，造成文化恐怖。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[18], places: [MOCK_PLACES[95]], persons: [{ id: 21, name: '康熙帝', role: '推行者' }, { id: 118, name: '雍正帝', role: '推行者' }, { id: 22, name: '乾隆帝', role: '推行者' }],
    external_refs: {},
  },
  {
    id: 124, name: '四库全书编纂', name_en: 'Compilation of the Siku Quanshu',
    start_year: 1773, end_year: 1782,
    event_type: 'cultural', importance: 2, detail_level: 2,
    summary: '乾隆帝下令编纂《四库全书》，收录典籍三千四百余种，为古代最大丛书，但编纂过程中大量书籍被禁毁。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[18], places: [MOCK_PLACES[95]], persons: [{ id: 22, name: '乾隆帝', role: '下令者' }],
    external_refs: {},
  },
  {
    id: 125, name: '虎门销烟', name_en: 'Destruction of Opium at Humen',
    start_year: 1839, end_year: 1839,
    event_type: 'political', importance: 1, detail_level: 1,
    summary: '林则徐在虎门海滩当众销毁鸦片二百三十七万斤，彰显禁烟决心，成为鸦片战争导火索。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[18], places: [MOCK_PLACES[28]], persons: [{ id: 30, name: '林则徐', role: '主持者' }],
    external_refs: {},
  },
  {
    id: 126, name: '第二次鸦片战争', name_en: 'Second Opium War',
    start_year: 1856, end_year: 1860,
    event_type: 'war', importance: 1, detail_level: 2,
    summary: '英法联军侵华，攻入北京，火烧圆明园。签订《天津条约》《北京条约》，中国半殖民地化加深。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[18], places: [MOCK_PLACES[95], MOCK_PLACES[96]], persons: [{ id: 119, name: '慈禧太后', role: '决策者' }],
    external_refs: {},
  },
  {
    id: 127, name: '庚子国变', name_en: 'Boxer Rebellion and Eight-Nation Alliance',
    start_year: 1900, end_year: 1901,
    event_type: 'rebellion', importance: 1, detail_level: 2,
    summary: '义和团运动兴起，清廷向十一国宣战，八国联军攻占北京，慈禧携光绪西逃。签订《辛丑条约》，赔款四亿五千万两。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[18], places: [MOCK_PLACES[95]], persons: [{ id: 119, name: '慈禧太后', role: '决策者' }, { id: 121, name: '李鸿章', role: '签约者' }],
    external_refs: {},
  },
  // ---- 新增：文化类事件 ----
  {
    id: 128, name: '诗经编纂', name_en: 'Compilation of the Classic of Poetry',
    start_year: -600, end_year: -600,
    event_type: 'cultural', importance: 2, detail_level: 2,
    summary: '中国最早的诗歌总集《诗经》在西周至春秋间编纂成书，收录诗歌三百零五篇，分风、雅、颂三部分，奠定中国诗歌传统。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[3], places: [MOCK_PLACES[15]], persons: [],
    external_refs: {},
  },
  {
    id: 129, name: '楚辞兴盛', name_en: 'Flourishing of Chu Ci',
    start_year: -300, end_year: -278,
    event_type: 'cultural', importance: 2, detail_level: 2,
    summary: '屈原、宋玉等创作楚辞，以《离骚》《九歌》为代表，开创中国浪漫主义文学传统，影响深远。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[3], places: [MOCK_PLACES[77]], persons: [{ id: 125, name: '屈原', role: '代表诗人' }],
    external_refs: {},
  },
  {
    id: 130, name: '道教形成', name_en: 'Formation of Daoism as Religion',
    start_year: 142, end_year: 142,
    event_type: 'cultural', importance: 2, detail_level: 2,
    summary: '张道陵在蜀地创五斗米道，标志着道教作为宗教的正式形成，对后世中国宗教文化影响深远。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[6], places: [MOCK_PLACES[18]], persons: [{ id: 126, name: '张道陵', role: '创立者' }],
    external_refs: {},
  },
  {
    id: 131, name: '白虎观会议', name_en: 'White Tiger Hall Conference',
    start_year: 79, end_year: 79,
    event_type: 'cultural', importance: 2, detail_level: 2,
    summary: '汉章帝亲自主持白虎观经学会议，讨论五经异同，统一经义，编成《白虎通义》，确立经学正统。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[6], places: [MOCK_PLACES[3]], persons: [],
    external_refs: {},
  },
  {
    id: 132, name: '玄学兴起', name_en: 'Rise of Xuanxue (Neo-Daoism)',
    start_year: 240, end_year: 260,
    event_type: 'cultural', importance: 2, detail_level: 2,
    summary: '何晏、王弼等倡导玄学清谈，以老庄思想解释儒家经典，崇尚自然无为，形成魏晋玄学思潮。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[7], places: [], persons: [{ id: 127, name: '何晏', role: '倡导者' }, { id: 128, name: '王弼', role: '倡导者' }],
    external_refs: {},
  },
  {
    id: 133, name: '造纸术改良', name_en: "Cai Lun's Improvement of Papermaking",
    start_year: 105, end_year: 105,
    event_type: 'cultural', importance: 1, detail_level: 1,
    summary: '蔡伦改良造纸术，以树皮、麻头、破布、旧渔网为原料造纸，大幅降低成本，推动文化传播，为中国四大发明之一。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[6], places: [MOCK_PLACES[3]], persons: [{ id: 129, name: '蔡伦', role: '改良者' }],
    external_refs: {},
  },
  {
    id: 134, name: '元曲兴盛', name_en: 'Flourishing of Yuan Drama',
    start_year: 1300, end_year: 1330,
    event_type: 'cultural', importance: 2, detail_level: 2,
    summary: '关汉卿、马致远、白朴、郑光祖等创作大量杂剧，元曲成为与唐诗宋词并列的文学高峰，代表作《窦娥冤》等。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[16], places: [MOCK_PLACES[7]], persons: [{ id: 130, name: '关汉卿', role: '代表作家' }],
    external_refs: {},
  },
  {
    id: 135, name: '八股文科举', name_en: 'Eight-Legged Essay Imperial Examination',
    start_year: 1487, end_year: 1487,
    event_type: 'cultural', importance: 2, detail_level: 2,
    summary: '明代科举定型八股文格式，考试内容限于四书五经，文体严格规范，束缚士人思想，影响明清数百年。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[17], places: [MOCK_PLACES[9]], persons: [],
    external_refs: {},
  },
  {
    id: 136, name: '大明历颁行', name_en: 'Promulgation of the Daming Calendar',
    start_year: 445, end_year: 510,
    event_type: 'cultural', importance: 2, detail_level: 2,
    summary: '祖冲之编制《大明历》，首次将岁差引入历法，精确计算回归年长度，是中国历法史上的重大突破。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[10], places: [], persons: [{ id: 49, name: '祖冲之', role: '编制者' }],
    external_refs: {},
  },
  {
    id: 137, name: '梦溪笔谈成书', name_en: 'Completion of Dream Pool Essays',
    start_year: 1088, end_year: 1088,
    event_type: 'cultural', importance: 2, detail_level: 2,
    summary: '沈括著《梦溪笔谈》，涵盖天文、数学、物理、化学、生物等领域，被誉为中国科学史上的里程碑。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[14], places: [], persons: [{ id: 131, name: '沈括', role: '作者' }],
    external_refs: {},
  },
  {
    id: 138, name: '本草纲目成书', name_en: 'Completion of Compendium of Materia Medica',
    start_year: 1578, end_year: 1578,
    event_type: 'cultural', importance: 1, detail_level: 1,
    summary: '李时珍历时二十七年著成《本草纲目》，收录药物一千八百九十二种，是中国医药学的集大成之作。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[17], places: [], persons: [{ id: 132, name: '李时珍', role: '作者' }],
    external_refs: {},
  },
  {
    id: 139, name: '天工开物成书', name_en: 'Completion of Tiangong Kaiwu',
    start_year: 1637, end_year: 1637,
    event_type: 'cultural', importance: 1, detail_level: 1,
    summary: '宋应星著《天工开物》，系统记述农业和手工业生产技术，被誉为中国十七世纪的百科全书。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[17], places: [], persons: [{ id: 133, name: '宋应星', role: '作者' }],
    external_refs: {},
  },
  {
    id: 140, name: '农政全书成书', name_en: 'Completion of Nongzheng Quanshu',
    start_year: 1628, end_year: 1628,
    event_type: 'cultural', importance: 2, detail_level: 2,
    summary: '徐光启著《农政全书》，系统总结中国农学知识，引入西方水利技术，是中国古代农学集大成之作。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[17], places: [], persons: [{ id: 134, name: '徐光启', role: '作者' }],
    external_refs: {},
  },
  // ---- 新增：经济类事件 ----
  {
    id: 141, name: '统一度量衡', name_en: 'Standardization of Weights and Measures',
    start_year: -221, end_year: -221,
    event_type: 'economic', importance: 2, detail_level: 2,
    summary: '秦始皇统一全国度量衡制度，统一长度、容量、重量标准，便利经济交流，加强中央集权。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[4], places: [MOCK_PLACES[1]], persons: [{ id: 1, name: '秦始皇', role: '决策者' }],
    external_refs: {},
  },
  {
    id: 142, name: '统一货币', name_en: 'Standardization of Currency',
    start_year: -210, end_year: -210,
    event_type: 'economic', importance: 2, detail_level: 2,
    summary: '秦始皇统一全国货币，废止六国旧币，推行秦半两钱，以圆形方孔铜钱为标准，奠定中国两千年货币形制。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[4], places: [MOCK_PLACES[1]], persons: [{ id: 1, name: '秦始皇', role: '决策者' }],
    external_refs: {},
  },
  {
    id: 143, name: '盐铁官营', name_en: 'State Monopoly on Salt and Iron',
    start_year: -119, end_year: -119,
    event_type: 'economic', importance: 2, detail_level: 2,
    summary: '汉武帝实行盐铁专卖，将盐铁产销收归国家经营，增加财政收入以支持对匈奴战争，引发盐铁之议。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[5], places: [MOCK_PLACES[2]], persons: [{ id: 2, name: '汉武帝', role: '决策者' }],
    external_refs: {},
  },
  {
    id: 144, name: '均输平准', name_en: 'Junshu and Pingzhun Policies',
    start_year: -110, end_year: -110,
    event_type: 'economic', importance: 2, detail_level: 2,
    summary: '汉武帝推行均输平准政策，均输法统一调配各地物资，平准法平抑物价，加强国家对经济的调控。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[5], places: [MOCK_PLACES[2]], persons: [{ id: 2, name: '汉武帝', role: '决策者' }, { id: 135, name: '桑弘羊', role: '执行者' }],
    external_refs: {},
  },
  {
    id: 145, name: '交子出现', name_en: 'Emergence of Jiaozi (Paper Money)',
    start_year: 1023, end_year: 1023,
    event_type: 'economic', importance: 1, detail_level: 1,
    summary: '北宋四川地区出现世界上最早的纸币——交子，由民间信用凭证发展为官方发行，是货币史上的重大创新。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[14], places: [MOCK_PLACES[18]], persons: [],
    external_refs: {},
  },
  {
    id: 146, name: '一条鞭法', name_en: 'Single Whip Tax Reform',
    start_year: 1581, end_year: 1581,
    event_type: 'economic', importance: 2, detail_level: 2,
    summary: '张居正推行一条鞭法，将田赋、徭役等合并为一条，按亩征银，简化赋役制度，促进商品经济发展。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[17], places: [MOCK_PLACES[9]], persons: [{ id: 116, name: '张居正', role: '推行者' }],
    external_refs: {},
  },
  {
    id: 147, name: '摊丁入亩', name_en: 'Tax Reform of Merging Poll Tax into Land Tax',
    start_year: 1712, end_year: 1712,
    event_type: 'economic', importance: 2, detail_level: 2,
    summary: '雍正帝推行摊丁入亩，将人头税并入田赋，按土地面积征收，废除延续两千多年的人头税，促进人口增长。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[18], places: [MOCK_PLACES[100]], persons: [{ id: 118, name: '雍正帝', role: '推行者' }],
    external_refs: {},
  },
  {
    id: 148, name: '都江堰修建', name_en: 'Construction of Dujiangyan Irrigation System',
    start_year: -256, end_year: -251,
    event_type: 'economic', importance: 1, detail_level: 1,
    summary: '李冰父子主持修建都江堰水利工程，分水灌溉成都平原，使蜀地成为天府之国，至今仍在发挥作用。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[3], places: [], persons: [{ id: 136, name: '李冰', role: '修建者' }],
    external_refs: {},
  },
  {
    id: 149, name: '灵渠开凿', name_en: 'Construction of the Lingqu Canal',
    start_year: -214, end_year: -214,
    event_type: 'economic', importance: 2, detail_level: 2,
    summary: '秦始皇下令开凿灵渠，沟通长江与珠江水系，便利南方军事运输和南北经济交流，是世界最古老的人工运河之一。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[4], places: [], persons: [{ id: 1, name: '秦始皇', role: '决策者' }],
    external_refs: {},
  },
  // ---- 新增：外交类事件 ----
  {
    id: 150, name: '鉴真东渡', name_en: "Jianzhen's Voyages to Japan",
    start_year: 753, end_year: 753,
    event_type: 'diplomatic', importance: 2, detail_level: 2,
    summary: '鉴真六次东渡日本终获成功，将佛教律宗、建筑、医药等传入日本，对日本文化影响深远。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[12], places: [], persons: [{ id: 137, name: '鉴真', role: '东渡者' }],
    external_refs: {},
  },
  {
    id: 151, name: '马戛尔尼使华', name_en: "Macartney Embassy to China",
    start_year: 1793, end_year: 1793,
    event_type: 'diplomatic', importance: 2, detail_level: 2,
    summary: '英国使臣马戛尔尼率团访华，请求通商，乾隆帝以"天朝物产丰盈"拒绝，错失与西方交流的机遇。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[18], places: [MOCK_PLACES[100]], persons: [{ id: 22, name: '乾隆帝', role: '拒绝者' }, { id: 138, name: '马戛尔尼', role: '使臣' }],
    external_refs: {},
  },
  {
    id: 152, name: '南京条约签订', name_en: 'Signing of the Treaty of Nanjing',
    start_year: 1842, end_year: 1842,
    event_type: 'diplomatic', importance: 1, detail_level: 1,
    summary: '鸦片战争失败后，清廷与英国签订《南京条约》，割让香港岛、开放五口通商、赔款两千一百万银元，是中国近代第一个不平等条约。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[18], places: [MOCK_PLACES[57]], persons: [{ id: 121, name: '李鸿章', role: '签约者' }],
    external_refs: {},
  },
  {
    id: 153, name: '北京条约签订', name_en: 'Signing of the Convention of Beijing',
    start_year: 1860, end_year: 1860,
    event_type: 'diplomatic', importance: 2, detail_level: 2,
    summary: '第二次鸦片战争后，清廷与英法签订《北京条约》，增开天津为商埠、割九龙半岛、赔款增加，半殖民地化加深。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[18], places: [MOCK_PLACES[100]], persons: [{ id: 119, name: '慈禧太后', role: '决策者' }, { id: 121, name: '李鸿章', role: '签约者' }],
    external_refs: {},
  },
  {
    id: 154, name: '马关条约签订', name_en: 'Signing of the Treaty of Shimonoseki',
    start_year: 1895, end_year: 1895,
    event_type: 'diplomatic', importance: 1, detail_level: 1,
    summary: '甲午战争失败后，清廷与日本签订《马关条约》，割让台湾及澎湖列岛、赔款二亿两白银，民族危机空前严重。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[18], places: [MOCK_PLACES[102]], persons: [{ id: 121, name: '李鸿章', role: '签约者' }],
    external_refs: {},
  },
  {
    id: 155, name: '辛丑条约签订', name_en: 'Signing of the Boxer Protocol',
    start_year: 1901, end_year: 1901,
    event_type: 'diplomatic', importance: 1, detail_level: 1,
    summary: '庚子国变后，清廷与十一国签订《辛丑条约》，赔款四亿五千万两白银，中国完全沦为半殖民地半封建社会。',
    is_lunar: false, dynasty: MOCK_DYNASTIES[18], places: [MOCK_PLACES[100]], persons: [{ id: 119, name: '慈禧太后', role: '决策者' }, { id: 121, name: '李鸿章', role: '签约者' }],
    external_refs: {},
  },
];

// ===== 人物数据 =====
export const MOCK_PERSONS: Person[] = [
  // ---- 皇帝 (emperor) ----
  { id: 1, name: '秦始皇', name_en: 'Qin Shi Huang', courtesy_name: '', birth_year: -259, death_year: -210, dynasty_id: 5, person_type: 'emperor', summary: '中国第一位皇帝，统一六国，建立中央集权制度。', description: '嬴姓，赵氏，名政。先后灭韩、赵、魏、楚、燕、齐六国，完成统一大业。统一文字、度量衡、货币，修筑长城，建阿房宫，焚书坑儒。', external_refs: {} },
  { id: 2, name: '汉武帝', name_en: 'Emperor Wu of Han', courtesy_name: '', birth_year: -156, death_year: -87, dynasty_id: 6, person_type: 'emperor', summary: '开疆拓土，独尊儒术，开辟丝绸之路。', description: '刘彻，西汉第七位皇帝。在位五十四年，北击匈奴，派张骞通西域，罢黜百家独尊儒术，开创汉武盛世。晚年颁下罪己诏。', external_refs: {} },
  { id: 3, name: '唐太宗', name_en: 'Emperor Taizong of Tang', courtesy_name: '', birth_year: 598, death_year: 649, dynasty_id: 13, person_type: 'emperor', summary: '开创贞观之治，被誉为千古一帝。', description: '李世民，唐朝第二位皇帝。玄武门之变后即位，虚心纳谏，知人善任，开创贞观之治，为盛唐奠定基础。', external_refs: {} },
  { id: 11, name: '商汤王', name_en: 'King Tang of Shang', courtesy_name: '', birth_year: -1675, death_year: -1587, dynasty_id: 2, person_type: 'emperor', summary: '商朝开国君主，以德服人灭夏建商。', description: '子姓，名履。商部落首领，以仁德著称，率诸侯灭夏桀，建立商朝。', external_refs: {} },
  { id: 12, name: '周文王', name_en: 'King Wen of Zhou', courtesy_name: '', birth_year: -1152, death_year: -1056, dynasty_id: 3, person_type: 'emperor', summary: '西周奠基者，演绎周易，为武王伐纣奠定基础。', description: '姬姓，名昌。在位期间发展生产，招贤纳士，三分天下有其二，为灭商做好准备。', external_refs: {} },
  { id: 13, name: '周武王', name_en: 'King Wu of Zhou', courtesy_name: '', birth_year: -1087, death_year: -1043, dynasty_id: 3, person_type: 'emperor', summary: '西周开国君主，牧野之战灭商建周。', description: '姬姓，名发。继承父志，率诸侯联军在牧野击败商纣王，建立西周，实行分封制。', external_refs: {} },
  { id: 14, name: '汉高祖', name_en: 'Emperor Gaozu of Han', courtesy_name: '季', birth_year: -256, death_year: -195, dynasty_id: 6, person_type: 'emperor', summary: '西汉开国皇帝，以布衣之身取天下。', description: '刘邦，沛县人。起兵反秦，楚汉之争中击败项羽，建立西汉。善用人才，知人善任。', external_refs: {} },
  { id: 15, name: '汉光武帝', name_en: 'Emperor Guangwu of Han', courtesy_name: '文叔', birth_year: -5, death_year: 57, dynasty_id: 7, person_type: 'emperor', summary: '东汉开国皇帝，中兴汉室。', description: '刘秀，南阳蔡阳人。起兵反莽，昆阳之战以少胜多，后称帝建立东汉，统一全国，实行柔道治国。', external_refs: {} },
  { id: 16, name: '隋文帝', name_en: 'Emperor Wen of Sui', courtesy_name: '', birth_year: 541, death_year: 604, dynasty_id: 12, person_type: 'emperor', summary: '隋朝开国皇帝，结束南北分裂，开创开皇之治。', description: '杨坚，弘农华阴人。代北周建隋，灭陈统一全国。推行均田制、三省六部制，开创科举雏形。', external_refs: {} },
  { id: 17, name: '武则天', name_en: 'Empress Wu Zetian', courtesy_name: '', birth_year: 624, death_year: 705, dynasty_id: 13, person_type: 'emperor', summary: '中国历史上唯一的女皇帝，开创武周政权。', description: '名曌，并州文水人。唐高宗皇后，后称帝改国号为周。在位期间发展科举，打击门阀，政绩显著。', external_refs: {} },
  { id: 18, name: '宋太祖', name_en: 'Emperor Taizu of Song', courtesy_name: '元朗', birth_year: 927, death_year: 976, dynasty_id: 15, person_type: 'emperor', summary: '北宋开国皇帝，陈桥兵变黄袍加身。', description: '赵匡胤，涿郡人。陈桥兵变建立北宋，杯酒释兵权，重文抑武，奠定宋代文治基础。', external_refs: {} },
  { id: 19, name: '成吉思汗', name_en: 'Genghis Khan', courtesy_name: '', birth_year: 1162, death_year: 1227, dynasty_id: 17, person_type: 'emperor', summary: '蒙古帝国创建者，统一蒙古各部，建立横跨欧亚的帝国。', description: '名铁木真，蒙古乞颜部人。统一蒙古各部，1206年称成吉思汗，发动大规模征服战争。', external_refs: {} },
  { id: 20, name: '明太祖', name_en: 'Emperor Taizu of Ming', courtesy_name: '国瑞', birth_year: 1328, death_year: 1398, dynasty_id: 18, person_type: 'emperor', summary: '明朝开国皇帝，从乞丐到皇帝的传奇。', description: '朱元璋，濠州钟离人。出身贫苦，参加红巾军起义，后建立明朝，推行一系列改革，恢复社会秩序。', external_refs: {} },
  { id: 21, name: '康熙帝', name_en: 'Emperor Kangxi', courtesy_name: '', birth_year: 1654, death_year: 1722, dynasty_id: 19, person_type: 'emperor', summary: '清朝在位最长的皇帝，开创康乾盛世。', description: '爱新觉罗·玄烨，八岁即位，在位六十一年。平三藩、收台湾、抗沙俄、征噶尔丹，文治武功兼备。', external_refs: {} },
  { id: 22, name: '乾隆帝', name_en: 'Emperor Qianlong', courtesy_name: '', birth_year: 1711, death_year: 1799, dynasty_id: 19, person_type: 'emperor', summary: '清朝鼎盛时期的皇帝，十全武功，编纂《四库全书》。', description: '爱新觉罗·弘历，在位六十年。文治武功均有建树，但晚年奢靡，闭关锁国，埋下衰败隐患。', external_refs: {} },
  { id: 58, name: '孝文帝', name_en: 'Emperor Xiaowen of Northern Wei', courtesy_name: '', birth_year: 467, death_year: 499, dynasty_id: 11, person_type: 'emperor', summary: '北魏皇帝，推行汉化改革，促进民族融合。', description: '拓跋宏，北魏第七位皇帝。迁都洛阳，改汉姓为元，推行全面汉化，对中国民族融合贡献巨大。', external_refs: {} },
  { id: 59, name: '宋徽宗', name_en: 'Emperor Huizong of Song', courtesy_name: '', birth_year: 1082, death_year: 1135, dynasty_id: 15, person_type: 'emperor', summary: '北宋皇帝，艺术天才却治国无能，靖康之变中被俘。', description: '赵佶，书画造诣极高，创瘦金体。但任用奸佞，穷奢极欲，导致北宋灭亡。', external_refs: {} },
  { id: 60, name: '忽必烈', name_en: 'Kublai Khan', courtesy_name: '', birth_year: 1215, death_year: 1294, dynasty_id: 17, person_type: 'emperor', summary: '元朝开国皇帝，建立大一统的元朝。', description: '爱新觉罗·忽必烈，成吉思汗之孙。1271年建立元朝，1279年灭南宋统一中国。推行行省制，促进中外交流。', external_refs: {} },
  { id: 61, name: '刘备', name_en: 'Liu Bei', courtesy_name: '玄德', birth_year: 161, death_year: 223, dynasty_id: 8, person_type: 'emperor', summary: '蜀汉开国皇帝，以仁义著称。', description: '涿郡涿县人，汉室宗亲。三顾茅庐请诸葛亮，建立蜀汉政权。', external_refs: {} },
  { id: 62, name: '孙权', name_en: 'Sun Quan', courtesy_name: '仲谋', birth_year: 182, death_year: 252, dynasty_id: 8, person_type: 'emperor', summary: '东吴开国皇帝，据守江东。', description: '吴郡富春人，继承父兄基业，联刘抗曹，称帝建吴，统治江东数十年。', external_refs: {} },
  { id: 64, name: '司马炎', name_en: 'Sima Yan', courtesy_name: '安世', birth_year: 236, death_year: 290, dynasty_id: 9, person_type: 'emperor', summary: '西晋开国皇帝，统一三国。', description: '河内温县人，司马昭之子。265年篡魏建晋，280年灭吴统一全国，但统一仅维持十余年。', external_refs: {} },
  // ---- 官员 (official) ----
  { id: 4, name: '张骞', name_en: 'Zhang Qian', courtesy_name: '子文', birth_year: -164, death_year: -114, dynasty_id: 6, person_type: 'official', summary: '出使西域，开辟丝绸之路。', description: '汉中郡城固人，两次出使西域，历经十三年艰辛，沟通了中原与西域的联系，被誉为"凿空"之旅。', external_refs: {} },
  { id: 5, name: '诸葛亮', name_en: 'Zhuge Liang', courtesy_name: '孔明', art_name: '卧龙', birth_year: 181, death_year: 234, dynasty_id: 8, person_type: 'official', summary: '蜀汉丞相，鞠躬尽瘁死而后已。', description: '琅琊阳都人，三国时期蜀汉丞相。辅佐刘备建立蜀汉，联吴抗曹，七擒孟获，六出祁山，鞠躬尽瘁死而后已。', external_refs: {} },
  { id: 6, name: '王安石', name_en: 'Wang Anshi', courtesy_name: '介甫', art_name: '半山', birth_year: 1021, death_year: 1086, dynasty_id: 15, person_type: 'official', summary: '北宋政治家、改革家，推行新法。', description: '临川人，北宋著名政治家、思想家、文学家。在宋神宗支持下推行变法，包括青苗法、免役法、方田均税法等，史称"王安石变法"。', external_refs: {} },
  { id: 7, name: '郑和', name_en: 'Zheng He', courtesy_name: '三保', birth_year: 1371, death_year: 1433, dynasty_id: 18, person_type: 'official', summary: '七下西洋，展示大明国威。', description: '本姓马，云南昆阳人。明成祖赐姓郑，任内官监太监。率领庞大船队七次远航，最远到达非洲东海岸和红海沿岸。', external_refs: {} },
  { id: 8, name: '商鞅', name_en: 'Shang Yang', courtesy_name: '', birth_year: -390, death_year: -338, dynasty_id: 4, person_type: 'official', summary: '法家代表人物，推行变法使秦国强盛。', description: '卫国人，本名卫鞅。入秦后推行变法，废井田、开阡陌、行县制、奖军功，使秦国迅速强盛。秦孝公死后被车裂。', external_refs: {} },
  { id: 23, name: '管仲', name_en: 'Guan Zhong', courtesy_name: '夷吾', birth_year: -725, death_year: -645, dynasty_id: 4, person_type: 'official', summary: '春秋名相，辅佐齐桓公称霸。', description: '颍上人，齐国丞相。推行改革，富国强兵，尊王攘夷，使齐桓公成为春秋首霸。被誉为"华夏第一相"。', external_refs: {} },
  { id: 24, name: '萧何', name_en: 'Xiao He', courtesy_name: '', birth_year: -257, death_year: -193, dynasty_id: 6, person_type: 'official', summary: '西汉开国功臣，镇国家、抚百姓。', description: '沛县人，西汉初年丞相。辅佐刘邦起兵，入关后收取秦朝律令图书，为汉朝制度建设奠定基础。', external_refs: {} },
  { id: 25, name: '魏征', name_en: 'Wei Zheng', courtesy_name: '玄成', birth_year: 580, death_year: 643, dynasty_id: 13, person_type: 'official', summary: '唐初名臣，以直谏著称。', description: '巨鹿人，唐太宗时谏议大夫。敢于犯颜直谏，前后谏言二百余事，被太宗比作一面镜子。', external_refs: {} },
  { id: 26, name: '房玄龄', name_en: 'Fang Xuanling', courtesy_name: '乔', birth_year: 579, death_year: 648, dynasty_id: 13, person_type: 'official', summary: '唐初名相，贞观之治的重要推手。', description: '齐州临淄人，唐太宗时宰相。善于谋略，与杜如晦并称"房谋杜断"，是贞观之治的核心人物。', external_refs: {} },
  { id: 27, name: '狄仁杰', name_en: 'Di Renjie', courtesy_name: '怀英', birth_year: 630, death_year: 700, dynasty_id: 13, person_type: 'official', summary: '武周时期名相，断案如神。', description: '并州太原人，武则天时期宰相。以断案公正著称，荐举张柬之等人才，为恢复李唐奠定基础。', external_refs: {} },
  { id: 28, name: '包拯', name_en: 'Bao Zheng', courtesy_name: '希仁', birth_year: 999, death_year: 1062, dynasty_id: 15, person_type: 'official', summary: '北宋名臣，铁面无私，人称包青天。', description: '庐州合肥人，以刚正不阿著称。任御史和开封府尹时执法如山，民间尊为"包青天"。', external_refs: {} },
  { id: 29, name: '海瑞', name_en: 'Hai Rui', courtesy_name: '汝贤', art_name: '刚峰', birth_year: 1514, death_year: 1587, dynasty_id: 18, person_type: 'official', summary: '明朝清官，刚正不阿，冒死上疏。', description: '海南琼山人，以清廉刚正著称。买棺上疏批评嘉靖帝，被誉"海青天"。', external_refs: {} },
  { id: 30, name: '林则徐', name_en: 'Lin Zexu', courtesy_name: '元抚', art_name: '少穆', birth_year: 1785, death_year: 1850, dynasty_id: 19, person_type: 'official', summary: '清朝名臣，虎门销烟，民族英雄。', description: '福建侯官人，任钦差大臣赴广东禁烟，虎门销烟。鸦片战争后被诬陷流放，是中国近代睁眼看世界的第一人。', external_refs: {} },
  { id: 63, name: '曹操', name_en: 'Cao Cao', courtesy_name: '孟德', art_name: '', birth_year: 155, death_year: 220, dynasty_id: 8, person_type: 'official', summary: '三国时期政治家、军事家、文学家，统一北方。', description: '沛国谯县人。挟天子以令诸侯，官渡之战击败袁绍，统一北方。善诗文，为建安文学代表。', external_refs: {} },
  // ---- 将领 (general) ----
  { id: 9, name: '安禄山', name_en: 'An Lushan', birth_year: 703, death_year: 757, dynasty_id: 13, person_type: 'general', summary: '安史之乱发动者，唐朝由盛转衰的转折点。', description: '营州柳城人，粟特族。身兼三镇节度使，起兵叛乱，攻陷洛阳、长安，建立大燕政权。后被其子安庆绪所杀。', external_refs: {} },
  { id: 10, name: '白起', name_en: 'Bai Qi', courtesy_name: '', birth_year: -332, death_year: -257, dynasty_id: 4, person_type: 'general', summary: '战国四大名将之首，长平之战坑杀赵军四十万。', description: '郿县人，秦国名将。一生大小七十余战未尝败绩，伊阙之战、鄢郢之战、长平之战均为经典战例。', external_refs: {} },
  { id: 31, name: '韩信', name_en: 'Han Xin', courtesy_name: '', birth_year: -231, death_year: -196, dynasty_id: 6, person_type: 'general', summary: '西汉开国名将，兵仙战神。', description: '淮阴人，初从项羽后归刘邦。明修栈道暗渡陈仓，背水一战破赵，十面埋伏围项羽，被誉为"兵仙"。', external_refs: {} },
  { id: 32, name: '卫青', name_en: 'Wei Qing', courtesy_name: '仲卿', birth_year: -140, death_year: -106, dynasty_id: 6, person_type: 'general', summary: '西汉名将，七击匈奴，收复河套。', description: '河东平阳人，汉武帝卫皇后之弟。出身卑微却战功赫赫，七次出击匈奴，收复河套地区，封长平侯。', external_refs: {} },
  { id: 33, name: '霍去病', name_en: 'Huo Qubing', courtesy_name: '', birth_year: -140, death_year: -117, dynasty_id: 6, person_type: 'general', summary: '西汉名将，封狼居胥，少年英雄。', description: '河东平阳人，卫青外甥。十七岁从军，六战六捷，封狼居胥山，禅于姑衍，年仅二十四岁病逝。', external_refs: {} },
  { id: 34, name: '岳飞', name_en: 'Yue Fei', courtesy_name: '鹏举', birth_year: 1103, death_year: 1142, dynasty_id: 16, person_type: 'general', summary: '南宋抗金名将，精忠报国。', description: '相州汤阴人，率岳家军北伐，屡败金军。被秦桧以"莫须有"罪名害死，后追谥武穆。', external_refs: {} },
  { id: 35, name: '戚继光', name_en: 'Qi Jiguang', courtesy_name: '元敬', art_name: '南塘', birth_year: 1528, death_year: 1588, dynasty_id: 18, person_type: 'general', summary: '明朝抗倭名将，创鸳鸯阵法。', description: '山东蓬莱人，在东南沿海抗击倭寇十余年，创立鸳鸯阵法，基本肃清倭患。后镇守蓟州，修筑长城。', external_refs: {} },
  // ---- 学者 (scholar) ----
  { id: 36, name: '孔子', name_en: 'Confucius', courtesy_name: '仲尼', birth_year: -551, death_year: -479, dynasty_id: 4, person_type: 'scholar', summary: '儒家学派创始人，万世师表。', description: '鲁国陬邑人，春秋末期思想家、教育家。创立儒学，倡导仁义礼智信，弟子三千，贤者七十二。其思想影响中国两千余年。', external_refs: {} },
  { id: 37, name: '老子', name_en: 'Laozi', courtesy_name: '', birth_year: -571, death_year: -471, dynasty_id: 4, person_type: 'scholar', summary: '道家学派创始人，著《道德经》。', description: '姓李名耳，字聃，楚国苦县人。道家学派创始人，著《道德经》五千言，主张无为而治，道法自然。', external_refs: {} },
  { id: 38, name: '墨子', name_en: 'Mozi', courtesy_name: '', birth_year: -468, death_year: -376, dynasty_id: 4, person_type: 'scholar', summary: '墨家学派创始人，主张兼爱非攻。', description: '名翟，鲁国人。创立墨家学派，主张兼爱、非攻、尚贤、节用，在逻辑学和力学方面亦有贡献。', external_refs: {} },
  { id: 39, name: '韩非子', name_en: 'Han Feizi', courtesy_name: '', birth_year: -280, death_year: -233, dynasty_id: 4, person_type: 'scholar', summary: '法家集大成者，著《韩非子》。', description: '韩国贵族，法家思想集大成者。综合商鞅之法、申不害之术、慎到之势，著《韩非子》。后入秦被李斯害死。', external_refs: {} },
  { id: 40, name: '董仲舒', name_en: 'Dong Zhongshu', courtesy_name: '', birth_year: -179, death_year: -104, dynasty_id: 6, person_type: 'scholar', summary: '西汉大儒，提出罢黜百家独尊儒术。', description: '广川人，西汉经学大师。向汉武帝建议"罢黜百家，独尊儒术"，使儒学成为官方意识形态。', external_refs: {} },
  { id: 41, name: '朱熹', name_en: 'Zhu Xi', courtesy_name: '元晦', art_name: '晦庵', birth_year: 1130, death_year: 1200, dynasty_id: 16, person_type: 'scholar', summary: '理学集大成者，影响中国思想数百年。', description: '徽州婺源人，南宋理学家。集理学之大成，建立完整的客观唯心主义体系，其学说成为元明清官方哲学。', external_refs: {} },
  { id: 42, name: '王阳明', name_en: 'Wang Yangming', courtesy_name: '伯安', art_name: '阳明', birth_year: 1472, death_year: 1529, dynasty_id: 18, person_type: 'scholar', summary: '心学集大成者，知行合一。', description: '名守仁，浙江余姚人。创立心学，提出"致良知"和"知行合一"，对后世影响深远。', external_refs: {} },
  { id: 48, name: '张衡', name_en: 'Zhang Heng', courtesy_name: '平子', birth_year: 78, death_year: 139, dynasty_id: 7, person_type: 'scholar', summary: '东汉科学家，发明地动仪和浑天仪。', description: '南阳西鄂人，天文学家、数学家、发明家。发明候风地动仪和浑天仪，在文学上亦有建树。', external_refs: {} },
  { id: 49, name: '祖冲之', name_en: 'Zu Chongzhi', courtesy_name: '文远', birth_year: 429, death_year: 500, dynasty_id: 11, person_type: 'scholar', summary: '南北朝数学家，精确计算圆周率。', description: '范阳郡遒县人，数学家、天文学家。将圆周率精确到小数点后第七位，领先世界近千年。', external_refs: {} },
  { id: 50, name: '沈括', name_en: 'Shen Kuo', courtesy_name: '存中', birth_year: 1031, death_year: 1095, dynasty_id: 15, person_type: 'scholar', summary: '北宋科学家，著《梦溪笔谈》。', description: '杭州钱塘人，博学家。著《梦溪笔谈》，涵盖天文、数学、物理、化学、地理等，被誉为中国科学史上的里程碑。', external_refs: {} },
  { id: 51, name: '郭守敬', name_en: 'Guo Shoujing', courtesy_name: '若思', birth_year: 1231, death_year: 1316, dynasty_id: 17, person_type: 'scholar', summary: '元朝天文学家，编制《授时历》。', description: '顺德邢台人，天文学家、数学家、水利专家。编制《授时历》，精度与现行公历相同但早三百年。', external_refs: {} },
  { id: 52, name: '宋应星', name_en: 'Song Yingxing', courtesy_name: '长庚', birth_year: 1587, death_year: 1666, dynasty_id: 18, person_type: 'scholar', summary: '明末科学家，著《天工开物》。', description: '江西奉新人，著《天工开物》，系统总结农业和手工业生产技术，被誉为中国17世纪的工艺百科全书。', external_refs: {} },
  { id: 65, name: '玄奘', name_en: 'Xuanzang', courtesy_name: '', art_name: '', birth_year: 602, death_year: 664, dynasty_id: 13, person_type: 'scholar', summary: '唐代高僧，西行求法，翻译佛经。', description: '俗姓陈，洛州缑氏人。贞观年间西行求法，历时十九年，带回佛经六百五十七部，翻译七十五部。著《大唐西域记》。', external_refs: {} },
  // ---- 文人艺术家 (artisan) ----
  { id: 43, name: '李白', name_en: 'Li Bai', courtesy_name: '太白', art_name: '青莲居士', birth_year: 701, death_year: 762, dynasty_id: 13, person_type: 'artisan', summary: '唐代伟大诗人，诗仙。', description: '字太白，号青莲居士，绵州昌隆人。浪漫主义诗人代表，诗风豪放飘逸，被誉为"诗仙"。', external_refs: {} },
  { id: 44, name: '杜甫', name_en: 'Du Fu', courtesy_name: '子美', art_name: '少陵野老', birth_year: 712, death_year: 770, dynasty_id: 13, person_type: 'artisan', summary: '唐代伟大诗人，诗圣。', description: '巩县人，现实主义诗人代表。诗风沉郁顿挫，反映社会现实，被誉为"诗圣"。', external_refs: {} },
  { id: 45, name: '苏轼', name_en: 'Su Shi', courtesy_name: '子瞻', art_name: '东坡居士', birth_year: 1037, death_year: 1101, dynasty_id: 15, person_type: 'artisan', summary: '北宋文学巨匠，诗词书画皆绝。', description: '眉州眉山人，号东坡居士。诗词文书画皆精，为唐宋八大家之一，豪放派词人代表。', external_refs: {} },
  { id: 46, name: '王羲之', name_en: 'Wang Xizhi', courtesy_name: '逸少', art_name: '', birth_year: 303, death_year: 361, dynasty_id: 10, person_type: 'artisan', summary: '东晋书法家，书圣。', description: '琅琊临沂人，官至右军将军。书法博采众长，自成一家，被誉为"书圣"。《兰亭集序》被称为天下第一行书。', external_refs: {} },
  { id: 47, name: '吴道子', name_en: 'Wu Daozi', courtesy_name: '', birth_year: 680, death_year: 759, dynasty_id: 13, person_type: 'artisan', summary: '唐代画家，画圣。', description: '阳翟人，唐代著名画家。擅长人物画，笔法流畅，衣褶飘举，被誉为"吴带当风"，尊为"画圣"。', external_refs: {} },
  // ---- 起义领袖 (other) ----
  { id: 53, name: '陈胜', name_en: 'Chen Sheng', courtesy_name: '涉', birth_year: -240, death_year: -208, dynasty_id: 5, person_type: 'other', summary: '秦末农民起义领袖，首举反秦大旗。', description: '阳城人，与吴广在大泽乡起义，提出"王侯将相宁有种乎"，建立张楚政权，虽失败但动摇了秦朝根基。', external_refs: {} },
  { id: 54, name: '吴广', name_en: 'Wu Guang', courtesy_name: '叔', birth_year: -240, death_year: -208, dynasty_id: 5, person_type: 'other', summary: '秦末农民起义领袖，与陈胜一同起事。', description: '阳夏人，与陈胜在大泽乡起义，后被部将田臧所杀。', external_refs: {} },
  { id: 55, name: '黄巢', name_en: 'Huang Chao', courtesy_name: '巨天', birth_year: 820, death_year: 884, dynasty_id: 13, person_type: 'other', summary: '唐末农民起义领袖，攻入长安称帝。', description: '曹州冤句人，盐商出身。率起义军转战大半个中国，880年攻入长安称帝，国号大齐，后兵败自刎。', external_refs: {} },
  { id: 56, name: '李自成', name_en: 'Li Zicheng', courtesy_name: '鸿基', birth_year: 1606, death_year: 1645, dynasty_id: 18, person_type: 'other', summary: '明末农民起义领袖，攻入北京推翻明朝。', description: '陕西米脂人，提出"均田免赋"口号。1644年攻入北京，推翻明朝，但很快被清军击败。', external_refs: {} },
  { id: 57, name: '洪秀全', name_en: 'Hong Xiuquan', courtesy_name: '', birth_year: 1814, death_year: 1864, dynasty_id: 19, person_type: 'other', summary: '太平天国运动领袖，创立拜上帝教。', description: '广东花县人，创立拜上帝教，1851年金田起义建立太平天国，定都天京。1864年天京陷落前病逝。', external_refs: {} },
  // ---- 夏朝人物 ----
  { id: 66, name: '禹', name_en: 'Yu the Great', courtesy_name: '', birth_year: -2200, death_year: -2061, dynasty_id: 1, person_type: 'emperor', summary: '夏朝建立者，治水英雄，划定九州，铸九鼎象征王权。', description: '姒姓，名文命，鲧之子。继承父业治理洪水，居外十三年三过家门而不入，以疏导之法平定水患。治水过程中划定九州，按各地土质制定贡赋等级，铸九鼎象征天下九牧之贡，成为王权正统的标志。舜死后即天子位，国号夏后，大会诸侯于涂山，开创中国第一个王朝。', external_refs: {} },
  { id: 67, name: '启', name_en: 'Qi of Xia', courtesy_name: '', birth_year: -2100, death_year: -2019, dynasty_id: 1, person_type: 'emperor', summary: '废除禅让制，确立家天下世袭制度。', description: '禹之子。禹死后本应由益继位，但诸侯皆朝启而不朝益，启遂即位。即位后有扈氏不服，启在甘之战中击败有扈氏，作《甘誓》以明军纪。由此废除禅让制，确立王位世袭制，"家天下"取代"公天下"，标志中国从原始社会进入私有制社会。', external_refs: {} },
  { id: 68, name: '太康', name_en: 'Taikang', courtesy_name: '', birth_year: -2050, death_year: -1990, dynasty_id: 1, person_type: 'emperor', summary: '夏朝第三任君主，因荒淫失国。', description: '启之子。生活荒淫，朝政松弛。外出打猎时被有穷氏首领后羿乘机夺取政权，史称太康失国。昆弟五人作《五子之歌》。', external_refs: {} },
  { id: 69, name: '少康', name_en: 'Shaokang', courtesy_name: '', birth_year: -1970, death_year: -1915, dynasty_id: 1, person_type: 'emperor', summary: '夏朝第六任君主，少康中兴，中国历史上第一次中兴。', description: '相之遗腹子，自幼在颠沛流离中成长。先为有仍氏牧正，遭寒浞追杀后逃至有虞氏任庖正，有虞氏以二姚妻之并赠以纶邑。少康在此招揽夏后氏遗民，广施德政收揽人心，又联络旧臣伯靡，以纶邑为基地积蓄力量。最终率军攻灭寒浞，夺回政权，恢复夏朝统治，史称"少康中兴"，是中国历史上第一次王朝复兴。', external_refs: {} },
  { id: 70, name: '桀', name_en: 'Jie of Xia', courtesy_name: '', birth_year: -1700, death_year: -1600, dynasty_id: 1, person_type: 'emperor', summary: '夏朝末代君主，暴虐无道，商汤灭夏。', description: '名履癸，夏末代王。统治残暴，杀忠臣关龙逢，扬言政权将与太阳同在。商汤在伊尹辅助下逐一剪除其羽翼，鸣条之战夏军大败，桀被流放南巢忧愤而死。', external_refs: {} },
  { id: 71, name: '后羿', name_en: 'Hou Yi', courtesy_name: '', birth_year: -2050, death_year: -1990, dynasty_id: 1, person_type: 'general', summary: '有穷氏首领，夺取夏政权的射日英雄。', description: '有穷氏首领。乘太康外出打猎夺取政权，史称太康失国。后被其臣子寒浞所杀。', external_refs: {} },
  { id: 72, name: '寒浞', name_en: 'Han Zhuo', courtesy_name: '', birth_year: -2040, death_year: -1948, dynasty_id: 1, person_type: 'general', summary: '杀后羿篡权，后被少康所灭。', description: '后羿之臣。杀后羿夺权，又派兵杀夏王相。后被少康攻灭。', external_refs: {} },
  // ---- 商朝人物 ----
  { id: 73, name: '盘庚', name_en: 'Pan Geng', courtesy_name: '', birth_year: -1340, death_year: -1270, dynasty_id: 2, person_type: 'emperor', summary: '迁都至殷，商朝复兴之君。', description: '商朝第十九位君主。面对九世之乱后的衰败，力排众议将国都迁至殷（今安阳），商朝由此复兴，故又称殷商。迁都后社会稳定，经济文化繁荣。', external_refs: {} },
  { id: 74, name: '武丁', name_en: 'Wu Ding', courtesy_name: '', birth_year: -1320, death_year: -1192, dynasty_id: 2, person_type: 'emperor', summary: '武丁中兴，在位五十九年，商朝鼎盛之君。', description: '商朝第二十三位君主。少时曾在民间劳作，深知百姓疾苦。即位后任用傅说为相，妇好为将，征伐四方，商朝达到鼎盛。甲骨文中大量卜辞记录其事迹。', external_refs: {} },
  { id: 75, name: '妇好', name_en: 'Fu Hao', courtesy_name: '', birth_year: -1300, death_year: -1200, dynasty_id: 2, person_type: 'general', summary: '武丁王后，中国最早的女将军，率军征伐四方。', description: '商王武丁之妻，中国历史上有据可查的第一位女性军事统帅。甲骨文记载她多次受命代商王征战，先后征伐土方、羌方、巴方、夷方等，战功赫赫。1976年殷墟妇好墓出土大量青铜器与玉器。', external_refs: {} },
  { id: 76, name: '商纣王', name_en: 'King Zhou of Shang', courtesy_name: '', birth_year: -1105, death_year: -1046, dynasty_id: 2, person_type: 'emperor', summary: '商朝末代暴君，牧野之战败亡。', description: '名受，又称帝辛。天资聪颖，武力过人，但荒淫暴虐。造酒池肉林，设炮烙之刑，杀比干、囚箕子。周武王率诸侯联军在牧野之战中击败商军，纣王自焚于鹿台，商朝灭亡。', external_refs: {} },
  { id: 77, name: '傅说', name_en: 'Fu Yue', courtesy_name: '', birth_year: -1330, death_year: -1240, dynasty_id: 2, person_type: 'official', summary: '武丁宰相，从版筑匠人到一代名相。', description: '原为傅险（今山西平陆）从事版筑的匠人。武丁梦得圣人，按图索骥找到傅说，举以为相。傅说辅佐武丁推行德政，商朝大治，史称武丁中兴。', external_refs: {} },
  { id: 78, name: '伊尹', name_en: 'Yi Yin', courtesy_name: '', birth_year: -1648, death_year: -1549, dynasty_id: 2, person_type: 'official', summary: '商汤宰相，辅佐五代商王，中华第一名相。', description: '名挚，原为有莘氏陪嫁奴隶，以烹饪之术喻治国之道，被商汤举用为相。辅佐商汤灭夏建商，后又辅佐外丙、中壬、太甲、沃丁四代商王。太甲无道，伊尹将其放逐桐宫，三年后太甲悔过还政。', external_refs: {} },
  // ---- 西周人物 ----
  { id: 79, name: '周公旦', name_en: 'Duke of Zhou', courtesy_name: '', birth_year: -1080, death_year: -1030, dynasty_id: 3, person_type: 'official', summary: '制礼作乐，营建洛邑，奠定周朝制度基础。', description: '姬姓，名旦，周文王第四子，周武王之弟。武王死后辅佐成王，平定三监之乱，制礼作乐，营建洛邑为东都，建立宗法分封制度，被后世尊为"元圣"。', external_refs: {} },
  { id: 80, name: '姜子牙', name_en: 'Jiang Ziya', courtesy_name: '尚', art_name: '太公望', birth_year: -1128, death_year: -1015, dynasty_id: 3, person_type: 'official', summary: '太公望，辅佐武王灭商，封于齐，兵家鼻祖。', description: '姜姓，吕氏，名尚，字子牙，号太公望。渭水垂钓遇文王，辅佐武王牧野之战灭商建周。受封于齐，为齐国始祖。被后世尊为兵家鼻祖和武圣。', external_refs: {} },
  { id: 81, name: '周幽王', name_en: 'King You of Zhou', courtesy_name: '', birth_year: -795, death_year: -771, dynasty_id: 3, person_type: 'emperor', summary: '烽火戏诸侯，犬戎入侵，西周灭亡。', description: '姬姓，名宫湦，西周末代君主。宠幸褒姒，烽火戏诸侯失信于天下。废申后及太子宜臼，立褒姒为后。申侯联合犬戎攻破镐京，幽王被杀于骊山下，西周灭亡。', external_refs: {} },
  // ---- 东周人物 ----
  { id: 82, name: '齐桓公', name_en: 'Duke Huan of Qi', courtesy_name: '', birth_year: -716, death_year: -643, dynasty_id: 4, person_type: 'emperor', summary: '春秋五霸之首，尊王攘夷，九合诸侯。', description: '姜姓，名小白。任用管仲为相，推行改革，富国强兵。以"尊王攘夷"为号召，九合诸侯一匡天下，成为春秋首霸。葵丘之会确立霸主地位。', external_refs: {} },
  { id: 83, name: '晋文公', name_en: 'Duke Wen of Jin', courtesy_name: '', birth_year: -671, death_year: -628, dynasty_id: 4, person_type: 'emperor', summary: '春秋五霸之一，城濮之战退避三舍击败楚军。', description: '姬姓，名重耳。流亡十九年后归国即位，城濮之战中以退避三舍之策大败楚军，践土之盟被周天子策命为侯伯，成为春秋第二位霸主。', external_refs: {} },
  { id: 84, name: '楚庄王', name_en: 'King Zhuang of Chu', courtesy_name: '', birth_year: -630, death_year: -591, dynasty_id: 4, person_type: 'emperor', summary: '春秋五霸之一，问鼎中原，一鸣惊人。', description: '芈姓，熊氏，名旅。即位初期沉湎声色，三年不鸣，一鸣惊人。问鼎中原，邲之战击败晋军，成为春秋霸主。', external_refs: {} },
  { id: 85, name: '孙武', name_en: 'Sun Wu', courtesy_name: '长卿', birth_year: -545, death_year: -470, dynasty_id: 4, person_type: 'general', summary: '兵圣，著《孙子兵法》，世界军事学经典。', description: '字长卿，齐国乐安人。避齐国内乱至吴国，被伍子胥荐于吴王阖闾。著《孙子兵法》十三篇，被誉为"兵学圣典"。率吴军西破强楚，北威齐晋。', external_refs: {} },
  { id: 86, name: '屈原', name_en: 'Qu Yuan', courtesy_name: '平', art_name: '', birth_year: -340, death_year: -278, dynasty_id: 4, person_type: 'scholar', summary: '楚国诗人，中国浪漫主义文学奠基人，投汨罗江殉国。', description: '芈姓，屈氏，名平，字原。楚怀王时任左徒，主张联齐抗秦，遭谗被逐。流放期间创作《离骚》《九歌》《天问》等不朽诗篇。前278年秦将白起攻破郢都，屈原悲愤投汨罗江殉国。端午节即源于纪念屈原。', external_refs: {} },
  { id: 87, name: '苏秦', name_en: 'Su Qin', courtesy_name: '季子', birth_year: -380, death_year: -284, dynasty_id: 4, person_type: 'official', summary: '纵横家，合纵六国抗秦，佩六国相印。', description: '东周洛阳人，纵横家代表人物。游说齐、楚、燕、韩、赵、魏六国合纵抗秦，佩六国相印，使秦兵不敢出函谷关十五年。后因齐国内争被刺杀身亡。', external_refs: {} },
  { id: 88, name: '张仪', name_en: 'Zhang Yi', courtesy_name: '', birth_year: -378, death_year: -309, dynasty_id: 4, person_type: 'official', summary: '纵横家，连横破纵事秦，瓦解六国联盟。', description: '魏国贵族后裔，纵横家代表人物。入秦为相，以连横之策瓦解苏秦合纵联盟，游说各国事秦。先后说服魏、楚、韩、齐、赵、燕与秦结盟，为秦国东进扫除障碍。', external_refs: {} },
  // ---- 秦汉人物 ----
  { id: 89, name: '项羽', name_en: 'Xiang Yu', courtesy_name: '籍', birth_year: -232, death_year: -202, dynasty_id: 5, person_type: 'general', summary: '西楚霸王，巨鹿之战破釜沉舟，垓下之战兵败自刎。', description: '名籍，字羽，下相人。楚国贵族之后，力能扛鼎。巨鹿之战破釜沉舟击败秦军主力，推翻秦朝。楚汉之争中虽屡战屡胜，但战略失误，垓下之战被围，自刎于乌江。', external_refs: {} },
  { id: 90, name: '司马迁', name_en: 'Sima Qian', courtesy_name: '子长', birth_year: -145, death_year: -86, dynasty_id: 6, person_type: 'scholar', summary: '西汉史学家，著《史记》，开创纪传体通史。', description: '夏阳人，西汉太史令。因替李陵辩护受宫刑，忍辱发愤著成《史记》，上起黄帝下至汉武帝，共一百三十篇，五十二万余字，被誉为"史家之绝唱，无韵之离骚"。', external_refs: {} },
  { id: 91, name: '蔡伦', name_en: 'Cai Lun', courtesy_name: '敬仲', birth_year: 61, death_year: 121, dynasty_id: 7, person_type: 'scholar', summary: '东汉宦官，改良造纸术，促进文明传播。', description: '桂阳郡耒阳人，东汉宦官。以树皮、麻头、破布、旧鱼网为原料改良造纸术，大大降低造纸成本，被称为"蔡侯纸"。造纸术为中国四大发明之一，对世界文明传播影响深远。', external_refs: {} },
  { id: 92, name: '班超', name_en: 'Ban Chao', courtesy_name: '仲升', birth_year: 32, death_year: 102, dynasty_id: 7, person_type: 'official', summary: '投笔从戎，经营西域三十年，重开丝绸之路。', description: '扶风安陵人，班彪之子，班固之弟。少时为人佣写，投笔叹曰"大丈夫无他志略，犹当效傅介子、张骞立功异域"。率三十六人出使西域，纵横捭阖三十年，恢复汉朝对西域的控制，重新打通丝绸之路。封定远侯。', external_refs: {} },
  { id: 93, name: '王莽', name_en: 'Wang Mang', courtesy_name: '巨君', birth_year: -45, death_year: 23, dynasty_id: 6, person_type: 'emperor', summary: '篡汉建新，推行复古改制，绿林赤眉起义中败亡。', description: '魏郡元城人，西汉外戚。公元8年代汉建新，推行王田制、私属制、币制等复古改制，史称"王莽改制"。改革脱离实际，天下大乱，绿林赤眉起义此起彼伏。23年新朝灭亡，王莽被杀。', external_refs: {} },
  // ---- 三国两晋南北朝人物 ----
  { id: 94, name: '关羽', name_en: 'Guan Yu', courtesy_name: '云长', birth_year: 160, death_year: 220, dynasty_id: 8, person_type: 'general', summary: '蜀汉名将，忠义化身，过五关斩六将。', description: '河东解县人，与刘备、张飞桃园结义。斩颜良诛文丑，过五关斩六将，水淹七军威震华夏。败走麦城被孙权所杀，后世尊为"武圣"。', external_refs: {} },
  { id: 95, name: '陶渊明', name_en: 'Tao Yuanming', courtesy_name: '元亮', art_name: '五柳先生', birth_year: 365, death_year: 427, dynasty_id: 10, person_type: 'scholar', summary: '东晋诗人，归隐田园，著《桃花源记》。', description: '浔阳柴桑人，一名潜。曾任彭泽县令，因不为五斗米折腰辞官归隐。创作《桃花源记》《归去来兮辞》等名篇，开创田园诗派，被誉为"隐逸诗人之宗"。', external_refs: {} },
  { id: 96, name: '谢安', name_en: 'Xie An', courtesy_name: '安石', birth_year: 320, death_year: 385, dynasty_id: 10, person_type: 'official', summary: '东晋名相，淝水之战运筹帷幄，以少胜多。', description: '陈郡阳夏人。早年隐居东山，四十余岁出仕。前秦苻坚率百万大军南下，谢安镇定自若，指挥谢玄率北府兵在淝水之战中以八万击败前秦百万大军，保全东晋。', external_refs: {} },
  // ---- 隋唐人物 ----
  { id: 97, name: '隋炀帝', name_en: 'Emperor Yang of Sui', courtesy_name: '', birth_year: 569, death_year: 618, dynasty_id: 12, person_type: 'emperor', summary: '隋朝第二位皇帝，开凿大运河，三征高句丽，因暴政导致隋亡。', description: '杨广，弘农华阴人。在位期间营建东都洛阳，开凿大运河贯通南北，三征高句丽耗尽国力。骄奢淫逸，民不聊生，各地起义蜂起，最终被宇文化及缢杀于江都。', external_refs: {} },
  { id: 98, name: '唐玄宗', name_en: 'Emperor Xuanzong of Tang', courtesy_name: '', birth_year: 685, death_year: 762, dynasty_id: 13, person_type: 'emperor', summary: '开创开元盛世，晚年宠信杨贵妃导致安史之乱。', description: '李隆基，唐朝第七位皇帝。前期励精图治，开创开元盛世，唐朝达到鼎盛。后期宠幸杨贵妃，任用李林甫、杨国忠，朝政腐败，安史之乱爆发后逃往蜀地，退位为太上皇。', external_refs: {} },
  { id: 99, name: '杨贵妃', name_en: 'Yang Guifei', courtesy_name: '', birth_year: 719, death_year: 756, dynasty_id: 13, person_type: 'artisan', summary: '四大美人之一，唐玄宗宠妃，马嵬坡之变中被赐死。', description: '名杨玉环，号太真，蒲州永乐人。姿质丰艳，善歌舞通音律。先为寿王妃，后入宫得玄宗宠爱，封贵妃。安史之乱中随玄宗逃蜀，马嵬坡禁军哗变，被赐死，年仅三十八岁。', external_refs: {} },
  { id: 100, name: '史思明', name_en: 'Shi Siming', courtesy_name: '', birth_year: 703, death_year: 761, dynasty_id: 13, person_type: 'general', summary: '安史之乱叛军首领之一，继安禄山之后称帝。', description: '宁夷州人，突厥族。与安禄山同为范阳节度使部将，安史之乱中率军南下攻城略地。安禄山被杀后自立为帝，后被子史朝义所杀。', external_refs: {} },
  { id: 101, name: '郭子仪', name_en: 'Guo Ziyi', courtesy_name: '', birth_year: 697, death_year: 781, dynasty_id: 13, person_type: 'general', summary: '平定安史之乱的首功之臣，中兴名将。', description: '华州郑县人。安史之乱爆发后任朔方节度使，率军收复长安、洛阳，为平乱首功之臣。后又平定仆固怀恩之乱，一生戎马，功高盖世而不遭猜忌，寿终正寝。', external_refs: {} },
  { id: 102, name: '文成公主', name_en: 'Princess Wencheng', courtesy_name: '', birth_year: 625, death_year: 680, dynasty_id: 13, person_type: 'other', summary: '唐宗室女，入藏和亲，促进汉藏文化交流。', description: '唐宗室女，641年奉唐太宗之命入藏嫁给吐蕃赞普松赞干布。带去大量书籍、工匠、种子和医药，传授中原的纺织、耕种、建筑等技术，深受吐蕃人民爱戴，汉藏文化交流由此大增。', external_refs: {} },
  // ---- 宋朝人物 ----
  { id: 103, name: '宋高宗', name_en: 'Emperor Gaozong of Song', courtesy_name: '', birth_year: 1107, death_year: 1187, dynasty_id: 16, person_type: 'emperor', summary: '南宋开国皇帝，南渡建南宋，偏安江南。', description: '赵构，宋徽宗第九子。靖康之变后在应天府即位，重建宋朝政权，史称南宋。重用秦桧，与金议和，杀害岳飞，偏安江南。绍兴和议后向金称臣，长期奉行妥协求和政策。', external_refs: {} },
  { id: 104, name: '秦桧', name_en: 'Qin Hui', courtesy_name: '会之', birth_year: 1090, death_year: 1155, dynasty_id: 16, person_type: 'official', summary: '南宋奸臣，以"莫须有"罪名害死岳飞。', description: '江宁人，南宋宰相。靖康之变中被俘北去，后南归。主张对金议和，排挤主战派。以"莫须有"罪名陷害岳飞，与金签订绍兴和议，向金称臣纳贡。后世人将其铸铁跪像置于岳飞墓前，永世受唾。', external_refs: {} },
  { id: 105, name: '文天祥', name_en: 'Wen Tianxiang', courtesy_name: '宋瑞', art_name: '文山', birth_year: 1236, death_year: 1283, dynasty_id: 16, person_type: 'official', summary: '南宋末年抗元名臣，"人生自古谁无死，留取丹心照汗青"。', description: '吉州庐陵人，南宋状元。元军南下时散尽家财起兵勤王，兵败被俘。在狱中作《正气歌》《过零丁洋》，留下"人生自古谁无死，留取丹心照汗青"千古名句。拒绝元朝招降，从容就义。', external_refs: {} },
  { id: 106, name: '辛弃疾', name_en: 'Xin Qiji', courtesy_name: '幼安', art_name: '稼轩', birth_year: 1140, death_year: 1207, dynasty_id: 16, person_type: 'artisan', summary: '南宋爱国词人，豪放派代表，"醉里挑灯看剑"。', description: '历城人，字幼安，号稼轩。少年时聚众抗金，后南归南宋。一生力主北伐收复中原，屡遭主和派排挤。词风豪放悲壮，与苏轼并称"苏辛"，代表作有《破阵子·醉里挑灯看剑》《水龙吟·登建康赏心亭》等。', external_refs: {} },
  { id: 107, name: '李清照', name_en: 'Li Qingzhao', courtesy_name: '', art_name: '易安居士', birth_year: 1084, death_year: 1155, dynasty_id: 15, person_type: 'artisan', summary: '宋代女词人，婉约派代表，"寻寻觅觅冷冷清清"。', description: '济南人，号易安居士。中国历史上最伟大的女词人，婉约词派代表。前期词作清新婉丽，后期因靖康之变流离失所，词风转为沉郁悲凉。代表作有《声声慢·寻寻觅觅》《一剪梅·红藕香残玉簟秋》等。', external_refs: {} },
  { id: 108, name: '司马光', name_en: 'Sima Guang', courtesy_name: '君实', art_name: '涑水先生', birth_year: 1019, death_year: 1086, dynasty_id: 15, person_type: 'scholar', summary: '北宋政治家、史学家，主编《资治通鉴》。', description: '陕州夏县人，北宋名臣。历时十九年主编编年体通史《资治通鉴》，上起周威烈王下至五代，共二百九十四卷，为史学巨著。政治上反对王安石变法，任宰相后尽废新法。', external_refs: {} },
  { id: 109, name: '毕昇', name_en: 'Bi Sheng', courtesy_name: '', birth_year: 970, death_year: 1051, dynasty_id: 15, person_type: 'scholar', summary: '北宋发明家，发明活字印刷术。', description: '蕲州蕲水人，北宋布衣。约1040年发明胶泥活字印刷术，比欧洲古腾堡活字印刷早约四百年。活字印刷术为中国四大发明之一，对世界文明传播产生深远影响。', external_refs: {} },
  // ---- 元朝人物 ----
  { id: 110, name: '马可波罗', name_en: 'Marco Polo', courtesy_name: '', birth_year: 1254, death_year: 1324, dynasty_id: 17, person_type: 'other', summary: '意大利旅行家，游历中国十七年，著《马可波罗游记》。', description: '威尼斯商人家庭出身。1271年随父叔东行，1275年到达元朝大都，受到忽必烈接见。在华十七年间游历中国各地，曾任元朝官职。1295年返回威尼斯，口述《马可波罗游记》，向欧洲展示了东方的富庶与文明，激起欧洲人对东方的向往。', external_refs: {} },
  { id: 111, name: '关汉卿', name_en: 'Guan Hanqing', courtesy_name: '', art_name: '已斋', birth_year: 1219, death_year: 1301, dynasty_id: 17, person_type: 'artisan', summary: '元曲大家，被誉为"曲圣"，代表作《窦娥冤》。', description: '号已斋，大都人。元杂剧奠基人，一生创作杂剧六十余种，现存十八种。代表作《窦娥冤》为元杂剧巅峰之作，描写窦娥含冤而死、六月飞雪的悲剧，深刻揭露社会黑暗。与白朴、马致远、郑光祖并称"元曲四大家"。', external_refs: {} },
  { id: 112, name: '黄道婆', name_en: 'Huang Daopo', courtesy_name: '', birth_year: 1245, death_year: 1330, dynasty_id: 17, person_type: 'other', summary: '棉纺织技术革新者，革新纺车与织布技术，推动松江棉纺织业发展。', description: '松江乌泥泾人。少年时流落崖州，向黎族妇女学习棉纺织技术。约1295年返回故乡，革新捍、弹、纺、织全套棉纺织工具，发明三锭脚踏纺车，大大提高纺纱效率。松江一带棉纺织业由此兴盛，"衣被天下"，对中国棉纺织业发展贡献巨大。', external_refs: {} },
  // ---- 明朝人物 ----
  { id: 113, name: '明成祖', name_en: 'Emperor Chengzu of Ming', courtesy_name: '', birth_year: 1360, death_year: 1424, dynasty_id: 18, person_type: 'emperor', summary: '永乐大帝，靖难之役夺位，迁都北京，编《永乐大典》，遣郑和下西洋。', description: '朱棣，明太祖第四子，初封燕王，就藩北平。以"清君侧"为名发动靖难之役，经四年战争夺取帝位。在位期间迁都北京，营建紫禁城，编修《永乐大典》，五次亲征蒙古，派郑和七下西洋，开创永乐盛世。', external_refs: {} },
  { id: 114, name: '明世宗', name_en: 'Emperor Shizong of Ming', courtesy_name: '', birth_year: 1507, death_year: 1567, dynasty_id: 18, person_type: 'emperor', summary: '嘉靖帝，大礼议争议，长期修道不上朝，严嵩专权。', description: '朱厚熜，明宪宗之孙，兴献王之子。正德帝无嗣，以藩王入继大统。即位后发动"大礼议"，追尊生父为帝，打压旧臣。在位四十五年，前期尚有作为，中后期沉迷修道炼丹，长期不上朝，严嵩专权乱政，倭寇侵扰沿海。', external_refs: {} },
  { id: 115, name: '明思宗', name_en: 'Emperor Sizong of Ming', courtesy_name: '', birth_year: 1611, death_year: 1644, dynasty_id: 18, person_type: 'emperor', summary: '崇祯帝，明朝末代皇帝，勤政却多疑，内忧外患中自缢煤山。', description: '朱由检，明光宗第五子。天启帝无嗣，以信王即位。即位后铲除魏忠贤阉党，力图振兴，但性格多疑，频繁更换内阁。内有农民起义，外有后金入侵，加征三饷加重民困。1644年李自成攻入北京，崇祯帝自缢于煤山，明朝灭亡。', external_refs: {} },
  { id: 116, name: '张居正', name_en: 'Zhang Juzheng', courtesy_name: '叔大', art_name: '太岳', birth_year: 1525, death_year: 1582, dynasty_id: 18, person_type: 'official', summary: '明朝首辅，推行一条鞭法与万历新政，力挽狂澜。', description: '湖广江陵人，字叔大，号太岳。万历初年任内阁首辅，辅佐年幼的万历帝推行改革。清丈田亩，推行一条鞭法，简化赋役制度，增加国库收入。整顿吏治，实行考成法，加强边防。在位十年，明朝国力大为增强，史称"万历新政"。死后被清算，家产被抄。', external_refs: {} },
  { id: 117, name: '李时珍', name_en: 'Li Shizhen', courtesy_name: '东璧', art_name: '濒湖', birth_year: 1518, death_year: 1593, dynasty_id: 18, person_type: 'scholar', summary: '明代医药学家，著《本草纲目》，中国医药学巨著。', description: '蕲州人，字东璧，号濒湖。出身医学世家，继承父业行医。历时二十七年，三易其稿，著成《本草纲目》五十二卷，收录药物一千八百九十二种，附方一万一千余首，附图一千一百余幅。该书系统总结了中国古代药物学成就，被誉为"东方药物巨典"，被译为多种文字传播世界。', external_refs: {} },
  // ---- 清朝人物 ----
  { id: 118, name: '雍正帝', name_en: 'Emperor Yongzheng', courtesy_name: '', birth_year: 1678, death_year: 1735, dynasty_id: 19, person_type: 'emperor', summary: '承上启下的勤政之君，推行摊丁入亩、改土归流，充实国库。', description: '爱新觉罗·胤禛，康熙帝第四子。九子夺嫡中胜出即位，在位十三年勤于政事，日理万机。推行摊丁入亩将人头税并入地税，改土归流废除西南土司制度，设军机处加强皇权，整顿吏治严惩贪腐。国库由空虚转为充盈，为乾隆盛世奠定经济基础。', external_refs: {} },
  { id: 119, name: '慈禧太后', name_en: 'Empress Dowager Cixi', courtesy_name: '', birth_year: 1835, death_year: 1908, dynasty_id: 19, person_type: 'other', summary: '晚清实际统治者，垂帘听政近半个世纪，顽固守旧误国。', description: '叶赫那拉氏，满洲镶蓝旗人。咸丰帝妃嫔，同治帝生母。辛酉政变后垂帘听政，先后控制同治、光绪两朝。期间虽有洋务运动，但扼杀戊戌变法，挪用海军经费修颐和园，庚子国变后仍把持朝政。其专权保守使中国错失近代化机遇，加速清朝衰亡。', external_refs: {} },
  { id: 120, name: '曾国藩', name_en: 'Zeng Guofan', courtesy_name: '伯涵', art_name: '涤生', birth_year: 1811, death_year: 1872, dynasty_id: 19, person_type: 'official', summary: '晚清名臣，创建湘军镇压太平天国，倡导洋务运动。', description: '湖南湘乡人，道光进士。太平天国起事后在籍办团练，创建湘军，以"结硬寨打呆仗"之法经十余年苦战攻灭太平天国。后任两江总督，倡导洋务，创办安庆内军械所、江南制造总局，派遣首批留美幼童。被誉为晚清"中兴名臣"之首。', external_refs: {} },
  { id: 121, name: '李鸿章', name_en: 'Li Hongzhang', courtesy_name: '少荃', art_name: '', birth_year: 1823, death_year: 1901, dynasty_id: 19, person_type: 'official', summary: '晚清重臣，洋务运动核心人物，创办北洋水师，签订多项条约。', description: '安徽合肥人，道光进士。师从曾国藩，创建淮军镇压太平天国。后任直隶总督兼北洋大臣，主导洋务运动三十年，创办江南制造总局、轮船招商局、开平矿务局等近代企业，建立北洋水师。甲午战败后代表清廷签订《马关条约》《辛丑条约》等，被称为"卖国贼"，亦有"裱糊匠"之叹。', external_refs: {} },
  { id: 122, name: '左宗棠', name_en: 'Zuo Zongtang', courtesy_name: '季高', art_name: '', birth_year: 1812, death_year: 1885, dynasty_id: 19, person_type: 'official', summary: '晚清名臣，抬棺出征收复新疆，捍卫西北疆土。', description: '湖南湘阴人，举人出身。参与镇压太平天国，后任陕甘总督。1876年率军西征收复新疆，击败阿古柏政权，迫使沙俄归还伊犁。力主新疆建省，巩固西北边防。中法战争期间督办福建军务，病逝于福州。与曾国藩、李鸿章、张之洞并称"晚清四大名臣"。', external_refs: {} },
  { id: 123, name: '孙中山', name_en: 'Sun Yat-sen', courtesy_name: '载之', art_name: '逸仙', birth_year: 1866, death_year: 1925, dynasty_id: 19, person_type: 'other', summary: '中国民主革命先行者，推翻帝制，建立民国。', description: '广东香山人，名文，字载之，号逸仙。早年在海外宣传革命，创立兴中会、同盟会，提出"民族、民权、民生"三民主义。多次发动武装起义均告失败，1911年武昌起义成功后归国被选为中华民国临时大总统。毕生致力于国民革命，"革命尚未成功，同志仍须努力"。', external_refs: {} },
  { id: 124, name: '袁世凯', name_en: 'Yuan Shikai', courtesy_name: '慰亭', art_name: '容庵', birth_year: 1859, death_year: 1916, dynasty_id: 19, person_type: 'official', summary: '北洋军阀首领，窃取辛亥革命果实，复辟帝制失败。', description: '河南项城人。小站练兵编练北洋新军，形成北洋军阀集团。辛亥革命时逼清帝退位，窃取中华民国大总统之位。1915年称帝改元洪宪，遭全国反对，八十三天后被迫取消帝制，不久病逝。', external_refs: {} },
  // ---- 新增人物：女性/宗教/科技/商贸等 ----
  // 女性
  { id: 125, name: '妲己', name_en: 'Daji', courtesy_name: '', birth_year: -1100, death_year: -1046, dynasty_id: 2, person_type: 'other', summary: '商纣王宠妃，传说中以美色祸国。', description: '有苏氏之女，商纣王帝辛之宠妃。传说中她美艳绝伦，怂恿纣王荒淫暴虐，造炮烙之刑，设酒池肉林。武王伐纣后，妲己被斩首示众。后世以"红颜祸水"称之，其形象在《封神演义》中被神化为狐妖。', external_refs: {} },
  { id: 126, name: '褒姒', name_en: 'Bao Si', courtesy_name: '', birth_year: -790, death_year: -771, dynasty_id: 3, person_type: 'other', summary: '周幽王宠妃，烽火戏诸侯致西周灭亡。', description: '褒国人，周幽王宠妃。传说不爱笑，幽王为博其一笑，点燃烽火谎报军情，诸侯急驰救驾却发现被骗。后犬戎真的入侵时，烽火再燃而诸侯不至，幽王被杀于骊山下，西周灭亡。', external_refs: {} },
  { id: 127, name: '西施', name_en: 'Xi Shi', courtesy_name: '', birth_year: -506, death_year: -420, dynasty_id: 4, person_type: 'other', summary: '四大美人之一，卧薪尝胆故事中的关键人物。', description: '名施，春秋末期越国苎萝山下浣纱女。越国败于吴国后，越王勾践献西施于吴王夫差，以美色惑其心智。西施入吴后深得夫差宠爱，吴王沉迷声色荒废国政，越国趁机休养生息，终灭吴国。西施被誉为四大美人之首。', external_refs: {} },
  { id: 128, name: '吕后', name_en: 'Empress Lü', courtesy_name: '', birth_year: -241, death_year: -180, dynasty_id: 6, person_type: 'emperor', summary: '汉高祖皇后，中国历史上第一位临朝称制的女性。', description: '名雉，单父人，刘邦之妻。助刘邦杀韩信、彭越等功臣。刘邦死后惠帝即位，吕后掌握朝政。惠帝死后临朝称制，分封吕氏子弟为王，开启外戚专权先例。其执政期间继续推行与民休息政策，天下太平。', external_refs: {} },
  { id: 129, name: '王昭君', name_en: 'Wang Zhaojun', courtesy_name: '嫱', birth_year: -52, death_year: 15, dynasty_id: 6, person_type: 'other', summary: '四大美人之一，昭君出塞和亲，促进汉匈和平。', description: '名嫱，字昭君，西汉南郡秭归人。汉元帝时入宫，因不肯贿赂画师毛延寿而被画丑，不得见帝。后匈奴呼韩邪单于来朝求亲，昭君自请出塞和亲。入匈奴后封宁胡阏氏，促进汉匈和平数十年，边塞安宁，百姓免遭战乱之苦。', external_refs: {} },
  { id: 130, name: '貂蝉', name_en: 'Diao Chan', courtesy_name: '', birth_year: 170, death_year: 220, dynasty_id: 8, person_type: 'other', summary: '四大美人之一，连环计离间董卓吕布。', description: '传说为司徒王允义女，四大美人之一。董卓专权乱政，王允设连环计，先将貂蝉许给吕布，再献给董卓，貂蝉周旋于二人之间挑拨离间，最终促使吕布杀死董卓。其事主要见于《三国演义》，正史中并无此人。', external_refs: {} },
  { id: 131, name: '花木兰', name_en: 'Hua Mulan', courtesy_name: '', birth_year: 420, death_year: 500, dynasty_id: 11, person_type: 'general', summary: '代父从军的女英雄，巾帼不让须眉。', description: '北魏人，据《木兰辞》记载，因父老弟幼，女扮男装代父从军，征战十二年屡立战功。凯旋后不愿为官，但求还乡侍亲。其事迹虽史书无明确记载，但木兰代父从军的故事广为流传，成为中国女性勇敢坚韧精神的象征。', external_refs: {} },
  { id: 147, name: '班昭', name_en: 'Ban Zhao', courtesy_name: '惠班', art_name: '曹大家', birth_year: 45, death_year: 117, dynasty_id: 7, person_type: 'scholar', summary: '东汉女史学家，续成《汉书》，著《女诫》。', description: '字惠班，扶风安陵人，班彪之女，班固、班超之妹。兄班固著《汉书》未竟而卒，班昭奉旨续成八表与天文志。和帝时入宫为皇后及妃嫔教师，人称"曹大家"。著有《女诫》七篇，对后世女性规范影响深远，但也饱受争议。是中国历史上第一位女历史学家。', external_refs: {} },
  { id: 148, name: '上官婉儿', name_en: 'Shangguan Wan\'er', courtesy_name: '', birth_year: 664, death_year: 710, dynasty_id: 13, person_type: 'artisan', summary: '唐代才女，武则天时期女官，称"巾帼宰相"。', description: '陕州陕县人，上官仪之孙女。祖父获罪被杀，婉儿随母没入掖庭。因才华出众被武则天赏识，掌管宫中诏命多年。中宗时封昭容，专掌制命，权势显赫，称"巾帼宰相"。主持风雅，品评诗文，对初唐文学发展有推动作用。唐隆政变中被杀。', external_refs: {} },
  // 宗教/哲学人物
  { id: 132, name: '达摩', name_en: 'Bodhidharma', courtesy_name: '', birth_year: 470, death_year: 530, dynasty_id: 10, person_type: 'other', summary: '禅宗初祖，来华传法，面壁九年。', description: '南天竺人，婆罗门种姓。梁武帝时来华，因与武帝话不投机，渡江北上至嵩山少林寺，面壁九年，终日默然。传法于慧可，为禅宗初祖。创少林武术，被尊为中华武术之源。其"直指人心，见性成佛"的禅法对中国佛教影响深远。', external_refs: {} },
  { id: 133, name: '鉴真', name_en: 'Jianzhen', courtesy_name: '', birth_year: 688, death_year: 763, dynasty_id: 13, person_type: 'other', summary: '唐代高僧，六次东渡日本传法，为中日文化交流做出巨大贡献。', description: '俗姓淳于，扬州江阳人。受日本僧人邀请东渡传法，前五次均因风暴等原因失败，第五次更双目失明。753年第六次东渡终于成功抵达日本，被尊为日本律宗初祖。带去大量佛经、医药、建筑、雕塑等文化技术，主持修建唐招提寺，对日本文化影响深远。', external_refs: {} },
  { id: 134, name: '丘处机', name_en: 'Qiu Chuji', courtesy_name: '通密', art_name: '长春子', birth_year: 1148, death_year: 1227, dynasty_id: 17, person_type: 'scholar', summary: '全真教掌教，西行万里见成吉思汗，劝其止杀爱民。', description: '字通密，号长春子，登州栖霞人。全真教王重阳弟子，全真七子之一。1220年率弟子西行万里，在大雪山觐见成吉思汗，劝其"敬天爱民""减少屠杀""清心寡欲"，成吉思汗深为敬重，称其为"神仙"。后受命掌管天下道教，全真教由此大兴。', external_refs: {} },
  // 科学家/发明家
  { id: 135, name: '华佗', name_en: 'Hua Tuo', courtesy_name: '元化', birth_year: 145, death_year: 208, dynasty_id: 8, person_type: 'scholar', summary: '外科圣手，发明麻沸散，创五禽戏。', description: '字元化，沛国谯人。东汉末年名医，精通内、外、妇、儿各科，尤擅外科手术。发明麻沸散为病人麻醉后施行手术，创五禽戏模仿虎鹿熊猿鸟动作以强身健体。曾为关羽刮骨疗毒，后因不愿专为曹操治头痛而被下狱杀害。临死前将医书赠狱吏，却被狱吏之妻焚毁，仅余部分。', external_refs: {} },
  { id: 136, name: '一行', name_en: 'Yixing', courtesy_name: '', birth_year: 683, death_year: 727, dynasty_id: 13, person_type: 'scholar', summary: '唐代僧人天文学家，编制《大衍历》，主持世界上首次子午线测量。', description: '俗姓张，名遂，魏州昌乐人。自幼聪颖，精通天文历法。出家为僧后，奉唐玄宗命主持修历，编制《大衍历》，精度远超前代。主持世界上首次子午线长度实测，测量从河南滑县到上蔡的距离和北极星高度差，推算出子午线一度的长度。同时在天文仪器制造方面也有重要贡献。', external_refs: {} },
  { id: 137, name: '徐光启', name_en: 'Xu Guangqi', courtesy_name: '子先', art_name: '玄扈', birth_year: 1562, death_year: 1633, dynasty_id: 18, person_type: 'scholar', summary: '明末科学家，著《农政全书》，推动西学东渐。', description: '字子先，号玄扈，上海人。明末科学家、农学家、政治家。与意大利传教士利玛窦合作翻译《几何原本》，为西方数学传入中国之始。著《农政全书》六十卷，系统总结中国农学成就。引进西方天文历法知识，参与修订《崇祯历书》。是中国近代科学的先驱，中西文化交流的桥梁。', external_refs: {} },
  // 工匠/艺术家
  { id: 138, name: '鲁班', name_en: 'Lu Ban', courtesy_name: '', birth_year: -507, death_year: -444, dynasty_id: 4, person_type: 'artisan', summary: '木匠祖师，发明锯子、刨子等工具，百工之祖。', description: '公输姓，名般，鲁国人，又称公输般。春秋末期著名工匠，被后世尊为木匠祖师。传说发明了锯子、刨子、墨斗、曲尺等木工工具，还发明了云梯用于攻城。其技艺精湛，被楚王聘用制造攻城器械，被墨子以守城之术劝止。后世木匠行业奉其为祖师爷，"班门弄斧"成语即源于此。', external_refs: {} },
  { id: 150, name: '顾恺之', name_en: 'Gu Kaizhi', courtesy_name: '长康', art_name: '虎头', birth_year: 348, death_year: 409, dynasty_id: 10, person_type: 'artisan', summary: '东晋画家，中国画祖，"传神写照，正在阿堵中"。', description: '字长康，小字虎头，无锡人。东晋著名画家，与曹不兴、陆探微、张僧繇并称"六朝四大家"。擅长人物画，提出"传神写照"理论，强调画人物重在眼神。代表作《洛神赋图》《女史箴图》为中国绘画经典。博学多才，人称"才绝、画绝、痴绝"。', external_refs: {} },
  { id: 151, name: '陆羽', name_en: 'Lu Yu', courtesy_name: '鸿渐', art_name: '竟陵子', birth_year: 733, death_year: 804, dynasty_id: 13, person_type: 'artisan', summary: '茶圣，著《茶经》，中国茶文化奠基人。', description: '字鸿渐，号竟陵子，复州竟陵人。幼时被遗弃于湖畔，被龙盖寺智积禅师收养。一生嗜茶，精于茶道，历时十余年著成《茶经》三卷，系统论述茶的起源、采制、烹饮之法，为世界第一部茶学专著。被后世尊为"茶圣"，对中国及世界茶文化影响深远。', external_refs: {} },
  // 关键缺失人物
  { id: 139, name: '司马懿', name_en: 'Sima Yi', courtesy_name: '仲达', birth_year: 179, death_year: 251, dynasty_id: 8, person_type: 'official', summary: '魏国权臣，隐忍数十年，为司马氏代魏奠定基础。', description: '河内温县人，字仲达。初为曹操文学掾，以隐忍著称。与诸葛亮对峙于五丈原，以坚守不战耗死诸葛亮。曹芳即位后与曹爽共同辅政，249年发动高平陵之变诛杀曹爽，夺取魏国大权。其孙司马炎后篡魏建晋，追尊司马懿为晋宣帝。', external_refs: {} },
  { id: 140, name: '赵云', name_en: 'Zhao Yun', courtesy_name: '子龙', birth_year: 168, death_year: 229, dynasty_id: 8, person_type: 'general', summary: '蜀汉五虎将之一，长坂坡单骑救主，忠勇无双。', description: '字子龙，常山真定人。初从公孙瓒，后归刘备。长坂坡之战中，刘备败走，赵云单骑冲入曹军重围，救出幼主刘禅，一战成名。汉水之战以寡敌众，被刘备赞为"子龙一身都是胆也"。一生忠勇，为蜀汉五虎将之一。', external_refs: {} },
  { id: 141, name: '范仲淹', name_en: 'Fan Zhongyan', courtesy_name: '希文', birth_year: 989, death_year: 1052, dynasty_id: 15, person_type: 'official', summary: '北宋名臣，庆历新政推行者，"先天下之忧而忧"。', description: '字希文，苏州吴县人。北宋政治家、文学家。任参知政事时推行庆历新政，改革吏治、兴办学校、减轻徭役。新政虽遭保守派反对而失败，但其改革精神影响深远。其《岳阳楼记》中"先天下之忧而忧，后天下之乐而乐"成为千古名句，激励无数仁人志士。', external_refs: {} },
  { id: 142, name: '郑成功', name_en: 'Zheng Chenggong', courtesy_name: '明俨', art_name: '大木', birth_year: 1624, death_year: 1662, dynasty_id: 18, person_type: 'general', summary: '收复台湾，驱逐荷兰殖民者，民族英雄。', description: '本名森，福建南安人。郑芝龙之子，南明赐姓朱，故称"国姓爷"。清军入闽后其父降清，郑成功坚持抗清，以金门、厦门为基地。1661年率军东征台湾，经九个月围攻驱逐荷兰殖民者，收复台湾。次年在台湾病逝，年仅三十九岁。', external_refs: {} },
  { id: 143, name: '和珅', name_en: 'Heshen', courtesy_name: '致斋', birth_year: 1750, death_year: 1799, dynasty_id: 19, person_type: 'official', summary: '清朝巨贪，乾隆宠臣，贪墨之巨震惊天下。', description: '钮祜禄氏，字致斋，满洲正红旗人。以才学得乾隆帝赏识，官至文华殿大学士、军机大臣。在位二十余年聚敛巨额财富，据传抄家时查获财产折合白银八亿两至十一亿两，相当于清廷十五年财政收入，故有"和珅跌倒，嘉庆吃饱"之说。乾隆死后被嘉庆帝赐自尽。', external_refs: {} },
  { id: 144, name: '纪晓岚', name_en: 'Ji Xiaolan', courtesy_name: '晓岚', art_name: '春帆', birth_year: 1724, death_year: 1805, dynasty_id: 19, person_type: 'scholar', summary: '四库全书总纂官，清代大学者。', description: '名昀，字晓岚，号春帆，直隶献县人。乾隆年间进士，官至礼部尚书、协办大学士。奉旨总纂《四库全书》，历时十余年，收录图书三千四百余种，近八万卷，为中国古代最大丛书。本人学识渊博，著有《阅微草堂笔记》，与和珅的争斗故事广为流传。', external_refs: {} },
  // 商人/经济人物
  { id: 145, name: '范蠡', name_en: 'Fan Li', courtesy_name: '少伯', art_name: '陶朱公', birth_year: -536, death_year: -448, dynasty_id: 4, person_type: 'official', summary: '辅佐越王勾践灭吴，功成身退，经商致富称陶朱公。', description: '字少伯，楚国宛地三户人。辅佐越王勾践卧薪尝胆，献美人西施于吴王夫差，经二十二年终灭吴国。功成后深知勾践可共患难不可共富贵，携西施泛舟五湖而去。后至陶地经商，三致千金，三散其财，被后世尊为商圣，号陶朱公。', external_refs: {} },
  { id: 146, name: '吕不韦', name_en: 'Lü Buwei', courtesy_name: '', birth_year: -292, death_year: -235, dynasty_id: 5, person_type: 'official', summary: '商人丞相，奇货可居，辅佐秦庄襄王，主编《吕氏春秋》。', description: '卫国濮阳人，大商人。在赵国都城邯郸经商时结识秦国质子异人，认为"奇货可居"，投入巨资运作，使异人归秦即位为秦庄襄王。吕不韦由此拜相封侯，权倾一时。执政期间招致门客三千，主编《吕氏春秋》，兼收并蓄百家之说。后因嫪毐之乱被免职，饮鸩自尽。', external_refs: {} },
  { id: 149, name: '沈万三', name_en: 'Shen Wansan', courtesy_name: '仲荣', birth_year: 1328, death_year: 1394, dynasty_id: 18, person_type: 'other', summary: '明初巨富，江南首富，助朱元璋修南京城。', description: '本名沈富，字仲荣，湖州南浔人。元末明初江南巨富，据传拥有财富亿万。曾资助朱元璋修筑南京城墙三分之一，又提出代皇帝犒赏三军，引起朱元璋忌恨。被流放云南，家产被抄。其致富传说众多，有"聚宝盆"之说，成为中国民间财富传奇的象征。', external_refs: {} },
];

// ===== 疆域地块数据（简化多边形） =====
interface MockTerritory {
  dynasty_id: number;
  dynasty_name: string;
  start_year: number;
  end_year: number;
  color: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  geom: any;
}

// 简化的中国各朝代核心疆域多边形
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mp = (...polygons: any): { type: "MultiPolygon"; coordinates: any } => ({
  type: "MultiPolygon" as const,
  coordinates: polygons,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ring = (...points: any): any => [points];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const polygon = (...rings: any): any => [rings];

export const MOCK_TERRITORIES: MockTerritory[] = [
  // 夏
  {
    dynasty_id: 1, dynasty_name: "夏", start_year: -2070, end_year: -1600, color: "#8B4513",
    geom: mp(polygon(ring(
      [110, 35], [112, 36], [114, 36], [115, 35], [116, 34],
      [115, 33], [114, 32], [112, 32], [110, 33], [109, 34],
      [110, 35],
    ))),
  },
  // 商
  {
    dynasty_id: 2, dynasty_name: "商", start_year: -1600, end_year: -1046, color: "#DAA520",
    geom: mp(polygon(ring(
      [110, 36], [114, 38], [117, 37], [118, 35], [117, 33],
      [114, 32], [112, 33], [110, 34], [108, 35], [110, 36],
    ))),
  },
  // 西周
  {
    dynasty_id: 3, dynasty_name: "西周", start_year: -1046, end_year: -771, color: "#2E8B57",
    geom: mp(polygon(ring(
      [104, 34], [108, 38], [112, 40], [116, 39], [118, 36],
      [117, 32], [114, 30], [112, 28], [108, 28], [105, 30],
      [103, 32], [104, 34],
    ))),
  },
  // 东周（春秋）
  {
    dynasty_id: 4, dynasty_name: "东周", start_year: -770, end_year: -256, color: "#4682B4",
    geom: mp(polygon(ring(
      [104, 32], [108, 38], [112, 40], [116, 39], [118, 36],
      [117, 32], [114, 30], [112, 28], [108, 26], [106, 28],
      [104, 30], [104, 32],
    ))),
  },
  // 秦
  {
    dynasty_id: 5, dynasty_name: "秦", start_year: -221, end_year: -206, color: "#1C1C1C",
    geom: mp(polygon(ring(
      [104, 34], [108, 38], [112, 40], [116, 39], [118, 36],
      [117, 32], [114, 30], [112, 28], [108, 28], [105, 30],
      [103, 32], [104, 34],
    ))),
  },
  // 西汉
  {
    dynasty_id: 6, dynasty_name: "西汉", start_year: -202, end_year: 8, color: "#DC143C",
    geom: mp(polygon(ring(
      [100, 36], [104, 40], [108, 42], [114, 42], [118, 40],
      [120, 38], [122, 34], [120, 30], [118, 28], [114, 26],
      [110, 24], [106, 26], [102, 28], [98, 30], [96, 32],
      [98, 34], [100, 36],
    ))),
  },
  // 东汉
  {
    dynasty_id: 7, dynasty_name: "东汉", start_year: 25, end_year: 220, color: "#B22222",
    geom: mp(polygon(ring(
      [100, 36], [104, 40], [108, 42], [114, 42], [118, 40],
      [120, 38], [122, 34], [120, 30], [118, 28], [114, 26],
      [110, 24], [106, 26], [102, 28], [98, 30], [96, 32],
      [98, 34], [100, 36],
    ))),
  },
  // 三国（魏）
  {
    dynasty_id: 8, dynasty_name: "三国·魏", start_year: 220, end_year: 280, color: "#8B0000",
    geom: mp(polygon(ring(
      [104, 34], [108, 38], [112, 40], [116, 40], [118, 38],
      [120, 34], [118, 32], [116, 30], [114, 30], [112, 32],
      [108, 32], [106, 32], [104, 34],
    ))),
  },
  // 三国（蜀）
  {
    dynasty_id: 8, dynasty_name: "三国·蜀", start_year: 221, end_year: 263, color: "#228B22",
    geom: mp(polygon(ring(
      [100, 28], [104, 32], [108, 34], [110, 32], [108, 28],
      [106, 26], [102, 26], [100, 28],
    ))),
  },
  // 三国（吴）
  {
    dynasty_id: 8, dynasty_name: "三国·吴", start_year: 222, end_year: 280, color: "#4169E1",
    geom: mp(polygon(ring(
      [112, 30], [116, 32], [120, 32], [122, 30], [122, 26],
      [120, 24], [116, 22], [112, 24], [110, 26], [112, 30],
    ))),
  },
  // 西晋
  {
    dynasty_id: 9, dynasty_name: "西晋", start_year: 265, end_year: 316, color: "#556B2F",
    geom: mp(polygon(ring(
      [100, 28], [104, 34], [108, 38], [112, 40], [116, 40],
      [118, 38], [120, 34], [122, 30], [120, 26], [116, 22],
      [112, 22], [108, 24], [104, 26], [100, 28],
    ))),
  },
  // 东晋
  {
    dynasty_id: 10, dynasty_name: "东晋", start_year: 317, end_year: 420, color: "#6B8E23",
    geom: mp(polygon(ring(
      [108, 28], [112, 32], [116, 32], [120, 30], [122, 28],
      [122, 24], [120, 22], [116, 20], [112, 22], [108, 24],
      [106, 26], [108, 28],
    ))),
  },
  // 南北朝（北魏）
  {
    dynasty_id: 11, dynasty_name: "南北朝·北魏", start_year: 420, end_year: 534, color: "#708090",
    geom: mp(polygon(ring(
      [100, 36], [104, 40], [108, 42], [114, 42], [118, 40],
      [120, 38], [118, 34], [116, 32], [114, 30], [110, 30],
      [106, 30], [102, 32], [100, 34], [100, 36],
    ))),
  },
  // 南北朝（南朝·宋齐梁陈）
  {
    dynasty_id: 11, dynasty_name: "南北朝·南朝", start_year: 420, end_year: 589, color: "#8FBC8F",
    geom: mp(polygon(ring(
      [108, 28], [112, 32], [116, 32], [120, 30], [122, 28],
      [122, 24], [120, 20], [116, 18], [112, 20], [108, 24],
      [106, 26], [108, 28],
    ))),
  },
  // 隋
  {
    dynasty_id: 12, dynasty_name: "隋", start_year: 581, end_year: 618, color: "#FF8C00",
    geom: mp(polygon(ring(
      [98, 36], [104, 40], [108, 42], [114, 42], [118, 40],
      [120, 38], [122, 34], [120, 30], [118, 28], [114, 26],
      [110, 24], [106, 26], [102, 28], [98, 30], [96, 32],
      [96, 34], [98, 36],
    ))),
  },
  // 唐
  {
    dynasty_id: 13, dynasty_name: "唐", start_year: 618, end_year: 907, color: "#FFD700",
    geom: mp(
      polygon(ring(
        [96, 38], [100, 42], [104, 44], [110, 44], [116, 42],
        [120, 40], [122, 36], [122, 32], [120, 28], [116, 26],
        [112, 24], [108, 24], [104, 26], [100, 28], [96, 30],
        [94, 34], [96, 38],
      )),
      polygon(ring(
        [80, 40], [86, 42], [92, 42], [96, 40], [94, 38],
        [90, 36], [84, 36], [80, 38], [80, 40],
      )),
    ),
  },
  // 五代十国
  {
    dynasty_id: 14, dynasty_name: "五代十国", start_year: 907, end_year: 960, color: "#A0522D",
    geom: mp(polygon(ring(
      [104, 34], [108, 38], [112, 40], [116, 40], [118, 38],
      [120, 34], [120, 30], [118, 28], [116, 26], [112, 26],
      [108, 26], [106, 28], [104, 30], [104, 34],
    ))),
  },
  // 北宋
  {
    dynasty_id: 15, dynasty_name: "北宋", start_year: 960, end_year: 1127, color: "#4169E1",
    geom: mp(polygon(ring(
      [104, 34], [108, 38], [112, 40], [116, 40], [118, 38],
      [120, 34], [120, 30], [118, 28], [116, 26], [112, 26],
      [108, 26], [106, 28], [104, 30], [104, 34],
    ))),
  },
  // 南宋
  {
    dynasty_id: 16, dynasty_name: "南宋", start_year: 1127, end_year: 1279, color: "#6495ED",
    geom: mp(polygon(ring(
      [108, 30], [112, 32], [116, 32], [118, 30], [120, 28],
      [120, 26], [118, 24], [114, 22], [110, 22], [108, 24],
      [106, 26], [106, 28], [108, 30],
    ))),
  },
  // 元
  {
    dynasty_id: 17, dynasty_name: "元", start_year: 1271, end_year: 1368, color: "#006400",
    geom: mp(
      polygon(ring(
        [88, 42], [96, 46], [104, 48], [112, 46], [118, 44],
        [122, 42], [124, 38], [124, 34], [122, 30], [120, 26],
        [116, 24], [110, 22], [106, 24], [100, 26], [94, 28],
        [88, 30], [84, 34], [84, 38], [88, 42],
      )),
      polygon(ring(
        [96, 48], [104, 50], [112, 50], [118, 48], [116, 46],
        [108, 46], [100, 46], [96, 48],
      )),
    ),
  },
  // 明
  {
    dynasty_id: 18, dynasty_name: "明", start_year: 1368, end_year: 1644, color: "#8B0000",
    geom: mp(polygon(ring(
      [98, 38], [104, 42], [110, 42], [116, 42], [120, 40],
      [122, 36], [122, 32], [120, 28], [118, 24], [114, 22],
      [110, 22], [106, 24], [102, 26], [98, 28], [96, 32],
      [96, 36], [98, 38],
    ))),
  },
  // 清
  {
    dynasty_id: 19, dynasty_name: "清", start_year: 1644, end_year: 1912, color: "#FFD700",
    geom: mp(
      polygon(ring(
        [98, 38], [104, 42], [110, 42], [116, 42], [120, 40],
        [122, 36], [122, 32], [120, 28], [118, 24], [114, 22],
        [110, 20], [106, 22], [102, 24], [98, 26], [96, 30],
        [96, 34], [98, 38],
      )),
      polygon(ring(
        [120, 44], [126, 48], [130, 48], [132, 46],
        [130, 42], [126, 40], [122, 40], [120, 44],
      )),
      polygon(ring(
        [76, 40], [82, 44], [88, 46], [94, 44], [96, 42],
        [92, 38], [86, 36], [80, 36], [76, 38], [76, 40],
      )),
      polygon(ring(
        [80, 32], [86, 34], [92, 34], [96, 32], [96, 28],
        [92, 26], [86, 26], [80, 28], [78, 30], [80, 32],
      )),
    ),
  },
];

// ===== 工具函数 =====

/** 判断是否为Mock模式 */
export function isMockMode(): boolean {
  return process.env.USE_MOCK === 'true';
}

/** 根据月日筛选今日历史事件 */
export function getTodayEvents(month: number, day: number) {
  const matched = MOCK_EVENTS.filter(e => e.start_month === month && e.start_day === day);
  // 如果没有精确匹配，返回随机几个事件模拟
  if (matched.length === 0) {
    const shuffled = [...MOCK_EVENTS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  }
  return matched;
}

/** 根据年份范围筛选事件 */
export function getEventsByYearRange(startYear?: number, endYear?: number, dynastyId?: number) {
  let filtered = MOCK_EVENTS;
  if (startYear !== undefined) {
    filtered = filtered.filter(e => e.start_year >= startYear);
  }
  if (endYear !== undefined) {
    filtered = filtered.filter(e => (e.end_year ?? e.start_year) <= endYear);
  }
  if (dynastyId !== undefined) {
    filtered = filtered.filter(e => e.dynasty?.id === dynastyId);
  }
  return filtered;
}

/** 根据ID获取事件 */
export function getEventById(id: number) {
  return MOCK_EVENTS.find(e => e.id === id) || null;
}

/** 根据ID获取朝代 */
export function getDynastyById(id: number) {
  const dynasty = MOCK_DYNASTIES.find(d => d.id === id);
  if (!dynasty) return null;
  const eventCount = MOCK_EVENTS.filter(e => e.dynasty?.id === id).length;
  const personCount = MOCK_PERSONS.filter(p => p.dynasty_id === id).length;
  return { ...dynasty, event_count: eventCount, person_count: personCount };
}

/** 根据ID获取人物 */
export function getPersonById(id: number) {
  const person = MOCK_PERSONS.find(p => p.id === id);
  if (!person) return null;
  const events = MOCK_EVENTS.filter(e => e.dynasty?.id === person.dynasty_id).slice(0, 3);
  return { ...person, relations: [], events };
}

/** 搜索人物 */
export function searchPersons(q: string, dynastyId?: number) {
  let filtered = MOCK_PERSONS;
  if (q) {
    const lower = q.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.includes(q) || p.name_en?.toLowerCase().includes(lower)
    );
  }
  if (dynastyId) {
    filtered = filtered.filter(p => p.dynasty_id === dynastyId);
  }
  return filtered;
}

/** 搜索地点 */
export function searchPlaces(q: string) {
  return MOCK_PLACES.filter(p => p.name.includes(q) || p.modern_name?.includes(q));
}
