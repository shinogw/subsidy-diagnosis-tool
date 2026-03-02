import uuid
from datetime import date
from typing import Optional
from sqlalchemy import String, BigInteger, Integer, Boolean, Date, Numeric, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin


class Subsidy(Base, TimestampMixin):
    __tablename__ = "subsidies"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False)
    provider: Mapped[str] = mapped_column(String(100), nullable=False)

    min_amount: Mapped[Optional[int]] = mapped_column(BigInteger, nullable=True)
    max_amount: Mapped[Optional[int]] = mapped_column(BigInteger, nullable=True)
    subsidy_rate: Mapped[Optional[float]] = mapped_column(Numeric(3, 2), nullable=True)

    difficulty_rank: Mapped[str] = mapped_column(String(1), nullable=False)
    historical_acceptance_rate: Mapped[Optional[float]] = mapped_column(Numeric(4, 2), nullable=True)
    competition_level: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)

    eligible_industries: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    eligible_employee_min: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    eligible_employee_max: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    eligible_capital_max: Mapped[Optional[int]] = mapped_column(BigInteger, nullable=True)
    eligible_years_min: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    eligible_regions: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    requires_wage_increase: Mapped[bool] = mapped_column(Boolean, default=False)
    requires_gbiz_id: Mapped[bool] = mapped_column(Boolean, default=False)
    other_requirements: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)

    application_start: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    application_deadline: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    deadline_type: Mapped[str] = mapped_column(String(10), default="fixed")
    required_documents: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    application_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

    status: Mapped[str] = mapped_column(String(20), default="active")
    source_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
