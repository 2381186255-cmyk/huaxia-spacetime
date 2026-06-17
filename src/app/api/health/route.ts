// GET /api/health — 健康检查

import { NextResponse } from 'next/server';
import { isMockMode } from '@/services/mock-data';

export async function GET() {
  if (isMockMode()) {
    return NextResponse.json({
      status: 'mock',
      services: { database: 'mock', redis: 'mock' },
      timestamp: new Date().toISOString(),
    });
  }

  const { checkDatabaseHealth } = await import('@/services/db');
  const { checkRedisHealth } = await import('@/services/redis');

  const [dbHealthy, redisHealthy] = await Promise.all([
    checkDatabaseHealth(),
    checkRedisHealth(),
  ]);

  const status = dbHealthy && redisHealthy ? 200 : 503;

  return NextResponse.json(
    {
      status: dbHealthy && redisHealthy ? 'healthy' : 'degraded',
      services: {
        database: dbHealthy ? 'up' : 'down',
        redis: redisHealthy ? 'up' : 'down',
      },
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}
