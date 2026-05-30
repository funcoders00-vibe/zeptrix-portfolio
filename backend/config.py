from typing import List
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict


BASE_DIR = Path(__file__).resolve().parent
ENV_FILE = BASE_DIR / ".env"


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str

    # Email (SMTP)
    SMTP_HOST: str
    SMTP_PORT: int
    SMTP_USER: str
    SMTP_PASSWORD: str
    EMAIL_FROM: str
    EMAIL_FROM_NAME: str
    RESEND_API_KEY: str
    EMAIL_FROM: str = "onboarding@resend.dev"
    EMAIL_FROM_NAME: str = "Zeptrix"
    # Organisation recipients
    ORG_RECIPIENTS: List[str]

    # App
    APP_NAME: str
    DEBUG: bool = False

    model_config = SettingsConfigDict(
        env_file=ENV_FILE if ENV_FILE.exists() else None,
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


try:
    settings = Settings()
    print("Loaded recipients:", settings.ORG_RECIPIENTS)
except Exception as e:
    print(f"FATAL: Failed to load settings: {e}")
    raise