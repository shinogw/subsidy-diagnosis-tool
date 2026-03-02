# 補助金診断ツール — システム設計書 v1

## 技術スタック（確定）
- **Backend**: FastAPI (Python 3.12+)
- **Frontend**: Next.js 14 (App Router)
- **DB**: PostgreSQL (Railway)
- **Hosting**: Railway
- **AI**: OpenAI API (書類下書き生成)

## 法的構造（確定）
- **パターン2: 行政書士協業モデル**
- AIは「下書き生成エンジン」。最終確認・提出は提携行政書士
- 課金対象: マッチング・診断・コンサル（書類作成料は行政書士報酬に含む）
- 「採択確率」は使わない → 難易度ランク(A/B/C) + 適合度スコア(★5段階)

---

## DBスキーマ

### subsidies（補助金マスタ）
```sql
CREATE TABLE subsidies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,           -- 補助金名称
    category VARCHAR(50) NOT NULL,        -- カテゴリ（IT導入/ものづくり/小規模等）
    provider VARCHAR(100) NOT NULL,       -- 提供元（中小企業庁/経産省/自治体等）
    
    -- 金額
    min_amount BIGINT,                    -- 最小補助額（円）
    max_amount BIGINT,                    -- 最大補助額（円）
    subsidy_rate DECIMAL(3,2),            -- 補助率（0.50 = 1/2, 0.67 = 2/3）
    
    -- 難易度・採択情報
    difficulty_rank CHAR(1) NOT NULL,     -- A/B/C（A=易, C=難）
    historical_acceptance_rate DECIMAL(4,2), -- 過去採択率（参考値）
    competition_level VARCHAR(20),        -- low/medium/high
    
    -- 対象要件
    eligible_industries JSONB,            -- 対象業種リスト
    eligible_employee_min INT,            -- 最小従業員数
    eligible_employee_max INT,            -- 最大従業員数
    eligible_capital_max BIGINT,          -- 資本金上限
    eligible_years_min INT,               -- 設立年数下限
    eligible_regions JSONB,               -- 対象地域（null=全国）
    requires_wage_increase BOOLEAN DEFAULT FALSE,
    requires_gbiz_id BOOLEAN DEFAULT FALSE,
    other_requirements JSONB,             -- その他要件（柔軟対応）
    
    -- 申請情報
    application_start DATE,
    application_deadline DATE,            -- 締切日（必須運用）
    deadline_type VARCHAR(10) DEFAULT 'fixed', -- fixed/rolling/tbd
    required_documents JSONB,             -- 必要書類リスト
    application_url VARCHAR(500),
    
    -- メタ
    status VARCHAR(20) DEFAULT 'active',  -- active/closed/upcoming
    source_url VARCHAR(500),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### companies（企業情報）
```sql
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- 基本情報
    company_name VARCHAR(200) NOT NULL,
    representative_name VARCHAR(100),
    industry VARCHAR(100) NOT NULL,       -- 業種
    sub_industry VARCHAR(100),            -- 細分類
    employee_count INT NOT NULL,
    annual_revenue BIGINT,                -- 年間売上（円）
    capital BIGINT,                       -- 資本金（円）
    established_year INT,                 -- 設立年
    prefecture VARCHAR(10) NOT NULL,      -- 都道府県
    city VARCHAR(50),
    
    -- 補助金関連属性
    has_wage_increase_plan BOOLEAN DEFAULT FALSE,
    has_gbiz_id BOOLEAN DEFAULT FALSE,
    previous_subsidy_usage JSONB,         -- 過去の補助金利用歴
    investment_purpose TEXT,              -- 投資目的（自由記述）
    investment_amount BIGINT,             -- 想定投資額
    
    -- 連絡先
    email VARCHAR(200),
    phone VARCHAR(20),
    line_id VARCHAR(100),
    
    -- メタ
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### match_results（マッチング結果）
```sql
CREATE TABLE match_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id),
    subsidy_id UUID REFERENCES subsidies(id),
    
    -- スコアリング
    fit_score INT NOT NULL CHECK (fit_score BETWEEN 1 AND 5),  -- 適合度★1-5
    difficulty_rank CHAR(1) NOT NULL,     -- 補助金の難易度（subsidiesから継承）
    recommendation_rank INT,              -- おすすめ順位
    
    -- 判定詳細
    match_reasons JSONB,                  -- マッチした理由リスト
    unmatch_reasons JSONB,                -- 不適合の理由リスト（部分マッチ時）
    estimated_amount BIGINT,              -- 概算補助額
    
    -- ステータス
    status VARCHAR(20) DEFAULT 'diagnosed', -- diagnosed/interested/applied/accepted/rejected
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### draft_documents（AI生成下書き）
```sql
CREATE TABLE draft_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_result_id UUID REFERENCES match_results(id),
    
    document_type VARCHAR(100) NOT NULL,  -- 事業計画書/経費明細/etc
    content JSONB NOT NULL,               -- 構造化された下書き内容
    ai_model VARCHAR(50),                 -- 使用AIモデル
    generation_prompt TEXT,               -- 生成に使ったプロンプト（デバッグ用）
    
    -- 行政書士レビュー
    reviewer_id UUID,                     -- 担当行政書士ID（将来: reviewersテーブル参照）
    review_status VARCHAR(20) DEFAULT 'draft', -- draft/reviewing/approved/submitted
    reviewer_notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## マッチングロジック

