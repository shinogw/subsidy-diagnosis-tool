"""補助金マッチングエンジン — ハードフィルタ→スコアリング→ランキング"""

from datetime import date
from typing import Optional

from app.models.subsidy import Subsidy
from app.models.company import Company


# デフォルト重み（DB未接続時のフォールバック）
DEFAULT_WEIGHTS = {
    "industry_match": 0.30,
    "employee_fit": 0.15,
    "purpose_match": 0.25,
    "wage_increase": 0.10,
    "previous_usage": 0.10,
    "years_fit": 0.10,
}

# 投資目的キーワードマッピング
PURPOSE_KEYWORDS = {
    "IT導入": ["IT", "システム", "ソフトウェア", "DX", "デジタル", "AI", "クラウド"],
    "ものづくり": ["製造", "設備", "生産", "工場", "機械", "自動化"],
    "省力化": ["省力", "効率化", "自動化", "ロボット", "AI"],
    "事業承継": ["承継", "M&A", "事業譲渡", "後継"],
    "新事業": ["新規", "進出", "転換", "新事業"],
    "人材": ["採用", "正社員", "キャリア", "人材", "雇用"],
    "業務改善": ["業務改善", "賃上げ", "給与", "最低賃金"],
}


def hard_filter(subsidy: Subsidy, company: Company) -> bool:
    """必須条件チェック。Falseなら即除外。"""

    # 従業員数チェック
    if subsidy.eligible_employee_min and company.employee_count < subsidy.eligible_employee_min:
        return False
    if subsidy.eligible_employee_max and company.employee_count > subsidy.eligible_employee_max:
        return False

    # 資本金チェック
    if subsidy.eligible_capital_max and company.capital and company.capital > subsidy.eligible_capital_max:
        return False

    # 業種チェック
    if subsidy.eligible_industries:
        industries = subsidy.eligible_industries
        if isinstance(industries, list) and len(industries) > 0:
            if company.industry not in industries and company.sub_industry not in industries:
                # 「全業種」的な指定がなければ除外
                if "全業種" not in industries and "全業種対象" not in industries:
                    return False

    # 地域チェック
    if subsidy.eligible_regions:
        regions = subsidy.eligible_regions
        if isinstance(regions, list) and len(regions) > 0:
            if company.prefecture not in regions:
                return False

    # 締切チェック
    if subsidy.application_deadline and subsidy.deadline_type == "fixed":
        if subsidy.application_deadline < date.today():
            return False

    # GビズID必須チェック
    if subsidy.requires_gbiz_id and not company.has_gbiz_id:
        return False

    # ステータスチェック
    if subsidy.status != "active":
        return False

    return True


def score_industry_match(subsidy: Subsidy, company: Company) -> float:
    """業種マッチスコア (0-100)"""
    if not subsidy.eligible_industries:
        return 80  # 全業種対象

    industries = subsidy.eligible_industries
    if isinstance(industries, list):
        if company.industry in industries:
            return 100  # 完全一致
        if company.sub_industry and company.sub_industry in industries:
            return 80
        if "全業種" in industries or "全業種対象" in industries:
            return 80
    return 30  # 広義マッチ（ハードフィルタを通過してるので完全不適合ではない）


def score_employee_fit(subsidy: Subsidy, company: Company) -> float:
    """従業員規模フィットスコア (0-100)"""
    emp_min = subsidy.eligible_employee_min or 0
    emp_max = subsidy.eligible_employee_max or 10000

    if emp_min <= company.employee_count <= emp_max:
        # 中央値に近いほど高スコア
        midpoint = (emp_min + emp_max) / 2
        if emp_max - emp_min == 0:
            return 100
        distance = abs(company.employee_count - midpoint) / ((emp_max - emp_min) / 2)
        return max(50, 100 - distance * 50)
    return 30


def score_purpose_match(subsidy: Subsidy, company: Company) -> float:
    """投資目的マッチスコア (0-100)"""
    if not company.investment_purpose:
        return 50  # 不明

    purpose = company.investment_purpose
    category = subsidy.category

    # カテゴリに対応するキーワードをチェック
    for cat_key, keywords in PURPOSE_KEYWORDS.items():
        if cat_key in category:
            matches = sum(1 for kw in keywords if kw in purpose)
            if matches >= 2:
                return 100
            if matches == 1:
                return 70
            return 40

    return 50  # デフォルト


