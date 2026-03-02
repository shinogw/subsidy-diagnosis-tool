"""補助金管理API"""

import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.models.subsidy import Subsidy
from app.api.schemas import SubsidyResponse, SubsidyCreate

router = APIRouter()


@router.get("/subsidies", response_model=list[SubsidyResponse])
async def list_subsidies(
    status: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    """補助金一覧取得"""
    query = select(Subsidy)
    if status:
        query = query.where(Subsidy.status == status)
    if category:
        query = query.where(Subsidy.category.ilike(f"%{category}%"))
    query = query.order_by(Subsidy.name)

    result = await db.execute(query)
    return list(result.scalars().all())


@router.get("/subsidies/{subsidy_id}", response_model=SubsidyResponse)
async def get_subsidy(subsidy_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """補助金詳細取得"""
    result = await db.execute(select(Subsidy).where(Subsidy.id == subsidy_id))
    subsidy = result.scalar_one_or_none()
    if not subsidy:
        raise HTTPException(status_code=404, detail="Subsidy not found")
    return subsidy


from app.api.auth import require_admin

@router.post("/subsidies", response_model=SubsidyResponse, status_code=201, dependencies=[Depends(require_admin)])
async def create_subsidy(data: SubsidyCreate, db: AsyncSession = Depends(get_db)):
    """補助金データ追加"""
    subsidy = Subsidy(**data.model_dump())
    db.add(subsidy)
    await db.commit()
    await db.refresh(subsidy)
    return subsidy


@router.put("/subsidies/{subsidy_id}", response_model=SubsidyResponse, dependencies=[Depends(require_admin)])
async def update_subsidy(
    subsidy_id: uuid.UUID, data: SubsidyCreate, db: AsyncSession = Depends(get_db)
):
    """補助金データ更新"""
    result = await db.execute(select(Subsidy).where(Subsidy.id == subsidy_id))
    subsidy = result.scalar_one_or_none()
    if not subsidy:
        raise HTTPException(status_code=404, detail="Subsidy not found")

    for key, value in data.model_dump().items():
        setattr(subsidy, key, value)
    await db.commit()
    await db.refresh(subsidy)
    return subsidy


@router.get("/stats")
async def get_stats(db: AsyncSession = Depends(get_db)):
    """ダッシュボード統計"""
    from sqlalchemy import func
    from app.models.company import Company
    from app.models.match_result import MatchResult

    subsidies_count = await db.scalar(select(func.count(Subsidy.id)))
    companies_count = await db.scalar(select(func.count(Company.id)))
    matches_count = await db.scalar(select(func.count(MatchResult.id)))

    return {
        "total_subsidies": subsidies_count or 0,
        "total_companies": companies_count or 0,
        "total_diagnoses": matches_count or 0,
    }
