import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  // Validate URL format
  try {
    new URL(url);
  } catch {
    return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
  }

  // Only allow http/https URLs
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return NextResponse.json({ error: 'URL must start with http:// or https://' }, { status: 400 });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    // Fetch the website HTML
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      signal: controller.signal,
      redirect: 'follow',
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch: ${response.status}` },
        { status: response.status >= 500 ? 502 : response.status }
      );
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
      // TEMPORARY: Flag to disable video loading in previews
      // Set to false to re-enable videos later
      const ENABLE_VIDEOS = false;
      
      // Clean up the HTML - remove scripts and styles for security
      let cleanedHtml = (heroMatch[1] || heroMatch[0])
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/on\w+="[^"]*"/gi, '') // Remove event handlers
        .replace(/on\w+='[^']*'/gi, '')
        .replace(/href="[^"]*"/gi, 'href="#"') // Neutralize links
        .replace(/href='[^']*'/gi, "href='#'");
      
      // TEMPORARY: Remove video elements when videos are disabled
      // This removes <video> tags and <source> tags with .mp4 files (especially Makonosi_Junior_Car_Hire.mp4)
      if (!ENABLE_VIDEOS) {
        cleanedHtml = cleanedHtml
          .replace(/<video\b[^<]*(?:(?!<\/video>)<[^<]*)*<\/video>/gi, '') // Remove video tags
          .replace(/<source\b[^>]*\.mp4[^>]*>/gi, '') // Remove source tags with .mp4
          .replace(/<source\b[^>]*type=["']video\/[^"']*["'][^>]*>/gi, ''); // Remove video source tags
      }

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
      // TEMPORARY: Flag to disable video loading in previews
      // Set to false to re-enable videos later
      const ENABLE_VIDEOS = false;
      
      let cleanedHtml = bodyMatch[1]
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/on\w+="[^"]*"/gi, '')
        .replace(/on\w+='[^']*'/gi, '')
        .replace(/href="[^"]*"/gi, 'href="#"')
        .replace(/href='[^']*'/gi, "href='#'");
      
      // TEMPORARY: Remove video elements when videos are disabled
      // This removes <video> tags and <source> tags with .mp4 files (especially Makonosi_Junior_Car_Hire.mp4)
      if (!ENABLE_VIDEOS) {
        cleanedHtml = cleanedHtml
          .replace(/<video\b[^<]*(?:(?!<\/video>)<[^<]*)*<\/video>/gi, '') // Remove video tags
          .replace(/<source\b[^>]*\.mp4[^>]*>/gi, '') // Remove source tags with .mp4
          .replace(/<source\b[^>]*type=["']video\/[^"']*["'][^>]*>/gi, ''); // Remove video source tags
      }

      return NextResponse.json({ html: cleanedHtml }, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      });
    }

    return NextResponse.json({ error: 'No content found' }, { status: 404 });
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError' || error.message.includes('timeout')) {
        return NextResponse.json(
          { error: 'Request timeout' },
          { status: 504 }
        );
      }
      if (error.message.includes('fetch')) {
        return NextResponse.json(
          { error: 'Failed to fetch preview' },
          { status: 502 }
        );
      }
    }
    
    console.error('Error fetching preview:', error);
    return NextResponse.json(
      { error: 'Failed to fetch preview' },
      { status: 500 }
    );
  }
}