def score_wage_increase(subsidy: Subsidy, company: Company) -> float:
    """賃上げ計画スコア (0-100)"""
    if not subsidy.requires_wage_increase:
        return 80  # 不要なら問題なし
    return 100 if company.has_wage_increase_plan else 0


def score_previous_usage(company: Company) -> float:
    """過去利用歴スコア (0-100)"""
    if not company.previous_subsidy_usage:
        return 100  # 未利用＝有利
    usage = company.previous_subsidy_usage
    if isinstance(usage, list) and len(usage) > 0:
        return 50  # 利用歴あり
    return 100


def score_years_fit(subsidy: Subsidy, company: Company) -> float:
    """設立年数フィットスコア (0-100)"""
    if not subsidy.eligible_years_min:
        return 80  # 制限なし

    if not company.established_year:
        return 50  # 不明

    years = date.today().year - company.established_year
    if years >= subsidy.eligible_years_min:
        return 100
    return 0


def calculate_fit_score(
    subsidy: Subsidy,
    company: Company,
    weights: Optional[dict] = None,
) -> tuple[int, list[str], list[str]]:
    """
    総合適合度スコアを算出。
    Returns: (fit_score 1-5, match_reasons, unmatch_reasons)
    """
    w = weights or DEFAULT_WEIGHTS

    scores = {
        "industry_match": score_industry_match(subsidy, company),
        "employee_fit": score_employee_fit(subsidy, company),
        "purpose_match": score_purpose_match(subsidy, company),
        "wage_increase": score_wage_increase(subsidy, company),
        "previous_usage": score_previous_usage(company),
        "years_fit": score_years_fit(subsidy, company),
    }

    total = sum(scores[k] * w.get(k, 0) for k in scores)

    # ★変換
    if total >= 90:
        fit_score = 5
    elif total >= 70:
        fit_score = 4
    elif total >= 50:
        fit_score = 3
    elif total >= 30:
        fit_score = 2
    else:
        fit_score = 1

    # 理由生成
    match_reasons = []
    unmatch_reasons = []

    for k, v in scores.items():
        label = {
            "industry_match": "業種適合",
            "employee_fit": "企業規模適合",
            "purpose_match": "投資目的合致",
            "wage_increase": "賃上げ計画",
            "previous_usage": "補助金利用歴",
            "years_fit": "設立年数",
        }.get(k, k)

        if v >= 70:
            match_reasons.append(label)
        elif v < 40:
            unmatch_reasons.append(f"{label}（低スコア）")

    return fit_score, match_reasons, unmatch_reasons


def estimate_amount(subsidy: Subsidy, company: Company) -> Optional[int]:
    """概算補助額"""
    if not subsidy.max_amount:
        return None

    if company.investment_amount and subsidy.subsidy_rate:
        estimated = int(company.investment_amount * float(subsidy.subsidy_rate))
        return min(estimated, subsidy.max_amount)

    # 投資額不明の場合は上限の50%を目安
    return subsidy.max_amount // 2


def run_matching(subsidies: list[Subsidy], company: Company, weights: Optional[dict] = None) -> list[dict]:
    """
    マッチング実行: ハードフィルタ→スコアリング→ランキング
    """
    results = []

    for subsidy in subsidies:
        # Step 1: ハードフィルタ
        if not hard_filter(subsidy, company):
            continue

        # Step 2: スコアリング
        fit_score, match_reasons, unmatch_reasons = calculate_fit_score(subsidy, company, weights)

        # Step 3: 結果構築
        results.append({
            "subsidy": subsidy,
            "fit_score": fit_score,
            "difficulty_rank": subsidy.difficulty_rank,
            "match_reasons": match_reasons,
            "unmatch_reasons": unmatch_reasons,
            "estimated_amount": estimate_amount(subsidy, company),
        })

    # ランキング: fit_score DESC → difficulty_rank ASC → estimated_amount DESC
    rank_order = {"C": 0, "B": 1, "A": 2}  # C=簡単, A=難
    results.sort(
        key=lambda r: (
            -r["fit_score"],
            rank_order.get(r["difficulty_rank"], 1),
            -(r["estimated_amount"] or 0),
        )
    )

    # 順位付与
    for i, r in enumerate(results):
        r["recommendation_rank"] = i + 1

    return results
