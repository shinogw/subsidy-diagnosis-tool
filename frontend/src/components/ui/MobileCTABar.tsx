"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { trackEvent } from "@/components/ui/Analytics";

export default function MobileCTABar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = () => {
      setShow(window.scrollY > 500);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-white border-t border-[#E5E7EB] shadow-[0_-2px_10px_rgba(0,0,0,0.08)] px-4 py-3"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-[12px] text-[#6B7280] leading-tight">
              無料・1分で完了
            </p>
            <Link
              href="/diagnosis"
              onClick={() => trackEvent("cta_click", { location: "mobile_bar" })}
              className="bg-[#E8772E] text-white text-[15px] font-bold px-6 py-3 rounded-lg hover:bg-[#D06A28] transition-colors shrink-0"
            >
              無料で診断する
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
