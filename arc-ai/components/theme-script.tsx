"use client";

export function ThemeScript() {
  const script = `
    try {
      const stored = localStorage.getItem('demo-ui');
      if (stored) {
        const { state } = JSON.parse(stored);
        if (state?.darkMode) document.documentElement.classList.add('dark');
      }
    } catch (_) {}
  `;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
