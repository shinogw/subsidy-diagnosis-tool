"use client";

import FadeIn from "@/components/ui/FadeIn";
import CTAButton from "@/components/ui/CTAButton";

const points = [
  {
    icon: "🏛️",
    bgColor: "bg-[#E8EDF3]",
    title: "行政書士が監修",
    desc: "国家資格を持つ行政書士と提携。診断ロジックから申請サポートまで専門家が関わっています",
    badge: "専門家監修",
    badgeColor: "bg-[#E8EDF3] text-[#1B3A5C]",
  },
  {
    icon: "🔒",
    bgColor: "bg-[#E6F4ED]",
    title: "個人情報の入力不要",
    desc: "診断に名前・電話番号・メールアドレスは一切不要。安心してお試しいただけます",
    badge: "登録不要",
    badgeColor: "bg-[#E6F4ED] text-[#2E7D5B]",
  },
  {
    icon: "¥0",
    bgColor: "bg-[#FEF3C7]",
    title: "完全無料で何度でも",
    desc: "診断は何度でも無料です。費用が発生するのは申請サポートをご依頼いただいた場合のみです",
    badge: "無料",
    badgeColor: "bg-[#FEF3C7] text-[#92400E]",
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
          {points.map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.1}>
              <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 relative h-full">
                <span className={`absolute top-4 right-4 text-[11px] font-bold px-2.5 py-1 rounded-full ${item.badgeColor}`}>
                  {item.badge}
                </span>
                {/* アイコン */}
                <div className={`w-14 h-14 ${item.bgColor} rounded-2xl flex items-center justify-center text-2xl mb-5`}>
                  {item.icon}
                </div>
                <h3 className="font-bold text-[17px] text-[#1B3A5C] mb-3">{item.title}</h3>
                <p className="text-[14px] text-[#6B7280] leading-[1.8]">{item.desc}</p>
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
