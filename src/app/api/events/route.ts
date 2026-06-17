// GET /api/events — 事件列表（多维筛选）

import { NextRequest, NextResponse } from 'next/server';
import { isMockMode, getEventsByYearRange, MOCK_EVENTS } from '@/services/mock-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const startYear = searchParams.get('start_year') ? parseFloat(searchParams.get('start_year')!) : undefined;
    const endYear = searchParams.get('end_year') ? parseFloat(searchParams.get('end_year')!) : undefined;
    const dynastyId = searchParams.get('dynasty_id') ? parseInt(searchParams.get('dynasty_id')!) : undefined;
    const eventType = searchParams.get('event_type');
    const importance = searchParams.get('importance') ? parseInt(searchParams.get('importance')!) : undefined;
    const q = searchParams.get('q');

    // Mock模式
    if (isMockMode()) {
      let events = getEventsByYearRange(startYear, endYear, dynastyId);
      if (eventType) {
        events = events.filter(e => e.event_type === eventType);
      }
      if (importance) {
        events = events.filter(e => e.importance <= importance);
      }
      if (q) {
        events = events.filter(e => e.name.includes(q) || e.name_en?.toLowerCase().includes(q.toLowerCase()));
      }
      return NextResponse.json({
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

    const detailLevel = searchParams.get('detail_level') ? parseInt(searchParams.get('detail_level')!) : undefined;
    const bbox = searchParams.get('bbox');
    const page = parseInt(searchParams.get('page') || String(PAGINATION.DEFAULT_PAGE));
    const limit = Math.min(
      parseInt(searchParams.get('limit') || String(PAGINATION.DEFAULT_LIMIT)),
      PAGINATION.MAX_LIMIT
    );

    const conditions: string[] = [];
    const params: unknown[] = [];
    let paramIdx = 1;

    if (startYear !== undefined) {
      conditions.push(`he.start_year >= $${paramIdx}`);
      params.push(startYear);
      paramIdx++;
    }

    if (endYear !== undefined) {
      conditions.push(`he.end_year <= $${paramIdx} OR (he.end_year IS NULL AND he.start_year <= $${paramIdx})`);
      params.push(endYear);
      paramIdx++;
    }

    if (dynastyId !== undefined) {
      conditions.push(`he.dynasty_id = $${paramIdx}`);
      params.push(dynastyId);
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

    if (detailLevel) {
      conditions.push(`he.detail_level = $${paramIdx}`);
      params.push(detailLevel);
      paramIdx++;
    }

    if (q) {
      conditions.push(`he.name ILIKE $${paramIdx}`);
      params.push(`%${q}%`);
      paramIdx++;
    }

    if (bbox) {
      const [xmin, ymin, xmax, ymax] = bbox.split(',').map(Number);
      conditions.push(`EXISTS (
        SELECT 1 FROM event_places ep
        JOIN historical_places hp ON ep.place_id = hp.id
        WHERE ep.event_id = he.id
        AND hp.geom && ST_MakeEnvelope($${paramIdx}, $${paramIdx + 1}, $${paramIdx + 2}, $${paramIdx + 3}, 4326)
      )`);
      params.push(xmin, ymin, xmax, ymax);
      paramIdx += 4;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const cacheKey = `events:list:${JSON.stringify(params)}:${page}:${limit}`;

    const data = await cacheOrFetch(cacheKey, async () => {
      const countResult = await query(
        `SELECT COUNT(*) as total FROM historical_events he ${whereClause}`,
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
         ${whereClause}
         ORDER BY he.start_year ASC
         LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`,
        [...params, limit, (page - 1) * limit]
      );

      const events = eventsResult.rows.map(event => ({
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
      }));

      return {
        total: parseInt(countResult.rows[0]?.total || '0'),
        page,
        limit,
        events,
      };
    }, CACHE_TTL.API_RESPONSE);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in /api/events:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
