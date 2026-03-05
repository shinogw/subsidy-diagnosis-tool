import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#FAFBFC] flex flex-col items-center justify-center px-4">
      <p className="text-[48px] font-bold text-[#E5E7EB] mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
        404
      </p>
      <h1 className="text-[20px] font-bold text-[#1B3A5C] mb-2">
        ページが見つかりません
      </h1>
      <p className="text-[15px] text-[#6B7280] mb-8">
        お探しのページは存在しないか、移動した可能性があります。
      </p>
      <Link
        href="/"
        className="bg-[#1B3A5C] text-white font-bold text-[15px] px-8 py-3 rounded-xl hover:bg-[#244B73] transition-colors"
      >
        トップに戻る
      </Link>
    </main>
  );
}
