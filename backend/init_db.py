"""DB初期化 + シードデータ投入"""
import asyncio
import json
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from sqlalchemy import text
from app.db.database import engine
from app.models.base import Base
from app.models import Subsidy, Company, MatchResult, DraftDocument, ScoringWeight


async def init():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    print("✅ Tables created")

    # Seed data
    from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker
    Session = async_sessionmaker(engine, class_=AsyncSession)

    with open(os.path.join(os.path.dirname(__file__), "data", "seed_subsidies.json")) as f:
        seeds = json.load(f)

    from datetime import date as dt_date

    async with Session() as session:
        for s in seeds:
            for k, v in s.items():
                if v == "null":
                    s[k] = None
            # Convert date strings
            for dk in ["application_start", "application_deadline"]:
                if s.get(dk) and isinstance(s[dk], str):
                    s[dk] = dt_date.fromisoformat(s[dk])
            sub = Subsidy(**s)
            session.add(sub)
        
        # Seed scoring weights
        weights = [
            ("industry_match", 0.30, "業種マッチ"),
            ("employee_fit", 0.15, "従業員規模フィット"),
            ("purpose_match", 0.25, "投資目的マッチ"),
            ("wage_increase", 0.10, "賃上げ計画"),
            ("previous_usage", 0.10, "過去利用歴"),
            ("years_fit", 0.10, "設立年数フィット"),
        ]
        for name, weight, desc in weights:
            session.add(ScoringWeight(factor_name=name, weight=weight, description=desc))

        await session.commit()
    print(f"✅ Seeded {len(seeds)} subsidies + 6 scoring weights")


asyncio.run(init())
