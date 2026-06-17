// 华夏时空 - 年号转换工具

import { query } from '@/services/db';

interface EraNameRecord {
  era_name: string;
  start_year: number;
  end_year: number;
  dynasty_id: number;
  dynasty_name: string;
  emperor?: string;
}

/**
 * 年号全量映射表
 * 覆盖秦、西汉、新、东汉、唐、宋（北宋+南宋）、明、清等主要朝代年号
 */
export const ERA_TABLE: EraNameRecord[] = [
  // ===== 秦 (dynasty_id: 5) =====
  { era_name: '始皇帝', start_year: -221, end_year: -210, dynasty_id: 5, dynasty_name: '秦', emperor: '秦始皇' },

  // ===== 西汉 (dynasty_id: 6) =====
  { era_name: '建元', start_year: -140, end_year: -135, dynasty_id: 6, dynasty_name: '西汉', emperor: '汉武帝' },
  { era_name: '元光', start_year: -134, end_year: -129, dynasty_id: 6, dynasty_name: '西汉', emperor: '汉武帝' },
  { era_name: '元朔', start_year: -128, end_year: -123, dynasty_id: 6, dynasty_name: '西汉', emperor: '汉武帝' },
  { era_name: '元狩', start_year: -122, end_year: -117, dynasty_id: 6, dynasty_name: '西汉', emperor: '汉武帝' },
  { era_name: '元鼎', start_year: -116, end_year: -111, dynasty_id: 6, dynasty_name: '西汉', emperor: '汉武帝' },
  { era_name: '元封', start_year: -110, end_year: -105, dynasty_id: 6, dynasty_name: '西汉', emperor: '汉武帝' },
  { era_name: '太初', start_year: -104, end_year: -101, dynasty_id: 6, dynasty_name: '西汉', emperor: '汉武帝' },
  { era_name: '天汉', start_year: -100, end_year: -97, dynasty_id: 6, dynasty_name: '西汉', emperor: '汉武帝' },
  { era_name: '太始', start_year: -96, end_year: -93, dynasty_id: 6, dynasty_name: '西汉', emperor: '汉武帝' },
  { era_name: '征和', start_year: -92, end_year: -89, dynasty_id: 6, dynasty_name: '西汉', emperor: '汉武帝' },
  { era_name: '后元', start_year: -88, end_year: -87, dynasty_id: 6, dynasty_name: '西汉', emperor: '汉武帝' },
  { era_name: '始元', start_year: -86, end_year: -80, dynasty_id: 6, dynasty_name: '西汉', emperor: '汉昭帝' },
  { era_name: '元凤', start_year: -80, end_year: -75, dynasty_id: 6, dynasty_name: '西汉', emperor: '汉昭帝' },
  { era_name: '元平', start_year: -74, end_year: -74, dynasty_id: 6, dynasty_name: '西汉', emperor: '汉昭帝' },
  { era_name: '本始', start_year: -73, end_year: -70, dynasty_id: 6, dynasty_name: '西汉', emperor: '汉宣帝' },
  { era_name: '地节', start_year: -69, end_year: -66, dynasty_id: 6, dynasty_name: '西汉', emperor: '汉宣帝' },
  { era_name: '元康', start_year: -65, end_year: -61, dynasty_id: 6, dynasty_name: '西汉', emperor: '汉宣帝' },
  { era_name: '神爵', start_year: -61, end_year: -58, dynasty_id: 6, dynasty_name: '西汉', emperor: '汉宣帝' },
  { era_name: '五凤', start_year: -57, end_year: -54, dynasty_id: 6, dynasty_name: '西汉', emperor: '汉宣帝' },
  { era_name: '甘露', start_year: -53, end_year: -50, dynasty_id: 6, dynasty_name: '西汉', emperor: '汉宣帝' },
  { era_name: '黄龙', start_year: -49, end_year: -49, dynasty_id: 6, dynasty_name: '西汉', emperor: '汉宣帝' },
  { era_name: '初元', start_year: -48, end_year: -44, dynasty_id: 6, dynasty_name: '西汉', emperor: '汉元帝' },
  { era_name: '永光', start_year: -43, end_year: -39, dynasty_id: 6, dynasty_name: '西汉', emperor: '汉元帝' },
  { era_name: '建昭', start_year: -38, end_year: -34, dynasty_id: 6, dynasty_name: '西汉', emperor: '汉元帝' },
  { era_name: '竟宁', start_year: -33, end_year: -33, dynasty_id: 6, dynasty_name: '西汉', emperor: '汉元帝' },
  { era_name: '建始', start_year: -32, end_year: -28, dynasty_id: 6, dynasty_name: '西汉', emperor: '汉成帝' },
  { era_name: '河平', start_year: -28, end_year: -25, dynasty_id: 6, dynasty_name: '西汉', emperor: '汉成帝' },
  { era_name: '阳朔', start_year: -24, end_year: -21, dynasty_id: 6, dynasty_name: '西汉', emperor: '汉成帝' },
  { era_name: '鸿嘉', start_year: -20, end_year: -17, dynasty_id: 6, dynasty_name: '西汉', emperor: '汉成帝' },
  { era_name: '永始', start_year: -16, end_year: -13, dynasty_id: 6, dynasty_name: '西汉', emperor: '汉成帝' },
  { era_name: '元延', start_year: -12, end_year: -9, dynasty_id: 6, dynasty_name: '西汉', emperor: '汉成帝' },
  { era_name: '绥和', start_year: -8, end_year: -7, dynasty_id: 6, dynasty_name: '西汉', emperor: '汉成帝' },
  { era_name: '建平', start_year: -6, end_year: -3, dynasty_id: 6, dynasty_name: '西汉', emperor: '汉哀帝' },
  { era_name: '元寿', start_year: -2, end_year: -1, dynasty_id: 6, dynasty_name: '西汉', emperor: '汉哀帝' },
  { era_name: '元始', start_year: 1, end_year: 5, dynasty_id: 6, dynasty_name: '西汉', emperor: '汉平帝' },
  { era_name: '居摄', start_year: 6, end_year: 8, dynasty_id: 6, dynasty_name: '西汉', emperor: '孺子婴' },

  // ===== 新/王莽 (dynasty_id: 6) =====
  { era_name: '始建国', start_year: 9, end_year: 13, dynasty_id: 6, dynasty_name: '新', emperor: '王莽' },
  { era_name: '天凤', start_year: 14, end_year: 19, dynasty_id: 6, dynasty_name: '新', emperor: '王莽' },
  { era_name: '地皇', start_year: 20, end_year: 23, dynasty_id: 6, dynasty_name: '新', emperor: '王莽' },

  // ===== 东汉 (dynasty_id: 7) =====
  { era_name: '建武', start_year: 25, end_year: 55, dynasty_id: 7, dynasty_name: '东汉', emperor: '汉光武帝' },
  { era_name: '建武中元', start_year: 56, end_year: 57, dynasty_id: 7, dynasty_name: '东汉', emperor: '汉光武帝' },
  { era_name: '永平', start_year: 58, end_year: 75, dynasty_id: 7, dynasty_name: '东汉', emperor: '汉明帝' },
  { era_name: '建初', start_year: 76, end_year: 83, dynasty_id: 7, dynasty_name: '东汉', emperor: '汉章帝' },
  { era_name: '元和', start_year: 84, end_year: 86, dynasty_id: 7, dynasty_name: '东汉', emperor: '汉章帝' },
  { era_name: '章和', start_year: 87, end_year: 88, dynasty_id: 7, dynasty_name: '东汉', emperor: '汉章帝' },
  { era_name: '永元', start_year: 89, end_year: 105, dynasty_id: 7, dynasty_name: '东汉', emperor: '汉和帝' },
  { era_name: '元兴', start_year: 105, end_year: 105, dynasty_id: 7, dynasty_name: '东汉', emperor: '汉和帝' },
  { era_name: '延平', start_year: 106, end_year: 106, dynasty_id: 7, dynasty_name: '东汉', emperor: '汉殇帝' },
  { era_name: '永初', start_year: 107, end_year: 113, dynasty_id: 7, dynasty_name: '东汉', emperor: '汉安帝' },
  { era_name: '元初', start_year: 114, end_year: 119, dynasty_id: 7, dynasty_name: '东汉', emperor: '汉安帝' },
  { era_name: '永宁', start_year: 120, end_year: 121, dynasty_id: 7, dynasty_name: '东汉', emperor: '汉安帝' },
  { era_name: '建光', start_year: 121, end_year: 122, dynasty_id: 7, dynasty_name: '东汉', emperor: '汉安帝' },
  { era_name: '延光', start_year: 122, end_year: 125, dynasty_id: 7, dynasty_name: '东汉', emperor: '汉安帝' },
  { era_name: '永建', start_year: 126, end_year: 132, dynasty_id: 7, dynasty_name: '东汉', emperor: '汉顺帝' },
  { era_name: '阳嘉', start_year: 132, end_year: 135, dynasty_id: 7, dynasty_name: '东汉', emperor: '汉顺帝' },
  { era_name: '永和', start_year: 136, end_year: 141, dynasty_id: 7, dynasty_name: '东汉', emperor: '汉顺帝' },
  { era_name: '汉安', start_year: 142, end_year: 144, dynasty_id: 7, dynasty_name: '东汉', emperor: '汉顺帝' },
  { era_name: '建康', start_year: 144, end_year: 144, dynasty_id: 7, dynasty_name: '东汉', emperor: '汉顺帝' },
  { era_name: '永憙', start_year: 145, end_year: 145, dynasty_id: 7, dynasty_name: '东汉', emperor: '汉冲帝' },
  { era_name: '本初', start_year: 146, end_year: 146, dynasty_id: 7, dynasty_name: '东汉', emperor: '汉质帝' },
  { era_name: '建和', start_year: 147, end_year: 149, dynasty_id: 7, dynasty_name: '东汉', emperor: '汉桓帝' },
  { era_name: '和平', start_year: 150, end_year: 150, dynasty_id: 7, dynasty_name: '东汉', emperor: '汉桓帝' },
  { era_name: '元嘉', start_year: 151, end_year: 152, dynasty_id: 7, dynasty_name: '东汉', emperor: '汉桓帝' },
  { era_name: '永兴', start_year: 153, end_year: 154, dynasty_id: 7, dynasty_name: '东汉', emperor: '汉桓帝' },
  { era_name: '永寿', start_year: 155, end_year: 158, dynasty_id: 7, dynasty_name: '东汉', emperor: '汉桓帝' },
  { era_name: '延熹', start_year: 158, end_year: 167, dynasty_id: 7, dynasty_name: '东汉', emperor: '汉桓帝' },
  { era_name: '永康', start_year: 167, end_year: 167, dynasty_id: 7, dynasty_name: '东汉', emperor: '汉桓帝' },
  { era_name: '建宁', start_year: 168, end_year: 171, dynasty_id: 7, dynasty_name: '东汉', emperor: '汉灵帝' },
  { era_name: '熹平', start_year: 172, end_year: 177, dynasty_id: 7, dynasty_name: '东汉', emperor: '汉灵帝' },
  { era_name: '光和', start_year: 178, end_year: 183, dynasty_id: 7, dynasty_name: '东汉', emperor: '汉灵帝' },
  { era_name: '中平', start_year: 184, end_year: 189, dynasty_id: 7, dynasty_name: '东汉', emperor: '汉灵帝' },
  { era_name: '初平', start_year: 190, end_year: 193, dynasty_id: 7, dynasty_name: '东汉', emperor: '汉献帝' },
  { era_name: '兴平', start_year: 194, end_year: 195, dynasty_id: 7, dynasty_name: '东汉', emperor: '汉献帝' },
  { era_name: '建安', start_year: 196, end_year: 220, dynasty_id: 7, dynasty_name: '东汉', emperor: '汉献帝' },
  { era_name: '延康', start_year: 220, end_year: 220, dynasty_id: 7, dynasty_name: '东汉', emperor: '汉献帝' },

  // ===== 唐 (dynasty_id: 13) =====
  { era_name: '武德', start_year: 618, end_year: 626, dynasty_id: 13, dynasty_name: '唐', emperor: '唐高祖' },
  { era_name: '贞观', start_year: 627, end_year: 649, dynasty_id: 13, dynasty_name: '唐', emperor: '唐太宗' },
  { era_name: '永徽', start_year: 650, end_year: 655, dynasty_id: 13, dynasty_name: '唐', emperor: '唐高宗' },
  { era_name: '显庆', start_year: 656, end_year: 660, dynasty_id: 13, dynasty_name: '唐', emperor: '唐高宗' },
  { era_name: '龙朔', start_year: 661, end_year: 663, dynasty_id: 13, dynasty_name: '唐', emperor: '唐高宗' },
  { era_name: '麟德', start_year: 664, end_year: 665, dynasty_id: 13, dynasty_name: '唐', emperor: '唐高宗' },
  { era_name: '乾封', start_year: 666, end_year: 667, dynasty_id: 13, dynasty_name: '唐', emperor: '唐高宗' },
  { era_name: '总章', start_year: 668, end_year: 670, dynasty_id: 13, dynasty_name: '唐', emperor: '唐高宗' },
  { era_name: '咸亨', start_year: 670, end_year: 674, dynasty_id: 13, dynasty_name: '唐', emperor: '唐高宗' },
  { era_name: '上元', start_year: 674, end_year: 676, dynasty_id: 13, dynasty_name: '唐', emperor: '唐高宗' },
  { era_name: '仪凤', start_year: 676, end_year: 678, dynasty_id: 13, dynasty_name: '唐', emperor: '唐高宗' },
  { era_name: '调露', start_year: 679, end_year: 680, dynasty_id: 13, dynasty_name: '唐', emperor: '唐高宗' },
  { era_name: '永隆', start_year: 680, end_year: 681, dynasty_id: 13, dynasty_name: '唐', emperor: '唐高宗' },
  { era_name: '开耀', start_year: 681, end_year: 682, dynasty_id: 13, dynasty_name: '唐', emperor: '唐高宗' },
  { era_name: '永淳', start_year: 682, end_year: 683, dynasty_id: 13, dynasty_name: '唐', emperor: '唐高宗' },
  { era_name: '弘道', start_year: 683, end_year: 683, dynasty_id: 13, dynasty_name: '唐', emperor: '唐高宗' },
  { era_name: '嗣圣', start_year: 684, end_year: 684, dynasty_id: 13, dynasty_name: '唐', emperor: '唐中宗' },
  { era_name: '文明', start_year: 684, end_year: 684, dynasty_id: 13, dynasty_name: '唐', emperor: '唐睿宗' },
  { era_name: '光宅', start_year: 684, end_year: 684, dynasty_id: 13, dynasty_name: '唐', emperor: '武则天' },
  { era_name: '垂拱', start_year: 685, end_year: 688, dynasty_id: 13, dynasty_name: '唐', emperor: '武则天' },
  { era_name: '永昌', start_year: 689, end_year: 689, dynasty_id: 13, dynasty_name: '唐', emperor: '武则天' },
  { era_name: '载初', start_year: 689, end_year: 690, dynasty_id: 13, dynasty_name: '唐', emperor: '武则天' },
  { era_name: '天授', start_year: 690, end_year: 692, dynasty_id: 13, dynasty_name: '唐', emperor: '武则天' },
  { era_name: '如意', start_year: 692, end_year: 692, dynasty_id: 13, dynasty_name: '唐', emperor: '武则天' },
  { era_name: '长寿', start_year: 692, end_year: 694, dynasty_id: 13, dynasty_name: '唐', emperor: '武则天' },
  { era_name: '延载', start_year: 694, end_year: 694, dynasty_id: 13, dynasty_name: '唐', emperor: '武则天' },
  { era_name: '证圣', start_year: 695, end_year: 695, dynasty_id: 13, dynasty_name: '唐', emperor: '武则天' },
  { era_name: '天册万岁', start_year: 695, end_year: 696, dynasty_id: 13, dynasty_name: '唐', emperor: '武则天' },
  { era_name: '万岁登封', start_year: 696, end_year: 696, dynasty_id: 13, dynasty_name: '唐', emperor: '武则天' },
  { era_name: '万岁通天', start_year: 696, end_year: 697, dynasty_id: 13, dynasty_name: '唐', emperor: '武则天' },
  { era_name: '神功', start_year: 697, end_year: 697, dynasty_id: 13, dynasty_name: '唐', emperor: '武则天' },
  { era_name: '圣历', start_year: 698, end_year: 700, dynasty_id: 13, dynasty_name: '唐', emperor: '武则天' },
  { era_name: '久视', start_year: 700, end_year: 700, dynasty_id: 13, dynasty_name: '唐', emperor: '武则天' },
  { era_name: '大足', start_year: 701, end_year: 701, dynasty_id: 13, dynasty_name: '唐', emperor: '武则天' },
  { era_name: '长安', start_year: 701, end_year: 704, dynasty_id: 13, dynasty_name: '唐', emperor: '武则天' },
  { era_name: '神龙', start_year: 705, end_year: 707, dynasty_id: 13, dynasty_name: '唐', emperor: '唐中宗' },
  { era_name: '景龙', start_year: 707, end_year: 710, dynasty_id: 13, dynasty_name: '唐', emperor: '唐中宗' },
  { era_name: '唐隆', start_year: 710, end_year: 710, dynasty_id: 13, dynasty_name: '唐', emperor: '唐殇帝' },
  { era_name: '景云', start_year: 710, end_year: 711, dynasty_id: 13, dynasty_name: '唐', emperor: '唐睿宗' },
  { era_name: '太极', start_year: 712, end_year: 712, dynasty_id: 13, dynasty_name: '唐', emperor: '唐睿宗' },
  { era_name: '延和', start_year: 712, end_year: 712, dynasty_id: 13, dynasty_name: '唐', emperor: '唐睿宗' },
  { era_name: '先天', start_year: 712, end_year: 713, dynasty_id: 13, dynasty_name: '唐', emperor: '唐玄宗' },
  { era_name: '开元', start_year: 713, end_year: 741, dynasty_id: 13, dynasty_name: '唐', emperor: '唐玄宗' },
  { era_name: '天宝', start_year: 742, end_year: 756, dynasty_id: 13, dynasty_name: '唐', emperor: '唐玄宗' },
  { era_name: '至德', start_year: 756, end_year: 758, dynasty_id: 13, dynasty_name: '唐', emperor: '唐肃宗' },
  { era_name: '乾元', start_year: 758, end_year: 760, dynasty_id: 13, dynasty_name: '唐', emperor: '唐肃宗' },
  { era_name: '上元', start_year: 760, end_year: 761, dynasty_id: 13, dynasty_name: '唐', emperor: '唐肃宗' },
  { era_name: '宝应', start_year: 762, end_year: 763, dynasty_id: 13, dynasty_name: '唐', emperor: '唐代宗' },
  { era_name: '广德', start_year: 763, end_year: 764, dynasty_id: 13, dynasty_name: '唐', emperor: '唐代宗' },
  { era_name: '永泰', start_year: 765, end_year: 766, dynasty_id: 13, dynasty_name: '唐', emperor: '唐代宗' },
  { era_name: '大历', start_year: 766, end_year: 779, dynasty_id: 13, dynasty_name: '唐', emperor: '唐代宗' },
  { era_name: '建中', start_year: 780, end_year: 783, dynasty_id: 13, dynasty_name: '唐', emperor: '唐德宗' },
  { era_name: '兴元', start_year: 784, end_year: 784, dynasty_id: 13, dynasty_name: '唐', emperor: '唐德宗' },
  { era_name: '贞元', start_year: 785, end_year: 805, dynasty_id: 13, dynasty_name: '唐', emperor: '唐德宗' },
  { era_name: '永贞', start_year: 805, end_year: 805, dynasty_id: 13, dynasty_name: '唐', emperor: '唐顺宗' },
  { era_name: '元和', start_year: 806, end_year: 820, dynasty_id: 13, dynasty_name: '唐', emperor: '唐宪宗' },
  { era_name: '长庆', start_year: 821, end_year: 824, dynasty_id: 13, dynasty_name: '唐', emperor: '唐穆宗' },
  { era_name: '宝历', start_year: 825, end_year: 826, dynasty_id: 13, dynasty_name: '唐', emperor: '唐敬宗' },
  { era_name: '大和', start_year: 827, end_year: 835, dynasty_id: 13, dynasty_name: '唐', emperor: '唐文宗' },
  { era_name: '开成', start_year: 836, end_year: 840, dynasty_id: 13, dynasty_name: '唐', emperor: '唐文宗' },
  { era_name: '会昌', start_year: 841, end_year: 846, dynasty_id: 13, dynasty_name: '唐', emperor: '唐武宗' },
  { era_name: '大中', start_year: 847, end_year: 859, dynasty_id: 13, dynasty_name: '唐', emperor: '唐宣宗' },
  { era_name: '大中十三年', start_year: 859, end_year: 860, dynasty_id: 13, dynasty_name: '唐', emperor: '唐宣宗' },
  { era_name: '咸通', start_year: 860, end_year: 874, dynasty_id: 13, dynasty_name: '唐', emperor: '唐懿宗' },
  { era_name: '乾符', start_year: 874, end_year: 879, dynasty_id: 13, dynasty_name: '唐', emperor: '唐僖宗' },
  { era_name: '广明', start_year: 880, end_year: 881, dynasty_id: 13, dynasty_name: '唐', emperor: '唐僖宗' },
  { era_name: '中和', start_year: 881, end_year: 884, dynasty_id: 13, dynasty_name: '唐', emperor: '唐僖宗' },
  { era_name: '光启', start_year: 885, end_year: 887, dynasty_id: 13, dynasty_name: '唐', emperor: '唐僖宗' },
  { era_name: '文德', start_year: 888, end_year: 888, dynasty_id: 13, dynasty_name: '唐', emperor: '唐僖宗' },
  { era_name: '龙纪', start_year: 889, end_year: 889, dynasty_id: 13, dynasty_name: '唐', emperor: '唐昭宗' },
  { era_name: '大顺', start_year: 890, end_year: 891, dynasty_id: 13, dynasty_name: '唐', emperor: '唐昭宗' },
  { era_name: '景福', start_year: 892, end_year: 893, dynasty_id: 13, dynasty_name: '唐', emperor: '唐昭宗' },
  { era_name: '乾宁', start_year: 894, end_year: 897, dynasty_id: 13, dynasty_name: '唐', emperor: '唐昭宗' },
  { era_name: '光化', start_year: 898, end_year: 900, dynasty_id: 13, dynasty_name: '唐', emperor: '唐昭宗' },
  { era_name: '天复', start_year: 901, end_year: 903, dynasty_id: 13, dynasty_name: '唐', emperor: '唐昭宗' },
  { era_name: '天祐', start_year: 904, end_year: 907, dynasty_id: 13, dynasty_name: '唐', emperor: '唐昭宗' },

  // ===== 北宋 (dynasty_id: 15) =====
  { era_name: '建隆', start_year: 960, end_year: 963, dynasty_id: 15, dynasty_name: '北宋', emperor: '宋太祖' },
  { era_name: '乾德', start_year: 963, end_year: 968, dynasty_id: 15, dynasty_name: '北宋', emperor: '宋太祖' },
  { era_name: '开宝', start_year: 968, end_year: 976, dynasty_id: 15, dynasty_name: '北宋', emperor: '宋太祖' },
  { era_name: '太平兴国', start_year: 976, end_year: 983, dynasty_id: 15, dynasty_name: '北宋', emperor: '宋太宗' },
  { era_name: '雍熙', start_year: 984, end_year: 987, dynasty_id: 15, dynasty_name: '北宋', emperor: '宋太宗' },
  { era_name: '端拱', start_year: 988, end_year: 989, dynasty_id: 15, dynasty_name: '北宋', emperor: '宋太宗' },
  { era_name: '淳化', start_year: 990, end_year: 994, dynasty_id: 15, dynasty_name: '北宋', emperor: '宋太宗' },
  { era_name: '至道', start_year: 995, end_year: 997, dynasty_id: 15, dynasty_name: '北宋', emperor: '宋太宗' },
  { era_name: '咸平', start_year: 998, end_year: 1003, dynasty_id: 15, dynasty_name: '北宋', emperor: '宋真宗' },
  { era_name: '景德', start_year: 1004, end_year: 1007, dynasty_id: 15, dynasty_name: '北宋', emperor: '宋真宗' },
  { era_name: '大中祥符', start_year: 1008, end_year: 1016, dynasty_id: 15, dynasty_name: '北宋', emperor: '宋真宗' },
  { era_name: '天禧', start_year: 1017, end_year: 1021, dynasty_id: 15, dynasty_name: '北宋', emperor: '宋真宗' },
  { era_name: '乾兴', start_year: 1022, end_year: 1022, dynasty_id: 15, dynasty_name: '北宋', emperor: '宋真宗' },
  { era_name: '天圣', start_year: 1023, end_year: 1031, dynasty_id: 15, dynasty_name: '北宋', emperor: '宋仁宗' },
  { era_name: '明道', start_year: 1032, end_year: 1033, dynasty_id: 15, dynasty_name: '北宋', emperor: '宋仁宗' },
  { era_name: '景祐', start_year: 1034, end_year: 1037, dynasty_id: 15, dynasty_name: '北宋', emperor: '宋仁宗' },
  { era_name: '宝元', start_year: 1038, end_year: 1039, dynasty_id: 15, dynasty_name: '北宋', emperor: '宋仁宗' },
  { era_name: '康定', start_year: 1040, end_year: 1041, dynasty_id: 15, dynasty_name: '北宋', emperor: '宋仁宗' },
  { era_name: '庆历', start_year: 1041, end_year: 1048, dynasty_id: 15, dynasty_name: '北宋', emperor: '宋仁宗' },
  { era_name: '皇祐', start_year: 1049, end_year: 1053, dynasty_id: 15, dynasty_name: '北宋', emperor: '宋仁宗' },
  { era_name: '至和', start_year: 1054, end_year: 1055, dynasty_id: 15, dynasty_name: '北宋', emperor: '宋仁宗' },
  { era_name: '嘉祐', start_year: 1056, end_year: 1063, dynasty_id: 15, dynasty_name: '北宋', emperor: '宋仁宗' },
  { era_name: '治平', start_year: 1064, end_year: 1067, dynasty_id: 15, dynasty_name: '北宋', emperor: '宋英宗' },
  { era_name: '熙宁', start_year: 1068, end_year: 1077, dynasty_id: 15, dynasty_name: '北宋', emperor: '宋神宗' },
  { era_name: '元丰', start_year: 1078, end_year: 1085, dynasty_id: 15, dynasty_name: '北宋', emperor: '宋神宗' },
  { era_name: '元祐', start_year: 1086, end_year: 1094, dynasty_id: 15, dynasty_name: '北宋', emperor: '宋哲宗' },
  { era_name: '绍圣', start_year: 1094, end_year: 1098, dynasty_id: 15, dynasty_name: '北宋', emperor: '宋哲宗' },
  { era_name: '元符', start_year: 1098, end_year: 1100, dynasty_id: 15, dynasty_name: '北宋', emperor: '宋哲宗' },
  { era_name: '建中靖国', start_year: 1101, end_year: 1101, dynasty_id: 15, dynasty_name: '北宋', emperor: '宋徽宗' },
  { era_name: '崇宁', start_year: 1102, end_year: 1106, dynasty_id: 15, dynasty_name: '北宋', emperor: '宋徽宗' },
  { era_name: '大观', start_year: 1107, end_year: 1110, dynasty_id: 15, dynasty_name: '北宋', emperor: '宋徽宗' },
  { era_name: '政和', start_year: 1111, end_year: 1118, dynasty_id: 15, dynasty_name: '北宋', emperor: '宋徽宗' },
  { era_name: '重和', start_year: 1118, end_year: 1119, dynasty_id: 15, dynasty_name: '北宋', emperor: '宋徽宗' },
  { era_name: '宣和', start_year: 1119, end_year: 1125, dynasty_id: 15, dynasty_name: '北宋', emperor: '宋徽宗' },

  // ===== 南宋 (dynasty_id: 16) =====
  { era_name: '建炎', start_year: 1127, end_year: 1130, dynasty_id: 16, dynasty_name: '南宋', emperor: '宋高宗' },
  { era_name: '绍兴', start_year: 1131, end_year: 1162, dynasty_id: 16, dynasty_name: '南宋', emperor: '宋高宗' },
  { era_name: '隆兴', start_year: 1163, end_year: 1164, dynasty_id: 16, dynasty_name: '南宋', emperor: '宋孝宗' },
  { era_name: '乾道', start_year: 1165, end_year: 1173, dynasty_id: 16, dynasty_name: '南宋', emperor: '宋孝宗' },
  { era_name: '淳熙', start_year: 1174, end_year: 1189, dynasty_id: 16, dynasty_name: '南宋', emperor: '宋孝宗' },
  { era_name: '绍熙', start_year: 1190, end_year: 1194, dynasty_id: 16, dynasty_name: '南宋', emperor: '宋光宗' },
  { era_name: '庆元', start_year: 1195, end_year: 1200, dynasty_id: 16, dynasty_name: '南宋', emperor: '宋宁宗' },
  { era_name: '嘉泰', start_year: 1201, end_year: 1204, dynasty_id: 16, dynasty_name: '南宋', emperor: '宋宁宗' },
  { era_name: '开禧', start_year: 1205, end_year: 1207, dynasty_id: 16, dynasty_name: '南宋', emperor: '宋宁宗' },
  { era_name: '嘉定', start_year: 1208, end_year: 1224, dynasty_id: 16, dynasty_name: '南宋', emperor: '宋宁宗' },
  { era_name: '宝庆', start_year: 1225, end_year: 1227, dynasty_id: 16, dynasty_name: '南宋', emperor: '宋理宗' },
  { era_name: '绍定', start_year: 1228, end_year: 1233, dynasty_id: 16, dynasty_name: '南宋', emperor: '宋理宗' },
  { era_name: '端平', start_year: 1234, end_year: 1236, dynasty_id: 16, dynasty_name: '南宋', emperor: '宋理宗' },
  { era_name: '嘉熙', start_year: 1237, end_year: 1240, dynasty_id: 16, dynasty_name: '南宋', emperor: '宋理宗' },
  { era_name: '淳祐', start_year: 1241, end_year: 1252, dynasty_id: 16, dynasty_name: '南宋', emperor: '宋理宗' },
  { era_name: '宝祐', start_year: 1253, end_year: 1258, dynasty_id: 16, dynasty_name: '南宋', emperor: '宋理宗' },
  { era_name: '开庆', start_year: 1259, end_year: 1259, dynasty_id: 16, dynasty_name: '南宋', emperor: '宋理宗' },
  { era_name: '景定', start_year: 1260, end_year: 1264, dynasty_id: 16, dynasty_name: '南宋', emperor: '宋理宗' },
  { era_name: '咸淳', start_year: 1265, end_year: 1274, dynasty_id: 16, dynasty_name: '南宋', emperor: '宋度宗' },
  { era_name: '德祐', start_year: 1275, end_year: 1276, dynasty_id: 16, dynasty_name: '南宋', emperor: '宋恭帝' },

  // ===== 明 (dynasty_id: 18) =====
  { era_name: '洪武', start_year: 1368, end_year: 1398, dynasty_id: 18, dynasty_name: '明', emperor: '明太祖' },
  { era_name: '建文', start_year: 1399, end_year: 1402, dynasty_id: 18, dynasty_name: '明', emperor: '明惠宗' },
  { era_name: '永乐', start_year: 1403, end_year: 1424, dynasty_id: 18, dynasty_name: '明', emperor: '明成祖' },
  { era_name: '洪熙', start_year: 1425, end_year: 1425, dynasty_id: 18, dynasty_name: '明', emperor: '明仁宗' },
  { era_name: '宣德', start_year: 1426, end_year: 1435, dynasty_id: 18, dynasty_name: '明', emperor: '明宣宗' },
  { era_name: '正统', start_year: 1436, end_year: 1449, dynasty_id: 18, dynasty_name: '明', emperor: '明英宗' },
  { era_name: '景泰', start_year: 1450, end_year: 1456, dynasty_id: 18, dynasty_name: '明', emperor: '明代宗' },
  { era_name: '天顺', start_year: 1457, end_year: 1464, dynasty_id: 18, dynasty_name: '明', emperor: '明英宗' },
  { era_name: '成化', start_year: 1465, end_year: 1487, dynasty_id: 18, dynasty_name: '明', emperor: '明宪宗' },
  { era_name: '弘治', start_year: 1488, end_year: 1505, dynasty_id: 18, dynasty_name: '明', emperor: '明孝宗' },
  { era_name: '正德', start_year: 1506, end_year: 1521, dynasty_id: 18, dynasty_name: '明', emperor: '明武宗' },
  { era_name: '嘉靖', start_year: 1522, end_year: 1566, dynasty_id: 18, dynasty_name: '明', emperor: '明世宗' },
  { era_name: '隆庆', start_year: 1567, end_year: 1572, dynasty_id: 18, dynasty_name: '明', emperor: '明穆宗' },
  { era_name: '万历', start_year: 1573, end_year: 1620, dynasty_id: 18, dynasty_name: '明', emperor: '明神宗' },
  { era_name: '泰昌', start_year: 1620, end_year: 1620, dynasty_id: 18, dynasty_name: '明', emperor: '明光宗' },
  { era_name: '天启', start_year: 1621, end_year: 1627, dynasty_id: 18, dynasty_name: '明', emperor: '明熹宗' },
  { era_name: '崇祯', start_year: 1628, end_year: 1644, dynasty_id: 18, dynasty_name: '明', emperor: '明思宗' },

  // ===== 清 (dynasty_id: 19) =====
  { era_name: '顺治', start_year: 1644, end_year: 1661, dynasty_id: 19, dynasty_name: '清', emperor: '清世祖' },
  { era_name: '康熙', start_year: 1662, end_year: 1722, dynasty_id: 19, dynasty_name: '清', emperor: '清圣祖' },
  { era_name: '雍正', start_year: 1723, end_year: 1735, dynasty_id: 19, dynasty_name: '清', emperor: '清世宗' },
  { era_name: '乾隆', start_year: 1736, end_year: 1795, dynasty_id: 19, dynasty_name: '清', emperor: '清高宗' },
  { era_name: '嘉庆', start_year: 1796, end_year: 1820, dynasty_id: 19, dynasty_name: '清', emperor: '清仁宗' },
  { era_name: '道光', start_year: 1821, end_year: 1850, dynasty_id: 19, dynasty_name: '清', emperor: '清宣宗' },
  { era_name: '咸丰', start_year: 1851, end_year: 1861, dynasty_id: 19, dynasty_name: '清', emperor: '清文宗' },
  { era_name: '同治', start_year: 1862, end_year: 1874, dynasty_id: 19, dynasty_name: '清', emperor: '清穆宗' },
  { era_name: '光绪', start_year: 1875, end_year: 1908, dynasty_id: 19, dynasty_name: '清', emperor: '清德宗' },
  { era_name: '宣统', start_year: 1909, end_year: 1911, dynasty_id: 19, dynasty_name: '清', emperor: '清逊帝' },
];

