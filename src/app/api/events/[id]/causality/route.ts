// GET /api/events/[id]/causality — 事件因果链

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
      return NextResponse.json({
        event_id: eventId,
        causes: [],
        effects: [],
      });
    }

    // 数据库模式
    const { query } = await import('@/services/db');
    const { cacheOrFetch } = await import('@/services/redis');
    const { CACHE_TTL } = await import('@/lib/constants');

    const cacheKey = `events:causality:${eventId}`;

    const data = await cacheOrFetch(cacheKey, async () => {
      const causes = await query(
        `SELECT he.id, he.name, he.start_year, he.event_type,
           ec.causality_type, ec.strength, ec.description
         FROM event_causality ec
         JOIN historical_events he ON ec.cause_event_id = he.id
         WHERE ec.effect_event_id = $1
         ORDER BY ec.strength DESC`,
        [eventId]
      );

      const effects = await query(
        `SELECT he.id, he.name, he.start_year, he.event_type,
           ec.causality_type, ec.strength, ec.description
         FROM event_causality ec
         JOIN historical_events he ON ec.effect_event_id = he.id
         WHERE ec.cause_event_id = $1
         ORDER BY ec.strength DESC`,
        [eventId]
      );

      return {
        event_id: eventId,
        causes: causes.rows.map(c => ({
          event_id: c.id,
          event_name: c.name,
          start_year: parseFloat(c.start_year),
          event_type: c.event_type,
          type: 'cause' as const,
          causality_type: c.causality_type,
          strength: c.strength,
          description: c.description,
        })),
        effects: effects.rows.map(e => ({
          event_id: e.id,
          event_name: e.name,
          start_year: parseFloat(e.start_year),
          event_type: e.event_type,
          type: 'effect' as const,
          causality_type: e.causality_type,
          strength: e.strength,
          description: e.description,
        })),
      };
    }, CACHE_TTL.API_RESPONSE);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in /api/events/[id]/causality:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
