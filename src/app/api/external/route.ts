// GET /api/external — 外部API代理

import { NextRequest, NextResponse } from 'next/server';
import { isMockMode } from '@/services/mock-data';
import { sanitizeSearchQuery, sanitizeYear, sanitizeMonth, sanitizeDay, sanitizeErrorMessage } from '@/lib/security';

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
      const rawQ = searchParams.get('q') || '';
      const q = sanitizeSearchQuery(rawQ);
      if (!q) {
        return NextResponse.json({ error: 'Invalid search query' }, { status: 400 });
      }
      const rawYear = searchParams.get('year');
      const yearRaw = rawYear ? sanitizeYear(rawYear) : undefined;
      if (rawYear && yearRaw === null) {
        return NextResponse.json({ error: 'Invalid year parameter' }, { status: 400 });
      }
      const year = yearRaw ?? undefined;
      const results = await chgisService.searchPlaces(q, year);
      return NextResponse.json({ source: 'CHGIS', results });
    }

    if (pathname.endsWith('/cbdb')) {
      const rawQ = searchParams.get('q');
      const rawId = searchParams.get('id');

      if (rawId) {
        // 只允许字母数字和短横线
        const cbdbId = rawId.replace(/[^a-zA-Z0-9\-]/g, '');
        if (!cbdbId || cbdbId.length > 50) {
          return NextResponse.json({ error: 'Invalid id parameter' }, { status: 400 });
        }
        const person = await cbdbService.getPerson(cbdbId);
        return NextResponse.json({ source: 'CBDB', result: person });
      }

      if (rawQ) {
        const q = sanitizeSearchQuery(rawQ);
        if (!q) {
          return NextResponse.json({ error: 'Invalid search query' }, { status: 400 });
        }
        const dynasty = searchParams.get('dynasty') || undefined;
        const results = await cbdbService.searchPersons(q, dynasty);
        return NextResponse.json({ source: 'CBDB', results });
      }

      return NextResponse.json({ error: 'q or id parameter is required' }, { status: 400 });
    }

    if (pathname.endsWith('/ctext')) {
      const rawQ = searchParams.get('q');
      const rawTextId = searchParams.get('id');

      if (rawTextId) {
        // CText ID只允许字母数字和常见符号
        const textId = rawTextId.replace(/[^a-zA-Z0-9\-_.]/g, '');
        if (!textId || textId.length > 100) {
          return NextResponse.json({ error: 'Invalid id parameter' }, { status: 400 });
        }
        const doc = await ctextService.getText(textId);
        return NextResponse.json({ source: 'CText', result: doc });
      }

      if (rawQ) {
        const q = sanitizeSearchQuery(rawQ);
        if (!q) {
          return NextResponse.json({ error: 'Invalid search query' }, { status: 400 });
        }
        const results = await ctextService.search(q);
        return NextResponse.json({ source: 'CText', results });
      }

      return NextResponse.json({ error: 'q or id parameter is required' }, { status: 400 });
    }

    if (pathname.endsWith('/chronology')) {
      const type = searchParams.get('type');

      if (type === 'lunar2solar') {
        const year = sanitizeYear(searchParams.get('year') || '0');
        const month = sanitizeMonth(searchParams.get('month') || '0');
        const day = sanitizeDay(searchParams.get('day') || '0');
        if (!year || !month || !day) {
          return NextResponse.json({ error: 'Invalid year, month, or day parameter' }, { status: 400 });
        }
        const result = await chronologyService.lunarToSolar(year, month, day);
        return NextResponse.json({ source: 'Chronology', result });
      }

      if (type === 'solar2lunar') {
        const month = sanitizeMonth(searchParams.get('month') || '0');
        const day = sanitizeDay(searchParams.get('day') || '0');
        if (!month || !day) {
          return NextResponse.json({ error: 'Invalid month or day parameter' }, { status: 400 });
        }
        const results = await chronologyService.solarToLunar(month, day);
        return NextResponse.json({ source: 'Chronology', results });
      }

      if (type === 'era2year') {
        const rawEraName = searchParams.get('era_name') || '';
        const eraName = sanitizeSearchQuery(rawEraName, 20);
        const eraYear = parseInt(searchParams.get('era_year') || '0');
        if (!eraName || !eraYear || eraYear < 1 || eraYear > 200) {
          return NextResponse.json({ error: 'Invalid era_name or era_year parameter' }, { status: 400 });
        }
        const year = await chronologyService.eraNameToYear(eraName, eraYear);
        return NextResponse.json({ source: 'Chronology', result: { year } });
      }

      return NextResponse.json({ error: 'type parameter must be lunar2solar, solar2lunar, or era2year' }, { status: 400 });
    }

    return NextResponse.json({ error: 'Unknown external API endpoint' }, { status: 400 });
  } catch (error) {
    console.error('Error in /api/external:', sanitizeErrorMessage(error));
    return NextResponse.json({ error: 'External API call failed' }, { status: 502 });
  }
}
