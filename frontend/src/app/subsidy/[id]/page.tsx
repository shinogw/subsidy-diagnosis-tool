"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { trackEvent } from "@/components/ui/Analytics";

interface SubsidyDetail {
  id: string;
  name: string;
  category: string;
  provider: string;
  min_amount: number | null;
  max_amount: number | null;
  subsidy_rate: number | null;
  difficulty_rank: string;
  historical_acceptance_rate: number | null;
  application_deadline: string | null;
  deadline_type: string;
  status: string;
  eligible_industries?: string[];
  eligible_employee_min?: number | null;
  eligible_employee_max?: number | null;
  eligible_capital_max?: number | null;
  requires_wage_increase?: boolean;
  requires_gbiz_id?: boolean;
  required_documents?: string[];
  application_url?: string | null;
  notes?: string | null;
}

function formatAmount(amount: number | null): string {
  if (!amount) return "—";
  if (amount >= 100000000) return `${(amount / 100000000).toFixed(1)}億円`;
  if (amount >= 10000) return `${Math.floor(amount / 10000).toLocaleString()}万円`;
  return `${amount.toLocaleString()}円`;
}

function DifficultyLabel({ rank }: { rank: string }) {
  const labels: Record<string, { text: string; color: string }> = {
    C: { text: "比較的申請しやすい", color: "bg-[#E6F4ED] text-[#2E7D5B]" },
    B: { text: "標準的な難易度", color: "bg-[#FEF3C7] text-[#92400E]" },
    A: { text: "申請の難易度が高い", color: "bg-[#FEE2E2] text-[#991B1B]" },
  };
  const label = labels[rank] || labels.B;
  return (
    <span className={`text-[12px] font-medium px-3 py-1 rounded-full ${label.color}`}>
      {label.text}
    </span>
  );
}

export default function SubsidyDetailPage() {
  const params = useParams();
  const [subsidy, setSubsidy] = useState<SubsidyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!params.id) return;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    fetch(`${apiUrl}/api/v1/subsidies/${params.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => setSubsidy(data))
      .catch(() => setError("補助金が見つかりませんでした"))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFBFC] flex items-center justify-center">
        <p className="text-[#6B7280]">読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAFBFC] flex flex-col items-center justify-center">
        <p className="text-[#6B7280] text-[16px] mb-4">{error}</p>
        <Link href="/" className="text-[#1B3A5C] font-medium underline">トップに戻る</Link>
      </div>
    );
  }

  if (!subsidy) return null;

  return (
    <main className="min-h-screen bg-[#FAFBFC] py-12 px-4">
      <div className="max-w-[720px] mx-auto">
        <Link href="/results" className="text-[14px] text-[#6B7280] hover:text-[#1B3A5C] transition-colors mb-6 block">
          ← 結果一覧に戻る
        </Link>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 sm:p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <span className="text-[12px] bg-[#E8EDF3] text-[#1B3A5C] px-2.5 py-1 rounded-full">{subsidy.category}</span>
              <h1 className="text-[22px] font-bold text-[#1B3A5C] mt-2">{subsidy.name}</h1>
              <p className="text-[14px] text-[#6B7280] mt-1">{subsidy.provider}</p>
            </div>
            <DifficultyLabel rank={subsidy.difficulty_rank} />
          </div>

          {/* 金額情報 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 p-5 bg-[#E8EDF3] rounded-xl">
            <div>
              <p className="text-[12px] text-[#6B7280]">補助金額</p>
              <p className="text-[17px] font-bold text-[#1B3A5C]">
                {formatAmount(subsidy.min_amount)} 〜 {formatAmount(subsidy.max_amount)}
              </p>
            </div>
            <div>
              <p className="text-[12px] text-[#6B7280]">補助率</p>
              <p className="text-[17px] font-bold text-[#1B3A5C]">
                {subsidy.subsidy_rate ? `${(subsidy.subsidy_rate * 100).toFixed(0)}%` : "—"}
              </p>
            </div>
            <div>
              <p className="text-[12px] text-[#6B7280]">過去採択率</p>
              <p className="text-[17px] font-bold text-[#1B3A5C]">
                {subsidy.historical_acceptance_rate ? `${subsidy.historical_acceptance_rate}%` : "—"}
              </p>
            </div>
          </div>

          {/* 申請期限 */}
          <div className="mb-6">
            <h2 className="text-[14px] font-medium text-[#6B7280] mb-2">申請期限</h2>
            {subsidy.deadline_type === "rolling" ? (
              <span className="text-[13px] bg-[#E6F4ED] text-[#2E7D5B] px-3 py-1 rounded-full">通年公募</span>
            ) : subsidy.application_deadline ? (
              <span className="text-[13px] bg-[#FEF3C7] text-[#92400E] px-3 py-1 rounded-full">
                {subsidy.application_deadline}まで
              </span>
            ) : (
              <span className="text-[13px] bg-[#E5E7EB] text-[#6B7280] px-3 py-1 rounded-full">未定</span>
            )}
          </div>

          {/* 対象要件 */}
          <div className="mb-6">
            <h2 className="text-[14px] font-medium text-[#6B7280] mb-2">対象要件</h2>
            <div className="space-y-2 text-[14px] text-[#2D2D2D]">
              {subsidy.eligible_employee_max && (
                <p>従業員数: {subsidy.eligible_employee_min || 0}〜{subsidy.eligible_employee_max}人</p>
              )}
              {subsidy.eligible_capital_max && (
                <p>資本金上限: {formatAmount(subsidy.eligible_capital_max)}</p>
              )}
              {subsidy.requires_wage_increase && (
                <p className="text-[#92400E]">⚠ 賃上げ計画が必要</p>
              )}
              {subsidy.requires_gbiz_id && (
                <p className="text-[#92400E]">⚠ GビズIDが必要</p>
              )}
            </div>
          </div>

          {/* 必要書類 */}
          {subsidy.required_documents && subsidy.required_documents.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[14px] font-medium text-[#6B7280] mb-2">必要書類</h2>
              <ul className="space-y-1.5">
                {subsidy.required_documents.map((doc, i) => (
                  <li key={i} className="flex items-center gap-2 text-[14px] text-[#2D2D2D]">
                    <span>📄</span> {doc}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CTA */}
          <div className="mt-8 p-6 bg-[#F5F3EF] rounded-xl text-center">
            <p className="text-[15px] text-[#2D2D2D] mb-4">この補助金について詳しく相談しますか？</p>
            <a
              href={`https://line.me/R/ti/p/DUMMY_LINE_ID?subsidy=${params.id}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("line_register_click", { from: "subsidy_detail", subsidy_id: params.id as string })}
              className="inline-block bg-[#06C755] text-white font-bold text-[16px] px-8 py-3.5 rounded-xl hover:bg-[#05b34c] transition-colors"
            >
              LINEで相談する
            </a>
            <p className="text-[12px] text-[#6B7280] mt-3">提携行政書士が申請をサポートします</p>
          </div>
        </div>
      </div>
    </main>
  );
}
