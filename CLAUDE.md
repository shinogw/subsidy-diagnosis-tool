# CLAUDE.md - 補助金診断ツール開発ガイド

## プロジェクト概要
中小企業向け補助金マッチング・診断ツール。企業情報を入力すると、該当する補助金を自動診断し、行政書士による申請サポートまで繋ぐ。

## 技術スタック
- **Backend**: FastAPI (Python 3.12) + SQLAlchemy 2.0 (async) + SQLite (開発) / PostgreSQL (本番)
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Hosting**: Railway (backend) + Vercel (frontend)
- **Repo**: https://github.com/shinogw/subsidy-diagnosis-tool

## ディレクトリ構造
```
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPIアプリ + CORS設定
│   │   ├── api/
│   │   │   ├── diagnosis.py     # POST /api/v1/diagnosis, GET /results
│   │   │   ├── subsidies.py     # CRUD /api/v1/subsidies (管理系は要X-API-Key)
│   │   │   ├── documents.py     # 書類生成エンドポイント
│   │   │   ├── stats.py         # 統計エンドポイント
│   │   │   ├── schemas.py       # Pydantic v2スキーマ
│   │   │   └── auth.py          # APIキー認証
│   │   ├── models/              # SQLAlchemy models (5テーブル)
│   │   │   ├── subsidy.py       # 補助金マスタ
│   │   │   ├── company.py       # 企業情報
│   │   │   ├── match_result.py  # マッチング結果
│   │   │   ├── draft_document.py # 書類ドラフト
│   │   │   └── scoring_weight.py # スコアリング重み
│   │   ├── services/
│   │   │   └── matching.py      # マッチングエンジン (hard_filter → scoring → ranking)
│   │   └── db/
│   │       └── database.py      # DB接続設定
│   ├── data/
│   │   └── seed_subsidies.json  # シードデータ8件
│   ├── tests/
│   │   └── test_matching.py     # 25テスト
│   ├── init_db.py               # DB初期化 + シード投入
│   ├── requirements.txt
│   ├── Dockerfile
│   └── Procfile
├── frontend/
│   └── src/app/
│       ├── page.tsx             # 診断入力フォーム
│       ├── results/page.tsx     # 結果一覧 (総額サマリー + 除外機能)
│       ├── subsidy/[id]/page.tsx # 補助金詳細
│       └── layout.tsx
└── design/
    └── ARCHITECTURE.md          # 設計書
```

## 開発コマンド

### バックエンド
```bash
cd backend
pip install -r requirements.txt
python init_db.py                    # DB初期化 + シードデータ
uvicorn app.main:app --reload --port 8000
python -m pytest tests/ -v           # テスト実行
```

### フロントエンド
```bash
cd frontend
npm install
npm run dev                          # http://localhost:3000
npm run build                        # ビルド確認
```

## 環境変数
- `NEXT_PUBLIC_API_URL` — バックエンドURL (フロント)
- `ALLOWED_ORIGINS` — CORS許可オリジン (バックエンド)
- `ADMIN_API_KEY` — 管理API認証キー (バックエンド)

## API概要
| Method | Path | 認証 | 説明 |
|--------|------|------|------|
| GET | /health | なし | ヘルスチェック |
| POST | /api/v1/diagnosis | なし | 補助金診断実行 |
| GET | /api/v1/diagnosis/{id}/results | なし | 診断結果取得 |
| GET | /api/v1/subsidies | なし | 補助金一覧 |
| GET | /api/v1/subsidies/{id} | なし | 補助金詳細 |
| POST | /api/v1/subsidies | X-API-Key | 補助金追加 |
| PUT | /api/v1/subsidies/{id} | X-API-Key | 補助金更新 |
| GET | /api/v1/stats | なし | 統計 |

## マッチングロジック
1. **Hard Filter**: 従業員数・資本金・業種・地域・GビズID・申請期限でフィルタ
2. **Scoring**: 6因子 (industry_match:0.30, employee_fit:0.15, purpose_match:0.25, wage_increase:0.10, previous_usage:0.10, years_fit:0.10)
3. **Ranking**: fit_score DESC → difficulty ASC → estimated_amount DESC

## 重要な設計判断
- **採択確率は表示しない** → 難易度ランク(A/B/C) + 適合度スコア(★1-5)を使う（景品表示法リスク回避）
- **「概算補助額」ではなく「受給目安額」** と表示
- **行政書士協業モデル** — AIは下書き生成のみ、行政書士が最終確認・提出
- **投資目的は自由記載ではなくチェックボックス** — ユーザーの入力ハードルを下げる

## テスト
変更後は必ず `python -m pytest tests/ -v` を実行し、25テスト全通過を確認すること。

## 本番URL
- Frontend: https://subsidy-diagnosis-tool-bzv5.vercel.app
- Backend: https://subsidy-diagnosis-tool-production.up.railway.app
