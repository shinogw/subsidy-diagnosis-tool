"""スコアリングロジック: 企業と補助金の適合度を算出する."""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date


# デフォルト重み（DBのscoring_weightsが取れないときのフォールバック）
DEFAULT_WEIGHTS: dict[str, float] = {
    "industry_match": 0.30,
    "employee_fit": 0.15,
    "purpose_match": 0.25,
    "wage_increase": 0.10,
    "previous_usage": 0.10,
    "established_years": 0.10,
}

# 投資目的のキーワードマッピング（カテゴリ → キーワードリスト）
PURPOSE_KEYWORDS: dict[str, list[str]] = {
    "IT導入": ["IT", "システム", "DX", "デジタル", "クラウド", "ソフトウェア", "RPA", "EC", "ホームページ", "セキュリティ"],
    "ものづくり": ["製造", "設備", "機械", "生産性", "自動化", "品質", "新製品", "試作"],
    "小規模持続化": ["販路", "開拓", "広告", "宣伝", "ウェブ", "チラシ", "展示会", "ブランディング"],
    "省力化": ["省力", "自動化", "効率化", "ロボット", "省人化", "AI", "IoT"],
    "事業承継": ["承継", "M&A", "事業譲渡", "後継", "引継", "第二創業"],
    "成長加速化": ["成長", "拡大", "海外", "新規事業", "イノベーション", "研究開発"],
    "業務改善": ["賃金", "賃上げ", "給与", "最低賃金", "生産性", "業務改善", "設備投資"],
    "キャリアアップ": ["正社員", "非正規", "キャリア", "処遇改善", "賞与", "退職金", "社会保険"],
}


@dataclass
class ScoreDetail:
    factor: str
    score: float  # 0-100
    weight: float
    reason: str


@dataclass
class ScoringResult:
    total_score: float  # 0-100
    fit_score: int  # ★1-5
    details: list[ScoreDetail] = field(default_factory=list)
    match_reasons: list[str] = field(default_factory=list)
    unmatch_reasons: list[str] = field(default_factory=list)


def score_to_stars(score: float) -> int:
    """総合スコア(0-100)を★1-5に変換."""
    if score >= 90:
        return 5
    elif score >= 70:
        return 4
    elif score >= 50:
        return 3
    elif score >= 30:
        return 2
    return 1


def score_industry_match(
    company_industry: str,
    company_sub_industry: str | None,
    eligible_industries: list[str] | None,
) -> tuple[float, str]:
    """業種マッチスコアを算出.

    完全一致=100, 関連業種=60, 広義=30, 不一致=0
    eligible_industriesがNone/空 → 全業種対象 = 100
    """
    if not eligible_industries:
        return 100.0, "全業種対象"

    # 完全一致チェック
    for ind in eligible_industries:
        if company_industry == ind:
            return 100.0, f"業種完全一致: {ind}"
        if company_sub_industry and company_sub_industry == ind:
            return 100.0, f"細分類一致: {ind}"

    # 部分一致チェック（業種名の一部が含まれる）
    for ind in eligible_industries:
        if ind in company_industry or company_industry in ind:
            return 60.0, f"関連業種: {ind}"
        if company_sub_industry and (ind in company_sub_industry or company_sub_industry in ind):
            return 60.0, f"関連業種(細分類): {ind}"

    # 広義マッチ（「製造業」「サービス業」など大カテゴリ）
    broad_categories = {"製造業", "サービス業", "小売業", "卸売業", "建設業", "情報通信業", "飲食業", "宿泊業", "運輸業", "医療福祉"}
    for ind in eligible_industries:
        for cat in broad_categories:
            if cat in ind and cat in company_industry:
                return 30.0, f"広義マッチ: {cat}"

    return 0.0, "業種不一致"


def score_employee_fit(
    employee_count: int,
    eligible_min: int | None,
    eligible_max: int | None,
) -> tuple[float, str]:
    """従業員規模スコアを算出. 中央値付近=100, 端=50."""
    if eligible_min is None and eligible_max is None:
        return 100.0, "従業員数制限なし"

    eff_min = eligible_min or 0
    eff_max = eligible_max or 99999

    if employee_count < eff_min or employee_count > eff_max:
        return 0.0, f"従業員数範囲外 ({eff_min}〜{eff_max}人)"

    # 中央値からの距離で50〜100のスコア
    midpoint = (eff_min + eff_max) / 2
    range_half = max((eff_max - eff_min) / 2, 1)
    distance_ratio = abs(employee_count - midpoint) / range_half
    score = 100 - (distance_ratio * 50)  # 中央=100, 端=50
    return max(score, 50.0), f"従業員数{employee_count}人 (範囲: {eff_min}〜{eff_max})"


def score_purpose_match(
    investment_purpose: str | None,
    subsidy_category: str,
) -> tuple[float, str]:
    """投資目的マッチスコアを算出（ルールベースのキーワードマッチ）."""
    if not investment_purpose:
        return 50.0, "投資目的未入力"

    purpose_lower = investment_purpose.lower()
    best_score = 0.0
    best_reason = "目的キーワード不一致"

    for category, keywords in PURPOSE_KEYWORDS.items():
        if category in subsidy_category or subsidy_category in category:
            # このカテゴリのキーワードでマッチングチェック
            matched_keywords = [kw for kw in keywords if kw.lower() in purpose_lower or kw in investment_purpose]
            if matched_keywords:
                match_ratio = min(len(matched_keywords) / 3, 1.0)  # 3キーワードで満点
                score = 60 + (match_ratio * 40)  # 60-100
                if score > best_score:
                    best_score = score
                    best_reason = f"キーワード一致: {', '.join(matched_keywords[:3])}"

    # カテゴリ名自体が含まれるか
    if subsidy_category in investment_purpose or investment_purpose in subsidy_category:
        if best_score < 80:
            best_score = 80.0
            best_reason = f"カテゴリ名一致: {subsidy_category}"

    return best_score, best_reason


