"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

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
  // Extended fields from full API
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
  if (amount >= 10000) return `${(amount / 10000).toFixed(0)}万円`;
  return `${amount}円`;
}

function DifficultyBadge({ rank }: { rank: string }) {
  const colors: Record<string, string> = {
    C: "bg-green-100 text-green-800",
    B: "bg-yellow-100 text-yellow-800",
    A: "bg-red-100 text-red-800",
  };
  const labels: Record<string, string> = {
    C: "易しい",
    B: "普通",
    A: "難しい",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[rank] || "bg-gray-100"}`}>
      難易度{rank} — {labels[rank]}
    </span>
  );
}

export default function SubsidyDetail() {
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

  if (loading) return <div className="min-h-screen flex items-center justify-center">読み込み中...</div>;
  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <p className="text-gray-500 text-lg mb-4">{error}</p>
      <Link href="/" className="text-blue-600 underline">トップに戻る</Link>
    </div>
  );
  if (!subsidy) return null;

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/results" className="text-blue-600 text-sm mb-4 inline-block">← 結果一覧に戻る</Link>

        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">{subsidy.category}</span>
              <h1 className="text-2xl font-bold text-gray-900 mt-2">{subsidy.name}</h1>
              <p className="text-gray-500 mt-1">{subsidy.provider}</p>
            </div>
            <DifficultyBadge rank={subsidy.difficulty_rank} />
          </div>

          {/* 金額情報 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 p-4 bg-blue-50 rounded-lg">
            <div>
              <span className="text-xs text-gray-500">補助金額</span>
              <p className="text-lg font-bold text-gray-900">
                {formatAmount(subsidy.min_amount)} 〜 {formatAmount(subsidy.max_amount)}
              </p>
            </div>
            <div>
              <span className="text-xs text-gray-500">補助率</span>
              <p className="text-lg font-bold text-gray-900">
                {subsidy.subsidy_rate ? `${(subsidy.subsidy_rate * 100).toFixed(0)}%` : "—"}
              </p>
            </div>
            <div>
              <span className="text-xs text-gray-500">過去採択率</span>
              <p className="text-lg font-bold text-gray-900">
                {subsidy.historical_acceptance_rate ? `${subsidy.historical_acceptance_rate}%` : "—"}
              </p>
            </div>
          </div>

          {/* 申請期限 */}
          <div className="mb-6">
            <h2 className="text-sm font-medium text-gray-700 mb-2">申請期限</h2>
            <div className="flex items-center gap-2">
              {subsidy.deadline_type === "rolling" ? (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">通年公募</span>
              ) : subsidy.application_deadline ? (
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                  {subsidy.application_deadline}まで
                </span>
              ) : (
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">未定</span>
              )}
            </div>
          </div>

          {/* 対象要件 */}
          <div className="mb-6">
            <h2 className="text-sm font-medium text-gray-700 mb-2">対象要件</h2>
            <div className="space-y-2 text-sm text-gray-600">
              {subsidy.eligible_employee_max && (
                <p>従業員数: {subsidy.eligible_employee_min || 0}〜{subsidy.eligible_employee_max}人</p>
              )}
              {subsidy.eligible_capital_max && (
                <p>資本金上限: {formatAmount(subsidy.eligible_capital_max)}</p>
              )}
              {subsidy.requires_wage_increase && (
                <p className="flex items-center gap-1">
                  <span className="text-orange-500">⚠</span> 賃上げ計画が必要
                </p>
              )}
              {subsidy.requires_gbiz_id && (
                <p className="flex items-center gap-1">
                  <span className="text-orange-500">⚠</span> GビズIDが必要
                </p>
              )}
            </div>
          </div>

          {/* 必要書類 */}
          {subsidy.required_documents && subsidy.required_documents.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-medium text-gray-700 mb-2">必要書類</h2>
              <ul className="space-y-1">
                {subsidy.required_documents.map((doc, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-blue-500">📄</span> {doc}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CTA */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-gray-600 mb-3">この補助金を申請しますか？</p>
            <a
              href={`https://line.me/R/ti/p/DUMMY_LINE_ID?subsidy=${params.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#06C755] text-white px-8 py-3 rounded-md font-medium hover:bg-[#05b34c]"
            >
              LINEで相談する
            </a>
            <p className="text-xs text-gray-400 mt-2">提携行政書士が申請をサポートします</p>
          </div>
        </div>
      </div>
    </main>
  );
}