### フロー
```
企業情報入力 → ハードフィルタ → スコアリング → ランキング → 結果表示
```

### Step 1: ハードフィルタ（必須条件チェック）
以下を満たさない補助金は即除外:
- 従業員数が範囲外
- 資本金が上限超過
- 対象業種に含まれない
- 対象地域外
- 申請期限切れ
- GビズID必須なのに未保有

### Step 2: スコアリング（適合度★1-5）
各項目に重み付けスコアを算出:

| 項目 | 重み | スコア算出 |
|---|---|---|
| 業種マッチ | 30% | 完全一致=100, 関連業種=60, 広義=30 |
| 従業員規模 | 15% | 中央値付近=100, 端=50 |
| 投資目的マッチ | 25% | キーワードマッチ（NLP不要、ルールベース） |
| 賃上げ計画 | 10% | あり=100 or N/A=80, なし&必須=0 |
| 過去利用歴 | 10% | 未利用=100, 利用済み=50（一部制限あり） |
| 設立年数 | 10% | 範囲内=100, 範囲外=0 |

**総合スコア → ★変換:**
- 90-100 → ★★★★★
- 70-89 → ★★★★
- 50-69 → ★★★
- 30-49 → ★★
- 0-29 → ★

### Step 3: ランキング
`fit_score DESC, difficulty_rank ASC (A→C), estimated_amount DESC` でソート

---

## API設計

### 診断フロー
```
POST /api/v1/diagnosis
  Body: { company info }
  Response: { company_id, matches: [{ subsidy, fit_score, difficulty, estimated_amount }] }

GET /api/v1/diagnosis/{company_id}/results
  Response: { matches with details }

GET /api/v1/subsidies
  Query: ?status=active&category=IT
  Response: { subsidies list }

GET /api/v1/subsidies/{id}
  Response: { subsidy detail }
```

### 書類生成フロー
```
POST /api/v1/documents/generate
  Body: { match_result_id }
  Response: { draft_document_id, status: "generating" }

GET /api/v1/documents/{id}
  Response: { document content, review_status }

PATCH /api/v1/documents/{id}/review
  Body: { status, reviewer_notes }
  Response: { updated document }
```

### 管理系
```
POST /api/v1/subsidies          -- 補助金データ追加
PUT /api/v1/subsidies/{id}      -- 補助金データ更新
GET /api/v1/stats               -- ダッシュボード統計
```

---

### scoring_weights（スコアリング重み設定）
```sql
CREATE TABLE scoring_weights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    factor_name VARCHAR(50) NOT NULL UNIQUE, -- industry_match/employee_fit/purpose_match/etc
    weight DECIMAL(3,2) NOT NULL,            -- 重み（合計1.00）
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## ディレクトリ構成（予定）

```
subsidy-tool/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── api/
│   │   │   ├── diagnosis.py
│   │   │   ├── subsidies.py
│   │   │   └── documents.py
│   │   ├── models/
│   │   │   ├── subsidy.py
│   │   │   ├── company.py
│   │   │   ├── match_result.py
│   │   │   └── draft_document.py
│   │   ├── services/
│   │   │   ├── matching.py      -- マッチングエンジン
│   │   │   ├── scoring.py       -- スコアリングロジック
│   │   │   └── document_gen.py  -- AI書類生成
│   │   └── db/
│   │       ├── database.py
│   │       └── migrations/
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── app/
│   │   ├── page.tsx             -- トップ/診断入力
│   │   ├── results/
│   │   │   └── [id]/page.tsx    -- 診断結果
│   │   └── api/                 -- BFF（必要に応じて）
│   ├── package.json
│   └── Dockerfile
├── data/
│   └── seed_subsidies.json      -- 初期補助金データ
├── docker-compose.yml
└── README.md
```

---

*v1 作成: クロ / 2026-03-02*
*ステータス: メッシレビュー待ち*
