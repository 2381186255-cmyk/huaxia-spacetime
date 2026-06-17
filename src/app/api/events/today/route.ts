// GET /api/events/today — 今日历史

import { NextRequest, NextResponse } from 'next/server';
import { isMockMode, getTodayEvents, MOCK_EVENTS } from '@/services/mock-data';
import { sanitizeMonth, sanitizeDay, sanitizeErrorMessage } from '@/lib/security';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const month = sanitizeMonth(searchParams.get('month') || '0');
    const day = sanitizeDay(searchParams.get('day') || '0');

    if (!month || !day) {
      return NextResponse.json(
        { error: 'Invalid month or day parameter' },
        { status: 400 }
      );
    }

    // Mock模式
    if (isMockMode()) {
      const events = getTodayEvents(month, day);
      return NextResponse.json({
        date: { month, day },
        total: events.length,
        page: 1,
        limit: 20,
        events,
      });
    }

    // 数据库模式
    const { query } = await import('@/services/db');
    const { cacheOrFetch } = await import('@/services/redis');
    const { CACHE_TTL, PAGINATION } = await import('@/lib/constants');

    const dynasty = searchParams.get('dynasty');
    const eventType = searchParams.get('type');
    const importance = searchParams.get('importance')
      ? parseInt(searchParams.get('importance')!)
      : undefined;
    const page = parseInt(searchParams.get('page') || String(PAGINATION.DEFAULT_PAGE));
    const limit = Math.min(
      parseInt(searchParams.get('limit') || String(PAGINATION.DEFAULT_LIMIT)),
      PAGINATION.MAX_LIMIT
    );

    const cacheKey = `events:today:${month}:${day}:${dynasty || ''}:${eventType || ''}:${importance || ''}:${page}:${limit}`;

    const data = await cacheOrFetch(
      cacheKey,
      async () => {
        const conditions = [
          'he.start_month IS NOT NULL',
          'he.start_day IS NOT NULL',
          'he.start_month = $1',
          'he.start_day = $2',
        ];
        const params: unknown[] = [month, day];
        let paramIdx = 3;

        if (dynasty) {
          conditions.push(`(d.name = $${paramIdx} OR d.id::text = $${paramIdx})`);
          params.push(dynasty);
          paramIdx++;
        }

        if (eventType) {
          conditions.push(`he.event_type = $${paramIdx}`);
          params.push(eventType);
          paramIdx++;
        }

        if (importance) {
          conditions.push(`he.importance <= $${paramIdx}`);
          params.push(importance);
          paramIdx++;
        }

        const whereClause = conditions.join(' AND ');

        const countResult = await query(
          `SELECT COUNT(*) as total
           FROM historical_events he
           LEFT JOIN dynasties d ON he.dynasty_id = d.id
           WHERE ${whereClause}`,
          params
        );

        const eventsResult = await query(
          `SELECT
             he.id, he.name, he.name_en, he.start_year, he.end_year,
             he.start_month, he.start_day, he.event_type, he.importance,
             he.detail_level, he.summary, he.external_refs,
             d.id as dynasty_id, d.name as dynasty_name, d.color as dynasty_color
           FROM historical_events he
           LEFT JOIN dynasties d ON he.dynasty_id = d.id
           WHERE ${whereClause}
           ORDER BY he.start_year ASC
           LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`,
          [...params, limit, (page - 1) * limit]
        );

        const events = [];
        for (const event of eventsResult.rows) {
          const places = await query(
            `SELECT hp.id, hp.name, hp.modern_name,
               ST_AsGeoJSON(hp.geom) as geom,
               ep.role
             FROM historical_places hp
             JOIN event_places ep ON hp.id = ep.place_id
             WHERE ep.event_id = $1`,
            [event.id]
          );

          const persons = await query(
            `SELECT p.id, p.name, pe.role
             FROM persons p
             JOIN person_events pe ON p.id = pe.person_id
             WHERE pe.event_id = $1`,
            [event.id]
          );

          events.push({
            id: event.id,
            name: event.name,
            name_en: event.name_en,
            start_year: parseFloat(event.start_year),
            end_year: event.end_year ? parseFloat(event.end_year) : undefined,
            start_month: event.start_month,
            start_day: event.start_day,
            event_type: event.event_type,
            importance: event.importance,
            detail_level: event.detail_level,
            summary: event.summary,
            external_refs: event.external_refs || {},
            dynasty: event.dynasty_id
              ? { id: event.dynasty_id, name: event.dynasty_name, color: event.dynasty_color }
              : undefined,
            places: places.rows.map(p => ({
              id: p.id,
              name: p.name,
              modern_name: p.modern_name,
              geom: JSON.parse(p.geom),
              role: p.role,
            })),
            persons: persons.rows.map(p => ({
              id: p.id,
              name: p.name,
              role: p.role,
            })),
          });
        }

        return {
          date: { month, day },
          total: parseInt(countResult.rows[0]?.total || '0'),
          page,
          limit,
          events,
        };
      },
      CACHE_TTL.API_RESPONSE
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in /api/events/today:', sanitizeErrorMessage(error));
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
