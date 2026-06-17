// 华夏时空 - 纪年表API适配器（农历转换）

import { cacheOrFetch } from '@/services/redis';
import { query } from '@/services/db';
import { CACHE_TTL } from '@/lib/constants';

const BASE_URL = process.env.CHRONOLOGY_API_URL || '';

/**
 * 纪年表与农历转换服务
 */
export class ChronologyService {
  /**
   * 农历转公历
   * 优先查本地lunar_calendar表，再查外部API
   */
  async lunarToSolar(
    year: number,
    lunarMonth: number,
    lunarDay: number
  ): Promise<{ solar_month: number; solar_day: number } | null> {
    // 1. 优先查本地表
    const local = await this.queryLocalLunarCalendar(year, lunarMonth, lunarDay);
    if (local) return local;

    // 2. 调用外部API
    if (!BASE_URL) return null;

    const cacheKey = `chrono:lunar2solar:${year}:${lunarMonth}:${lunarDay}`;

    return cacheOrFetch(
      cacheKey,
      async () => {
        const data = await this.fetchWithRetry(`${BASE_URL}/convert`, {
          type: 'lunar2solar',
          year: year.toString(),
          month: lunarMonth.toString(),
          day: lunarDay.toString(),
        });

        return {
          solar_month: data.solar_month as number,
          solar_day: data.solar_day as number,
        };
      },
      CACHE_TTL.LUNAR_CONVERT
    );
  }

  /**
   * 公历转农历（用于反向查询"今日历史"）
   * 返回指定公历月日对应的各年农历月日
   */
  async solarToLunar(
    solarMonth: number,
    solarDay: number
  ): Promise<Array<{ year: number; lunar_month: number; lunar_day: number }>> {
    // 查本地表
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
   * 年号转公元年
   */
  async eraNameToYear(eraName: string, eraYear: number): Promise<number | null> {
    if (!BASE_URL) return null;

    const cacheKey = `chrono:era2year:${eraName}:${eraYear}`;

    const result = await cacheOrFetch(
      cacheKey,
      async () => {
        const data = await this.fetchWithRetry(`${BASE_URL}/convert`, {
          type: 'era2year',
          era_name: eraName,
          era_year: eraYear.toString(),
        });
        return data.year as number;
      },
      CACHE_TTL.LUNAR_CONVERT
    );

    return result;
  }

  /**
   * 查询本地lunar_calendar表
   */
  private async queryLocalLunarCalendar(
    year: number,
    lunarMonth: number,
    lunarDay: number
  ): Promise<{ solar_month: number; solar_day: number } | null> {
    try {
      const result = await query(
        `SELECT solar_month, solar_day FROM lunar_calendar
         WHERE year = $1 AND lunar_month = $2 AND lunar_day = $3
         LIMIT 1`,
        [year, lunarMonth, lunarDay]
      );
      return (result.rows[0] as { solar_month: number; solar_day: number }) || null;
    } catch {
      return null;
    }
  }

  private async fetchWithRetry(
    url: string,
    params: Record<string, string>,
    retries = 3
  ): Promise<Record<string, unknown>> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const qs = new URLSearchParams(params).toString();
        const res = await fetch(`${url}?${qs}`, {
          headers: { 'Accept': 'application/json' },
          signal: AbortSignal.timeout(10000),
        });

        if (!res.ok) throw new Error(`Chronology API error: ${res.status}`);
        return await res.json();
      } catch (error) {
        if (attempt === retries) {
          console.error(`Chronology API failed after ${retries} attempts:`, error);
          throw error;
        }
        await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt - 1)));
      }
    }
    throw new Error('Chronology API: unreachable');
  }
}

export const chronologyService = new ChronologyService();
