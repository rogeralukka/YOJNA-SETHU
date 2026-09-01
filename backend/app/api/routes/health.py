from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class HealthResponse(BaseModel):
    status: str
    service: str

@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Health Check",
    description="Returns the operational status of the YojanaSetu Backend API."
)
async def health_check() -> HealthResponse:
    return HealthResponse(
        status="ok",
        service="YojanaSetu Backend"
    )
