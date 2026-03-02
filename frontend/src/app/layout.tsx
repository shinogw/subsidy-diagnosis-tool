import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "補助金診断ツール",
  description: "中小企業向け補助金マッチング・診断ツール",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
