"use client";

import FadeIn from "@/components/ui/FadeIn";
import CTAButton from "@/components/ui/CTAButton";

const points = [
  {
    icon: "🏛️",
    title: "行政書士が監修",
    desc: "国家資格を持つ行政書士と提携。診断ロジックから申請サポートまで専門家が関わっています",
    badge: "専門家監修",
  },
  {
    icon: "🔒",
    title: "個人情報の入力不要",
    desc: "診断に名前・電話番号・メールアドレスは一切不要。安心してお試しいただけます",
    badge: "登録不要",
  },
  {
    icon: "¥0",
    title: "完全無料で何度でも",
    desc: "診断は何度でも無料です。費用が発生するのは申請サポートをご依頼いただいた場合のみです",
    badge: "無料",
  },
];

export default function WhyTrust() {
  return (
    <section className="py-16 sm:py-24 px-4 bg-[#F5F3EF]">
      <div className="max-w-[960px] mx-auto">
        <FadeIn>
          <h2 className="text-[22px] sm:text-[32px] font-bold text-center text-[#1B3A5C] mb-3">
            安心してご利用いただけます
          </h2>
          <p className="text-[#6B7280] text-center mb-12 text-[16px]">
            信頼できる仕組みを整えています
          </p>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {points.map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.1}>
              <div className="bg-white rounded-xl p-8 text-center border border-[#E5E7EB] hover:border-[#1B3A5C]/20 transition-colors relative h-full">
                <span className="absolute top-4 right-4 text-[11px] bg-[#E6F4ED] text-[#2E7D5B] font-bold px-2.5 py-1 rounded-full">
                  {item.badge}
                </span>
                <span className="text-4xl mb-5 block">{item.icon}</span>
                <h3 className="font-bold text-[18px] text-[#2D2D2D] mb-3">{item.title}</h3>
                <p className="text-[15px] text-[#6B7280] leading-[1.8]">{item.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
        <FadeIn>
          <div className="text-center">
            <CTAButton label="無料で診断する" location="trust" />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
