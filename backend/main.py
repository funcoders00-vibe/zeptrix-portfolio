import logging
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import ValidationError

from config import settings
from database import Base, engine
from routes import router

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.DEBUG if settings.DEBUG else logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s — %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    handlers=[logging.StreamHandler()],
    force=True,
)

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Lifespan
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting up — creating database tables if not present...")
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables ready.")
    yield
    logger.info("Shutting down.")

# ---------------------------------------------------------------------------
# FastAPI App
# ---------------------------------------------------------------------------
app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ---------------------------------------------------------------------------
# CORS
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://zeptrix.in",
        "https://www.zeptrix.in",
        "https://nexaflow.zeptrix.in",
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Validation Error Handler
# ---------------------------------------------------------------------------
@app.exception_handler(ValidationError)
async def pydantic_validation_handler(request: Request, exc: ValidationError):

    errors = [
        {
            "field": " -> ".join(str(loc) for loc in err["loc"]),
            "message": err["msg"]
        }
        for err in exc.errors()
    ]

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "errors": errors
        }
    )

# ---------------------------------------------------------------------------
# Generic Error Handler
# ---------------------------------------------------------------------------
@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):

    logger.error(
        "Unhandled exception: %s",
        exc,
        exc_info=True
    )

    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "errors": [
                {
                    "message": "Internal server error"
                }
            ]
        }
    )

# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
app.include_router(router)

# ---------------------------------------------------------------------------
# Root Endpoint
# ---------------------------------------------------------------------------
@app.get("/")
async def root():
    return {
        "success": True,
        "message": f"{settings.APP_NAME} API is running"
    }

# ---------------------------------------------------------------------------
# Health Check
# ---------------------------------------------------------------------------
@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "success": True,
        "status": "ok",
        "app": settings.APP_NAME
    }

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 8000)),
        reload=False,
        log_level="debug" if settings.DEBUG else "info",
    )