/**
 * 年号-公元年映射缓存
 * 结构: Map<eraName, EraNameRecord[]>
 */
let eraNameCache: Map<string, EraNameRecord[]> | null = null;

/**
 * 加载年号映射数据
 */
async function loadEraNameCache(): Promise<Map<string, EraNameRecord[]>> {
  if (eraNameCache) return eraNameCache;

  eraNameCache = new Map();
  for (const record of ERA_TABLE) {
    const existing = eraNameCache.get(record.era_name) || [];
    existing.push(record);
    eraNameCache.set(record.era_name, existing);
  }
  return eraNameCache;
}

/**
 * 年号转公元年
 * @param eraName 年号名（如"贞观"、"开元"）
 * @param eraYear 年号年数（如贞观1年=627年）
 */
export async function eraNameToYear(eraName: string, eraYear: number): Promise<number | null> {
  const cache = await loadEraNameCache();
  const records = cache.get(eraName);
  if (!records || records.length === 0) return null;

  // 取第一条匹配记录
  const record = records[0];
  return record.start_year + eraYear - 1;
}

/**
 * 公元年转年号
 * @param year 公元年
 * @returns 年号信息数组（可能跨多个年号）
 */
export async function yearToEraName(year: number): Promise<Array<{
  era_name: string;
  era_year: number;
  dynasty_name: string;
}>> {
  const cache = await loadEraNameCache();
  const results: Array<{ era_name: string; era_year: number; dynasty_name: string }> = [];

  for (const [eraName, records] of cache) {
    for (const record of records) {
      if (year >= record.start_year && year <= record.end_year) {
        results.push({
          era_name: eraName,
          era_year: Math.round(year - record.start_year + 1),
          dynasty_name: record.dynasty_name,
        });
      }
    }
  }

  return results;
}

