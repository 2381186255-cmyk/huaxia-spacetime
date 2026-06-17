// GET /api/events/[id] — 事件详情

import { NextRequest, NextResponse } from 'next/server';
import { isMockMode, getEventById } from '@/services/mock-data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const eventId = parseInt(id);

    if (isNaN(eventId)) {
      return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 });
    }

    // Mock模式
    if (isMockMode()) {
      const data = getEventById(eventId);
      if (!data) {
        return NextResponse.json({ error: 'Event not found' }, { status: 404 });
      }
      return NextResponse.json({
        ...data,
        causality: { causes: [], effects: [] },
        documents: [],
      });
    }

    // 数据库模式
    const { query } = await import('@/services/db');
    const { cacheOrFetch } = await import('@/services/redis');
    const { CACHE_TTL } = await import('@/lib/constants');

    const cacheKey = `events:detail:${eventId}`;

    const data = await cacheOrFetch(cacheKey, async () => {
      const eventResult = await query(
        `SELECT he.*,
           d.id as dynasty_id, d.name as dynasty_name, d.color as dynasty_color
         FROM historical_events he
         LEFT JOIN dynasties d ON he.dynasty_id = d.id
         WHERE he.id = $1`,
        [eventId]
      );

      if (eventResult.rows.length === 0) return null;

      const event = eventResult.rows[0];

      const places = await query(
        `SELECT hp.id, hp.name, hp.name_en, hp.modern_name,
           hp.start_year, hp.end_year, hp.place_type,
           ST_AsGeoJSON(hp.geom) as geom,
           ep.role
         FROM historical_places hp
         JOIN event_places ep ON hp.id = ep.place_id
         WHERE ep.event_id = $1
         ORDER BY ep.sort_order`,
        [eventId]
      );

      const persons = await query(
        `SELECT p.id, p.name, p.name_en, p.courtesy_name,
           p.birth_year, p.death_year, p.person_type,
           pe.role
         FROM persons p
         JOIN person_events pe ON p.id = pe.person_id
         WHERE pe.event_id = $1
         ORDER BY pe.sort_order`,
        [eventId]
      );

      const documents = await query(
        `SELECT d.id, d.title, d.author, d.doc_type,
           de.relevance
         FROM documents d
         JOIN document_events de ON d.id = de.document_id
         WHERE de.event_id = $1
         ORDER BY de.sort_order`,
        [eventId]
      );

      const causes = await query(
        `SELECT he.id, he.name, he.start_year, ec.causality_type, ec.strength
         FROM event_causality ec
         JOIN historical_events he ON ec.cause_event_id = he.id
         WHERE ec.effect_event_id = $1`,
        [eventId]
      );

      const effects = await query(
        `SELECT he.id, he.name, he.start_year, ec.causality_type, ec.strength
         FROM event_causality ec
         JOIN historical_events he ON ec.effect_event_id = he.id
         WHERE ec.cause_event_id = $1`,
        [eventId]
      );

      return {
        id: event.id,
        name: event.name,
        name_en: event.name_en,
        start_year: parseFloat(event.start_year),
        end_year: event.end_year ? parseFloat(event.end_year) : undefined,
        start_month: event.start_month,
        start_day: event.start_day,
        end_month: event.end_month,
        end_day: event.end_day,
        lunar_month: event.lunar_month,
        lunar_day: event.lunar_day,
        is_lunar: event.is_lunar,
        event_type: event.event_type,
        importance: event.importance,
        detail_level: event.detail_level,
        description: event.description,
        summary: event.summary,
        external_refs: event.external_refs || {},
        metadata: event.metadata || {},
        dynasty: event.dynasty_id
          ? { id: event.dynasty_id, name: event.dynasty_name, color: event.dynasty_color }
          : undefined,
        places: places.rows.map(p => ({
          ...p,
          geom: JSON.parse(p.geom),
        })),
        persons: persons.rows,
        documents: documents.rows,
        causality: {
          causes: causes.rows.map(c => ({
            event_id: c.id,
            event_name: c.name,
            type: 'cause' as const,
            causality_type: c.causality_type,
            strength: c.strength,
          })),
          effects: effects.rows.map(e => ({
            event_id: e.id,
            event_name: e.name,
            type: 'effect' as const,
            causality_type: e.causality_type,
            strength: e.strength,
          })),
        },
      };
    }, CACHE_TTL.API_RESPONSE);

    if (!data) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in /api/events/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
