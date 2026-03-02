"""マッチングエンジンのユニットテスト"""

import pytest
from unittest.mock import MagicMock
from datetime import date

from app.services.matching import (
    hard_filter,
    calculate_fit_score,
    estimate_amount,
    run_matching,
    score_industry_match,
    score_purpose_match,
)


def make_subsidy(**kwargs):
    """テスト用Subsidyモック"""
    defaults = {
        "id": "test-id",
        "name": "テスト補助金",
        "category": "IT導入",
        "provider": "テスト省",
        "min_amount": 100000,
        "max_amount": 5000000,
        "subsidy_rate": 0.50,
        "difficulty_rank": "B",
        "historical_acceptance_rate": 50.0,
        "competition_level": "medium",
        "eligible_industries": ["全業種対象"],
        "eligible_employee_min": None,
        "eligible_employee_max": 300,
        "eligible_capital_max": 300000000,
        "eligible_years_min": None,
        "eligible_regions": None,
        "requires_wage_increase": False,
        "requires_gbiz_id": False,
        "other_requirements": None,
        "application_start": None,
        "application_deadline": date(2026, 12, 31),
        "deadline_type": "fixed",
        "required_documents": [],
        "status": "active",
    }
    defaults.update(kwargs)
    mock = MagicMock()
    for k, v in defaults.items():
        setattr(mock, k, v)
    return mock


def make_company(**kwargs):
    """テスト用Companyモック"""
    defaults = {
        "id": "company-id",
        "company_name": "テスト株式会社",
        "industry": "情報通信業",
        "sub_industry": "ソフトウェア業",
        "employee_count": 50,
        "annual_revenue": 100000000,
        "capital": 10000000,
        "established_year": 2015,
        "prefecture": "東京都",
        "has_wage_increase_plan": True,
        "has_gbiz_id": True,
        "previous_subsidy_usage": None,
        "investment_purpose": "IT システム導入によるDX推進",
        "investment_amount": 5000000,
    }
    defaults.update(kwargs)
    mock = MagicMock()
    for k, v in defaults.items():
        setattr(mock, k, v)
    return mock


class TestHardFilter:
    def test_pass_basic(self):
        s = make_subsidy()
        c = make_company()
        assert hard_filter(s, c) is True

    def test_fail_employee_over(self):
        s = make_subsidy(eligible_employee_max=10)
        c = make_company(employee_count=50)
        assert hard_filter(s, c) is False

    def test_fail_capital_over(self):
        s = make_subsidy(eligible_capital_max=5000000)
        c = make_company(capital=10000000)
        assert hard_filter(s, c) is False

    def test_fail_deadline_passed(self):
        s = make_subsidy(application_deadline=date(2020, 1, 1), deadline_type="fixed")
        c = make_company()
        assert hard_filter(s, c) is False

    def test_pass_rolling_deadline(self):
        s = make_subsidy(application_deadline=None, deadline_type="rolling")
        c = make_company()
        assert hard_filter(s, c) is True

    def test_fail_gbiz_required(self):
        s = make_subsidy(requires_gbiz_id=True)
        c = make_company(has_gbiz_id=False)
        assert hard_filter(s, c) is False

    def test_fail_inactive(self):
        s = make_subsidy(status="closed")
        c = make_company()
        assert hard_filter(s, c) is False

    def test_fail_region(self):
        s = make_subsidy(eligible_regions=["大阪府"])
        c = make_company(prefecture="東京都")
        assert hard_filter(s, c) is False


class TestScoring:
    def test_perfect_match(self):
        s = make_subsidy()
        c = make_company()
        score, reasons, unreasons = calculate_fit_score(s, c)
        assert score >= 3
        assert len(reasons) > 0

    def test_low_score_no_purpose(self):
        s = make_subsidy(category="事業承継")
        c = make_company(investment_purpose=None)
        score, _, _ = calculate_fit_score(s, c)
        assert score >= 1

    def test_industry_exact_match(self):
        s = make_subsidy(eligible_industries=["情報通信業"])
        c = make_company(industry="情報通信業")
        assert score_industry_match(s, c) == 100

    def test_purpose_keywords(self):
        s = make_subsidy(category="IT導入")
        c = make_company(investment_purpose="AIとクラウドでDX推進")
        assert score_purpose_match(s, c) == 100


class TestEstimateAmount:
    def test_with_investment(self):
        s = make_subsidy(max_amount=5000000, subsidy_rate=0.50)
        c = make_company(investment_amount=8000000)
        assert estimate_amount(s, c) == 4000000  # 8M * 0.5 = 4M < 5M上限

    def test_capped_at_max(self):
        s = make_subsidy(max_amount=2000000, subsidy_rate=0.50)
        c = make_company(investment_amount=10000000)
        assert estimate_amount(s, c) == 2000000  # 10M * 0.5 = 5M > 2M上限

    def test_no_investment(self):
        s = make_subsidy(max_amount=4000000)
        c = make_company(investment_amount=None)
        assert estimate_amount(s, c) == 2000000  # 上限の50%


class TestEdgeCases:
    def test_zero_employees(self):
        s = make_subsidy(eligible_employee_min=1)
        c = make_company(employee_count=0)
        assert hard_filter(s, c) is False

    def test_zero_capital(self):
        s = make_subsidy(eligible_capital_max=300000000)
        c = make_company(capital=0)
        assert hard_filter(s, c) is True  # 0 is within limit

    def test_none_capital(self):
        s = make_subsidy(eligible_capital_max=300000000)
        c = make_company(capital=None)
        assert hard_filter(s, c) is True  # None = unknown, don't filter

    def test_no_investment_purpose(self):
        s = make_subsidy()
        c = make_company(investment_purpose=None, investment_amount=None)
        score, _, _ = calculate_fit_score(s, c)
        assert score >= 1  # Should not crash

    def test_empty_industries(self):
        s = make_subsidy(eligible_industries=[])
        c = make_company()
        assert hard_filter(s, c) is True  # Empty = no restriction

    def test_no_previous_usage(self):
        from app.services.matching import score_previous_usage
        c = make_company(previous_subsidy_usage=None)
        assert score_previous_usage(c) == 100

    def test_empty_previous_usage(self):
        from app.services.matching import score_previous_usage
        c = make_company(previous_subsidy_usage=[])
        assert score_previous_usage(c) == 100

    def test_estimate_no_max(self):
        s = make_subsidy(max_amount=None)
        c = make_company()
        assert estimate_amount(s, c) is None

    def test_no_established_year(self):
        from app.services.matching import score_years_fit
        s = make_subsidy(eligible_years_min=3)
        c = make_company(established_year=None)
        assert score_years_fit(s, c) == 50


class TestRunMatching:
    def test_filters_and_ranks(self):
        s1 = make_subsidy(name="補助金A", eligible_employee_max=300)
        s2 = make_subsidy(name="補助金B", eligible_employee_max=10)  # フィルタで除外
        s3 = make_subsidy(name="補助金C", eligible_employee_max=300, difficulty_rank="C")
        c = make_company(employee_count=50)

        results = run_matching([s1, s2, s3], c)
        assert len(results) == 2  # s2は除外
        assert results[0]["subsidy"].name in ["補助金A", "補助金C"]
