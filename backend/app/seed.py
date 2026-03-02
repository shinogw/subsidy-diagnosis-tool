"""Seed data loader: reads data/seed_subsidies.json and upserts into DB."""
from __future__ import annotations

import json
import sys
from pathlib import Path

from sqlalchemy import select

from app.db.database import async_session
from app.models.subsidy import Subsidy


SEED_FILE = Path(__file__).resolve().parent.parent.parent / "data" / "seed_subsidies.json"


async def load_seed_data(file_path: Path = SEED_FILE) -> int:
    """Load seed subsidies from JSON file. Returns count of inserted records."""
    with open(file_path, encoding="utf-8") as f:
        subsidies_data = json.load(f)

    inserted = 0
    async with async_session() as db:
        for item in subsidies_data:
            # Check if subsidy with same name already exists
            stmt = select(Subsidy).where(Subsidy.name == item["name"])
            existing = (await db.execute(stmt)).scalar_one_or_none()
            if existing:
                continue

            subsidy = Subsidy(**item)
            db.add(subsidy)
            inserted += 1

        await db.commit()

    return inserted


async def main() -> None:
    count = await load_seed_data()
    print(f"Seeded {count} subsidies.")


if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
