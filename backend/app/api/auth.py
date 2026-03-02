"""簡易APIキー認証"""
import os
from fastapi import Header, HTTPException

ADMIN_API_KEY = os.getenv("ADMIN_API_KEY", "dev-admin-key-change-me")


async def require_admin(x_api_key: str = Header(..., alias="X-API-Key")):
    if x_api_key != ADMIN_API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API key")
