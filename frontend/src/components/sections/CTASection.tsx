"use client";

import FadeIn from "@/components/ui/FadeIn";
import CTAButton from "@/components/ui/CTAButton";

export default function CTASection() {
  return (
    <section className="py-20 sm:py-28 px-4 bg-[#E8EDF3]">
      <div className="max-w-[640px] mx-auto text-center">
        <FadeIn>
          <h2 className="text-[22px] sm:text-[32px] font-bold text-[#1B3A5C] leading-[1.4] mb-5">
            あなたの会社が使える補助金、
            <br />
            まずは無料で確認してみませんか？
          </h2>
          <p className="text-[16px] text-[#6B7280] mb-10 leading-[1.8]">
            5つの質問に答えるだけ。約1分で結果が出ます。
            <br />
            個人情報の入力は不要です。
          </p>
          <CTAButton label="無料で診断する" size="large" location="footer_cta" />
          <p className="text-xs text-[#6B7280] mt-5">
            ※ 登録不要・完全無料・営業電話なし
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
