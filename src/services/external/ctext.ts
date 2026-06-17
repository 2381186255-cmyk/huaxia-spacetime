// 华夏时空 - CText中国哲学书电子化计划适配器

import { cacheOrFetch } from '@/services/redis';
import { CACHE_TTL } from '@/lib/constants';
import type { CTextDocument, CTextSearchResult } from '@/lib/types';

const BASE_URL = 'https://ctext.org/tools/api';

/**
 * CText古籍文献查询服务
 */
export class CTextService {
  /**
   * 获取古籍文本
   */
  async getText(textId: string): Promise<CTextDocument> {
    const cacheKey = `ctext:text:${textId}`;

    return cacheOrFetch(
      cacheKey,
      async () => {
        const data = await this.fetchWithRetry(`${BASE_URL}/get-text`, {
          id: textId,
          format: 'json',
        });

        return {
          ctext_id: textId,
          title: data.title as string || '',
          author: data.author as string || undefined,
          content: data.content as string || undefined,
          url: `https://ctext.org/wiki.pl?if=gb&res=${textId}`,
        };
      },
      CACHE_TTL.TEXT_CONTENT
    );
  }

  /**
   * 搜索文献
   */
  async search(query: string): Promise<CTextSearchResult[]> {
    const cacheKey = `ctext:search:${query}`;

    return cacheOrFetch(
      cacheKey,
      async () => {
        const data = await this.fetchWithRetry(`${BASE_URL}/search`, {
          q: query,
          format: 'json',
        });

        return ((data.results as Record<string, unknown>[]) || []).map((r) => ({
          ctext_id: r.id as string,
          title: r.title as string,
          author: r.author as string | undefined,
          excerpt: r.excerpt as string | undefined,
          url: `https://ctext.org/wiki.pl?if=gb&res=${r.id}`,
        }));
      },
      CACHE_TTL.EXTERNAL_DATA
    );
  }

  /**
   * 映射到内部documents模型
   */
  mapToInternalDocument(ctextDoc: CTextDocument) {
    return {
      title: ctextDoc.title,
      author: ctextDoc.author,
      external_refs: {
        ctext_id: ctextDoc.ctext_id,
        ctext_url: ctextDoc.url,
      },
    };
  }

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
          headers: { 'Accept': 'application/json' },
          signal: AbortSignal.timeout(15000),
        });

        if (!res.ok) throw new Error(`CText API error: ${res.status}`);
        return await res.json();
      } catch (error) {
        if (attempt === retries) {
          console.error(`CText API failed after ${retries} attempts:`, error);
          throw error;
        }
        await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt - 1)));
      }
    }
    throw new Error('CText API: unreachable');
  }
}

export const ctextService = new CTextService();
