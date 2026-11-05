// Lightweight Google Analytics 4 loader.
// Activates only when VITE_GA4_ID is set (e.g. VITE_GA4_ID=G-XXXXXXXXXX in .env / Vercel env).
// No ID = no tracking script, zero overhead.

export function initAnalytics() {
  const id = (import.meta as any).env?.VITE_GA4_ID as string | undefined;
  if (!id || typeof document === 'undefined') return;
  if (document.getElementById('ga4-script')) return;

  const script = document.createElement('script');
  script.id = 'ga4-script';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(script);

  const w = window as any;
  w.dataLayer = w.dataLayer || [];
  w.gtag = function gtag(...args: any[]) {
    w.dataLayer.push(args);
  };
  w.gtag('js', new Date());
  w.gtag('config', id, { anonymize_ip: true });
}
