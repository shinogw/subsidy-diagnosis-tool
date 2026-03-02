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
  const [excluded, setExcluded] = useState<Set<string>>(new Set());

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

  const activeMatches = result.matches.filter((m) => !excluded.has(m.subsidy_id));
  const totalEstimated = activeMatches.reduce((sum, m) => sum + (m.estimated_amount || 0), 0);

  const toggleExclude = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExcluded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">診断結果</h1>
        <p className="text-gray-500 text-center mb-4">
          {result.total_matches}件の補助金がマッチしました
        </p>

        {result.matches.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 text-lg">該当する補助金が見つかりませんでした</p>
            <Link href="/" className="text-blue-600 underline mt-4 inline-block">条件を変えて再診断</Link>
          </div>
        ) : (
          <>
            {/* 総額サマリー */}
            <div className="bg-blue-600 text-white rounded-lg shadow p-6 mb-6 text-center">
              <p className="text-sm opacity-80 mb-1">あなたがマッチした補助金の総額</p>
              <p className="text-4xl font-bold mb-1">{formatAmount(activeMatches.reduce((sum, m) => sum + (m.max_amount || 0), 0))}</p>
              <p className="text-sm opacity-80 mt-1">（受給目安額の合計: {formatAmount(totalEstimated)}）</p>
              <p className="text-sm opacity-80">{activeMatches.length}件の補助金が対象</p>
            </div>

            {/* 一括申請ボタン */}
            <div className="mb-6">
              <button className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors">
                補助対象の補助金を一括で申請する
              </button>
              <p className="text-xs text-gray-400 text-center mt-2">提携行政書士が申請をサポートします</p>
            </div>

            {/* 補助金明細 */}
            <div className="space-y-4">
              {result.matches.map((m) => {
                const isExcluded = excluded.has(m.subsidy_id);
                return (
                  <div key={m.subsidy_id} className={`bg-white rounded-lg shadow p-6 transition-opacity ${isExcluded ? "opacity-50" : ""}`}>
                    <Link href={`/subsidy/${m.subsidy_id}`} className="block">
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
                          <span className="text-xs text-gray-500">受給目安額</span>
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

                    {/* 除外ボタン */}
                    <div className="mt-3 pt-3 border-t">
                      <button
                        onClick={(e) => toggleExclude(m.subsidy_id, e)}
                        className={`text-sm px-3 py-1 rounded ${
                          isExcluded
                            ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        {isExcluded ? "✓ 申請対象に戻す" : "✕ この補助金の申請を除外する"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        <div className="text-center mt-8">
          <Link href="/" className="text-blue-600 underline">条件を変えて再診断</Link>
        </div>
      </div>
    </main>
  );
}
