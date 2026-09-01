from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes.health import router as health_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="YojanaSetu Backend — Scheme Discovery Platform API",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
if settings.CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Register API v1 routes
app.include_router(health_router, prefix=settings.API_V1_STR)

@app.get("/", include_in_schema=False)
async def root():
    return {
        "message": "Welcome to YojanaSetu API Backend",
        "health_check": f"{settings.API_V1_STR}/health",
        "documentation": "/docs"
    }
