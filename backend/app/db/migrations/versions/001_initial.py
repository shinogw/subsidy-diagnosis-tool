"""initial schema

Revision ID: 001
Revises:
Create Date: 2026-03-02
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "subsidies",
        sa.Column("id", postgresql.UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), primary_key=True),
        sa.Column("name", sa.String(200), nullable=False),
        sa.Column("category", sa.String(50), nullable=False),
        sa.Column("provider", sa.String(100), nullable=False),
        sa.Column("min_amount", sa.BigInteger()),
        sa.Column("max_amount", sa.BigInteger()),
        sa.Column("subsidy_rate", sa.Numeric(3, 2)),
        sa.Column("difficulty_rank", sa.String(1), nullable=False),
        sa.Column("historical_acceptance_rate", sa.Numeric(4, 2)),
        sa.Column("competition_level", sa.String(20)),
        sa.Column("eligible_industries", postgresql.JSONB()),
        sa.Column("eligible_employee_min", sa.Integer()),
        sa.Column("eligible_employee_max", sa.Integer()),
        sa.Column("eligible_capital_max", sa.BigInteger()),
        sa.Column("eligible_years_min", sa.Integer()),
        sa.Column("eligible_regions", postgresql.JSONB()),
        sa.Column("requires_wage_increase", sa.Boolean(), server_default="false"),
        sa.Column("requires_gbiz_id", sa.Boolean(), server_default="false"),
        sa.Column("other_requirements", postgresql.JSONB()),
        sa.Column("application_start", sa.Date()),
        sa.Column("application_deadline", sa.Date()),
        sa.Column("deadline_type", sa.String(10), server_default="fixed"),
        sa.Column("required_documents", postgresql.JSONB()),
        sa.Column("application_url", sa.String(500)),
        sa.Column("status", sa.String(20), server_default="active"),
        sa.Column("source_url", sa.String(500)),
        sa.Column("notes", sa.Text()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.CheckConstraint("difficulty_rank IN ('A', 'B', 'C')", name="ck_difficulty_rank"),
        sa.CheckConstraint("status IN ('active', 'closed', 'upcoming')", name="ck_subsidy_status"),
    )

    op.create_table(
        "companies",
        sa.Column("id", postgresql.UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), primary_key=True),
        sa.Column("company_name", sa.String(200), nullable=False),
        sa.Column("representative_name", sa.String(100)),
        sa.Column("industry", sa.String(100), nullable=False),
        sa.Column("sub_industry", sa.String(100)),
        sa.Column("employee_count", sa.Integer(), nullable=False),
        sa.Column("annual_revenue", sa.BigInteger()),
        sa.Column("capital", sa.BigInteger()),
        sa.Column("established_year", sa.Integer()),
        sa.Column("prefecture", sa.String(10), nullable=False),
        sa.Column("city", sa.String(50)),
        sa.Column("has_wage_increase_plan", sa.Boolean(), server_default="false"),
        sa.Column("has_gbiz_id", sa.Boolean(), server_default="false"),
        sa.Column("previous_subsidy_usage", postgresql.JSONB()),
        sa.Column("investment_purpose", sa.Text()),
        sa.Column("investment_amount", sa.BigInteger()),
        sa.Column("email", sa.String(200)),
        sa.Column("phone", sa.String(20)),
        sa.Column("line_id", sa.String(100)),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    op.create_table(
        "match_results",
        sa.Column("id", postgresql.UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), primary_key=True),
        sa.Column("company_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("companies.id")),
        sa.Column("subsidy_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("subsidies.id")),
        sa.Column("fit_score", sa.Integer(), nullable=False),
        sa.Column("difficulty_rank", sa.String(1), nullable=False),
        sa.Column("recommendation_rank", sa.Integer()),
        sa.Column("match_reasons", postgresql.JSONB()),
        sa.Column("unmatch_reasons", postgresql.JSONB()),
        sa.Column("estimated_amount", sa.BigInteger()),
        sa.Column("status", sa.String(20), server_default="diagnosed"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.CheckConstraint("fit_score BETWEEN 1 AND 5", name="ck_fit_score_range"),
    )

    op.create_table(
        "draft_documents",
        sa.Column("id", postgresql.UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), primary_key=True),
        sa.Column("match_result_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("match_results.id")),
        sa.Column("document_type", sa.String(100), nullable=False),
        sa.Column("content", postgresql.JSONB(), nullable=False),
        sa.Column("ai_model", sa.String(50)),
        sa.Column("generation_prompt", sa.Text()),
        sa.Column("reviewer_id", postgresql.UUID(as_uuid=True)),
        sa.Column("review_status", sa.String(20), server_default="draft"),
        sa.Column("reviewer_notes", sa.Text()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    op.create_table(
        "scoring_weights",
        sa.Column("id", postgresql.UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), primary_key=True),
        sa.Column("factor_name", sa.String(50), nullable=False, unique=True),
        sa.Column("weight", sa.Numeric(3, 2), nullable=False),
        sa.Column("description", sa.Text()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # Insert default scoring weights
    op.execute("""
        INSERT INTO scoring_weights (id, factor_name, weight, description) VALUES
        (gen_random_uuid(), 'industry_match', 0.30, '業種マッチ'),
        (gen_random_uuid(), 'employee_fit', 0.15, '従業員規模'),
        (gen_random_uuid(), 'purpose_match', 0.25, '投資目的マッチ'),
        (gen_random_uuid(), 'wage_increase', 0.10, '賃上げ計画'),
        (gen_random_uuid(), 'previous_usage', 0.10, '過去利用歴'),
        (gen_random_uuid(), 'established_years', 0.10, '設立年数')
    """)


def downgrade() -> None:
    op.drop_table("scoring_weights")
    op.drop_table("draft_documents")
    op.drop_table("match_results")
    op.drop_table("companies")
    op.drop_table("subsidies")
