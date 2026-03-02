import uuid
from typing import Optional
from sqlalchemy import String, Numeric, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin


class ScoringWeight(Base, TimestampMixin):
    __tablename__ = "scoring_weights"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    factor_name: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)
    weight: Mapped[float] = mapped_column(Numeric(3, 2), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
