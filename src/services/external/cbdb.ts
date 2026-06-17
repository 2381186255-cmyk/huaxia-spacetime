// 华夏时空 - CBDB中国历代人物传记资料库适配器

import { cacheOrFetch } from '@/services/redis';
import { CACHE_TTL } from '@/lib/constants';
import { isAllowedExternalUrl } from '@/lib/security';
import type { CBDBPerson } from '@/lib/types';

const BASE_URL = process.env.CBDB_API_URL || 'https://cbdb.fas.harvard.edu/api';

/**
 * CBDB人物查询服务
 */
export class CBDBService {
  /**
   * 查询人物信息
   */
  async getPerson(cbdbId: string): Promise<CBDBPerson> {
    const cacheKey = `cbdb:person:${cbdbId}`;

    return cacheOrFetch(
      cacheKey,
      async () => {
        const data = await this.fetchWithRetry(`${BASE_URL}/persons/${cbdbId}`);

        return {
          cbdb_id: data.PersonId as number,
          name: (data.PersonName as Record<string, string>)?.CharPrimary || '',
          name_en: (data.PersonName as Record<string, string>)?.EngPrimary || undefined,
          birth_year: (data.BirthYear as number) || undefined,
          death_year: (data.DeathYear as number) || undefined,
          dynasty: (data.Dynasty as string) || undefined,
          offices: ((data.Offices as Record<string, unknown>[]) || []).map((o) => ({
            office_name: o.OfficeName as string,
            start_year: o.StartYear as number | undefined,
            end_year: o.EndYear as number | undefined,
          })),
          kinship_relations: ((data.Kinship as Record<string, unknown>[]) || []).map((k) => ({
            relation_type: k.KinshipCode as string,
            related_person_id: k.RelatedPersonId as number,
            related_person_name: k.RelatedPersonName as string,
          })),
          associations: ((data.Associations as Record<string, unknown>[]) || []).map((a) => ({
            assoc_type: a.AssocCode as string,
            associated_person_id: a.AssocPersonId as number,
            associated_person_name: a.AssocPersonName as string,
          })),
        };
      },
      CACHE_TTL.EXTERNAL_DATA
    );
  }

  /**
   * 搜索人物
   */
  async searchPersons(query: string, dynasty?: string): Promise<CBDBPerson[]> {
    const cacheKey = `cbdb:search:${query}:${dynasty || 'all'}`;

    return cacheOrFetch(
      cacheKey,
      async () => {
        const data = await this.fetchWithRetry(`${BASE_URL}/persons`, {
          q: query,
          dynasty,
        });

        return ((data.results as Record<string, unknown>[]) || []).map((item) => ({
          cbdb_id: item.PersonId as number,
          name: (item.PersonName as Record<string, string>)?.CharPrimary || '',
          birth_year: item.BirthYear as number | undefined,
          death_year: item.DeathYear as number | undefined,
          dynasty: item.Dynasty as string | undefined,
          offices: [],
          kinship_relations: [],
          associations: [],
        }));
      },
      CACHE_TTL.EXTERNAL_DATA
    );
  }

  /**
   * 映射到内部persons模型
   */
  mapToInternalPerson(cbdbPerson: CBDBPerson) {
    return {
      name: cbdbPerson.name,
      name_en: cbdbPerson.name_en,
      birth_year: cbdbPerson.birth_year,
      death_year: cbdbPerson.death_year,
      external_refs: {
        cbdb_id: cbdbPerson.cbdb_id.toString(),
        cbdb_url: `https://cbdb.fas.harvard.edu/cbdbapi/person.php?id=${cbdbPerson.cbdb_id}`,
      },
    };
  }

  /**
   * 映射关系数据
   */
  mapRelations(cbdbPerson: CBDBPerson) {
    const relations: Array<{
      to_person_id: number;
      relation_type: string;
      to_person_name: string;
    }> = [];

    for (const kin of cbdbPerson.kinship_relations) {
      relations.push({
        to_person_id: kin.related_person_id,
        relation_type: this.mapKinshipType(kin.relation_type),
        to_person_name: kin.related_person_name,
      });
    }

    for (const assoc of cbdbPerson.associations) {
      relations.push({
        to_person_id: assoc.associated_person_id,
        relation_type: this.mapAssocType(assoc.assoc_type),
        to_person_name: assoc.associated_person_name,
      });
    }

    return relations;
  }

  private mapKinshipType(code: string): string {
    const mapping: Record<string, string> = {
      'father': 'father',
      'mother': 'mother',
      'son': 'son',
      'daughter': 'daughter',
      'spouse': 'spouse',
      'brother': 'brother',
    };
    return mapping[code] || code;
  }

  private mapAssocType(code: string): string {
    const mapping: Record<string, string> = {
      'teacher': 'teacher',
      'student': 'student',
      'colleague': 'colleague',
      'friend': 'friend',
      'patron': 'patron',
    };
    return mapping[code] || code;
  }

  private async fetchWithRetry(
    url: string,
    params?: Record<string, string | undefined>,
    retries = 3
  ): Promise<Record<string, unknown>> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        let fetchUrl = url;
        if (params) {
          const filteredParams = Object.fromEntries(
            Object.entries(params).filter(([_, v]) => v !== undefined)
          ) as Record<string, string>;
          const qs = new URLSearchParams(filteredParams).toString();
          if (qs) fetchUrl += `?${qs}`;
        }

        const res = await fetch(fetchUrl, {
          headers: { 'Accept': 'application/json' },
          signal: AbortSignal.timeout(10000),
        });

        // SSRF防护：验证URL在白名单内
        if (!isAllowedExternalUrl(fetchUrl)) {
          throw new Error('CBDB API: URL not in allowed domains');
        }

        if (!res.ok) throw new Error(`CBDB API error: ${res.status}`);
        return await res.json();
      } catch (error) {
        if (attempt === retries) {
          console.error(`CBDB API failed after ${retries} attempts:`, error);
          throw error;
        }
        await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt - 1)));
      }
    }
    throw new Error('CBDB API: unreachable');
  }
}

export const cbdbService = new CBDBService();
