// GET /api/documents — 文献搜索

import { NextRequest, NextResponse } from 'next/server';
import { isMockMode } from '@/services/mock-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const q = searchParams.get('q');
    const dynastyId = searchParams.get('dynasty_id') ? parseInt(searchParams.get('dynasty_id')!) : undefined;
    const docType = searchParams.get('doc_type');

    // Mock模式
    if (isMockMode()) {
      if (!q && !dynastyId && !docType) {
        return NextResponse.json(
          { error: 'At least one of q, dynasty_id, or doc_type is required' },
          { status: 400 }
        );
      }
      return NextResponse.json({
        total: 0,
        page: 1,
        limit: 20,
        documents: [],
      });
    }

    // 数据库模式
    const { query } = await import('@/services/db');
    const { cacheOrFetch } = await import('@/services/redis');
    const { CACHE_TTL, PAGINATION } = await import('@/lib/constants');

    const page = parseInt(searchParams.get('page') || String(PAGINATION.DEFAULT_PAGE));
    const limit = Math.min(
      parseInt(searchParams.get('limit') || String(PAGINATION.DEFAULT_LIMIT)),
      PAGINATION.MAX_LIMIT
    );

    if (!q && !dynastyId && !docType) {
      return NextResponse.json(
        { error: 'At least one of q, dynasty_id, or doc_type is required' },
        { status: 400 }
      );
    }

    const conditions: string[] = [];
    const params: unknown[] = [];
    let paramIdx = 1;

    if (q) {
      conditions.push(`title ILIKE $${paramIdx}`);
      params.push(`%${q}%`);
      paramIdx++;
    }

    if (dynastyId) {
      conditions.push(`dynasty_id = $${paramIdx}`);
      params.push(dynastyId);
      paramIdx++;
    }

    if (docType) {
      conditions.push(`doc_type = $${paramIdx}`);
      params.push(docType);
      paramIdx++;
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`;
    const cacheKey = `documents:list:${JSON.stringify(params)}:${page}:${limit}`;

    const data = await cacheOrFetch(cacheKey, async () => {
      const countResult = await query(
        `SELECT COUNT(*) as total FROM documents ${whereClause}`,
        params
      );

      const docsResult = await query(
        `SELECT id, title, title_en, author, dynasty_id, doc_type,
           start_year, end_year, summary, external_refs
         FROM documents
         ${whereClause}
         ORDER BY title
         LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`,
        [...params, limit, (page - 1) * limit]
      );

      return {
        total: parseInt(countResult.rows[0]?.total || '0'),
        page,
        limit,
        documents: docsResult.rows,
      };
    }, CACHE_TTL.API_RESPONSE);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in /api/documents:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
