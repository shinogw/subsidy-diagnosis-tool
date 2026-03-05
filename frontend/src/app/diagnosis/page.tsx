"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const INDUSTRIES = [
  "情報通信業", "製造業", "建設業", "卸売業・小売業", "サービス業",
  "飲食業", "医療・福祉", "不動産業", "運輸業", "農林水産業", "その他",
];

const PREFECTURES = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県",
  "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県",
  "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県",
  "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県",
];

const REVENUE_OPTIONS = [
  { label: "選択してください", value: "" },
  { label: "999万円以下", value: "500" },
  { label: "1,000〜2,999万円", value: "2000" },
  { label: "3,000〜4,999万円", value: "4000" },
  { label: "5,000〜9,999万円", value: "7500" },
  { label: "1億円以上", value: "15000" },
];

const YEAR_OPTIONS = (() => {
  const years = [{ label: "選択してください", value: "" }];
  for (let y = 2026; y >= 1950; y--) years.push({ label: `${y}年`, value: String(y) });
  return years;
})();

const PURPOSES = [
  "AI導入・DX推進", "業務効率化・省力化", "新製品・新サービス開発",
  "販路拡大・EC構築", "設備投資・機械導入", "人材育成・採用強化",
  "事業承継・M&A", "海外展開", "IT導入（クラウド・SaaS）", "賃上げ・労働環境改善",
];

const STEPS = ["基本情報", "会社情報", "投資目的"];

const LOADING_STEPS = [
  "業種データを確認中...",
  "対象補助金をスキャン中...",
  "適合度を計算中...",
  "受給目安額を算出中...",
  "最終結果をまとめています...",
];

export default function Diagnosis() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [form, setForm] = useState({
    industry: "", employee_count: "", annual_revenue: "", capital: "",
    established_year: "", prefecture: "",
    has_wage_increase_plan: false, has_gbiz_id: false,
    investment_purposes: [] as string[],
    interested_in_startup_loan: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const canNext = () => {
    if (step === 0) return form.industry && form.employee_count && form.prefecture;
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setLoadingStep(0);
    setLoadingProgress(0);

    // Animate loading steps
    for (let i = 0; i < LOADING_STEPS.length; i++) {
      await new Promise((r) => setTimeout(r, 600));
      setLoadingStep(i);
      setLoadingProgress(((i + 1) / LOADING_STEPS.length) * 100);
    }

    const payload = {
      company_name: "（LINE登録後に取得）",
      industry: form.industry,
      employee_count: parseInt(form.employee_count) || 0,
      annual_revenue: form.annual_revenue ? parseInt(form.annual_revenue) * 10000 : null,
      capital: form.capital ? parseInt(form.capital) * 10000 : null,
      established_year: form.established_year ? parseInt(form.established_year) : null,
      prefecture: form.prefecture,
      has_wage_increase_plan: form.has_wage_increase_plan,
      has_gbiz_id: form.has_gbiz_id,
      investment_purpose: form.investment_purposes.join("、"),
      interested_in_startup_loan: form.interested_in_startup_loan,
    };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/v1/diagnosis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      sessionStorage.setItem("diagnosisResult", JSON.stringify(data));
      router.push("/results");
    } catch {
      alert("エラーが発生しました。しばらくしてからお試しください。");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-4xl mb-4 animate-bounce">🤖</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">AIが分析しています...</h2>
            <p className="text-sm text-gray-500 mb-6">{LOADING_STEPS[loadingStep]}</p>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <motion.div
                className="bg-blue-600 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${loadingProgress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <p className="text-xs text-gray-400">あなたに最適な補助金を見つけています</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 sm:py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2">補助金AI 診断</h1>
        <p className="text-gray-500 text-center mb-6 text-sm">
          基本情報を選択して、対象の補助金を診断します
        </p>

        {/* Progress bar */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                i <= step ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
              }`}>
                <span>{i + 1}</span>
                <span className="hidden sm:inline">{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`w-8 h-0.5 ${i < step ? "bg-blue-600" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        {step < 3 && (
          <p className="text-center text-sm text-blue-600 font-medium mb-4">
            {step === 2 ? "あと少しで完了！" : `ステップ ${step + 1} / ${STEPS.length}`}
          </p>
        )}

        <div className="bg-white rounded-lg shadow p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">業種 <span className="text-red-500">*</span></label>
                  <select name="industry" value={form.industry} onChange={handleChange} required
                    className="w-full border rounded-md px-3 py-2.5 text-gray-900">
                    <option value="">選択してください</option>
                    {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">従業員数 <span className="text-red-500">*</span></label>
                  <input type="number" name="employee_count" required min="0" inputMode="numeric" pattern="[0-9]*"
                    value={form.employee_count} onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2.5 text-gray-900" placeholder="半角数字で入力（例: 30）" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">所在地 <span className="text-red-500">*</span></label>
                  <select name="prefecture" value={form.prefecture} onChange={handleChange} required
                    className="w-full border rounded-md px-3 py-2.5 text-gray-900">
                    <option value="">選択してください</option>
                    {PREFECTURES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">年間売上</label>
                    <select name="annual_revenue" value={form.annual_revenue} onChange={handleChange}
                      className="w-full border rounded-md px-3 py-2.5 text-gray-900">
                      {REVENUE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">資本金（万円）</label>
                    <input type="number" name="capital" inputMode="numeric" pattern="[0-9]*"
                      value={form.capital} onChange={handleChange}
                      className="w-full border rounded-md px-3 py-2.5 text-gray-900" placeholder="例: 1000" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">設立年</label>
                  <select name="established_year" value={form.established_year} onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2.5 text-gray-900">
                    {YEAR_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div className="space-y-3 pt-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="has_wage_increase_plan" checked={form.has_wage_increase_plan} onChange={handleChange} className="rounded" />
                    <span className="text-sm text-gray-700">賃上げ計画がある</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="has_gbiz_id" checked={form.has_gbiz_id} onChange={handleChange} className="rounded" />
                    <span className="text-sm text-gray-700">GビズIDを持っている</span>
                  </label>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">興味のある分野（複数選択可）</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {PURPOSES.map((purpose) => (
                      <label key={purpose} className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                        form.investment_purposes.includes(purpose) ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                      }`}>
                        <input type="checkbox" checked={form.investment_purposes.includes(purpose)}
                          onChange={(e) => setForm((prev) => ({
                            ...prev,
                            investment_purposes: e.target.checked
                              ? [...prev.investment_purposes, purpose]
                              : prev.investment_purposes.filter((p) => p !== purpose),
                          }))} className="rounded" />
                        <span className="text-sm text-gray-700">{purpose}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <label className="flex items-center gap-2 pt-2">
                  <input type="checkbox" name="interested_in_startup_loan" checked={form.interested_in_startup_loan} onChange={handleChange} className="rounded" />
                  <span className="text-sm text-gray-700">創業融資にも興味がある</span>
                </label>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <button onClick={() => setStep(step - 1)}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-md font-medium hover:bg-gray-50">
                戻る
              </button>
            )}
            {step < 2 ? (
              <button onClick={() => setStep(step + 1)} disabled={!canNext()}
                className="flex-1 bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 disabled:opacity-40">
                次へ
              </button>
            ) : (
              <button onClick={handleSubmit}
                className="flex-1 bg-blue-600 text-white py-3 rounded-md font-bold text-lg hover:bg-blue-700">
                無料で診断する
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
