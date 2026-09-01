from fastapi import FastAPI
from app.schemas import HealthResponse
from app.routers.search import router as search_router
from app.routers import documents


app = FastAPI(
    title="Vaultly API",
    description="Semantic Knowledge Base Search for Institutions",
    version="0.1.0",
)

app.include_router(search_router)
app.include_router(documents.router)


@app.get(
    "/health",
    response_model=HealthResponse,
)
async def health():
    return {
        "status": "ok",
    }