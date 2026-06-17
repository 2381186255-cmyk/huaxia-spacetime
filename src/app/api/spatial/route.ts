// POST /api/spatial — 空间运算

import { NextRequest, NextResponse } from 'next/server';
import { isMockMode } from '@/services/mock-data';

export async function POST(request: NextRequest) {
  try {
    // Mock模式
    if (isMockMode()) {
      const pathname = request.nextUrl.pathname;
      const body = await request.json();

      if (pathname.endsWith('/distance') && body.start && body.end) {
        // 简单欧氏距离近似
        const dx = (body.end[0] - body.start[0]) * 85;
        const dy = (body.end[1] - body.start[1]) * 111;
        return NextResponse.json({ distance_km: Math.sqrt(dx * dx + dy * dy) });
      }

      return NextResponse.json({ result: null, mock: true });
    }

    // 数据库模式
    const { createBuffer } = await import('@/services/spatial/buffer');
    const { findShortestRoute } = await import('@/services/spatial/routing');
    const { spatialAggregate, calculateDistance } = await import('@/services/spatial/aggregate');

    const pathname = request.nextUrl.pathname;
    const body = await request.json();

    if (pathname.endsWith('/buffer')) {
      return handleBuffer(body, createBuffer);
    }

    if (pathname.endsWith('/route')) {
      return handleRoute(body, findShortestRoute);
    }

    if (pathname.endsWith('/aggregate')) {
      return handleAggregate(body, spatialAggregate);
    }

    if (pathname.endsWith('/distance')) {
      return handleDistance(body, calculateDistance);
    }

    return NextResponse.json({ error: 'Unknown spatial operation' }, { status: 400 });
  } catch (error) {
    console.error('Error in /api/spatial:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handleBuffer(body: { geom: Record<string, unknown>; radius_km: number }, createBuffer: any) {
  if (!body.geom || !body.radius_km) {
    return NextResponse.json({ error: 'geom and radius_km are required' }, { status: 400 });
  }
  const result = await createBuffer(body.geom, body.radius_km);
  return NextResponse.json(result);
}

async function handleRoute(body: { start: { type: string; coordinates: [number, number] }; end: { type: string; coordinates: [number, number] }; dynasty_id?: number; route_type?: string }, findShortestRoute: any) {
  if (!body.start || !body.end) {
    return NextResponse.json({ error: 'start and end points are required' }, { status: 400 });
  }
  const result = await findShortestRoute(body.start.coordinates[0], body.start.coordinates[1], body.end.coordinates[0], body.end.coordinates[1], body.dynasty_id, body.route_type);
  return NextResponse.json(result);
}

async function handleAggregate(body: { bbox: [number, number, number, number]; year?: number; dynasty_id?: number; group_by?: 'event_type' | 'dynasty_id' | 'place_type' }, spatialAggregate: any) {
  if (!body.bbox || body.bbox.length !== 4) {
    return NextResponse.json({ error: 'bbox [xmin, ymin, xmax, ymax] is required' }, { status: 400 });
  }
  const result = await spatialAggregate(body.bbox, { year: body.year, dynastyId: body.dynasty_id, groupBy: body.group_by });
  return NextResponse.json(result);
}

async function handleDistance(body: { start: [number, number]; end: [number, number] }, calculateDistance: any) {
  if (!body.start || !body.end) {
    return NextResponse.json({ error: 'start and end coordinates are required' }, { status: 400 });
  }
  const distance = await calculateDistance(body.start[0], body.start[1], body.end[0], body.end[1]);
  return NextResponse.json({ distance_km: distance });
}
