import uuid
from typing import Optional
from sqlalchemy import String, Text, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class DraftDocument(Base, TimestampMixin):
    __tablename__ = "draft_documents"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    match_result_id: Mapped[str] = mapped_column(String(36), ForeignKey("match_results.id"))

    document_type: Mapped[str] = mapped_column(String(100), nullable=False)
    content: Mapped[dict] = mapped_column(JSON, nullable=False)
    ai_model: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    generation_prompt: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    reviewer_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
    review_status: Mapped[str] = mapped_column(String(20), default="draft")
    reviewer_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    match_result = relationship("MatchResult", lazy="selectin")
