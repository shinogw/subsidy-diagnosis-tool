from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import diagnosis, subsidies, documents

app = FastAPI(
    title="補助金診断ツール API",
    version="0.1.0",
    description="中小企業向け補助金マッチング・書類自動生成API",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(diagnosis.router, prefix="/api/v1", tags=["diagnosis"])
app.include_router(subsidies.router, prefix="/api/v1", tags=["subsidies"])
app.include_router(documents.router, prefix="/api/v1", tags=["documents"])


@app.get("/health")
async def health():
    return {"status": "ok"}
