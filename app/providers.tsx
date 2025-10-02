'use client';

import { SessionProvider } from "next-auth/react";
import dynamic from "next/dynamic";
import { useEffect } from "react";

function VisitPinger() {
  useEffect(() => {
    const key = `visit-sent-${new Date().toDateString()}`;
    if (typeof window !== 'undefined' && !sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, '1');
      fetch('/api/track-visit', { method: 'POST' }).catch(() => {});
    }
  }, []);
  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const OneTap = dynamic(() => import('./components/GoogleOneTap'), { ssr: false });
  return (
    <SessionProvider>
      <VisitPinger />
      <OneTap />
      {children}
    </SessionProvider>
  );
}


