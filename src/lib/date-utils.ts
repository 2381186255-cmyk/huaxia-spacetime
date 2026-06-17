// 华夏时空 - 日期与农历转换工具（纯工具函数，客户端安全）

/**
 * 获取今日公历月日
 */
export function getTodayMonthDay(): { month: number; day: number } {
  const now = new Date();
  return { month: now.getMonth() + 1, day: now.getDate() };
}

/**
 * 公元年份格式化显示
 * 负数显示为"前XXX年"，正数显示为"XXX年"
 */
export function formatYear(year: number): string {
  if (year < 0) {
    return `前${Math.abs(Math.round(year))}年`;
  }
  return `${Math.round(year)}年`;
}

/**
 * 公元年份格式化（含年号）
 */
export function formatYearWithEra(year: number, eraName?: string, eraYear?: number): string {
  const base = formatYear(year);
  if (eraName && eraYear) {
    return `${eraName}${eraYear}年（${base}）`;
  }
  return base;
}

/**
 * 计算两个年份之间的年数
 */
export function yearsBetween(startYear: number, endYear: number): number {
  return Math.abs(endYear - startYear);
}

/**
 * 判断年份是否在范围内
 */
export function isYearInRange(year: number, start: number, end: number): boolean {
  return year >= start && year <= end;
}

/**
 * 浮点年份转日期（用于事件模式的d3.scaleTime）
 */
export function yearToDate(year: number): Date {
  const intYear = Math.floor(year);
  const fraction = year - intYear;
  const date = new Date(intYear > 0 ? intYear : intYear + 1, 0, 1);
  if (fraction > 0) {
    const dayOfYear = Math.floor(fraction * 365);
    date.setDate(date.getDate() + dayOfYear);
  }
  return date;
}

/**
 * 日期转浮点年份
 */
export function dateToYear(date: Date): number {
  const year = date.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const dayOfYear = Math.floor(
    (date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000)
  );
  return year + dayOfYear / 365;
}
