"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface MatchResult {
  subsidy_id: string;
  subsidy_name: string;
  category: string;
  fit_score: number;
  difficulty_rank: string;
  recommendation_rank: number;
  match_reasons: string[];
  unmatch_reasons: string[];
  estimated_amount: number | null;
  max_amount: number | null;
}

interface DiagnosisResult {
  company_id: string;
  total_matches: number;
  matches: MatchResult[];
}

function Stars({ count }: { count: number }) {
  return (
    <span className="text-yellow-500 text-lg">
      {"★".repeat(count)}{"☆".repeat(5 - count)}
    </span>
  );
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
    <span className={`px-2 py-1 rounded text-xs font-medium ${colors[rank] || "bg-gray-100"}`}>
      難易度{rank} — {labels[rank]}
    </span>
  );
}

function formatAmount(amount: number | null): string {
  if (!amount) return "—";
  if (amount >= 100000000) return `${(amount / 100000000).toFixed(1)}億円`;
  if (amount >= 10000) return `${(amount / 10000).toFixed(0)}万円`;
  return `${amount}円`;
}

export default function Results() {
  const router = useRouter();
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("diagnosisResult");
    if (stored) {
      setResult(JSON.parse(stored));
    } else {
      router.push("/");
    }
  }, [router]);

  if (!result) {
    return <div className="min-h-screen flex items-center justify-center">読み込み中...</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">診断結果</h1>
        <p className="text-gray-500 text-center mb-8">
          {result.total_matches}件の補助金がマッチしました
        </p>

        {result.matches.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 text-lg">該当する補助金が見つかりませんでした</p>
            <Link href="/" className="text-blue-600 underline mt-4 inline-block">条件を変えて再診断</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {result.matches.map((m) => (
              <Link key={m.subsidy_id} href={`/subsidy/${m.subsidy_id}`} className="block bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">
                        #{m.recommendation_rank}
                      </span>
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">
                        {m.category}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">{m.subsidy_name}</h2>
                  </div>
                  <div className="text-right">
                    <Stars count={m.fit_score} />
                    <div className="mt-1">
                      <DifficultyBadge rank={m.difficulty_rank} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <span className="text-xs text-gray-500">概算補助額</span>
                    <p className="text-xl font-bold text-blue-600">{formatAmount(m.estimated_amount)}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">補助上限</span>
                    <p className="text-lg text-gray-700">{formatAmount(m.max_amount)}</p>
                  </div>
                </div>

                {m.match_reasons.length > 0 && (
                  <div className="mb-2">
                    <span className="text-xs text-gray-500">マッチ理由:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {m.match_reasons.map((r, i) => (
                        <span key={i} className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded">
                          ✓ {r}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {m.unmatch_reasons.length > 0 && (
                  <div>
                    <span className="text-xs text-gray-500">注意点:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {m.unmatch_reasons.map((r, i) => (
                        <span key={i} className="bg-red-50 text-red-700 text-xs px-2 py-0.5 rounded">
                          △ {r}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-3 text-right">
                  <span className="text-blue-600 text-sm">詳細を見る →</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <Link href="/" className="text-blue-600 underline">条件を変えて再診断</Link>
        </div>
      </div>
    </main>
  );
}
