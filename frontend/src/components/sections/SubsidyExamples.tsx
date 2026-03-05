"use client";

import FadeIn from "@/components/ui/FadeIn";

const subsidies = [
  {
    name: "ものづくり補助金",
    maxAmount: "1,250万円",
    rate: "1/2〜2/3",
    difficulty: "★★☆",
    desc: "革新的な製品・サービス開発や、生産プロセスの改善に",
  },
  {
    name: "IT導入補助金",
    maxAmount: "450万円",
    rate: "1/2〜3/4",
    difficulty: "★☆☆",
    desc: "業務効率化のためのITツール（会計ソフト、受発注システム等）導入に",
  },
  {
    name: "小規模事業者持続化補助金",
    maxAmount: "200万円",
    rate: "2/3",
    difficulty: "★☆☆",
    desc: "販路開拓や業務効率化の取り組みに。個人事業主も対象",
  },
  {
    name: "事業承継・M&A補助金",
    maxAmount: "600万円",
    rate: "1/2〜2/3",
    difficulty: "★★☆",
    desc: "事業承継やM&Aに伴う経営革新、事業転換の取り組みに",
  },
];

export default function SubsidyExamples() {
  return (
    <section className="py-16 sm:py-24 px-4 bg-[#FAFBFC]">
      <div className="max-w-[960px] mx-auto">
        <FadeIn>
          <h2 className="text-[22px] sm:text-[32px] font-bold text-center text-[#1B3A5C] mb-3">
            対応している補助金の例
          </h2>
          <p className="text-[#6B7280] text-center mb-12 text-[16px]">
            他にも多数の補助金に対応しています
          </p>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {subsidies.map((item, i) => (
            <FadeIn key={item.name} delay={i * 0.1}>
              <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-200">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-[16px] text-[#1B3A5C]">{item.name}</h3>
                  <span className="text-[11px] bg-[#E6F4ED] text-[#2E7D5B] px-2.5 py-1 rounded-full font-medium shrink-0 ml-2">
                    難易度 {item.difficulty}
                  </span>
                </div>
                <p className="text-[14px] text-[#6B7280] leading-[1.7] mb-3">{item.desc}</p>
                <div className="flex gap-4 text-[13px]">
                  <span className="text-[#2D2D2D]">
                    最大 <strong className="text-[#1B3A5C]">{item.maxAmount}</strong>
                  </span>
                  <span className="text-[#6B7280]">補助率 {item.rate}</span>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
