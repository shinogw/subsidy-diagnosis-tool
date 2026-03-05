"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function CountUp({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);
  return <>{count.toLocaleString()}{suffix}</>;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* ファーストビュー */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20 sm:py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
        </div>
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-3xl mx-auto text-center relative z-10">
          <p className="text-sm font-medium opacity-80 mb-3 tracking-wide">行政書士監修 × AI診断</p>
          <h1 className="text-3xl sm:text-5xl font-bold mb-6 leading-tight">
            たった30秒で<br />対象の補助金がわかる
          </h1>
          <p className="text-lg sm:text-xl opacity-90 mb-4">
            最大<span className="text-yellow-300 font-bold text-2xl sm:text-3xl mx-1"><CountUp end={1500} suffix="万円" /></span>の補助金を受給できる可能性
          </p>
          <p className="opacity-70 mb-8 text-sm">面倒な調査は不要。選択式の質問に答えるだけ。</p>
          <Link
            href="/diagnosis"
            className="inline-block bg-white text-blue-600 font-bold text-lg px-10 py-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 animate-pulse"
          >
            無料で診断する（30秒）
          </Link>
          <p className="text-sm opacity-60 mt-4">※ 登録不要・完全無料・何度でもOK</p>
        </motion.div>
      </section>

      {/* 実績バー */}
      <section className="bg-blue-50 py-6 px-4">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-8 text-center">
          {[
            { value: "1,000+", label: "対応補助金数" },
            { value: "30秒", label: "診断時間" },
            { value: "¥0", label: "診断費用" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-2xl font-bold text-blue-600">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 悩み共感 */}
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">
            こんなお悩みありませんか？
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { emoji: "🤔", title: "何が対象か分からない", desc: "補助金は数千種類。自分の会社がどれに該当するか調べる時間がない" },
              { emoji: "📄", title: "申請が面倒そう", desc: "書類作成が複雑で、何から始めればいいのか見当もつかない" },
              { emoji: "💰", title: "知らないまま損してる", desc: "使える補助金があるのに、知らないまま数百万円を逃しているかも" },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-6 shadow-sm text-center hover:shadow-md transition-shadow">
                <span className="text-4xl mb-3 block">{item.emoji}</span>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-blue-600 font-medium mt-8">
            → 補助金AIがすべて解決します
          </p>
        </div>
      </motion.section>

      {/* 3つの特徴 */}
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">3つの特徴</h2>
          <p className="text-gray-500 text-center mb-10">他の補助金サービスとの違い</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { icon: "🤖", title: "AIが最適マッチング", desc: "数千種類の補助金からAIがあなたに最適な制度を自動で見つけ出します", color: "bg-blue-50 border-blue-200" },
              { icon: "👨‍⚖️", title: "行政書士が申請サポート", desc: "2026年法改正対応。国家資格者が書類作成・提出まで一貫サポート", color: "bg-green-50 border-green-200" },
              { icon: "⚡", title: "30秒で完了", desc: "選択式の簡単な質問に答えるだけ。面倒な入力は一切ありません", color: "bg-purple-50 border-purple-200" },
            ].map((item) => (
              <div key={item.title} className={`rounded-xl p-6 border ${item.color} text-center`}>
                <span className="text-3xl mb-3 block">{item.icon}</span>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* かんたん3ステップ */}
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">かんたん3ステップ</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: "1", title: "30秒で診断", desc: "業種・従業員数など基本情報を選択するだけ", color: "bg-blue-100 text-blue-600" },
              { step: "2", title: "結果を確認", desc: "対象の補助金・受給目安額・難易度がすぐ分かる", color: "bg-green-100 text-green-600" },
              { step: "3", title: "LINEで相談", desc: "行政書士が申請をサポート。書類作成もおまかせ", color: "bg-purple-100 text-purple-600" },
            ].map((item, i) => (
              <div key={item.step} className="text-center relative">
                {i < 2 && <div className="hidden sm:block absolute top-8 -right-4 text-gray-300 text-2xl">→</div>}
                <div className={`w-16 h-16 rounded-full ${item.color} flex items-center justify-center text-2xl font-bold mx-auto mb-4`}>
                  {item.step}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 対応補助金一覧 */}
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">主な対応補助金</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: "ものづくり補助金", amount: "最大1,250万円", tag: "製造・IT" },
              { name: "IT導入補助金", amount: "最大450万円", tag: "全業種" },
              { name: "小規模事業者持続化補助金", amount: "最大250万円", tag: "小規模" },
              { name: "事業再構築補助金", amount: "最大1,500万円", tag: "新事業" },
              { name: "省力化投資補助金", amount: "最大1,000万円", tag: "DX・効率化" },
              { name: "業務改善助成金", amount: "最大600万円", tag: "賃上げ" },
            ].map((s) => (
              <div key={s.name} className="flex items-center justify-between p-4 bg-white border rounded-lg hover:shadow-sm transition-shadow">
                <div>
                  <p className="font-medium text-gray-900">{s.name}</p>
                  <span className="text-xs text-gray-400">{s.tag}</span>
                </div>
                <p className="text-blue-600 font-bold text-sm">{s.amount}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-400 mt-4">※ 他にも多数の補助金・助成金に対応</p>
        </div>
      </motion.section>

      {/* セキュリティ・信頼 */}
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-10">安心・安全のサービス</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: "🔒", title: "SSL暗号化通信", desc: "お客様の情報は暗号化して安全に送信されます" },
              { icon: "👨‍⚖️", title: "行政書士法準拠", desc: "2026年法改正に完全対応。合法な運用体制" },
              { icon: "🚫", title: "第三者提供なし", desc: "個人情報を無断で第三者に提供することはありません" },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-6 shadow-sm">
                <span className="text-3xl mb-3 block">{item.icon}</span>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* FAQ */}
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">よくある質問</h2>
          <div className="space-y-4">
            {[
              { q: "本当に無料ですか？", a: "はい、診断は完全無料です。費用が発生するのは、行政書士に申請書類の作成を依頼した場合のみです。" },
              { q: "どんな補助金に対応していますか？", a: "ものづくり補助金、IT導入補助金、小規模事業者持続化補助金など、主要な国の補助金・助成金に対応しています。" },
              { q: "個人事業主でも使えますか？", a: "はい、個人事業主の方もご利用いただけます。業種や従業員数に応じて最適な補助金をご提案します。" },
              { q: "診断結果はどのくらい正確ですか？", a: "公式の募集要項に基づいてAIが判定しています。ただし最終的な採択は審査によるため、適合度（★）として表示しています。" },
              { q: "申請書類の作成もお願いできますか？", a: "はい、提携の行政書士が申請書類の作成から提出まで一貫してサポートします。LINEでお気軽にご相談ください。" },
            ].map((faq) => (
              <details key={faq.q} className="bg-white border rounded-lg p-4 group cursor-pointer">
                <summary className="font-medium text-gray-900 flex items-center justify-between">
                  {faq.q}
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-sm text-gray-500 mt-3">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 2回目のCTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            あなたの会社が使える補助金、<br />今すぐ確認しませんか？
          </h2>
          <p className="opacity-90 mb-8">無料・30秒・登録不要で対象の補助金がわかります</p>
          <Link
            href="/diagnosis"
            className="inline-block bg-white text-blue-600 font-bold text-lg px-10 py-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 animate-pulse"
          >
            無料で診断する（30秒）
          </Link>
        </motion.div>
      </section>

      {/* フッター */}
      <footer className="py-8 px-4 bg-gray-900 text-gray-400 text-sm">
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <p className="text-white font-medium">補助金AI</p>
          <p>本サービスの補助金申請書類作成は提携行政書士が行います</p>
          <div className="flex justify-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">プライバシーポリシー</Link>
            <Link href="/terms" className="hover:text-white transition-colors">利用規約</Link>
          </div>
          <p className="text-gray-500">© 2026 補助金AI. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
