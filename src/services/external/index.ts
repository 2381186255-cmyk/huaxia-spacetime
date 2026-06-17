// 华夏时空 - 外部API统一服务

import { chgisService } from './chgis';
import { cbdbService } from './cbdb';
import { ctextService } from './ctext';
import { chronologyService } from './chronology';
import { query } from '@/services/db';
import type { HistoricalEvent, CHGISPlace, CBDBPerson, CTextDocument } from '@/lib/types';

export { chgisService, cbdbService, ctextService, chronologyService };

/**
 * 聚合查询：根据事件ID，从多个外部源获取补充信息
 */
export async function enrichEvent(eventId: number): Promise<{
  event: HistoricalEvent | null;
  chgis: CHGISPlace[];
  cbdb: CBDBPerson[];
  ctext: CTextDocument[];
}> {
  const eventResult = await query<{
    id: number; name: string; start_year: number; start_month: number | null;
  }>(
    `SELECT id, name, start_year, start_month FROM historical_events WHERE id = $1`,
    [eventId]
  );

  const event = eventResult.rows[0] || null;

  if (!event) {
    return { event: null, chgis: [], cbdb: [], ctext: [] };
  }

  // 并行请求外部数据（使用allSettled避免单个失败影响整体）
  const [chgisPlaces, cbdbPersons, ctextDocs] = await Promise.allSettled([
    chgisService.searchPlaces(event.name, event.start_year),
    fetchEventPersons(event.id),
    fetchEventDocuments(event.id),
  ]);

  return {
    event: event as unknown as HistoricalEvent,
    chgis: chgisPlaces.status === 'fulfilled' ? chgisPlaces.value : [],
    cbdb: cbdbPersons.status === 'fulfilled' ? cbdbPersons.value : [],
    ctext: ctextDocs.status === 'fulfilled' ? ctextDocs.value : [],
  };
}

async function fetchEventPersons(eventId: number): Promise<CBDBPerson[]> {
  const result = await query(
    `SELECT p.external_refs->>'cbdb_id' as cbdb_id
     FROM persons p
     JOIN person_events pe ON p.id = pe.person_id
     WHERE pe.event_id = $1 AND p.external_refs->>'cbdb_id' IS NOT NULL`,
    [eventId]
  );

  const persons: CBDBPerson[] = [];
  for (const row of result.rows) {
    try {
      const person = await cbdbService.getPerson(row.cbdb_id);
      persons.push(person);
    } catch {
      // 单个失败不影响其他
    }
  }
  return persons;
}

async function fetchEventDocuments(eventId: number): Promise<CTextDocument[]> {
  const result = await query(
    `SELECT d.external_refs->>'ctext_id' as ctext_id
     FROM documents d
     JOIN document_events de ON d.id = de.document_id
     WHERE de.event_id = $1 AND d.external_refs->>'ctext_id' IS NOT NULL`,
    [eventId]
  );

  const docs: CTextDocument[] = [];
  for (const row of result.rows) {
    try {
      const doc = await ctextService.getText(row.ctext_id);
      docs.push(doc);
    } catch {
      // 单个失败不影响其他
    }
  }
  return docs;
}
