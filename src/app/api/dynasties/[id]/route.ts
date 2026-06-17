// GET /api/dynasties/[id] — 朝代详情/事件/疆域

import { NextRequest, NextResponse } from 'next/server';
import { isMockMode, getDynastyById, getEventsByYearRange, MOCK_DYNASTIES } from '@/services/mock-data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const dynastyId = parseInt(id);
    const pathname = request.nextUrl.pathname;

    if (isNaN(dynastyId)) {
      return NextResponse.json({ error: 'Invalid dynasty ID' }, { status: 400 });
    }

    // Mock模式
    if (isMockMode()) {
      if (pathname.endsWith('/events')) {
        const events = getEventsByYearRange(undefined, undefined, dynastyId);
        return NextResponse.json({ total: events.length, page: 1, limit: 20, events });
      }

      if (pathname.endsWith('/regions')) {
        return NextResponse.json({ dynasty_id: dynastyId, year: null, regions: [] });
      }

      const dynasty = getDynastyById(dynastyId);
      if (!dynasty) {
        return NextResponse.json({ error: 'Dynasty not found' }, { status: 404 });
      }
      return NextResponse.json(dynasty);
    }

    // 数据库模式
    const { query } = await import('@/services/db');
    const { cacheOrFetch } = await import('@/services/redis');
    const { CACHE_TTL, PAGINATION } = await import('@/lib/constants');

    if (pathname.endsWith('/regions')) {
      return handleRegionsDb(dynastyId, request, query, cacheOrFetch, CACHE_TTL);
    }

    if (pathname.endsWith('/events')) {
      return handleEventsDb(dynastyId, request, query, cacheOrFetch, CACHE_TTL, PAGINATION);
    }

    const cacheKey = `dynasties:detail:${dynastyId}`;
    const data = await cacheOrFetch(cacheKey, async () => {
      const result = await query(
        `SELECT id, name, name_en, start_year, end_year, color, description, sort_order
         FROM dynasties WHERE id = $1`,
        [dynastyId]
      );

      if (result.rows.length === 0) return null;

      const dynasty = result.rows[0];

      const eventCount = await query(
        'SELECT COUNT(*) as count FROM historical_events WHERE dynasty_id = $1',
        [dynastyId]
      );

      const personCount = await query(
        'SELECT COUNT(*) as count FROM persons WHERE dynasty_id = $1',
        [dynastyId]
      );

      return {
        ...dynasty,
        event_count: parseInt(eventCount.rows[0]?.count || '0'),
        person_count: parseInt(personCount.rows[0]?.count || '0'),
      };
    }, CACHE_TTL.API_RESPONSE);

    if (!data) {
      return NextResponse.json({ error: 'Dynasty not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in /api/dynasties/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handleEventsDb(
  dynastyId: number, request: NextRequest,
  query: any, cacheOrFetch: any, CACHE_TTL: any, PAGINATION: any
) {
  const { searchParams } = request.nextUrl;
  const page = parseInt(searchParams.get('page') || String(PAGINATION.DEFAULT_PAGE));
  const limit = Math.min(
    parseInt(searchParams.get('limit') || String(PAGINATION.DEFAULT_LIMIT)),
    PAGINATION.MAX_LIMIT
  );
  const detailLevel = searchParams.get('detail_level') ? parseInt(searchParams.get('detail_level')!) : undefined;

  const cacheKey = `dynasties:${dynastyId}:events:${detailLevel || 'all'}:${page}:${limit}`;

  const data = await cacheOrFetch(cacheKey, async () => {
    let whereClause = 'WHERE he.dynasty_id = $1';
    const params: unknown[] = [dynastyId];
    let paramIdx = 2;

    if (detailLevel) {
      whereClause += ` AND he.detail_level >= $${paramIdx}`;
      params.push(detailLevel);
      paramIdx++;
    }

    const countResult = await query(
      `SELECT COUNT(*) as total FROM historical_events he ${whereClause}`,
      params
    );

    const eventsResult = await query(
      `SELECT he.id, he.name, he.start_year, he.end_year, he.event_type,
         he.importance, he.detail_level, he.summary
       FROM historical_events he
       ${whereClause}
       ORDER BY he.start_year ASC
       LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`,
      [...params, limit, (page - 1) * limit]
    );

    return {
      total: parseInt(countResult.rows[0]?.total || '0'),
      page,
      limit,
      events: eventsResult.rows,
    };
  }, CACHE_TTL.API_RESPONSE);

  return NextResponse.json(data);
}

async function handleRegionsDb(
  dynastyId: number, request: NextRequest,
  query: any, cacheOrFetch: any, CACHE_TTL: any
) {
  const { searchParams } = request.nextUrl;
  const year = searchParams.get('year') ? parseFloat(searchParams.get('year')!) : undefined;
  const detailLevel = searchParams.get('detail_level') ? parseInt(searchParams.get('detail_level')!) : undefined;
  const regionType = searchParams.get('region_type');

  const cacheKey = `dynasties:${dynastyId}:regions:${year || 'all'}:${detailLevel || 'all'}:${regionType || 'all'}`;

  const data = await cacheOrFetch(cacheKey, async () => {
    const conditions = ['dynasty_id = $1'];
    const params: unknown[] = [dynastyId];
    let paramIdx = 2;

    if (year !== undefined) {
      conditions.push(`start_year <= $${paramIdx} AND end_year >= $${paramIdx}`);
      params.push(year);
      paramIdx++;
    }

    if (detailLevel) {
      conditions.push(`detail_level = $${paramIdx}`);
      params.push(detailLevel);
      paramIdx++;
    }

    if (regionType) {
      conditions.push(`region_type = $${paramIdx}`);
      params.push(regionType);
      paramIdx++;
    }

    const result = await query(
      `SELECT id, name, name_en, start_year, end_year, detail_level,
         parent_id, region_type,
         ST_AsGeoJSON(geom) as geom_geojson,
         external_refs
       FROM historical_regions
       WHERE ${conditions.join(' AND ')}`,
      params
    );

    return {
      dynasty_id: dynastyId,
      year: year || null,
      regions: result.rows.map((r: Record<string, unknown>) => ({
        ...r,
        geom: JSON.parse(r.geom_geojson as string),
        geom_geojson: undefined,
      })),
    };
  }, CACHE_TTL.API_RESPONSE);

  return NextResponse.json(data);
}
