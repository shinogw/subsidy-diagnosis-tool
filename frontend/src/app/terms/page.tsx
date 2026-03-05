import Link from "next/link";

export default function Terms() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-6">利用規約</h1>
        <div className="prose prose-sm text-gray-700 space-y-4">
          <h2 className="text-lg font-bold mt-6">第1条（サービス内容）</h2>
          <p>補助金AI（以下「当サービス」）は、AIを活用した補助金適合診断サービスです。診断結果は参考情報であり、補助金の採択を保証するものではありません。</p>
          <h2 className="text-lg font-bold mt-6">第2条（申請書類作成）</h2>
          <p>補助金申請書類の作成は、行政書士法に基づき、提携行政書士が行います。当サービスは情報の整理・提供を行い、書類作成の主体ではありません。</p>
          <h2 className="text-lg font-bold mt-6">第3条（費用）</h2>
          <p>診断は無料です。行政書士への申請書類作成依頼には別途費用が発生します。費用は事前にご案内します。</p>
          <h2 className="text-lg font-bold mt-6">第4条（免責事項）</h2>
          <p>当サービスは診断結果の正確性について最善を尽くしますが、補助金の採択・不採択について一切の責任を負いません。</p>
          <h2 className="text-lg font-bold mt-6">第5条（知的財産権）</h2>
          <p>当サービスに関する知的財産権は、運営者に帰属します。</p>
        </div>
        <div className="mt-8">
          <Link href="/" className="text-blue-600 hover:underline text-sm">← トップに戻る</Link>
        </div>
      </div>
    </main>
  );
}
