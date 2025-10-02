'use client';

import { useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';

declare global {
  interface Window {
    google?: any;
  }
}

export default function GoogleOneTap() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session) return; // Only show when logged out
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    const initialize = () => {
      try {
        window.google?.accounts.id.initialize({
          client_id: clientId,
          callback: (response: any) => {
            // For now, just start the standard Google sign-in. We can later verify the credential server-side.
            signIn('google', { callbackUrl: '/' });
          },
          auto_select: false,
          cancel_on_tap_outside: true,
          prompt_parent_id: undefined,
        });
        window.google?.accounts.id.prompt();
      } catch (_) {
        // ignore
      }
    };

    if (window.google && window.google.accounts && window.google.accounts.id) {
      initialize();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initialize;
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, [session]);

  return null;
}


