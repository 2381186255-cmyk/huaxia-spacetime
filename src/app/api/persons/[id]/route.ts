// GET /api/persons/[id] — 人物详情

import { NextRequest, NextResponse } from 'next/server';
import { isMockMode, getPersonById } from '@/services/mock-data';
import { sanitizeId, sanitizeErrorMessage } from '@/lib/security';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const personId = sanitizeId(id);

    if (personId === null) {
      return NextResponse.json({ error: 'Invalid person ID' }, { status: 400 });
    }

    // Mock模式
    if (isMockMode()) {
      const data = getPersonById(personId);
      if (!data) {
        return NextResponse.json({ error: 'Person not found' }, { status: 404 });
      }
      return NextResponse.json(data);
    }

    // 数据库模式
    const { query } = await import('@/services/db');
    const { cacheOrFetch } = await import('@/services/redis');
    const { CACHE_TTL } = await import('@/lib/constants');

    const cacheKey = `persons:detail:${personId}`;

    const data = await cacheOrFetch(cacheKey, async () => {
      const personResult = await query(
        `SELECT * FROM persons WHERE id = $1`,
        [personId]
      );

      if (personResult.rows.length === 0) return null;

      const person = personResult.rows[0];

      const relations = await query(
        `SELECT pr.id, pr.from_person_id, pr.to_person_id, pr.relation_type, pr.description,
           fp.name as from_name, tp.name as to_name
         FROM person_relations pr
         JOIN persons fp ON pr.from_person_id = fp.id
         JOIN persons tp ON pr.to_person_id = tp.id
         WHERE pr.from_person_id = $1 OR pr.to_person_id = $1`,
        [personId]
      );

      const events = await query(
        `SELECT he.id, he.name, he.start_year, he.event_type, pe.role
         FROM historical_events he
         JOIN person_events pe ON he.id = pe.event_id
         WHERE pe.person_id = $1
         ORDER BY he.start_year`,
        [personId]
      );

      return {
        ...person,
        relations: relations.rows,
        events: events.rows,
      };
    }, CACHE_TTL.API_RESPONSE);

    if (!data) {
      return NextResponse.json({ error: 'Person not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in /api/persons/[id]:', sanitizeErrorMessage(error));
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
