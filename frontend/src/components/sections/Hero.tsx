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
              <span className="inline-flex items-center gap-1.5 bg-[#E6F4ED] text-[#2E7D5B] text-sm font-medium px-4 py-1.5 rounded-full mb-6">
                <span>🏛️</span>
                行政書士監修・完全無料
              </span>
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
              <CTAButton label="無料で診断する" shimmer size="large" />
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
              <div className="w-[280px] bg-white rounded-[32px] shadow-2xl border border-[#E5E7EB] p-4 rotate-[-2deg]">
                {/* ステータスバー */}
                <div className="w-20 h-1 bg-[#E5E7EB] rounded-full mx-auto mb-4" />
                {/* 診断結果モック */}
                <div className="space-y-3 px-2">
                  <div className="text-center mb-4">
                    <p className="text-xs text-[#6B7280]">診断結果</p>
                    <p className="text-[#1B3A5C] font-bold text-lg">3件の補助金が見つかりました</p>
                  </div>
                  {/* カード1 */}
                  <div className="bg-[#E8EDF3] rounded-xl p-3">
                    <p className="text-xs font-bold text-[#1B3A5C]">ものづくり補助金</p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-[#6B7280]">最大1,250万円</p>
                      <span className="text-[10px] bg-[#E6F4ED] text-[#2E7D5B] px-2 py-0.5 rounded-full font-medium">適合度 ★★★</span>
                    </div>
                  </div>
                  {/* カード2 */}
                  <div className="bg-[#E8EDF3] rounded-xl p-3">
                    <p className="text-xs font-bold text-[#1B3A5C]">IT導入補助金</p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-[#6B7280]">最大450万円</p>
                      <span className="text-[10px] bg-[#E6F4ED] text-[#2E7D5B] px-2 py-0.5 rounded-full font-medium">適合度 ★★★</span>
                    </div>
                  </div>
                  {/* カード3 */}
                  <div className="bg-[#E8EDF3] rounded-xl p-3">
                    <p className="text-xs font-bold text-[#1B3A5C]">小規模事業者持続化補助金</p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-[#6B7280]">最大200万円</p>
                      <span className="text-[10px] bg-[#E6F4ED] text-[#2E7D5B] px-2 py-0.5 rounded-full font-medium">適合度 ★★☆</span>
                    </div>
                  </div>
                </div>
                {/* ホームインジケータ */}
                <div className="w-24 h-1 bg-[#E5E7EB] rounded-full mx-auto mt-4" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
