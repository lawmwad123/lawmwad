'use client';

import { useState, useEffect, useRef } from 'react';

interface WebsitePreviewProps {
  url: string;
  title: string;
  category: 'web' | 'mobile' | 'enterprise' | 'saas';
}

export default function WebsitePreview({ url, title, category }: WebsitePreviewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [iframeError, setIframeError] = useState(false);
  const [useHtmlFallback, setUseHtmlFallback] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get gradient colors based on category
  const getCategoryGradient = () => {
    switch (category) {
      case 'enterprise':
        return 'from-primary-800 via-primary-700 to-primary-600';
      case 'saas':
        return 'from-accent-500 via-accent-400 to-accent-600';
      case 'mobile':
        return 'from-purple-600 via-purple-500 to-indigo-600';
      default:
        return 'from-primary-600 via-primary-500 to-accent-500';
    }
  };

  const fetchHtmlFallback = async () => {
    try {
      const response = await fetch(`/api/preview?url=${encodeURIComponent(url)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.html) {
          setPreviewHtml(data.html);
          setUseHtmlFallback(true);
          setIsLoading(false);
          return;
        }
      }
    } catch (err) {
      console.error('Failed to fetch HTML fallback:', err);
    }
    // If HTML fallback also fails, show error state
    setIframeError(true);
    setIsLoading(false);
  };

  useEffect(() => {
    if (!url) {
      setIframeError(true);
      setIsLoading(false);
      return;
    }

    // Set a timeout to detect if iframe is blocked or taking too long
    timeoutRef.current = setTimeout(() => {
      // If still loading after 3 seconds, try HTML fallback
      setIsLoading((current) => {
        if (current) {
          fetchHtmlFallback();
        }
        return current;
      });
    }, 3000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  const handleIframeLoad = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsLoading(false);
    setIframeError(false);
  };

  const handleIframeError = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIframeError(true);
    setIsLoading(false);
    // Try HTML fallback when iframe fails
    fetchHtmlFallback();
  };

  // Clean URL for display
  const displayUrl = url ? url.replace('https://', '').replace('http://', '') : '';

  // Fallback: Clean gradient preview with project info
  const renderFallback = () => (
    <div className={`relative w-full h-full bg-gradient-to-br ${getCategoryGradient()} overflow-hidden rounded-t-2xl`}>
      <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between">
        {/* Browser Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
          </div>
          {displayUrl && (
            <div className="text-white/60 text-xs font-mono truncate max-w-[120px]">
              {displayUrl}
            </div>
          )}
        </div>

        {/* Hero Content */}
        <div className="space-y-3">
          <div className="h-6 md:h-8 bg-white/20 rounded-lg w-3/4 backdrop-blur-sm" />
          <div className="h-3 bg-white/15 rounded w-full backdrop-blur-sm" />
          <div className="h-3 bg-white/15 rounded w-5/6 backdrop-blur-sm" />
          
          {/* Feature Cards */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="h-16 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20" />
            <div className="h-16 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20" />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm" />
            ))}
          </div>
          <div className="text-white/80 text-sm font-medium">
            {title}
          </div>
        </div>
      </div>
    </div>
  );

  // Loading state
  if (isLoading && !useHtmlFallback) {
    return (
      <div className={`relative w-full h-full bg-gradient-to-br ${getCategoryGradient()} flex items-center justify-center rounded-t-2xl`}>
        <div className="text-white/60 text-sm animate-pulse">Loading preview...</div>
      </div>
    );
  }

  // HTML fallback (when iframe is blocked)
  if (useHtmlFallback && previewHtml) {
    return (
      <div className="relative w-full h-full bg-white overflow-hidden rounded-t-2xl">
        <div
          className="w-full h-full overflow-hidden"
          style={{
            transform: 'scale(0.25)',
            transformOrigin: 'top left',
            width: '400%',
            height: '400%',
          }}
        >
          <div
            dangerouslySetInnerHTML={{ 
              __html: `
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                  <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    html, body { width: 100%; height: 100%; overflow: hidden; }
                    body { font-family: system-ui, -apple-system, sans-serif; }
                    img { max-width: 100%; height: auto; display: block; }
                    a { pointer-events: none; }
                  </style>
                </head>
                <body>
                  ${previewHtml}
                </body>
                </html>
              `
            }}
          />
        </div>
        {/* Overlay to prevent interaction */}
        <div className="absolute inset-0 z-10 pointer-events-none" />
      </div>
    );
  }

  // Primary: Iframe preview (shows real visuals, colors, backgrounds, typography)
  if (!iframeError && !useHtmlFallback && url) {
    return (
      <div className="relative w-full h-full bg-white overflow-hidden rounded-t-2xl">
        <iframe
          ref={iframeRef}
          src={url}
          className="w-full h-full border-0"
          style={{
            transform: 'scale(0.25)',
            transformOrigin: 'top left',
            width: '400%',
            height: '400%',
            pointerEvents: 'none',
            border: 'none',
          }}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          sandbox="allow-same-origin allow-scripts allow-forms"
          title={`Preview of ${title}`}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
        {/* Overlay to prevent interaction */}
        <div className="absolute inset-0 z-20 pointer-events-none" />
        {/* Loading overlay */}
        {isLoading && (
          <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryGradient()} flex items-center justify-center z-30 transition-opacity duration-300 ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="text-white/60 text-sm">Loading preview...</div>
          </div>
        )}
      </div>
    );
  }

  // Final fallback
  return renderFallback();
}

