import uuid
from typing import Optional
from sqlalchemy import String, BigInteger, Integer, Boolean, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin


class Company(Base, TimestampMixin):
    __tablename__ = "companies"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    company_name: Mapped[str] = mapped_column(String(200), nullable=False)
    representative_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    industry: Mapped[str] = mapped_column(String(100), nullable=False)
    sub_industry: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    employee_count: Mapped[int] = mapped_column(Integer, nullable=False)
    annual_revenue: Mapped[Optional[int]] = mapped_column(BigInteger, nullable=True)
    capital: Mapped[Optional[int]] = mapped_column(BigInteger, nullable=True)
    established_year: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    prefecture: Mapped[str] = mapped_column(String(10), nullable=False)
    city: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)

    has_wage_increase_plan: Mapped[bool] = mapped_column(Boolean, default=False)
    has_gbiz_id: Mapped[bool] = mapped_column(Boolean, default=False)
    previous_subsidy_usage: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    investment_purpose: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    investment_amount: Mapped[Optional[int]] = mapped_column(BigInteger, nullable=True)

    email: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    phone: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    line_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
