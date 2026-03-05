import Link from "next/link";

export default function Privacy() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-6">プライバシーポリシー</h1>
        <div className="prose prose-sm text-gray-700 space-y-4">
          <p>補助金AI（以下「当サービス」）は、お客様の個人情報の保護に努めます。</p>
          <h2 className="text-lg font-bold mt-6">1. 収集する情報</h2>
          <p>当サービスでは、補助金診断のために以下の情報を収集します：業種、従業員数、年間売上、所在地、設立年、投資目的等の企業情報。</p>
          <h2 className="text-lg font-bold mt-6">2. 利用目的</h2>
          <p>収集した情報は、補助金の適合診断および提携行政書士への申請サポートの提供にのみ使用します。</p>
          <h2 className="text-lg font-bold mt-6">3. 第三者提供</h2>
          <p>お客様の同意なく、個人情報を第三者に提供することはありません。ただし、お客様がLINEでの相談を希望された場合、提携行政書士に必要な情報を共有する場合があります。</p>
          <h2 className="text-lg font-bold mt-6">4. 情報の管理</h2>
          <p>お客様の個人情報は、SSL暗号化通信により安全に送信・保管されます。</p>
          <h2 className="text-lg font-bold mt-6">5. お問い合わせ</h2>
          <p>個人情報に関するお問い合わせは、LINEアカウントよりご連絡ください。</p>
        </div>
        <div className="mt-8">
          <Link href="/" className="text-blue-600 hover:underline text-sm">← トップに戻る</Link>
        </div>
      </div>
    </main>
  );
}
