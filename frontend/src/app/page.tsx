"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    company_name: "",
    industry: "情報通信業",
    employee_count: "",
    annual_revenue: "",
    capital: "",
    established_year: "",
    prefecture: "東京都",
    has_wage_increase_plan: false,
    has_gbiz_id: false,
    investment_purpose: "",
    investment_amount: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      employee_count: parseInt(form.employee_count) || 0,
      annual_revenue: form.annual_revenue ? parseInt(form.annual_revenue) * 10000 : null,
      capital: form.capital ? parseInt(form.capital) * 10000 : null,
      established_year: form.established_year ? parseInt(form.established_year) : null,
      investment_amount: form.investment_amount ? parseInt(form.investment_amount) * 10000 : null,
    };

    try {
      const res = await fetch("http://localhost:8000/api/v1/diagnosis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      // Store in sessionStorage for results page
      sessionStorage.setItem("diagnosisResult", JSON.stringify(data));
      router.push("/results");
    } catch (err) {
      alert("エラーが発生しました。バックエンドが起動しているか確認してください。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">補助金診断ツール</h1>
        <p className="text-gray-500 text-center mb-8">
          企業情報を入力して、該当する補助金を診断します
        </p>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-6">
          {/* 会社名 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">会社名</label>
            <input
              type="text" name="company_name" required
              value={form.company_name} onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 text-gray-900"
              placeholder="例: 株式会社サンプル"
            />
          </div>

          {/* 業種 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">業種</label>
            <select name="industry" value={form.industry} onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 text-gray-900">
              {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>

          {/* 従業員数 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">従業員数</label>
            <input
              type="number" name="employee_count" required min="1"
              value={form.employee_count} onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 text-gray-900"
              placeholder="例: 30"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* 年間売上 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">年間売上（万円）</label>
              <input
                type="number" name="annual_revenue"
                value={form.annual_revenue} onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 text-gray-900"
                placeholder="例: 10000"
              />
            </div>
            {/* 資本金 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">資本金（万円）</label>
              <input
                type="number" name="capital"
                value={form.capital} onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 text-gray-900"
                placeholder="例: 1000"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* 設立年 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">設立年</label>
              <input
                type="number" name="established_year" min="1900" max="2026"
                value={form.established_year} onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 text-gray-900"
                placeholder="例: 2018"
              />
            </div>
            {/* 所在地 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">所在地</label>
              <select name="prefecture" value={form.prefecture} onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 text-gray-900">
                {PREFECTURES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          {/* 投資目的 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">投資目的・導入したいもの</label>
            <textarea
              name="investment_purpose" rows={3}
              value={form.investment_purpose} onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 text-gray-900"
              placeholder="例: AI導入によるDX推進、クラウドシステムの構築"
            />
          </div>

          {/* 想定投資額 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">想定投資額（万円）</label>
            <input
              type="number" name="investment_amount"
              value={form.investment_amount} onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 text-gray-900"
              placeholder="例: 500"
            />
          </div>

          {/* チェックボックス */}
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="has_wage_increase_plan"
                checked={form.has_wage_increase_plan} onChange={handleChange}
                className="rounded" />
              <span className="text-sm text-gray-700">賃上げ計画がある</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="has_gbiz_id"
                checked={form.has_gbiz_id} onChange={handleChange}
                className="rounded" />
              <span className="text-sm text-gray-700">GビズIDを持っている</span>
            </label>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "診断中..." : "補助金を診断する"}
          </button>
        </form>
      </div>
    </main>
  );
}
