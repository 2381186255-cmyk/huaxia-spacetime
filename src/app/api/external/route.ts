// GET /api/external — 外部API代理

import { NextRequest, NextResponse } from 'next/server';
import { isMockMode } from '@/services/mock-data';

export async function GET(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname;
    const { searchParams } = request.nextUrl;

    // Mock模式
    if (isMockMode()) {
      return NextResponse.json({
        source: 'mock',
        results: [],
        message: 'Mock模式：外部API不可用',
      });
    }

    // 数据库模式
    const { chgisService } = await import('@/services/external/chgis');
    const { cbdbService } = await import('@/services/external/cbdb');
    const { ctextService } = await import('@/services/external/ctext');
    const { chronologyService } = await import('@/services/external/chronology');

    if (pathname.endsWith('/chgis')) {
      const q = searchParams.get('q');
      if (!q) {
        return NextResponse.json({ error: 'q parameter is required' }, { status: 400 });
      }
      const year = searchParams.get('year') ? parseFloat(searchParams.get('year')!) : undefined;
      const results = await chgisService.searchPlaces(q, year);
      return NextResponse.json({ source: 'CHGIS', results });
    }

    if (pathname.endsWith('/cbdb')) {
      const q = searchParams.get('q');
      const cbdbId = searchParams.get('id');

      if (cbdbId) {
        const person = await cbdbService.getPerson(cbdbId);
        return NextResponse.json({ source: 'CBDB', result: person });
      }

      if (q) {
        const dynasty = searchParams.get('dynasty') || undefined;
        const results = await cbdbService.searchPersons(q, dynasty);
        return NextResponse.json({ source: 'CBDB', results });
      }

      return NextResponse.json({ error: 'q or id parameter is required' }, { status: 400 });
    }

    if (pathname.endsWith('/ctext')) {
      const q = searchParams.get('q');
      const textId = searchParams.get('id');

      if (textId) {
        const doc = await ctextService.getText(textId);
        return NextResponse.json({ source: 'CText', result: doc });
      }

      if (q) {
        const results = await ctextService.search(q);
        return NextResponse.json({ source: 'CText', results });
      }

      return NextResponse.json({ error: 'q or id parameter is required' }, { status: 400 });
    }

    if (pathname.endsWith('/chronology')) {
      const type = searchParams.get('type');

      if (type === 'lunar2solar') {
        const year = parseInt(searchParams.get('year') || '0');
        const month = parseInt(searchParams.get('month') || '0');
        const day = parseInt(searchParams.get('day') || '0');
        if (!year || !month || !day) {
          return NextResponse.json({ error: 'year, month, day are required' }, { status: 400 });
        }
        const result = await chronologyService.lunarToSolar(year, month, day);
        return NextResponse.json({ source: 'Chronology', result });
      }

      if (type === 'solar2lunar') {
        const month = parseInt(searchParams.get('month') || '0');
        const day = parseInt(searchParams.get('day') || '0');
        if (!month || !day) {
          return NextResponse.json({ error: 'month, day are required' }, { status: 400 });
        }
        const results = await chronologyService.solarToLunar(month, day);
        return NextResponse.json({ source: 'Chronology', results });
      }

      if (type === 'era2year') {
        const eraName = searchParams.get('era_name');
        const eraYear = parseInt(searchParams.get('era_year') || '0');
        if (!eraName || !eraYear) {
          return NextResponse.json({ error: 'era_name, era_year are required' }, { status: 400 });
        }
        const year = await chronologyService.eraNameToYear(eraName, eraYear);
        return NextResponse.json({ source: 'Chronology', result: { year } });
      }

      return NextResponse.json({ error: 'type parameter must be lunar2solar, solar2lunar, or era2year' }, { status: 400 });
    }

    return NextResponse.json({ error: 'Unknown external API endpoint' }, { status: 400 });
  } catch (error) {
    console.error('Error in /api/external:', error);
    return NextResponse.json({ error: 'External API call failed' }, { status: 502 });
  }
}
