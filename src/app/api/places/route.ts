// GET /api/places — 地点搜索

import { NextRequest, NextResponse } from 'next/server';
import { isMockMode, searchPlaces, MOCK_PLACES } from '@/services/mock-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const q = searchParams.get('q');
    const dynastyId = searchParams.get('dynasty_id') ? parseInt(searchParams.get('dynasty_id')!) : undefined;

    // Mock模式
    if (isMockMode()) {
      if (!q && !dynastyId) {
        return NextResponse.json(
          { error: 'At least one of q or dynasty_id is required' },
          { status: 400 }
        );
      }
      let places = q ? searchPlaces(q) : MOCK_PLACES;
      if (dynastyId) {
        places = places.filter(p => p.dynasty_id === dynastyId);
      }
      return NextResponse.json({
        total: places.length,
        page: 1,
        limit: 20,
        places,
      });
    }

    // 数据库模式
    const { query } = await import('@/services/db');
    const { cacheOrFetch } = await import('@/services/redis');
    const { CACHE_TTL, PAGINATION } = await import('@/lib/constants');

    const placeType = searchParams.get('place_type');
    const year = searchParams.get('year') ? parseFloat(searchParams.get('year')!) : undefined;
    const bbox = searchParams.get('bbox');
    const detailLevel = searchParams.get('detail_level') ? parseInt(searchParams.get('detail_level')!) : undefined;
    const page = parseInt(searchParams.get('page') || String(PAGINATION.DEFAULT_PAGE));
    const limit = Math.min(
      parseInt(searchParams.get('limit') || String(PAGINATION.DEFAULT_LIMIT)),
      PAGINATION.MAX_LIMIT
    );

    if (!q && !bbox && !dynastyId) {
      return NextResponse.json(
        { error: 'At least one of q, bbox, or dynasty_id is required' },
        { status: 400 }
      );
    }

    const conditions: string[] = [];
    const params: unknown[] = [];
    let paramIdx = 1;

    if (q) {
      conditions.push(`name ILIKE $${paramIdx}`);
      params.push(`%${q}%`);
      paramIdx++;
    }

    if (dynastyId) {
      conditions.push(`dynasty_id = $${paramIdx}`);
      params.push(dynastyId);
      paramIdx++;
    }

    if (placeType) {
      conditions.push(`place_type = $${paramIdx}`);
      params.push(placeType);
      paramIdx++;
    }

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

    if (bbox) {
      const [xmin, ymin, xmax, ymax] = bbox.split(',').map(Number);
      conditions.push(`geom && ST_MakeEnvelope($${paramIdx}, $${paramIdx + 1}, $${paramIdx + 2}, $${paramIdx + 3}, 4326)`);
      params.push(xmin, ymin, xmax, ymax);
      paramIdx += 4;
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`;
    const cacheKey = `places:list:${JSON.stringify(params)}:${page}:${limit}`;

    const data = await cacheOrFetch(cacheKey, async () => {
      const countResult = await query(
        `SELECT COUNT(*) as total FROM historical_places ${whereClause}`,
        params
      );

      const placesResult = await query(
        `SELECT id, name, name_en, modern_name, start_year, end_year,
           detail_level, dynasty_id, place_type,
           ST_AsGeoJSON(geom) as geom_geojson,
           external_refs
         FROM historical_places
         ${whereClause}
         ORDER BY name
         LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`,
        [...params, limit, (page - 1) * limit]
      );

      return {
        total: parseInt(countResult.rows[0]?.total || '0'),
        page,
        limit,
        places: placesResult.rows.map(p => ({
          ...p,
          geom: JSON.parse(p.geom_geojson),
          geom_geojson: undefined,
        })),
      };
    }, CACHE_TTL.API_RESPONSE);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in /api/places:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