/**
 * 格式化年份显示（带年号）
 */
export async function formatYearFull(year: number): Promise<string> {
  const eraNames = await yearToEraName(year);
  const base = year < 0
    ? `前${Math.abs(Math.round(year))}年`
    : `${Math.round(year)}年`;

  if (eraNames.length > 0) {
    const era = eraNames[0];
    return `${era.dynasty_name}${era.era_name}${era.era_year}年（${base}）`;
  }
  return base;
}

/**
 * 常用年号快速映射表（硬编码核心数据，减少查询）
 * 覆盖西汉、新莽、东汉、三国（魏蜀吴）、两晋、隋、唐、北宋、南宋、元、明、清全部主要年号
 */
export const COMMON_ERA_NAMES: Record<string, { start_year: number; dynasty: string }> = {
  // ===== 西汉 (dynasty_id: 6) =====
  '建元（西汉）': { start_year: -140, dynasty: '西汉' },
  '元光': { start_year: -134, dynasty: '西汉' },
  '元朔': { start_year: -128, dynasty: '西汉' },
  '元狩': { start_year: -122, dynasty: '西汉' },
  '元鼎': { start_year: -116, dynasty: '西汉' },
  '元封': { start_year: -110, dynasty: '西汉' },
  '太初': { start_year: -104, dynasty: '西汉' },
  '天汉': { start_year: -100, dynasty: '西汉' },
  '太始': { start_year: -96, dynasty: '西汉' },
  '征和': { start_year: -92, dynasty: '西汉' },
  '后元': { start_year: -88, dynasty: '西汉' },
  '始元': { start_year: -86, dynasty: '西汉' },
  '元凤': { start_year: -80, dynasty: '西汉' },
  '元平': { start_year: -74, dynasty: '西汉' },
  '本始': { start_year: -73, dynasty: '西汉' },
  '地节': { start_year: -69, dynasty: '西汉' },
  '元康（西汉）': { start_year: -65, dynasty: '西汉' },
  '神爵': { start_year: -61, dynasty: '西汉' },
  '五凤（西汉）': { start_year: -57, dynasty: '西汉' },
  '甘露': { start_year: -53, dynasty: '西汉' },
  '黄龙（西汉）': { start_year: -49, dynasty: '西汉' },
  '初元': { start_year: -48, dynasty: '西汉' },
  '永光': { start_year: -43, dynasty: '西汉' },
  '建昭': { start_year: -38, dynasty: '西汉' },
  '竟宁': { start_year: -33, dynasty: '西汉' },
  '建始（西汉）': { start_year: -32, dynasty: '西汉' },
  '河平': { start_year: -28, dynasty: '西汉' },
  '阳朔': { start_year: -24, dynasty: '西汉' },
  '鸿嘉': { start_year: -20, dynasty: '西汉' },
  '永始': { start_year: -16, dynasty: '西汉' },
  '元延': { start_year: -12, dynasty: '西汉' },
  '绥和': { start_year: -8, dynasty: '西汉' },
  '建平（西汉）': { start_year: -6, dynasty: '西汉' },
  '元寿': { start_year: -2, dynasty: '西汉' },
  '元始': { start_year: 1, dynasty: '西汉' },
  '居摄': { start_year: 6, dynasty: '西汉' },
  '初始': { start_year: 8, dynasty: '西汉' },

  // ===== 新/王莽 (dynasty_id: 6) =====
  '始建国': { start_year: 9, dynasty: '新' },
  '天凤（新）': { start_year: 14, dynasty: '新' },
  '地皇': { start_year: 20, dynasty: '新' },

  // ===== 东汉 (dynasty_id: 7) =====
  '建武（东汉）': { start_year: 25, dynasty: '东汉' },
  '建武中元': { start_year: 56, dynasty: '东汉' },
  '永平': { start_year: 58, dynasty: '东汉' },
  '建初': { start_year: 76, dynasty: '东汉' },
  '元和（东汉）': { start_year: 84, dynasty: '东汉' },
  '章和': { start_year: 87, dynasty: '东汉' },
  '永元': { start_year: 89, dynasty: '东汉' },
  '元兴（东汉）': { start_year: 105, dynasty: '东汉' },
  '延平': { start_year: 106, dynasty: '东汉' },
  '永初': { start_year: 107, dynasty: '东汉' },
  '元初': { start_year: 114, dynasty: '东汉' },
  '永宁（东汉）': { start_year: 120, dynasty: '东汉' },
  '建光': { start_year: 121, dynasty: '东汉' },
  '延光': { start_year: 122, dynasty: '东汉' },
  '永建': { start_year: 126, dynasty: '东汉' },
  '阳嘉': { start_year: 132, dynasty: '东汉' },
  '永和（东汉）': { start_year: 136, dynasty: '东汉' },
  '汉安': { start_year: 142, dynasty: '东汉' },
  '建康': { start_year: 144, dynasty: '东汉' },
  '永憙': { start_year: 145, dynasty: '东汉' },
  '本初': { start_year: 146, dynasty: '东汉' },
  '建和': { start_year: 147, dynasty: '东汉' },
  '和平': { start_year: 150, dynasty: '东汉' },
  '元嘉': { start_year: 151, dynasty: '东汉' },
  '永兴（东汉）': { start_year: 153, dynasty: '东汉' },
  '永寿': { start_year: 155, dynasty: '东汉' },
  '延熹': { start_year: 158, dynasty: '东汉' },
  '永康（东汉）': { start_year: 167, dynasty: '东汉' },
  '建宁': { start_year: 168, dynasty: '东汉' },
  '熹平': { start_year: 172, dynasty: '东汉' },
  '光和': { start_year: 178, dynasty: '东汉' },
  '中平': { start_year: 184, dynasty: '东汉' },
  '初平': { start_year: 190, dynasty: '东汉' },
  '建安': { start_year: 196, dynasty: '东汉' },
  '延康': { start_year: 220, dynasty: '东汉' },

  // ===== 三国·魏 (dynasty_id: 8) =====
  '黄初': { start_year: 220, dynasty: '魏' },
  '太和（魏）': { start_year: 227, dynasty: '魏' },
  '青龙': { start_year: 233, dynasty: '魏' },
  '景初': { start_year: 237, dynasty: '魏' },
  '正始': { start_year: 240, dynasty: '魏' },
  '嘉平': { start_year: 249, dynasty: '魏' },
  '正元': { start_year: 254, dynasty: '魏' },
  '甘露（魏）': { start_year: 256, dynasty: '魏' },
  '景元': { start_year: 260, dynasty: '魏' },
  '咸熙': { start_year: 264, dynasty: '魏' },

  // ===== 三国·蜀 (dynasty_id: 8) =====
  '章武': { start_year: 221, dynasty: '蜀' },
  '建兴（蜀）': { start_year: 223, dynasty: '蜀' },
  '延熙': { start_year: 238, dynasty: '蜀' },
  '景耀': { start_year: 258, dynasty: '蜀' },
  '炎兴': { start_year: 263, dynasty: '蜀' },

  // ===== 三国·吴 (dynasty_id: 8) =====
  '黄武': { start_year: 222, dynasty: '吴' },
  '黄龙（吴）': { start_year: 229, dynasty: '吴' },
  '嘉禾': { start_year: 232, dynasty: '吴' },
  '赤乌': { start_year: 238, dynasty: '吴' },
  '太元': { start_year: 251, dynasty: '吴' },
  '神凤': { start_year: 252, dynasty: '吴' },
  '五凤（吴）': { start_year: 254, dynasty: '吴' },
  '太平（吴）': { start_year: 256, dynasty: '吴' },
  '永安': { start_year: 258, dynasty: '吴' },
  '元兴（吴）': { start_year: 264, dynasty: '吴' },
  '宝鼎': { start_year: 266, dynasty: '吴' },
  '建衡': { start_year: 269, dynasty: '吴' },
  '凤凰': { start_year: 272, dynasty: '吴' },
  '天册': { start_year: 275, dynasty: '吴' },
  '天玺': { start_year: 276, dynasty: '吴' },
  '天纪': { start_year: 277, dynasty: '吴' },

  // ===== 西晋 (dynasty_id: 9) =====
  '泰始': { start_year: 265, dynasty: '西晋' },
  '咸宁': { start_year: 275, dynasty: '西晋' },
  '太康': { start_year: 280, dynasty: '西晋' },
  '太熙': { start_year: 290, dynasty: '西晋' },
  '永平（西晋）': { start_year: 291, dynasty: '西晋' },
  '元康': { start_year: 291, dynasty: '西晋' },
  '永康（西晋）': { start_year: 300, dynasty: '西晋' },
  '永宁（西晋）': { start_year: 301, dynasty: '西晋' },
  '太安': { start_year: 302, dynasty: '西晋' },
  '永兴（西晋）': { start_year: 304, dynasty: '西晋' },
  '光熙': { start_year: 306, dynasty: '西晋' },
  '永嘉': { start_year: 307, dynasty: '西晋' },
  '建兴（西晋）': { start_year: 313, dynasty: '西晋' },

  // ===== 东晋 (dynasty_id: 10) =====
  '建武（东晋）': { start_year: 317, dynasty: '东晋' },
  '太兴': { start_year: 318, dynasty: '东晋' },
  '永昌': { start_year: 322, dynasty: '东晋' },
  '太宁': { start_year: 323, dynasty: '东晋' },
  '咸和': { start_year: 326, dynasty: '东晋' },
  '咸康': { start_year: 335, dynasty: '东晋' },
  '建元（东晋）': { start_year: 343, dynasty: '东晋' },
  '永和（东晋）': { start_year: 345, dynasty: '东晋' },
  '升平': { start_year: 357, dynasty: '东晋' },
  '隆和': { start_year: 362, dynasty: '东晋' },
  '兴宁': { start_year: 363, dynasty: '东晋' },
  '太和（东晋）': { start_year: 366, dynasty: '东晋' },
  '咸安': { start_year: 371, dynasty: '东晋' },
  '宁康': { start_year: 373, dynasty: '东晋' },
  '太元（东晋）': { start_year: 376, dynasty: '东晋' },
  '隆安': { start_year: 397, dynasty: '东晋' },
  '元兴（东晋）': { start_year: 402, dynasty: '东晋' },
  '义熙': { start_year: 405, dynasty: '东晋' },
  '元熙': { start_year: 419, dynasty: '东晋' },

  // ===== 隋 (dynasty_id: 12) =====
  '开皇': { start_year: 581, dynasty: '隋' },
  '仁寿': { start_year: 601, dynasty: '隋' },
  '大业': { start_year: 605, dynasty: '隋' },

  // ===== 唐 (dynasty_id: 13) =====
  '武德': { start_year: 618, dynasty: '唐' },
  '贞观': { start_year: 627, dynasty: '唐' },
  '永徽': { start_year: 650, dynasty: '唐' },
  '显庆': { start_year: 656, dynasty: '唐' },
  '龙朔': { start_year: 661, dynasty: '唐' },
  '麟德': { start_year: 664, dynasty: '唐' },
  '乾封': { start_year: 666, dynasty: '唐' },
  '总章': { start_year: 668, dynasty: '唐' },
  '咸亨': { start_year: 670, dynasty: '唐' },
  '上元（唐）': { start_year: 674, dynasty: '唐' },
  '仪凤': { start_year: 676, dynasty: '唐' },
  '调露': { start_year: 679, dynasty: '唐' },
  '永隆': { start_year: 680, dynasty: '唐' },
  '开耀': { start_year: 681, dynasty: '唐' },
  '永淳': { start_year: 682, dynasty: '唐' },
  '弘道': { start_year: 683, dynasty: '唐' },
  '嗣圣': { start_year: 684, dynasty: '唐' },
  '文明（唐）': { start_year: 684, dynasty: '唐' },
  '光宅': { start_year: 684, dynasty: '唐' },
  '垂拱': { start_year: 685, dynasty: '唐' },
  '永昌（唐）': { start_year: 689, dynasty: '唐' },
  '载初': { start_year: 689, dynasty: '唐' },
  '天授': { start_year: 690, dynasty: '唐' },
  '如意': { start_year: 692, dynasty: '唐' },
  '长寿': { start_year: 692, dynasty: '唐' },
  '延载': { start_year: 694, dynasty: '唐' },
  '证圣': { start_year: 695, dynasty: '唐' },
  '天册万岁': { start_year: 695, dynasty: '唐' },
  '万岁登封': { start_year: 696, dynasty: '唐' },
  '万岁通天': { start_year: 696, dynasty: '唐' },
  '神功': { start_year: 697, dynasty: '唐' },
  '圣历': { start_year: 698, dynasty: '唐' },
  '久视': { start_year: 700, dynasty: '唐' },
  '大足': { start_year: 701, dynasty: '唐' },
  '长安': { start_year: 701, dynasty: '唐' },
  '神龙': { start_year: 705, dynasty: '唐' },
  '景龙': { start_year: 707, dynasty: '唐' },
  '唐隆': { start_year: 710, dynasty: '唐' },
  '景云': { start_year: 710, dynasty: '唐' },
  '太极': { start_year: 712, dynasty: '唐' },
  '延和（唐）': { start_year: 712, dynasty: '唐' },
  '先天': { start_year: 712, dynasty: '唐' },
  '开元': { start_year: 713, dynasty: '唐' },
  '天宝': { start_year: 742, dynasty: '唐' },
  '至德': { start_year: 756, dynasty: '唐' },
  '乾元': { start_year: 758, dynasty: '唐' },
  '宝应': { start_year: 762, dynasty: '唐' },
  '广德': { start_year: 763, dynasty: '唐' },
  '永泰': { start_year: 765, dynasty: '唐' },
  '大历': { start_year: 766, dynasty: '唐' },
  '建中（唐）': { start_year: 780, dynasty: '唐' },
  '兴元': { start_year: 784, dynasty: '唐' },
  '贞元': { start_year: 785, dynasty: '唐' },
  '永贞': { start_year: 805, dynasty: '唐' },
  '元和（唐）': { start_year: 806, dynasty: '唐' },
  '长庆': { start_year: 821, dynasty: '唐' },
  '宝历': { start_year: 825, dynasty: '唐' },
  '大和': { start_year: 827, dynasty: '唐' },
  '开成': { start_year: 836, dynasty: '唐' },
  '会昌': { start_year: 841, dynasty: '唐' },
  '大中（唐）': { start_year: 847, dynasty: '唐' },
  '咸通': { start_year: 860, dynasty: '唐' },
  '乾符': { start_year: 874, dynasty: '唐' },
  '广明': { start_year: 880, dynasty: '唐' },
  '中和（唐）': { start_year: 881, dynasty: '唐' },
  '光启（唐）': { start_year: 885, dynasty: '唐' },
  '文德': { start_year: 888, dynasty: '唐' },
  '龙纪': { start_year: 889, dynasty: '唐' },
  '大顺（唐）': { start_year: 890, dynasty: '唐' },
  '景福（唐）': { start_year: 892, dynasty: '唐' },
  '乾宁（唐）': { start_year: 894, dynasty: '唐' },
  '光化（唐）': { start_year: 898, dynasty: '唐' },
  '天复（唐）': { start_year: 901, dynasty: '唐' },
  '天祐（唐）': { start_year: 904, dynasty: '唐' },

  // ===== 北宋 (dynasty_id: 15) =====
  '建隆（北宋）': { start_year: 960, dynasty: '北宋' },
  '乾德': { start_year: 963, dynasty: '北宋' },
  '开宝': { start_year: 968, dynasty: '北宋' },
  '太平兴国（北宋）': { start_year: 976, dynasty: '北宋' },
  '雍熙': { start_year: 984, dynasty: '北宋' },
  '端拱': { start_year: 988, dynasty: '北宋' },
  '淳化': { start_year: 990, dynasty: '北宋' },
  '至道': { start_year: 995, dynasty: '北宋' },
  '咸平（北宋）': { start_year: 998, dynasty: '北宋' },
  '景德': { start_year: 1004, dynasty: '北宋' },
  '大中祥符（北宋）': { start_year: 1008, dynasty: '北宋' },
  '天禧': { start_year: 1017, dynasty: '北宋' },
  '乾兴': { start_year: 1022, dynasty: '北宋' },
  '天圣': { start_year: 1023, dynasty: '北宋' },
  '明道（北宋）': { start_year: 1032, dynasty: '北宋' },
  '景祐': { start_year: 1034, dynasty: '北宋' },
  '宝元': { start_year: 1038, dynasty: '北宋' },
  '康定': { start_year: 1040, dynasty: '北宋' },
  '庆历': { start_year: 1041, dynasty: '北宋' },
  '皇祐': { start_year: 1049, dynasty: '北宋' },
  '至和': { start_year: 1054, dynasty: '北宋' },
  '嘉祐': { start_year: 1056, dynasty: '北宋' },
  '治平': { start_year: 1064, dynasty: '北宋' },
  '熙宁': { start_year: 1068, dynasty: '北宋' },
  '元丰': { start_year: 1078, dynasty: '北宋' },
  '元祐': { start_year: 1086, dynasty: '北宋' },
  '绍圣': { start_year: 1094, dynasty: '北宋' },
  '元符': { start_year: 1098, dynasty: '北宋' },
  '建中靖国': { start_year: 1101, dynasty: '北宋' },
  '崇宁': { start_year: 1102, dynasty: '北宋' },
  '大观': { start_year: 1107, dynasty: '北宋' },
  '政和': { start_year: 1111, dynasty: '北宋' },
  '重和': { start_year: 1118, dynasty: '北宋' },
  '宣和': { start_year: 1119, dynasty: '北宋' },

  // ===== 南宋 (dynasty_id: 16) =====
  '建炎（南宋）': { start_year: 1127, dynasty: '南宋' },
  '绍兴（南宋）': { start_year: 1131, dynasty: '南宋' },
  '隆兴（南宋）': { start_year: 1163, dynasty: '南宋' },
  '乾道': { start_year: 1165, dynasty: '南宋' },
  '淳熙': { start_year: 1174, dynasty: '南宋' },
  '绍熙（南宋）': { start_year: 1190, dynasty: '南宋' },
  '庆元': { start_year: 1195, dynasty: '南宋' },
  '嘉泰（南宋）': { start_year: 1201, dynasty: '南宋' },
  '开禧（南宋）': { start_year: 1205, dynasty: '南宋' },
  '嘉定（南宋）': { start_year: 1208, dynasty: '南宋' },
  '宝庆（南宋）': { start_year: 1225, dynasty: '南宋' },
  '绍定（南宋）': { start_year: 1228, dynasty: '南宋' },
  '端平（南宋）': { start_year: 1234, dynasty: '南宋' },
  '嘉熙（南宋）': { start_year: 1237, dynasty: '南宋' },
  '淳祐（南宋）': { start_year: 1241, dynasty: '南宋' },
  '宝祐（南宋）': { start_year: 1253, dynasty: '南宋' },
  '开庆（南宋）': { start_year: 1259, dynasty: '南宋' },
  '景定（南宋）': { start_year: 1260, dynasty: '南宋' },
  '咸淳（南宋）': { start_year: 1265, dynasty: '南宋' },
  '德祐（南宋）': { start_year: 1275, dynasty: '南宋' },

  // ===== 元 (dynasty_id: 17) =====
  '中统（元）': { start_year: 1260, dynasty: '元' },
  '至元（元）': { start_year: 1264, dynasty: '元' },
  '元贞（元）': { start_year: 1295, dynasty: '元' },
  '大德（元）': { start_year: 1297, dynasty: '元' },
  '至大（元）': { start_year: 1308, dynasty: '元' },
  '皇庆（元）': { start_year: 1312, dynasty: '元' },
  '延祐（元）': { start_year: 1314, dynasty: '元' },
  '至治（元）': { start_year: 1321, dynasty: '元' },
  '泰定（元）': { start_year: 1324, dynasty: '元' },
  '天历（元）': { start_year: 1328, dynasty: '元' },
  '至顺（元）': { start_year: 1330, dynasty: '元' },
  '元统（元）': { start_year: 1333, dynasty: '元' },
  '至正（元）': { start_year: 1341, dynasty: '元' },

  // ===== 明 (dynasty_id: 18) =====
  '洪武（明）': { start_year: 1368, dynasty: '明' },
  '建文（明）': { start_year: 1399, dynasty: '明' },
  '永乐（明）': { start_year: 1403, dynasty: '明' },
  '洪熙（明）': { start_year: 1425, dynasty: '明' },
  '宣德（明）': { start_year: 1426, dynasty: '明' },
  '正统（明）': { start_year: 1436, dynasty: '明' },
  '景泰（明）': { start_year: 1450, dynasty: '明' },
  '天顺（明）': { start_year: 1457, dynasty: '明' },
  '成化（明）': { start_year: 1465, dynasty: '明' },
  '弘治（明）': { start_year: 1488, dynasty: '明' },
  '正德（明）': { start_year: 1506, dynasty: '明' },
  '嘉靖（明）': { start_year: 1522, dynasty: '明' },
  '隆庆（明）': { start_year: 1567, dynasty: '明' },
  '万历（明）': { start_year: 1573, dynasty: '明' },
  '泰昌（明）': { start_year: 1620, dynasty: '明' },
  '天启（明）': { start_year: 1621, dynasty: '明' },
  '崇祯（明）': { start_year: 1628, dynasty: '明' },

  // ===== 清 (dynasty_id: 19) =====
  '顺治（清）': { start_year: 1644, dynasty: '清' },
  '康熙（清）': { start_year: 1662, dynasty: '清' },
  '雍正（清）': { start_year: 1723, dynasty: '清' },
  '乾隆（清）': { start_year: 1736, dynasty: '清' },
  '嘉庆（清）': { start_year: 1796, dynasty: '清' },
  '道光（清）': { start_year: 1821, dynasty: '清' },
  '咸丰（清）': { start_year: 1851, dynasty: '清' },
  '同治（清）': { start_year: 1862, dynasty: '清' },
  '光绪（清）': { start_year: 1875, dynasty: '清' },
  '宣统（清）': { start_year: 1909, dynasty: '清' },
};
