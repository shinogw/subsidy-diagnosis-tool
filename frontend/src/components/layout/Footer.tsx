import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-10 px-4 bg-[#1B3A5C] text-white/70">
      <div className="max-w-[960px] mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <p className="font-bold text-white text-lg">補助金診断</p>
            <p className="text-xs mt-1">© 2026 補助金診断. All rights reserved.</p>
          </div>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="hover:text-white transition-colors">
              プライバシーポリシー
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              利用規約
            </Link>
          </div>
        </div>
        <p className="text-xs text-center mt-6 text-white/40">
          本サービスの補助金申請書類作成は提携行政書士が行います
        </p>
      </div>
    </footer>
  );
}
