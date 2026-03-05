"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-[#E5E7EB]">
      <div className="max-w-[960px] mx-auto flex items-center justify-between px-4 h-16">
        <Link href="/" className="text-[#1B3A5C] font-bold text-lg">
          補助金診断
        </Link>
        <Link
          href="/diagnosis"
          className="bg-[#E8772E] text-white text-sm font-bold px-6 py-2.5 rounded-lg hover:bg-[#D06A28] transition-colors"
        >
          無料で診断する
        </Link>
      </div>
    </header>
  );
}
