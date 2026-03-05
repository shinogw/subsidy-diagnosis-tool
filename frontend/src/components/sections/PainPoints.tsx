"use client";

import FadeIn from "@/components/ui/FadeIn";

const pains = [
  {
    icon: "📋",
    title: "種類が多すぎて分からない",
    desc: "補助金は3,000種類以上。自分の会社にどれが該当するか調べる時間がない",
  },
  {
    icon: "⏰",
    title: "申請が面倒で断念した",
    desc: "書類作成が複雑で、本業に追われて手が回らない。過去に諦めた経験がある",
  },
  {
    icon: "💰",
    title: "いくらもらえるか見えない",
    desc: "補助金の存在は知っていても、自社でいくら受給できるか分からず動けない",
  },
];

export default function PainPoints() {
  return (
    <section className="py-16 sm:py-24 px-4 bg-[#F5F3EF]">
      <div className="max-w-[960px] mx-auto">
        <FadeIn>
          <h2 className="text-[22px] sm:text-[32px] font-bold text-center text-[#1B3A5C] mb-3">
            こんなお悩みありませんか？
          </h2>
          <p className="text-[#6B7280] text-center mb-12 text-[16px]">
            中小企業の約70%が、使える補助金を見逃しています
          </p>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {pains.map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.1}>
              <div className="bg-white rounded-xl p-8 border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-200 text-center h-full">
                <span className="text-4xl mb-5 block">{item.icon}</span>
                <h3 className="font-bold text-[18px] text-[#2D2D2D] mb-3">{item.title}</h3>
                <p className="text-[15px] text-[#6B7280] leading-[1.8]">{item.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
