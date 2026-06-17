// GET /api/dynasties — 朝代列表

import { NextResponse } from 'next/server';
import { isMockMode, MOCK_DYNASTIES } from '@/services/mock-data';

export async function GET() {
  try {
    // Mock模式
    if (isMockMode()) {
      return NextResponse.json({ dynasties: MOCK_DYNASTIES });
    }

    // 数据库模式
    const { query } = await import('@/services/db');
    const { cacheOrFetch } = await import('@/services/redis');
    const { CACHE_TTL } = await import('@/lib/constants');

    const data = await cacheOrFetch('dynasties:list', async () => {
      const result = await query(
        `SELECT id, name, name_en, start_year, end_year, color, description, sort_order
         FROM dynasties
         ORDER BY sort_order`
      );
      return result.rows;
    }, CACHE_TTL.API_RESPONSE * 7);

    return NextResponse.json({ dynasties: data });
  } catch (error) {
    console.error('Error in /api/dynasties:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
