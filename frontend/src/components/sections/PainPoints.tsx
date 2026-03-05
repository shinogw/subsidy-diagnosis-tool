"use client";

import FadeIn from "@/components/ui/FadeIn";
import { Search, Clock, CircleDollarSign, ArrowRight } from "lucide-react";

const pains = [
  {
    Icon: Search,
    iconColor: "text-[#1B3A5C]",
    bgColor: "bg-[#E8EDF3]",
    title: "種類が多すぎて分からない",
    desc: "補助金は3,000種類以上。自分の会社に合うものを調べる時間も余裕もない",
    solve: "5つの質問で自動マッチング",
  },
  {
    Icon: Clock,
    iconColor: "text-[#92400E]",
    bgColor: "bg-[#FEF3C7]",
    title: "調べたけど挫折した",
    desc: "申請書類が複雑で、本業に追われて手が回らない。途中で諦めた経験がある",
    solve: "行政書士が申請をサポート",
  },
  {
    Icon: CircleDollarSign,
    iconColor: "text-[#2E7D5B]",
    bgColor: "bg-[#E6F4ED]",
    title: "いくらもらえるか見えない",
    desc: "補助金の存在は知っていても、自社がいくら受給できるのか分からず動けない",
    solve: "受給目安額をすぐに表示",
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {pains.map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.1}>
              <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                {/* 上部: 悩み */}
                <div className="p-6 flex-1">
                  <div className={`w-12 h-12 ${item.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                    <item.Icon className={`w-6 h-6 ${item.iconColor}`} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-bold text-[17px] text-[#1B3A5C] mb-2 leading-[1.4]">{item.title}</h3>
                  <p className="text-[14px] text-[#6B7280] leading-[1.8]">{item.desc}</p>
                </div>
                {/* 下部: 解決 */}
                <div className="px-6 py-4 border-t border-[#E5E7EB] bg-[#FAFBFC] rounded-b-xl">
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-[#2E7D5B] shrink-0" />
                    <p className="text-[13px] font-medium text-[#2E7D5B]">{item.solve}</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
