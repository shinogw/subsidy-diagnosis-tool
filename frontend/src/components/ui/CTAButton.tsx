"use client";

import Link from "next/link";

export default function CTAButton({
  href = "/diagnosis",
  label = "無料で診断する",
  shimmer = false,
  size = "default",
}: {
  href?: string;
  label?: string;
  shimmer?: boolean;
  size?: "default" | "large";
}) {
  const sizeClasses =
    size === "large"
      ? "text-[18px] px-14 py-5"
      : "text-[17px] px-12 py-4";

  return (
    <Link
      href={href}
      className={`
        relative inline-block overflow-hidden
        bg-[#E8772E] text-white font-bold
        ${sizeClasses}
        rounded-xl
        shadow-[0_2px_8px_rgba(232,119,46,0.2)]
        hover:bg-[#D06A28]
        hover:shadow-[0_4px_16px_rgba(232,119,46,0.3)]
        hover:-translate-y-[1px]
        transition-all duration-200
        ${shimmer ? "cta-shimmer" : ""}
      `}
    >
      {label}
    </Link>
  );
}
