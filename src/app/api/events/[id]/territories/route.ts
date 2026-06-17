// GET /api/events/[id]/territories — 事件势力地块

import { NextRequest, NextResponse } from 'next/server';
import { isMockMode, getEventById } from '@/services/mock-data';
import { sanitizeId, sanitizeYear, sanitizeErrorMessage } from '@/lib/security';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const eventId = sanitizeId(id);

    if (eventId === null) {
      return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 });
    }

    // Mock模式
    if (isMockMode()) {
      const event = getEventById(eventId);
      if (!event) {
        return NextResponse.json({ error: 'Event not found' }, { status: 404 });
      }
      return NextResponse.json({
        event_id: event.id,
        event_name: event.name,
        year: null,
        territories: [],
      });
    }

    // 数据库模式
    const { query } = await import('@/services/db');
    const { cacheOrFetch } = await import('@/services/redis');
    const { CACHE_TTL } = await import('@/lib/constants');

    const { searchParams } = request.nextUrl;
    const year = searchParams.get('year') ? sanitizeYear(searchParams.get('year')!) : undefined;
    if (searchParams.get('year') && year === null) {
      return NextResponse.json({ error: 'Invalid year parameter' }, { status: 400 });
    }
    const faction = searchParams.get('faction');

    const cacheKey = `events:territories:${eventId}:${year || 'all'}:${faction || 'all'}`;

    const data = await cacheOrFetch(cacheKey, async () => {
      const eventResult = await query(
        'SELECT id, name FROM historical_events WHERE id = $1',
        [eventId]
      );

      if (eventResult.rows.length === 0) return null;

      const event = eventResult.rows[0];

      const conditions = ['event_id = $1'];
      const queryParams: unknown[] = [eventId];
      let paramIdx = 2;

      if (year !== undefined) {
        conditions.push(`start_year <= $${paramIdx} AND end_year >= $${paramIdx}`);
        queryParams.push(year);
        paramIdx++;
      }

      if (faction) {
        conditions.push(`faction = $${paramIdx}`);
        queryParams.push(faction);
        paramIdx++;
      }

      const whereClause = conditions.join(' AND ');

      const territoriesResult = await query(
        `SELECT
           id, event_id, faction, faction_color,
           start_year, end_year, keyframe_order,
           ST_AsGeoJSON(geom) as geom_geojson,
           properties
         FROM event_territories
         WHERE ${whereClause}
         ORDER BY keyframe_order, faction`,
        queryParams
      );

      return {
        event_id: event.id,
        event_name: event.name,
        year: year || null,
        territories: territoriesResult.rows.map(t => ({
          id: t.id,
          event_id: t.event_id,
          faction: t.faction,
          faction_color: t.faction_color,
          start_year: parseFloat(t.start_year),
          end_year: parseFloat(t.end_year),
          keyframe_order: t.keyframe_order,
          geom: JSON.parse(t.geom_geojson),
          properties: t.properties || {},
        })),
      };
    }, CACHE_TTL.API_RESPONSE);

    if (!data) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in /api/events/[id]/territories:', sanitizeErrorMessage(error));
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
