'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface WebsitePreviewProps {
  url: string;
  title: string;
  category: 'web' | 'mobile' | 'enterprise' | 'saas';
}

// TEMPORARY: Flag to disable video loading in previews
// Set to false to re-enable videos later
const ENABLE_VIDEOS = false;

// Global queue to limit concurrent iframe loads
let activeIframeLoads = 0;
const MAX_CONCURRENT_IFRAMES = 1; // Load one at a time to prevent freezing
const iframeLoadQueue: Array<() => void> = [];

// Request deduplication cache for HTML fallback
const htmlFallbackCache = new Map<string, { html: string; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const activeFetches = new Map<string, Promise<string | null>>();

function processIframeQueue() {
  if (activeIframeLoads < MAX_CONCURRENT_IFRAMES && iframeLoadQueue.length > 0) {
    const nextLoad = iframeLoadQueue.shift();
    if (nextLoad) {
      activeIframeLoads++;
      nextLoad();
    }
  }
}

function cleanupCache() {
  const now = Date.now();
  for (const [url, data] of htmlFallbackCache.entries()) {
    if (now - data.timestamp > CACHE_DURATION) {
      htmlFallbackCache.delete(url);
    }
  }
}

// Cleanup cache periodically
if (typeof window !== 'undefined') {
  setInterval(cleanupCache, CACHE_DURATION);
}

export default function WebsitePreview({ url, title, category }: WebsitePreviewProps) {
  const [isLoading, setIsLoading] = useState(false); // Start as false - no auto-loading
  const [iframeError, setIframeError] = useState(false);
  const [useHtmlFallback, setUseHtmlFallback] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false); // Only load on user interaction
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const loadStartedRef = useRef(false);

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

  const fetchHtmlFallback = useCallback(async (targetUrl: string) => {
    if (!isMountedRef.current) return;

    // Check cache first
    const cached = htmlFallbackCache.get(targetUrl);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      if (isMountedRef.current) {
        setPreviewHtml(cached.html);
        setUseHtmlFallback(true);
        setIsLoading(false);
      }
      return;
    }

    // Check if there's already an active fetch for this URL
    const existingFetch = activeFetches.get(targetUrl);
    if (existingFetch) {
      try {
        const html = await existingFetch;
        if (html && isMountedRef.current) {
          setPreviewHtml(html);
          setUseHtmlFallback(true);
          setIsLoading(false);
        }
      } catch (err) {
        // Error handled in the original fetch
      }
      return;
    }

    // Cancel any existing request for this component
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    // Create fetch promise and store it
    const fetchPromise = (async () => {
      try {
        const response = await fetch(`/api/preview?url=${encodeURIComponent(targetUrl)}`, {
          signal: abortController.signal,
        });
        
        if (!isMountedRef.current) {
          activeFetches.delete(targetUrl);
          return null;
        }
        
        if (response.ok) {
          const data = await response.json();
          if (data.html) {
            // Cache the result
            htmlFallbackCache.set(targetUrl, {
              html: data.html,
              timestamp: Date.now(),
            });
            
            if (isMountedRef.current) {
              setPreviewHtml(data.html);
              setUseHtmlFallback(true);
              setIsLoading(false);
            }
            activeFetches.delete(targetUrl);
            return data.html;
          }
        }
        activeFetches.delete(targetUrl);
        return null;
      } catch (err) {
        activeFetches.delete(targetUrl);
        if (err instanceof Error && err.name === 'AbortError') {
          return null; // Request was cancelled, ignore
        }
        if (isMountedRef.current) {
          console.error('Failed to fetch HTML fallback:', err);
        }
        return null;
      }
    })();

    activeFetches.set(targetUrl, fetchPromise);

    try {
      await fetchPromise;
    } catch (err) {
      // Error already handled in promise
    }
    
    // If HTML fallback also fails, show error state
    // Use setTimeout to defer state update and prevent blocking
    setTimeout(() => {
      if (isMountedRef.current) {
        setIsLoading((current) => {
          if (current && !useHtmlFallback) {
            setIframeError(true);
            return false;
          }
          return current;
        });
      }
    }, 0);
  }, []);

  // Handle hover to trigger loading - only load on user interaction
  const handleMouseEnter = useCallback(() => {
    if (!shouldLoad && !loadStartedRef.current) {
      // Only start loading after hover for 800ms to prevent accidental triggers
      hoverTimeoutRef.current = setTimeout(() => {
        if (isMountedRef.current && !loadStartedRef.current) {
          loadStartedRef.current = true;
          setShouldLoad(true);
          setIsLoading(true);
        }
      }, 800);
    }
  }, [shouldLoad]);

  const handleMouseLeave = useCallback(() => {
    // Cancel hover timeout if user leaves before 800ms
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  }, []);

  // Handle click to trigger immediate loading
  const handleClick = useCallback(() => {
    if (!shouldLoad && !loadStartedRef.current) {
      loadStartedRef.current = true;
      setShouldLoad(true);
      setIsLoading(true);
    }
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  }, [shouldLoad]);

  // Main loading effect - only runs when shouldLoad is true (user interaction)
  useEffect(() => {
    if (!shouldLoad || !url || url === '#') {
      if (!url || url === '#') {
        setIframeError(true);
        setIsLoading(false);
      }
      return;
    }

    // Add delay between iframe loads to prevent concurrent loading
    const loadDelay = activeIframeLoads * 2000; // 2 second delay between each iframe

    // Reset state when URL changes
    isMountedRef.current = true;
    setIsLoading(true);
    setIframeError(false);
    setUseHtmlFallback(false);
    setPreviewHtml(null);

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Cancel any pending fetch
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // Remove iframe src to stop loading if it exists
    if (iframeRef.current) {
      iframeRef.current.src = 'about:blank';
    }

    // Queue iframe load to prevent concurrent loads with staggered delays
    const startLoad = () => {
      if (!isMountedRef.current) {
        activeIframeLoads = Math.max(0, activeIframeLoads - 1);
        processIframeQueue();
        return;
      }

      // Set a timeout to detect if iframe is blocked or taking too long
      timeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          // Check current loading state using functional update
          setIsLoading((current) => {
            if (current) {
              fetchHtmlFallback(url);
            }
            return current;
          });
        }
        activeIframeLoads = Math.max(0, activeIframeLoads - 1);
        processIframeQueue();
      }, 5000); // Increased timeout to 5 seconds
    };

    // Stagger iframe loads with delays
    const delayedStart = setTimeout(() => {
      if (isMountedRef.current && shouldLoad) {
        // Add to queue if at capacity, otherwise load immediately
        if (activeIframeLoads >= MAX_CONCURRENT_IFRAMES) {
          iframeLoadQueue.push(startLoad);
        } else {
          activeIframeLoads++;
          startLoad();
        }
      }
    }, loadDelay);

    return () => {
      clearTimeout(delayedStart);
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      // Clear iframe src on unmount
      if (iframeRef.current) {
        try {
          iframeRef.current.src = 'about:blank';
        } catch (e) {
          // Ignore errors when clearing iframe
        }
      }
      // Decrement active loads counter
      activeIframeLoads = Math.max(0, activeIframeLoads - 1);
      processIframeQueue();
      // Clear hover timeout
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
    };
  }, [url, fetchHtmlFallback, shouldLoad]);

  const handleIframeLoad = useCallback(() => {
    if (!isMountedRef.current) return;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Defer state update to prevent blocking
    requestAnimationFrame(() => {
      if (isMountedRef.current) {
        setIsLoading(false);
        setIframeError(false);
      }
    });
    
    // Decrement active loads and process queue
    activeIframeLoads = Math.max(0, activeIframeLoads - 1);
    processIframeQueue();
  }, []);

  const handleIframeError = useCallback(() => {
    if (!isMountedRef.current) return;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Defer state update to prevent blocking
    requestAnimationFrame(() => {
      if (isMountedRef.current) {
        setIframeError(true);
        setIsLoading(false);
        // Try HTML fallback when iframe fails
        fetchHtmlFallback(url);
      }
    });
    
    // Decrement active loads and process queue
    activeIframeLoads = Math.max(0, activeIframeLoads - 1);
    processIframeQueue();
  }, [url, fetchHtmlFallback]);

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

  // Show static preview by default - only load iframe on user interaction
  if (!shouldLoad) {
    return (
      <div 
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className={`relative w-full h-full bg-gradient-to-br ${getCategoryGradient()} overflow-hidden rounded-t-2xl cursor-pointer group`}
      >
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
        
        {/* Hover hint overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm font-medium bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
            Hover to load preview
          </div>
        </div>
      </div>
    );
  }

  // Loading state - show placeholder while loading
  if (isLoading && !useHtmlFallback) {
    return (
      <div ref={containerRef} className={`relative w-full h-full bg-gradient-to-br ${getCategoryGradient()} flex items-center justify-center rounded-t-2xl`}>
        <div className="text-white/60 text-sm animate-pulse">
          Loading preview...
        </div>
      </div>
    );
  }

  // HTML fallback (when iframe is blocked)
  if (useHtmlFallback && previewHtml) {
    return (
      <div ref={containerRef} className="relative w-full h-full bg-white overflow-hidden rounded-t-2xl">
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
                    /* TEMPORARY: Hide video elements when videos are disabled */
                    ${!ENABLE_VIDEOS ? 'video { display: none !important; }' : ''}
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
  // Only render iframe when shouldLoad is true (user interaction triggered)
  if (!iframeError && !useHtmlFallback && url && url !== '#' && shouldLoad) {
    // TEMPORARY: Disable video loading by removing media-related permissions
    // Remove 'encrypted-media' and 'picture-in-picture' from allow attribute when videos are disabled
    const iframeAllow = ENABLE_VIDEOS 
      ? "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      : "accelerometer; clipboard-write; gyroscope"; // Removed autoplay, encrypted-media, picture-in-picture
    
    return (
      <div ref={containerRef} className="relative w-full h-full bg-white overflow-hidden rounded-t-2xl">
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
            willChange: 'auto', // Optimize rendering
          }}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          sandbox="allow-same-origin allow-scripts allow-forms"
          title={`Preview of ${title}`}
          loading="lazy"
          allow={iframeAllow}
          referrerPolicy="no-referrer-when-downgrade"
        />
        {/* Overlay to prevent interaction */}
        <div className="absolute inset-0 z-20 pointer-events-none" />
        {/* Loading overlay */}
        {isLoading && (
          <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryGradient()} flex items-center justify-center z-30 transition-opacity duration-300 opacity-100`}>
            <div className="text-white/60 text-sm">Loading preview...</div>
          </div>
        )}
      </div>
    );
  }

  // Final fallback - should not reach here if shouldLoad is false
  return (
    <div 
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className="cursor-pointer"
    >
      {renderFallback()}
    </div>
  );
}

