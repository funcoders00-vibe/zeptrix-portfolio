import logging
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import ValidationError
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from config import settings
from database import Base, engine
from routes import router

# ---------------------------------------------------------------------------
# Logging — stdout only (no file handler, Render filesystem is read-only)
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
    logger.info("Starting up — creating database tables if not present …")
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables ready.")
    yield
    logger.info("Shutting down.")


# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------
app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://www.zeptrix.in",
        "https://zeptrix.in",
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(ValidationError)
async def pydantic_validation_handler(request: Request, exc: ValidationError):
    errors = [
        {"field": " → ".join(str(loc) for loc in err["loc"]), "message": err["msg"]}
        for err in exc.errors()
    ]
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"success": False, "errors": errors},
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.error("Unhandled exception: %s", exc, exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"success": False, "errors": [{"message": "Internal server error"}]},
    )


app.include_router(router)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(BASE_DIR, "../frontend/dist")

app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_DIR, "assets")), name="assets")
@app.get("/logo.png")
async def logo():
    return FileResponse(os.path.join(FRONTEND_DIR, "logo.png"))

@app.get("/favicon.svg")
async def favicon():
    return FileResponse(os.path.join(FRONTEND_DIR, "favicon.svg"))

@app.get("/robots.txt")
async def robots():
    return FileResponse(os.path.join(FRONTEND_DIR, "robots.txt"))

@app.get("/sitemap.xml")
async def sitemap():
    return FileResponse(os.path.join(FRONTEND_DIR, "sitemap.xml"))

@app.get("/")
async def root():
    return FileResponse(os.path.join(FRONTEND_DIR, "index.html"))


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "app": settings.APP_NAME}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 8000)),
        reload=False,
        log_level="debug" if settings.DEBUG else "info",
    )