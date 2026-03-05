"use client";

import { motion } from "framer-motion";
import CTAButton from "@/components/ui/CTAButton";

export default function Hero() {
  return (
    <section className="relative pt-28 pb-20 sm:pt-36 sm:pb-28 px-4 bg-[#FAFBFC] overflow-hidden">
      {/* 背景の微グラデーション装飾 */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#E8EDF3] rounded-full blur-[120px] opacity-60 -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#E6F4ED] rounded-full blur-[100px] opacity-40 translate-y-1/2 -translate-x-1/3" />

      <div className="max-w-[960px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* テキスト側 */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="inline-flex items-center gap-1.5 bg-[#E6F4ED] text-[#2E7D5B] text-[13px] font-medium px-3.5 py-1.5 rounded-full">
                  🏛️ 行政書士監修
                </span>
                <span className="inline-flex items-center gap-1.5 bg-[#E8EDF3] text-[#1B3A5C] text-[13px] font-medium px-3.5 py-1.5 rounded-full">
                  ✅ 完全無料
                </span>
                <span className="inline-flex items-center gap-1.5 bg-[#FEF3C7] text-[#92400E] text-[13px] font-medium px-3.5 py-1.5 rounded-full">
                  ⏱ 約1分で完了
                </span>
              </div>
            </motion.div>

            <motion.h1
              className="text-[28px] sm:text-[42px] font-bold text-[#1B3A5C] leading-[1.3] mb-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            >
              あなたの会社が使える
              <br />
              <span className="text-[#2E7D5B]">補助金</span>、1分で見つかります
            </motion.h1>

            <motion.p
              className="text-[16px] sm:text-[17px] text-[#6B7280] leading-[1.9] mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              5つの質問に答えるだけ。個人情報の入力は不要です。
              <br className="hidden sm:block" />
              行政書士が監修した診断で、あなたの会社に合った補助金を見つけます。
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-start gap-4"
            >
              <CTAButton label="無料で診断する" shimmer size="large" location="hero" />
              <p className="text-xs text-[#6B7280] mt-2 sm:mt-4">
                ※ 登録不要・完全無料・営業電話なし
              </p>
            </motion.div>
          </div>

          {/* ビジュアル側: 診断結果モックアップ */}
          <motion.div
            className="hidden lg:flex justify-center"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              {/* スマホフレーム */}
              <div className="w-[300px] bg-white rounded-[36px] shadow-[0_20px_60px_rgba(27,58,92,0.15)] border border-[#E5E7EB]/50 p-5 rotate-[-3deg]">
                {/* ノッチ */}
                <div className="w-24 h-1.5 bg-[#E5E7EB] rounded-full mx-auto mb-5" />
                {/* 診断結果モック */}
                <div className="space-y-3 px-1">
                  <div className="text-center mb-5">
                    <span className="text-2xl mb-1 block">🎯</span>
                    <p className="text-[#1B3A5C] font-bold text-[17px] leading-tight">
                      3件の補助金が<br />見つかりました
                    </p>
                  </div>
                  {/* カード1 */}
                  <div className="bg-gradient-to-r from-[#E8EDF3] to-[#F0F4F8] rounded-xl p-4 border border-[#E5E7EB]/50">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[13px] font-bold text-[#1B3A5C]">ものづくり補助金</p>
                        <p className="text-[12px] text-[#6B7280] mt-0.5">最大 <span className="font-bold text-[#1B3A5C]">1,250万円</span></p>
                      </div>
                      <span className="text-[10px] bg-[#2E7D5B] text-white px-2.5 py-1 rounded-full font-bold">★★★</span>
                    </div>
                  </div>
                  {/* カード2 */}
                  <div className="bg-gradient-to-r from-[#E8EDF3] to-[#F0F4F8] rounded-xl p-4 border border-[#E5E7EB]/50">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[13px] font-bold text-[#1B3A5C]">IT導入補助金</p>
                        <p className="text-[12px] text-[#6B7280] mt-0.5">最大 <span className="font-bold text-[#1B3A5C]">450万円</span></p>
                      </div>
                      <span className="text-[10px] bg-[#2E7D5B] text-white px-2.5 py-1 rounded-full font-bold">★★★</span>
                    </div>
                  </div>
                  {/* カード3 */}
                  <div className="bg-gradient-to-r from-[#E8EDF3] to-[#F0F4F8] rounded-xl p-4 border border-[#E5E7EB]/50">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[13px] font-bold text-[#1B3A5C]">持続化補助金</p>
                        <p className="text-[12px] text-[#6B7280] mt-0.5">最大 <span className="font-bold text-[#1B3A5C]">200万円</span></p>
                      </div>
                      <span className="text-[10px] bg-[#E8772E] text-white px-2.5 py-1 rounded-full font-bold">★★☆</span>
                    </div>
                  </div>
                </div>
                {/* ホームインジケータ */}
                <div className="w-28 h-1.5 bg-[#E5E7EB] rounded-full mx-auto mt-5" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
