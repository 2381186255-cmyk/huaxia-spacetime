// 华夏时空 - CHGIS外部API适配器

import { cacheOrFetch } from '@/services/redis';
import { CACHE_TTL } from '@/lib/constants';
import type { CHGISPlace } from '@/lib/types';

const BASE_URL = process.env.CHGIS_API_URL || 'https://chgis.fas.harvard.edu/api';
const API_KEY = process.env.CHGIS_API_KEY || '';

/**
 * CHGIS历史地名查询服务
 */
export class CHGISService {
  /**
   * 查询历史地名
   */
  async searchPlaces(query: string, year?: number): Promise<CHGISPlace[]> {
    const cacheKey = `chgis:search:${query}:${year || 'all'}`;

    return cacheOrFetch(
      cacheKey,
      async () => {
        const data = await this.fetchWithRetry(`${BASE_URL}/places`, {
          q: query,
          year: year?.toString(),
        });

        return ((data.results as Record<string, unknown>[]) || []).map((item) => ({
          chgis_id: item.id as string,
          name: item.name_zh as string,
          name_py: item.name_py as string,
          year_range: [item.beg_yr, item.end_yr] as [number, number],
          geom: {
            type: 'Feature' as const,
            geometry: {
              type: 'Point' as const,
              coordinates: [item.x_coord, item.y_coord] as [number, number],
            },
            properties: {},
          },
          url: `https://chgis.fas.harvard.edu/places/${item.id}`,
        }));
      },
      CACHE_TTL.EXTERNAL_DATA
    );
  }

  /**
   * 将CHGIS数据映射到内部historical_places模型
   */
  mapToInternalPlace(chgisPlace: CHGISPlace) {
    return {
      name: chgisPlace.name,
      start_year: chgisPlace.year_range[0],
      end_year: chgisPlace.year_range[1],
      geom: chgisPlace.geom,
      external_refs: {
        chgis_id: chgisPlace.chgis_id,
        chgis_url: chgisPlace.url,
      },
    };
  }

  /**
   * 带重试的HTTP请求
   */
  private async fetchWithRetry(
    url: string,
    params: Record<string, string | undefined>,
    retries = 3
  ): Promise<Record<string, unknown>> {
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== undefined)
    ) as Record<string, string>;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const qs = new URLSearchParams(filteredParams).toString();
        const res = await fetch(`${url}?${qs}`, {
          headers: {
            ...(API_KEY ? { 'Authorization': `Bearer ${API_KEY}` } : {}),
            'Accept': 'application/json',
          },
          signal: AbortSignal.timeout(10000),
        });

        if (!res.ok) {
          throw new Error(`CHGIS API error: ${res.status}`);
        }

        return await res.json();
      } catch (error) {
        if (attempt === retries) {
          console.error(`CHGIS API failed after ${retries} attempts:`, error);
          throw error;
        }
        await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt - 1)));
      }
    }

    throw new Error('CHGIS API: unreachable');
  }
}

// 单例导出
export const chgisService = new CHGISService();
