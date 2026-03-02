"""Tests for scoring logic."""
import pytest

from app.services.scoring import (
    calculate_score,
    score_employee_fit,
    score_established_years,
    score_industry_match,
    score_previous_usage,
    score_purpose_match,
    score_to_stars,
    score_wage_increase,
)


class TestScoreToStars:
    def test_five_stars(self):
        assert score_to_stars(95) == 5
        assert score_to_stars(90) == 5

    def test_four_stars(self):
        assert score_to_stars(85) == 4
        assert score_to_stars(70) == 4

    def test_three_stars(self):
        assert score_to_stars(60) == 3
        assert score_to_stars(50) == 3

    def test_two_stars(self):
        assert score_to_stars(40) == 2
        assert score_to_stars(30) == 2

    def test_one_star(self):
        assert score_to_stars(20) == 1
        assert score_to_stars(0) == 1


class TestIndustryMatch:
    def test_exact_match(self):
        score, reason = score_industry_match("製造業", None, ["製造業", "小売業"])
        assert score == 100.0
        assert "完全一致" in reason

    def test_sub_industry_match(self):
        score, reason = score_industry_match("サービス業", "ソフトウェア開発", ["ソフトウェア開発"])
        assert score == 100.0

    def test_partial_match(self):
        score, reason = score_industry_match("情報通信", None, ["情報通信業"])
        assert score == 60.0
        assert "関連業種" in reason

    def test_no_restriction(self):
        score, reason = score_industry_match("農業", None, None)
        assert score == 100.0
        assert "全業種" in reason

    def test_no_match(self):
        score, reason = score_industry_match("農業", None, ["製造業", "小売業"])
        assert score == 0.0


class TestEmployeeFit:
    def test_no_restriction(self):
        score, _ = score_employee_fit(50, None, None)
        assert score == 100.0

    def test_center_of_range(self):
        score, _ = score_employee_fit(150, 1, 300)
        assert score > 90

    def test_edge_of_range(self):
        score, _ = score_employee_fit(1, 1, 300)
        assert score >= 50.0

    def test_out_of_range(self):
        score, _ = score_employee_fit(500, 1, 300)
        assert score == 0.0


class TestPurposeMatch:
    def test_keyword_hit(self):
        score, reason = score_purpose_match("IT システム導入でDX推進", "IT導入")
        assert score >= 60.0
        assert "キーワード" in reason or "カテゴリ" in reason

    def test_no_purpose(self):
        score, _ = score_purpose_match(None, "IT導入")
        assert score == 50.0

    def test_no_match(self):
        score, _ = score_purpose_match("農地の拡大", "IT導入")
        # Should get some default score since no keywords match
        assert score >= 0


class TestWageIncrease:
    def test_not_required_with_plan(self):
        score, _ = score_wage_increase(True, False)
        assert score == 100.0

    def test_not_required_no_plan(self):
        score, _ = score_wage_increase(False, False)
        assert score == 80.0

    def test_required_with_plan(self):
        score, _ = score_wage_increase(True, True)
        assert score == 100.0

    def test_required_no_plan(self):
        score, _ = score_wage_increase(False, True)
        assert score == 0.0


class TestPreviousUsage:
    def test_no_history(self):
        score, _ = score_previous_usage(None, "IT導入補助金")
        assert score == 100.0

    def test_same_subsidy(self):
        score, _ = score_previous_usage(
            [{"name": "IT導入補助金2025"}],
            "IT導入補助金",
        )
        assert score == 50.0

    def test_different_subsidy(self):
        score, _ = score_previous_usage(
            [{"name": "ものづくり補助金"}],
            "IT導入補助金",
        )
        assert score == 80.0


class TestEstablishedYears:
    def test_no_restriction(self):
        score, _ = score_established_years(2020, None)
        assert score == 100.0

    def test_meets_requirement(self):
        score, _ = score_established_years(2015, 5, current_year=2026)
        assert score == 100.0

    def test_below_requirement(self):
        score, _ = score_established_years(2024, 5, current_year=2026)
        assert score == 0.0

    def test_unknown_year(self):
        score, _ = score_established_years(None, 5)
        assert score == 50.0


class TestCalculateScore:
    def test_full_score_integration(self):
        company = {
            "industry": "製造業",
            "sub_industry": None,
            "employee_count": 50,
            "investment_purpose": "生産性向上のための設備導入・自動化",
            "has_wage_increase_plan": True,
            "previous_subsidy_usage": None,
            "established_year": 2010,
        }
        subsidy = {
            "name": "ものづくり補助金",
            "category": "ものづくり",
            "eligible_industries": ["製造業", "サービス業"],
            "eligible_employee_min": 1,
            "eligible_employee_max": 300,
            "requires_wage_increase": True,
            "eligible_years_min": None,
        }
        result = calculate_score(company, subsidy)
        assert 1 <= result.fit_score <= 5
        assert 0 <= result.total_score <= 100
        assert len(result.details) == 6
        assert len(result.match_reasons) > 0

    def test_poor_match(self):
        company = {
            "industry": "農業",
            "sub_industry": None,
            "employee_count": 500,
            "investment_purpose": None,
            "has_wage_increase_plan": False,
            "previous_subsidy_usage": None,
            "established_year": None,
        }
        subsidy = {
            "name": "IT導入補助金",
            "category": "IT導入",
            "eligible_industries": ["情報通信業"],
            "eligible_employee_min": 1,
            "eligible_employee_max": 300,
            "requires_wage_increase": True,
            "eligible_years_min": 5,
        }
        result = calculate_score(company, subsidy)
        assert result.fit_score <= 3
        assert len(result.unmatch_reasons) > 0
