import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    // Fetch the website HTML
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      // Set a timeout
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const html = await response.text();

    // Extract hero section - look for common hero section patterns
    // Try multiple patterns: hero class, main content, first section, etc.
    const patterns = [
      /<section[^>]*class="[^"]*hero[^"]*"[^>]*>[\s\S]{0,8000}<\/section>/i,
      /<div[^>]*class="[^"]*hero[^"]*"[^>]*>[\s\S]{0,8000}<\/div>/i,
      /<header[^>]*>[\s\S]{0,6000}<\/header>/i,
      /<main[^>]*>([\s\S]{0,5000})/i,
      /<section[^>]*>([\s\S]{0,5000})/i,
    ];

    let heroMatch = null;
    for (const pattern of patterns) {
      heroMatch = html.match(pattern);
      if (heroMatch) break;
    }

    if (heroMatch) {
      // Clean up the HTML - remove scripts and styles for security
      let cleanedHtml = (heroMatch[1] || heroMatch[0])
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/on\w+="[^"]*"/gi, '') // Remove event handlers
        .replace(/on\w+='[^']*'/gi, '')
        .replace(/href="[^"]*"/gi, 'href="#"') // Neutralize links
        .replace(/href='[^']*'/gi, "href='#'");

      return NextResponse.json({ html: cleanedHtml }, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      });
    }

    // If no hero section found, return first part of body
    const bodyMatch = html.match(/<body[^>]*>([\s\S]{0,4000})/i);
    if (bodyMatch) {
      let cleanedHtml = bodyMatch[1]
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/on\w+="[^"]*"/gi, '')
        .replace(/on\w+='[^']*'/gi, '')
        .replace(/href="[^"]*"/gi, 'href="#"')
        .replace(/href='[^']*'/gi, "href='#'");

      return NextResponse.json({ html: cleanedHtml }, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      });
    }

    return NextResponse.json({ error: 'No content found' }, { status: 404 });
  } catch (error) {
    console.error('Error fetching preview:', error);
    return NextResponse.json(
      { error: 'Failed to fetch preview' },
      { status: 500 }
    );
  }
}

