"""DB互換レイヤー — PostgreSQL/SQLite両対応"""
import os
from sqlalchemy import JSON, String

DATABASE_URL = os.getenv("DATABASE_URL", "")

if "postgresql" in DATABASE_URL:
    from sqlalchemy.dialects.postgresql import UUID as PG_UUID, JSONB
    UUIDType = PG_UUID(as_uuid=True)
    JSONType = JSONB
else:
    # SQLite fallback
    UUIDType = String(36)
    JSONType = JSON
