// 华夏时空 - 日期与农历转换工具（服务端专用，含数据库查询）

import { query } from '@/services/db';

/**
 * 公历月日转农历月日（查询本地对照表）
 * 返回所有匹配的年-农历月日组合
 */
export async function solarToLunar(
  solarMonth: number,
  solarDay: number
): Promise<Array<{ year: number; lunar_month: number; lunar_day: number }>> {
  const result = await query(
    `SELECT year, lunar_month, lunar_day
     FROM lunar_calendar
     WHERE solar_month = $1 AND solar_day = $2
     ORDER BY year`,
    [solarMonth, solarDay]
  );
  return result.rows as Array<{ year: number; lunar_month: number; lunar_day: number }>;
}

/**
 * 农历月日转公历月日（查询本地对照表）
 */
export async function lunarToSolar(
  year: number,
  lunarMonth: number,
  lunarDay: number
): Promise<{ solar_month: number; solar_day: number } | null> {
  const result = await query<{ solar_month: number; solar_day: number }>(
    `SELECT solar_month, solar_day
     FROM lunar_calendar
     WHERE year = $1 AND lunar_month = $2 AND lunar_day = $3
     LIMIT 1`,
    [year, lunarMonth, lunarDay]
  );
  return result.rows[0] || null;
}
