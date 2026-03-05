"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

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

const PAYMENT_TIMELINE: Record<string, string> = {
  "省力化": "採択後 約6〜8ヶ月",
  "IT導入": "採択後 約4〜6ヶ月",
  "ものづくり": "採択後 約6〜8ヶ月",
  "小規模": "採択後 約4〜6ヶ月",
  "事業承継": "採択後 約4〜6ヶ月",
  "新事業": "採択後 約6〜10ヶ月",
  "業務改善": "採択後 約3〜5ヶ月",
  "人材": "支給決定後 約2〜4ヶ月",
};

// Deadline data (month/day format for next upcoming deadline)
const DEADLINES: Record<string, { month: number; day: number }> = {
  "ものづくり": { month: 6, day: 20 },
  "IT導入": { month: 5, day: 16 },
  "小規模": { month: 5, day: 27 },
  "省力化": { month: 7, day: 4 },
  "事業承継": { month: 5, day: 9 },
  "新事業": { month: 6, day: 30 },
  "業務改善": { month: 8, day: 31 },
  "人材": { month: 12, day: 31 },
};

interface DiagnosisResult {
  company_id: string;
  total_matches: number;
  matches: MatchResult[];
}

function Stars({ count }: { count: number }) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-0.5">適合度</p>
      <span className="text-yellow-500 text-lg">{"★".repeat(count)}{"☆".repeat(5 - count)}</span>
    </div>
  );
}

function DifficultyBadge({ rank }: { rank: string }) {
  const colors: Record<string, string> = { C: "bg-green-100 text-green-800", B: "bg-yellow-100 text-yellow-800", A: "bg-red-100 text-red-800" };
  const labels: Record<string, string> = { C: "易しい", B: "普通", A: "難しい" };
  return <span className={`px-2 py-1 rounded text-xs font-medium ${colors[rank] || "bg-gray-100"}`}>難易度{rank} — {labels[rank]}</span>;
}

function DeadlineTag({ category }: { category: string }) {
  const dl = DEADLINES[category];
  if (!dl) return null;
  const now = new Date();
  const deadline = new Date(now.getFullYear(), dl.month - 1, dl.day);
  if (deadline < now) deadline.setFullYear(deadline.getFullYear() + 1);
  const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const urgent = daysLeft <= 30;
  return (
    <p className={`text-xs mt-1 ${urgent ? "text-red-600 font-bold" : "text-gray-500"}`}>
      次回締切: {dl.month}/{dl.day}（あと{daysLeft}日）{urgent && " 🔥"}
    </p>
  );
}

function formatAmount(amount: number | null): string {
  if (!amount) return "—";
  if (amount >= 100000000) return `${(amount / 100000000).toFixed(1)}億円`;
  if (amount >= 10000) return `${(amount / 10000).toFixed(0)}万円`;
  return `${amount}円`;
}

const BLUR_THRESHOLD = 2; // Show first 2 cards, blur the rest

