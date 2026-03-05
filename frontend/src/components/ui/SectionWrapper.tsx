import type { ReactNode } from "react";

export default function SectionWrapper({
  children,
  bg = "main",
  className = "",
}: {
  children: ReactNode;
  bg?: "main" | "alt" | "primary" | "primary-light";
  className?: string;
}) {
  const bgMap = {
    main: "bg-[#FAFBFC]",
    alt: "bg-[#F5F3EF]",
    primary: "bg-[#1B3A5C] text-white",
    "primary-light": "bg-[#E8EDF3]",
  };

  return (
    <section className={`py-16 sm:py-24 px-4 ${bgMap[bg]} ${className}`}>
      <div className="max-w-[960px] mx-auto">{children}</div>
    </section>
  );
}
