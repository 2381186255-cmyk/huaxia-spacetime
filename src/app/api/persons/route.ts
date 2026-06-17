// GET /api/persons — 人物搜索

import { NextRequest, NextResponse } from 'next/server';
import { isMockMode, searchPersons, MOCK_PERSONS } from '@/services/mock-data';

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
      const persons = searchPersons(q || '', dynastyId);
      return NextResponse.json({
        total: persons.length,
        page: 1,
        limit: 20,
        persons,
      });
    }

    // 数据库模式
    const { query } = await import('@/services/db');
    const { cacheOrFetch } = await import('@/services/redis');
    const { CACHE_TTL, PAGINATION } = await import('@/lib/constants');

    const personType = searchParams.get('person_type');
    const page = parseInt(searchParams.get('page') || String(PAGINATION.DEFAULT_PAGE));
    const limit = Math.min(
      parseInt(searchParams.get('limit') || String(PAGINATION.DEFAULT_LIMIT)),
      PAGINATION.MAX_LIMIT
    );

    if (!q && !dynastyId) {
      return NextResponse.json(
        { error: 'At least one of q or dynasty_id is required' },
        { status: 400 }
      );
    }

    const conditions: string[] = [];
    const params: unknown[] = [];
    let paramIdx = 1;

    if (q) {
      conditions.push(`(name ILIKE $${paramIdx} OR courtesy_name ILIKE $${paramIdx} OR art_name ILIKE $${paramIdx})`);
      params.push(`%${q}%`);
      paramIdx++;
    }

    if (dynastyId) {
      conditions.push(`dynasty_id = $${paramIdx}`);
      params.push(dynastyId);
      paramIdx++;
    }

    if (personType) {
      conditions.push(`person_type = $${paramIdx}`);
      params.push(personType);
      paramIdx++;
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`;
    const cacheKey = `persons:list:${JSON.stringify(params)}:${page}:${limit}`;

    const data = await cacheOrFetch(cacheKey, async () => {
      const countResult = await query(
        `SELECT COUNT(*) as total FROM persons ${whereClause}`,
        params
      );

      const personsResult = await query(
        `SELECT id, name, name_en, courtesy_name, art_name,
           birth_year, death_year, dynasty_id, person_type, summary,
           external_refs
         FROM persons
         ${whereClause}
         ORDER BY name
         LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`,
        [...params, limit, (page - 1) * limit]
      );

      return {
        total: parseInt(countResult.rows[0]?.total || '0'),
        page,
        limit,
        persons: personsResult.rows,
      };
    }, CACHE_TTL.API_RESPONSE);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in /api/persons:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
