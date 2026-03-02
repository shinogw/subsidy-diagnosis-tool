"""Pydantic v2 schemas"""

import uuid
from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, Field


# --- Company ---
class CompanyCreate(BaseModel):
    company_name: str
    representative_name: Optional[str] = None
    industry: str
    sub_industry: Optional[str] = None
    employee_count: int
    annual_revenue: Optional[int] = None
    capital: Optional[int] = None
    established_year: Optional[int] = None
    prefecture: str
    city: Optional[str] = None
    has_wage_increase_plan: bool = False
    has_gbiz_id: bool = False
    previous_subsidy_usage: Optional[list] = None
    investment_purpose: Optional[str] = None
    investment_amount: Optional[int] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    line_id: Optional[str] = None


class CompanyResponse(CompanyCreate):
    id: uuid.UUID
    created_at: datetime

    model_config = {"from_attributes": True}


# --- Subsidy ---
class SubsidyResponse(BaseModel):
    id: uuid.UUID
    name: str
    category: str
    provider: str
    min_amount: Optional[int] = None
    max_amount: Optional[int] = None
    subsidy_rate: Optional[float] = None
    difficulty_rank: str
    historical_acceptance_rate: Optional[float] = None
    application_deadline: Optional[date] = None
    deadline_type: str = "fixed"
    status: str
    eligible_industries: Optional[list] = None
    eligible_employee_min: Optional[int] = None
    eligible_employee_max: Optional[int] = None
    eligible_capital_max: Optional[int] = None
    requires_wage_increase: bool = False
    requires_gbiz_id: bool = False
    required_documents: Optional[list] = None
    application_url: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class SubsidyCreate(BaseModel):
    name: str
    category: str
    provider: str
    min_amount: Optional[int] = None
    max_amount: Optional[int] = None
    subsidy_rate: Optional[float] = None
    difficulty_rank: str = Field(pattern=r"^[ABC]$")
    historical_acceptance_rate: Optional[float] = None
    competition_level: Optional[str] = None
    eligible_industries: Optional[list] = None
    eligible_employee_min: Optional[int] = None
    eligible_employee_max: Optional[int] = None
    eligible_capital_max: Optional[int] = None
    eligible_years_min: Optional[int] = None
    eligible_regions: Optional[list] = None
    requires_wage_increase: bool = False
    requires_gbiz_id: bool = False
    other_requirements: Optional[dict] = None
    application_start: Optional[date] = None
    application_deadline: Optional[date] = None
    deadline_type: str = "fixed"
    required_documents: Optional[list] = None
    application_url: Optional[str] = None
    status: str = "active"
    source_url: Optional[str] = None
    notes: Optional[str] = None


# --- Match Result ---
class MatchResultResponse(BaseModel):
    subsidy_id: uuid.UUID
    subsidy_name: str
    category: str
    fit_score: int  # ★1-5
    difficulty_rank: str  # A/B/C
    recommendation_rank: int
    match_reasons: list[str]
    unmatch_reasons: list[str]
    estimated_amount: Optional[int] = None
    max_amount: Optional[int] = None


class DiagnosisResponse(BaseModel):
    company_id: uuid.UUID
    total_matches: int
    matches: list[MatchResultResponse]


# --- Document ---
class DocumentGenerateRequest(BaseModel):
    match_result_id: uuid.UUID


class DocumentResponse(BaseModel):
    id: uuid.UUID
    match_result_id: uuid.UUID
    document_type: str
    content: dict
    review_status: str
    reviewer_notes: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class DocumentReviewRequest(BaseModel):
    status: str = Field(pattern=r"^(reviewing|approved|submitted)$")
    reviewer_notes: Optional[str] = None
    reviewer_id: Optional[uuid.UUID] = None
