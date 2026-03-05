"use client";

import CountUp from "@/components/ui/CountUp";
import FadeIn from "@/components/ui/FadeIn";

export default function TrustBar() {
  return (
    <section className="py-10 px-4 bg-gradient-to-r from-[#1B3A5C] to-[#244B73]">
      <div className="max-w-[960px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center text-white">
          <FadeIn>
            <div>
              <p className="text-4xl sm:text-5xl font-bold" style={{ fontFamily: "'Inter', sans-serif" }}>
                <CountUp end={8} duration={1} suffix="種類" />
              </p>
              <p className="text-sm text-white/60 mt-2">対応補助金</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div>
              <p className="text-4xl sm:text-5xl font-bold" style={{ fontFamily: "'Inter', sans-serif" }}>
                <CountUp end={1500} duration={1.5} suffix="万円" />
              </p>
              <p className="text-sm text-white/60 mt-2">最大受給額</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div>
              <p className="text-4xl sm:text-5xl font-bold" style={{ fontFamily: "'Inter', sans-serif" }}>
                ¥0
              </p>
              <p className="text-sm text-white/60 mt-2">診断料金</p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
