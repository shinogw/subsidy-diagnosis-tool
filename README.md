# 補助金診断ツール

中小企業向け補助金マッチング・書類自動生成ツール。

## 技術スタック
- **Backend**: FastAPI (Python 3.12+) + SQLAlchemy 2.0
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **DB**: PostgreSQL (本番) / SQLite (開発)
- **Hosting**: Railway

## セットアップ

### バックエンド
```bash
cd backend
pip install -r requirements.txt
python init_db.py          # DB初期化 + シードデータ投入
uvicorn app.main:app --reload --port 8000
```

### フロントエンド
```bash
cd frontend
npm install
npm run dev                # http://localhost:3000
```

### 環境変数
`.env.example` をコピーして `.env` を作成:
```bash
cp .env.example .env
```

| 変数 | 説明 | デフォルト |
|---|---|---|
| DATABASE_URL | DB接続文字列 | sqlite+aiosqlite:///./subsidy_tool.db |
| ALLOWED_ORIGINS | CORSオリジン（カンマ区切り） | http://localhost:3000 |
| ADMIN_API_KEY | 管理系API認証キー | dev-admin-key-change-me |

## API

### 公開エンドポイント
| Method | Path | 説明 |
|---|---|---|
| GET | /health | ヘルスチェック |
| POST | /api/v1/diagnosis | 補助金診断実行 |
| GET | /api/v1/diagnosis/{company_id}/results | 診断結果取得 |
| GET | /api/v1/subsidies | 補助金一覧 |
| GET | /api/v1/subsidies/{id} | 補助金詳細 |
| GET | /api/v1/stats | 統計情報 |

### 管理エンドポイント（要 X-API-Key ヘッダー）
| Method | Path | 説明 |
|---|---|---|
| POST | /api/v1/subsidies | 補助金追加 |
| PUT | /api/v1/subsidies/{id} | 補助金更新 |

## テスト
```bash
cd backend
python -m pytest tests/ -v
```

## ライセンス
Private