export default function Results() {
  const router = useRouter();
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);
  const confettiFired = useRef(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("diagnosisResult");
    if (stored) {
      const data: DiagnosisResult = JSON.parse(stored);
      setResult(data);
      setSelected(new Set(data.matches.map((m) => m.subsidy_id)));
      // Fire confetti
      if (!confettiFired.current && data.matches.length > 0) {
        confettiFired.current = true;
        setTimeout(() => {
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }, 300);
      }
    } else {
      router.push("/");
    }
  }, [router]);

  if (!result) {
    return <div className="min-h-screen flex items-center justify-center">読み込み中...</div>;
  }

  const selectedMatches = result.matches.filter((m) => selected.has(m.subsidy_id));
  const totalEstimated = selectedMatches.reduce((sum, m) => sum + (m.estimated_amount || 0), 0);
  const totalMax = selectedMatches.reduce((sum, m) => sum + (m.max_amount || 0), 0);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === result.matches.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(result.matches.map((m) => m.subsidy_id)));
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-3xl mx-auto px-4 pt-8 sm:pt-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <p className="text-3xl mb-2">🎉</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">おめでとうございます！</h1>
          <p className="text-gray-500">{result.total_matches}件の補助金がマッチしました</p>
        </motion.div>

        {result.matches.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 text-lg">該当する補助金が見つかりませんでした</p>
            <Link href="/diagnosis" className="text-blue-600 underline mt-4 inline-block">条件を変えて再診断</Link>
          </div>
        ) : (
          <>
            {/* 総額サマリー */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg p-6 mb-6 text-center">
              <p className="text-sm opacity-80 mb-1">あなたがマッチした補助金の総額</p>
              <p className="text-4xl sm:text-5xl font-bold mb-1">{formatAmount(totalMax)}</p>
              <p className="text-sm opacity-80">受給目安額: {formatAmount(totalEstimated)} / {selectedMatches.length}件選択中</p>
            </motion.div>

            {/* 選択操作 */}
            <div className="flex items-center justify-between mb-4">
              <button onClick={toggleAll} className="text-sm text-blue-600 hover:underline">
                {selected.size === result.matches.length ? "すべて解除" : "すべて選択"}
              </button>
              <p className="text-sm text-gray-400">{selected.size}/{result.matches.length}件選択中</p>
            </div>

            {/* 補助金カード */}
            <div className="space-y-4">
              {result.matches.map((m, index) => {
                const isBlurred = !showAll && index >= BLUR_THRESHOLD;
                const isSelected = selected.has(m.subsidy_id);
                return (
                  <motion.div key={m.subsidy_id}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * Math.min(index, 5) }}
                    className={`relative bg-white rounded-xl shadow transition-all ${
                      isSelected ? "border-2 border-blue-500" : "border border-gray-200 opacity-60"
                    } ${isBlurred ? "select-none" : ""}`}
                  >
                    {isBlurred && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl z-10 flex items-center justify-center">
                        <div className="text-center p-4">
                          <p className="text-gray-700 font-medium mb-2">残り{result.matches.length - BLUR_THRESHOLD}件の補助金があります</p>
                          <button onClick={() => setShowAll(true)}
                            className="bg-[#06C755] text-white px-6 py-2 rounded-full font-medium hover:bg-[#05b34c] text-sm">
                            LINEで全ての結果を確認する
                          </button>
                        </div>
                      </div>
                    )}
                    <div className="p-5 sm:p-6">
                      <div className="flex items-start gap-3">
                        <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(m.subsidy_id)}
                          className="mt-1 w-5 h-5 rounded border-gray-300" />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">#{m.recommendation_rank}</span>
                                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">{m.category}</span>
                              </div>
                              <h2 className="text-lg font-bold text-gray-900">{m.subsidy_name}</h2>
                              <DeadlineTag category={m.category} />
                            </div>
                            <div className="text-right shrink-0">
                              <Stars count={m.fit_score} />
                              <div className="mt-1"><DifficultyBadge rank={m.difficulty_rank} /></div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                            <div>
                              <span className="text-xs text-gray-500">受給目安額</span>
                              <p className="text-xl font-bold text-blue-600">{formatAmount(m.estimated_amount)}</p>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500">補助上限</span>
                              <p className="text-lg text-gray-700">{formatAmount(m.max_amount)}</p>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500">入金までの目安</span>
                              <p className="text-sm text-gray-700">{PAYMENT_TIMELINE[m.category] || "採択後 約4〜8ヶ月"}</p>
                            </div>
                          </div>

                          {m.match_reasons.length > 0 && (
                            <div className="mb-2">
                              <div className="flex flex-wrap gap-1">
                                {m.match_reasons.map((r, i) => (
                                  <span key={i} className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded">✓ {r}</span>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="mt-2">
                            <Link href={`/subsidy/${m.subsidy_id}`} className="text-blue-600 text-sm hover:underline">詳細を見る →</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="text-center mt-6">
              <Link href="/diagnosis" className="text-blue-600 text-sm hover:underline">条件を変えて再診断</Link>
            </div>
          </>
        )}
      </div>

      {/* 固定フッターCTA */}
      {result.matches.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
          <div className="max-w-3xl mx-auto">
            <a
              href={`https://line.me/R/ti/p/DUMMY_LINE_ID?subsidies=${selectedMatches.map(m => m.subsidy_id).join(",")}&total=${totalEstimated}`}
              target="_blank" rel="noopener noreferrer"
              className={`block w-full py-4 rounded-xl font-bold text-lg text-center transition-all ${
                selectedMatches.length > 0
                  ? "bg-[#06C755] text-white hover:bg-[#05b34c]"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              onClick={(e) => selectedMatches.length === 0 && e.preventDefault()}
            >
              {selectedMatches.length > 0
                ? `選択した${selectedMatches.length}件についてLINEで相談する`
                : "補助金を選択してください"
              }
            </a>
            <p className="text-xs text-gray-400 text-center mt-1">提携行政書士が無料で申請をサポートします</p>
          </div>
        </div>
      )}
    </main>
  );
}
