"""診断API"""

import uuid
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.models.subsidy import Subsidy
from app.models.company import Company
from app.models.match_result import MatchResult
from app.api.schemas import CompanyCreate, DiagnosisResponse, MatchResultResponse
from app.services.matching import run_matching

router = APIRouter()


@router.post("/diagnosis", response_model=DiagnosisResponse)
async def diagnose(company_data: CompanyCreate, db: AsyncSession = Depends(get_db)):
    """企業情報を受け取り、マッチする補助金を診断"""

    # 企業情報保存
    company = Company(**company_data.model_dump())
    db.add(company)
    await db.flush()

    # 全アクティブ補助金取得
    result = await db.execute(select(Subsidy).where(Subsidy.status == "active"))
    subsidies = list(result.scalars().all())

    # マッチング実行
    matches = run_matching(subsidies, company)

    # 結果保存
    match_responses = []
    for m in matches:
        mr = MatchResult(
            company_id=company.id,
            subsidy_id=m["subsidy"].id,
            fit_score=m["fit_score"],
            difficulty_rank=m["difficulty_rank"],
            recommendation_rank=m["recommendation_rank"],
            match_reasons=m["match_reasons"],
            unmatch_reasons=m["unmatch_reasons"],
            estimated_amount=m["estimated_amount"],
        )
        db.add(mr)

        match_responses.append(MatchResultResponse(
            subsidy_id=m["subsidy"].id,
            subsidy_name=m["subsidy"].name,
            category=m["subsidy"].category,
            fit_score=m["fit_score"],
            difficulty_rank=m["difficulty_rank"],
            recommendation_rank=m["recommendation_rank"],
            match_reasons=m["match_reasons"],
            unmatch_reasons=m["unmatch_reasons"],
            estimated_amount=m["estimated_amount"],
            max_amount=m["subsidy"].max_amount,
        ))

    await db.commit()

    return DiagnosisResponse(
        company_id=company.id,
        total_matches=len(match_responses),
        matches=match_responses,
    )


@router.get("/diagnosis/{company_id}/results", response_model=DiagnosisResponse)
async def get_results(company_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """過去の診断結果を取得"""
    result = await db.execute(
        select(MatchResult)
        .where(MatchResult.company_id == company_id)
        .order_by(MatchResult.recommendation_rank)
    )
    match_results = list(result.scalars().all())

    match_responses = []
    for mr in match_results:
        match_responses.append(MatchResultResponse(
            subsidy_id=mr.subsidy_id,
            subsidy_name=mr.subsidy.name,
            category=mr.subsidy.category,
            fit_score=mr.fit_score,
            difficulty_rank=mr.difficulty_rank,
            recommendation_rank=mr.recommendation_rank or 0,
            match_reasons=mr.match_reasons or [],
            unmatch_reasons=mr.unmatch_reasons or [],
            estimated_amount=mr.estimated_amount,
            max_amount=mr.subsidy.max_amount,
        ))

    return DiagnosisResponse(
        company_id=company_id,
        total_matches=len(match_responses),
        matches=match_responses,
    )
