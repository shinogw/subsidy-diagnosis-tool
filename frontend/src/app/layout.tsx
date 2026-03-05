import type { Metadata } from "next";
import { Noto_Sans_JP, Inter } from "next/font/google";
import Analytics from "@/components/ui/Analytics";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "【無料】補助金診断 | あなたの会社が使える補助金を1分で",
  description:
    "5つの質問に答えるだけで、あなたの会社が申請できる補助金が分かります。個人情報の入力不要。行政書士監修の無料診断ツール。",
  openGraph: {
    title: "あなたの会社が使える補助金、1分で見つかります",
    description: "個人情報不要の無料診断。行政書士が監修。",
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} ${inter.variable}`}>
      <body className="font-[family-name:var(--font-noto)]">
        <Analytics />
        {children}
      </body>
    </html>
  );
}
