"use client";

import FadeIn from "@/components/ui/FadeIn";
import { ClipboardList, BarChart3, UserCheck } from "lucide-react";

const steps = [
  {
    step: "1",
    title: "5つの質問に回答",
    desc: "業種・従業員数など、選択するだけの簡単な質問です。入力は不要です",
    Icon: ClipboardList,
    iconColor: "text-[#1B3A5C]",
    bgColor: "bg-[#E8EDF3]",
  },
  {
    step: "2",
    title: "結果をその場で確認",
    desc: "対象の補助金・受給目安額・難易度がすぐに表示されます",
    Icon: BarChart3,
    iconColor: "text-[#2E7D5B]",
    bgColor: "bg-[#E6F4ED]",
  },
  {
    step: "3",
    title: "興味があれば専門家に相談",
    desc: "提携行政書士が申請をサポート。まずはLINEで気軽にご相談ください",
    Icon: UserCheck,
    iconColor: "text-[#92400E]",
    bgColor: "bg-[#FEF3C7]",
  },
];

export default function Steps() {
  return (
    <section className="py-16 sm:py-24 px-4 bg-[#FAFBFC]">
      <div className="max-w-[960px] mx-auto">
        <FadeIn>
          <h2 className="text-[22px] sm:text-[32px] font-bold text-center text-[#1B3A5C] mb-3">
            診断の流れ
          </h2>
          <p className="text-[#6B7280] text-center mb-14 text-[16px]">
            約1分で完了します
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative">
          {/* 接続線（デスクトップ） */}
          <div className="hidden sm:block absolute top-12 left-[22%] right-[22%] h-[2px] bg-[#E5E7EB] z-0" />

          {steps.map((item, i) => (
            <FadeIn key={item.step} delay={i * 0.15}>
              <div className="text-center relative z-10">
                <div className={`w-24 h-24 ${item.bgColor} rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-sm`}>
                  <item.Icon className={`w-10 h-10 ${item.iconColor}`} strokeWidth={1.5} />
                </div>
                <div className="inline-flex items-center text-[12px] font-bold text-white bg-[#1B3A5C] px-3.5 py-1 rounded-full mb-3">
                  STEP {item.step}
                </div>
                <h3 className="font-bold text-[17px] text-[#1B3A5C] mb-3">{item.title}</h3>
                <p className="text-[14px] text-[#6B7280] leading-[1.8] max-w-[260px] mx-auto">{item.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
