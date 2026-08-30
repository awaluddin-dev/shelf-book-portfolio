import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Abaikan path statis dan API tanpa menggunakan Regex (Matcher)
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next/static') ||
    pathname.startsWith('/_next/image') ||
    pathname === '/favicon.ico' ||
    pathname === '/sitemap.xml' ||
    pathname === '/robots.txt'
  ) {
    return NextResponse.next();
  }

  const host = request.headers.get('host') || '';
  const legacyDomainStr = process.env.NEXT_PUBLIC_LEGACY_DOMAIN || '';
  const newDomainStr = process.env.NEXT_PUBLIC_WEB_URL || '';

  if (legacyDomainStr && newDomainStr) {
    // 2. Bersihkan legacy domain dari http:// atau https:// tanpa Regex
    let cleanLegacyDomain = legacyDomainStr;
    
    if (cleanLegacyDomain.startsWith('https://')) {
      cleanLegacyDomain = cleanLegacyDomain.slice(8);
    } else if (cleanLegacyDomain.startsWith('http://')) {
      cleanLegacyDomain = cleanLegacyDomain.slice(7);
    }
    
    if (cleanLegacyDomain.endsWith('/')) {
      cleanLegacyDomain = cleanLegacyDomain.slice(0, -1);
    }
    
    // Cek apakah user sedang mengakses domain lama
    if (host === cleanLegacyDomain) {
      // Pastikan domain baru memiliki format URL yang valid (terdapat http/https)
      const baseUrl = newDomainStr.startsWith('http') 
        ? newDomainStr 
        : `https://${newDomainStr}`;
      
      // Redirect ke domain baru dengan path dan parameter yang dipertahankan
      const targetUrl = new URL(request.nextUrl.pathname + request.nextUrl.search, baseUrl);
      return NextResponse.redirect(targetUrl, 301); // 301 = permanent redirect untuk SEO
    }
  }

  return NextResponse.next();
}
