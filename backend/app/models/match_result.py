import uuid
from typing import Optional
from sqlalchemy import String, BigInteger, Integer, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class MatchResult(Base, TimestampMixin):
    __tablename__ = "match_results"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    company_id: Mapped[str] = mapped_column(String(36), ForeignKey("companies.id"))
    subsidy_id: Mapped[str] = mapped_column(String(36), ForeignKey("subsidies.id"))

    fit_score: Mapped[int] = mapped_column(Integer, nullable=False)
    difficulty_rank: Mapped[str] = mapped_column(String(1), nullable=False)
    recommendation_rank: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    match_reasons: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    unmatch_reasons: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    estimated_amount: Mapped[Optional[int]] = mapped_column(BigInteger, nullable=True)

    status: Mapped[str] = mapped_column(String(20), default="diagnosed")

    company = relationship("Company", lazy="selectin")
    subsidy = relationship("Subsidy", lazy="selectin")
