"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* ファーストビュー */}
      <section className="bg-gradient-to-b from-blue-600 to-blue-700 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-medium opacity-80 mb-3">行政書士監修 × AI診断</p>
          <h1 className="text-3xl sm:text-5xl font-bold mb-4 leading-tight">
            たった30秒で<br />対象の補助金がわかる
          </h1>
          <p className="text-lg opacity-90 mb-8">
            あなたの会社が使える補助金を無料で診断。<br className="hidden sm:block" />
            面倒な調査は不要です。
          </p>
          <Link
            href="/diagnosis"
            className="inline-block bg-white text-blue-600 font-bold text-lg px-10 py-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            無料で診断する（30秒）
          </Link>
          <p className="text-sm opacity-70 mt-4">※ 登録不要・完全無料</p>
        </div>
      </section>

      {/* 悩み共感 */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">
            こんなお悩みありませんか？
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                emoji: "🤔",
                title: "何が対象か分からない",
                desc: "補助金は種類が多すぎて、自分の会社がどれに該当するのか分からない",
              },
              {
                emoji: "📄",
                title: "申請が面倒そう",
                desc: "書類作成が複雑で、何から始めればいいのか見当もつかない",
              },
              {
                emoji: "💰",
                title: "補助金の存在を知らない",
                desc: "使える補助金があるのに、知らないまま損をしているかもしれない",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-6 shadow-sm text-center">
                <span className="text-4xl mb-3 block">{item.emoji}</span>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* サービス説明 3ステップ */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
            かんたん3ステップ
          </h2>
          <p className="text-gray-500 text-center mb-10">
            補助金AIが最適な補助金をマッチングします
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "30秒で診断",
                desc: "業種・従業員数など基本情報を選択するだけ",
                color: "bg-blue-100 text-blue-600",
              },
              {
                step: "2",
                title: "結果を確認",
                desc: "対象の補助金・受給目安額・難易度がすぐ分かる",
                color: "bg-green-100 text-green-600",
              },
              {
                step: "3",
                title: "LINEで相談",
                desc: "行政書士が申請をサポート。書類作成もおまかせ",
                color: "bg-purple-100 text-purple-600",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className={`w-16 h-16 rounded-full ${item.color} flex items-center justify-center text-2xl font-bold mx-auto mb-4`}>
                  {item.step}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 信頼要素 */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">
            選ばれる理由
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: "🔒",
                title: "行政書士が監修",
                desc: "2026年法改正に対応。国家資格者が申請書類を最終チェック",
              },
              {
                icon: "¥0",
                title: "診断は完全無料",
                desc: "何度でも無料で診断OK。費用が発生するのは申請を依頼した時だけ",
              },
              {
                icon: "⚡",
                title: "たった30秒",
                desc: "選択式の簡単な質問に答えるだけ。面倒な入力は一切なし",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-6 shadow-sm text-center">
                <span className="text-3xl mb-3 block">{item.icon}</span>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2回目のCTA */}
      <section className="py-20 px-4 bg-blue-600 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            あなたの会社が使える補助金、<br />今すぐ確認しませんか？
          </h2>
          <p className="opacity-90 mb-8">
            無料・30秒・登録不要で対象の補助金がわかります
          </p>
          <Link
            href="/diagnosis"
            className="inline-block bg-white text-blue-600 font-bold text-lg px-10 py-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            無料で診断する（30秒）
          </Link>
        </div>
      </section>

      {/* フッター */}
      <footer className="py-8 px-4 bg-gray-900 text-gray-400 text-center text-sm">
        <p>© 2026 補助金AI. All rights reserved.</p>
        <p className="mt-2">
          本サービスの補助金申請書類作成は提携行政書士が行います
        </p>
      </footer>
    </main>
  );
}
