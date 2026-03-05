"use client";

import FadeIn from "@/components/ui/FadeIn";
import { trackEvent } from "@/components/ui/Analytics";

const faqs = [
  {
    q: "本当に無料ですか？",
    a: "はい、診断は完全無料です。費用が発生するのは、診断後に行政書士への申請サポートを依頼された場合のみです。",
  },
  {
    q: "どんな補助金に対応していますか？",
    a: "ものづくり補助金、IT導入補助金、小規模事業者持続化補助金、事業承継補助金など主要8種類の補助金に対応しています。",
  },
  {
    q: "個人事業主でも利用できますか？",
    a: "はい、個人事業主の方もご利用いただけます。小規模事業者持続化補助金など、個人事業主が対象の補助金も多数あります。",
  },
  {
    q: "個人情報は必要ですか？",
    a: "診断には名前・電話番号・メールアドレスなどの個人情報は一切必要ありません。安心してご利用ください。",
  },
  {
    q: "申請書類は自分で作成する必要がありますか？",
    a: "いいえ。提携行政書士が書類を作成します。お客様には必要な情報のヒアリング（約15分）にご協力いただくだけです。",
  },
];

export default function FAQ() {
  return (
    <section className="py-16 sm:py-24 px-4 bg-[#F5F3EF]">
      <div className="max-w-[720px] mx-auto">
        <FadeIn>
          <h2 className="text-[22px] sm:text-[32px] font-bold text-center text-[#1B3A5C] mb-12">
            よくあるご質問
          </h2>
        </FadeIn>
        <div className="space-y-3">
          {faqs.map((item, i) => (
            <FadeIn key={i} delay={i * 0.05}>
              <details className="group bg-white rounded-xl border border-[#E5E7EB] overflow-hidden" onClick={() => trackEvent("faq_open", { question_id: `q${i + 1}` })}>
                <summary className="flex items-center justify-between p-5 sm:p-6 cursor-pointer hover:bg-[#FAFBFC] transition-colors">
                  <span className="font-medium text-[#2D2D2D] text-[16px] pr-4">{item.q}</span>
                  <span className="text-[#6B7280] group-open:rotate-180 transition-transform duration-300 shrink-0">
                    ▼
                  </span>
                </summary>
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-[15px] text-[#6B7280] leading-[1.8]">
                  {item.a}
                </div>
              </details>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
