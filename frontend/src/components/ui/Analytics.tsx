"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// GA4 Measurement ID — 本番設定時に環境変数に移す
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";

// gtag helper
export function gtag(...args: unknown[]) {
  if (typeof window !== "undefined" && GA_ID) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).gtag?.(...args);
  }
}

// カスタムイベント送信
export function trackEvent(name: string, params?: Record<string, unknown>) {
  gtag("event", name, params);
}

// スクロール深度トラッキング
function useScrollDepth() {
  useEffect(() => {
    if (!GA_ID) return;
    const thresholds = [25, 50, 75, 100];
    const fired = new Set<number>();

    const handler = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const percent = Math.round((scrollTop / docHeight) * 100);

      for (const t of thresholds) {
        if (percent >= t && !fired.has(t)) {
          fired.add(t);
          trackEvent("scroll_depth", { percent: t });
        }
      }
    };

    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
}

// GA4 Script + page_view tracking
export default function Analytics() {
  const pathname = usePathname();

  useScrollDepth();

  useEffect(() => {
    if (!GA_ID) return;
    gtag("config", GA_ID, { page_path: pathname });
  }, [pathname]);

  if (!GA_ID) return null;

  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `,
        }}
      />
    </>
  );
}
