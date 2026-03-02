"""書類生成API"""

import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.models.match_result import MatchResult
from app.models.draft_document import DraftDocument
from app.api.schemas import DocumentGenerateRequest, DocumentResponse, DocumentReviewRequest

router = APIRouter()


@router.post("/documents/generate", response_model=DocumentResponse, status_code=201)
async def generate_document(
    req: DocumentGenerateRequest, db: AsyncSession = Depends(get_db)
):
    """AI書類下書き生成"""
    # マッチ結果取得
    result = await db.execute(
        select(MatchResult).where(MatchResult.id == req.match_result_id)
    )
    match_result = result.scalar_one_or_none()
    if not match_result:
        raise HTTPException(status_code=404, detail="Match result not found")

    # TODO: OpenAI API連携で実際の書類生成
    # 現時点ではプレースホルダー
    content = {
        "sections": [
            {"title": "事業計画概要", "body": "（AI生成予定）"},
            {"title": "経費明細", "body": "（AI生成予定）"},
            {"title": "実施体制", "body": "（AI生成予定）"},
        ],
        "metadata": {
            "subsidy_name": match_result.subsidy.name,
            "company_name": match_result.company.company_name,
        },
    }

    doc = DraftDocument(
        match_result_id=req.match_result_id,
        document_type="事業計画書",
        content=content,
        ai_model="placeholder",
        review_status="draft",
    )
    db.add(doc)
    await db.commit()
    await db.refresh(doc)
    return doc


@router.get("/documents/{document_id}", response_model=DocumentResponse)
async def get_document(document_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """書類取得"""
    result = await db.execute(
        select(DraftDocument).where(DraftDocument.id == document_id)
    )
    doc = result.scalar_one_or_none()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc


@router.patch("/documents/{document_id}/review", response_model=DocumentResponse)
async def review_document(
    document_id: uuid.UUID,
    req: DocumentReviewRequest,
    db: AsyncSession = Depends(get_db),
):
    """行政書士レビュー更新"""
    result = await db.execute(
        select(DraftDocument).where(DraftDocument.id == document_id)
    )
    doc = result.scalar_one_or_none()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    doc.review_status = req.status
    if req.reviewer_notes:
        doc.reviewer_notes = req.reviewer_notes
    if req.reviewer_id:
        doc.reviewer_id = req.reviewer_id

    await db.commit()
    await db.refresh(doc)
    return doc
