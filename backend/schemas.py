import re
import uuid
from decimal import Decimal
from datetime import datetime
from typing import Optional, Literal

from pydantic import BaseModel, EmailStr, Field, field_validator

from models import ServiceType


# ---------------------------------------------------------------------------
# Request
# ---------------------------------------------------------------------------

class ContactFormRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(..., min_length=7, max_length=20)
    service: ServiceType
    description: str = Field(..., min_length=10, max_length=2000)
    currency: Literal["INR", "USD"] = "USD"
    budget: Decimal = Field(..., gt=0, le=10_000_000, decimal_places=2)

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        v = v.strip()
        if not re.match(r"^[A-Za-z\s'\-\.]+$", v):
            raise ValueError("Name may only contain letters, spaces, hyphens, apostrophes and dots.")
        return v

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        v = v.strip()
        cleaned = re.sub(r"[\s\-\(\)\+]", "", v)
        if not cleaned.isdigit():
            raise ValueError("Phone number may only contain digits, spaces, +, -, and parentheses.")
        if not (7 <= len(cleaned) <= 15):
            raise ValueError("Phone number must be between 7 and 15 digits.")
        return v

    @field_validator("description")
    @classmethod
    def validate_description(cls, v: str) -> str:
        v = v.strip()
        if len(v.split()) < 3:
            raise ValueError("Description must contain at least 3 words.")
        return v

    @field_validator("budget", mode="before")
    @classmethod
    def validate_budget(cls, v):
        try:
            value = Decimal(str(v))
        except Exception:
            raise ValueError("Budget must be a valid number.")
        if value <= 0:
            raise ValueError("Budget must be greater than 0.")
        return value

    model_config = {
        "json_schema_extra": {
            "example": {
                "name": "Arjun Kumar",
                "email": "arjun@example.com",
                "phone": "+91 98765 43210",
                "service": "web_development",
                "description": "We need a modern e-commerce website for our fashion brand with payment integration.",
                "currency": "INR",
                "budget": "75000.00",
            }
        }
    }


# ---------------------------------------------------------------------------
# Response
# ---------------------------------------------------------------------------

class ContactFormResponse(BaseModel):
    id: uuid.UUID
    name: str
    email: str
    phone: str
    service: ServiceType
    description: str
    currency: str
    budget: Decimal
    created_at: datetime
    message: str = "Your message has been received. Our team will reach out to you shortly."

    model_config = {"from_attributes": True}


class ErrorDetail(BaseModel):
    field: Optional[str] = None
    message: str


class ErrorResponse(BaseModel):
    success: bool = False
    errors: list[ErrorDetail]