def score_wage_increase(
    has_plan: bool,
    requires: bool,
) -> tuple[float, str]:
    """賃上げ計画スコア."""
    if not requires:
        if has_plan:
            return 100.0, "賃上げ計画あり（加点対象）"
        return 80.0, "賃上げ計画不要"

    if has_plan:
        return 100.0, "賃上げ計画あり"
    return 0.0, "賃上げ計画必須だが未計画"


def score_previous_usage(
    previous_usage: list[dict] | None,
    subsidy_name: str,
) -> tuple[float, str]:
    """過去利用歴スコア. 未利用=100, 同一補助金利用済み=50."""
    if not previous_usage:
        return 100.0, "補助金利用歴なし"

    used_names = [u.get("name", "") for u in previous_usage if isinstance(u, dict)]
    for name in used_names:
        if name in subsidy_name or subsidy_name in name:
            return 50.0, f"同種補助金の利用歴あり: {name}"

    return 80.0, "他の補助金利用歴あり（制限なし）"


def score_established_years(
    established_year: int | None,
    eligible_years_min: int | None,
    current_year: int | None = None,
) -> tuple[float, str]:
    """設立年数スコア."""
    if eligible_years_min is None:
        return 100.0, "設立年数制限なし"

    if established_year is None:
        return 50.0, "設立年不明"

    if current_year is None:
        current_year = date.today().year
    years = current_year - established_year

    if years < eligible_years_min:
        return 0.0, f"設立{years}年（下限{eligible_years_min}年未満）"

    return 100.0, f"設立{years}年（下限{eligible_years_min}年以上）"


def calculate_score(
    company: dict,
    subsidy: dict,
    weights: dict[str, float] | None = None,
) -> ScoringResult:
    """企業と補助金の適合度スコアを算出する.

    Args:
        company: 企業情報dict
        subsidy: 補助金情報dict
        weights: スコアリング重み（Noneならデフォルト使用）

    Returns:
        ScoringResult: スコアリング結果
    """
    w = weights or DEFAULT_WEIGHTS
    details: list[ScoreDetail] = []
    match_reasons: list[str] = []
    unmatch_reasons: list[str] = []

    # 1. 業種マッチ
    ind_score, ind_reason = score_industry_match(
        company.get("industry", ""),
        company.get("sub_industry"),
        subsidy.get("eligible_industries"),
    )
    details.append(ScoreDetail("industry_match", ind_score, w["industry_match"], ind_reason))
    if ind_score >= 60:
        match_reasons.append(ind_reason)
    elif ind_score == 0:
        unmatch_reasons.append(ind_reason)

    # 2. 従業員規模
    emp_score, emp_reason = score_employee_fit(
        company.get("employee_count", 0),
        subsidy.get("eligible_employee_min"),
        subsidy.get("eligible_employee_max"),
    )
    details.append(ScoreDetail("employee_fit", emp_score, w["employee_fit"], emp_reason))
    if emp_score >= 80:
        match_reasons.append(emp_reason)
    elif emp_score == 0:
        unmatch_reasons.append(emp_reason)

    # 3. 投資目的マッチ
    purpose_score, purpose_reason = score_purpose_match(
        company.get("investment_purpose"),
        subsidy.get("category", ""),
    )
    details.append(ScoreDetail("purpose_match", purpose_score, w["purpose_match"], purpose_reason))
    if purpose_score >= 60:
        match_reasons.append(purpose_reason)
    elif purpose_score < 30:
        unmatch_reasons.append(purpose_reason)

    # 4. 賃上げ計画
    wage_score, wage_reason = score_wage_increase(
        company.get("has_wage_increase_plan", False),
        subsidy.get("requires_wage_increase", False),
    )
    details.append(ScoreDetail("wage_increase", wage_score, w["wage_increase"], wage_reason))
    if wage_score >= 100:
        match_reasons.append(wage_reason)
    elif wage_score == 0:
        unmatch_reasons.append(wage_reason)

    # 5. 過去利用歴
    usage_score, usage_reason = score_previous_usage(
        company.get("previous_subsidy_usage"),
        subsidy.get("name", ""),
    )
    details.append(ScoreDetail("previous_usage", usage_score, w["previous_usage"], usage_reason))
    if usage_score >= 80:
        match_reasons.append(usage_reason)

    # 6. 設立年数
    years_score, years_reason = score_established_years(
        company.get("established_year"),
        subsidy.get("eligible_years_min"),
    )
    details.append(ScoreDetail("established_years", years_score, w["established_years"], years_reason))
    if years_score >= 100 and subsidy.get("eligible_years_min"):
        match_reasons.append(years_reason)
    elif years_score == 0:
        unmatch_reasons.append(years_reason)

    # 総合スコア算出
    total = sum(d.score * d.weight for d in details)
    stars = score_to_stars(total)

    return ScoringResult(
        total_score=round(total, 1),
        fit_score=stars,
        details=details,
        match_reasons=match_reasons,
        unmatch_reasons=unmatch_reasons,
    )
