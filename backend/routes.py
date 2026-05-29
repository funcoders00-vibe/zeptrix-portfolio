import logging
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from pydantic import ValidationError

from database import get_db
from schemas import ContactFormRequest, ContactFormResponse, ErrorResponse, ErrorDetail
from services import ContactService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1", tags=["Contact Form"])


# ---------------------------------------------------------------------------
# POST  /api/v1/contact
# ---------------------------------------------------------------------------

@router.post(
    "/contact",
    response_model=ContactFormResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Submit a contact form",
    responses={
        201: {"description": "Submission saved and notification sent"},
        422: {"description": "Validation error — check field constraints"},
        400: {"description": "Business rule violation"},
        500: {"description": "Internal server error"},
    },
)
async def submit_contact_form(
    payload: ContactFormRequest,
    db: Session = Depends(get_db),
) -> ContactFormResponse:
    """
    **Flow:**
    1. FastAPI / Pydantic validates field types & constraints (routes.py).
    2. `ContactService` enforces business rules (services.py).
    3. `ContactRepository` persists to PostgreSQL (repository.py).
    4. `email_service` fires notification email to organisation members.
    """
    service = ContactService(db)

    try:
        submission = service.submit_contact_form(payload)
    except ValueError as exc:
        # Business-rule violations → 400 Bad Request
        logger.warning("Business rule violation: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )
    except Exception as exc:
        logger.error("Unexpected error during contact submission: %s", exc, exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred. Please try again later.",
        )

    return ContactFormResponse.model_validate(submission)


# ---------------------------------------------------------------------------
# GET  /api/v1/contact/{submission_id}  — admin / debug endpoint
# ---------------------------------------------------------------------------

@router.get(
    "/contact/{submission_id}",
    response_model=ContactFormResponse,
    summary="Retrieve a single submission by UUID (admin use)",
    responses={
        200: {"description": "Submission found"},
        404: {"description": "Submission not found"},
    },
)
async def get_submission(
    submission_id: UUID,
    db: Session = Depends(get_db),
) -> ContactFormResponse:
    from repository import ContactRepository

    repo = ContactRepository(db)
    submission = repo.get_by_id(submission_id)

    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Submission {submission_id} not found.",
        )

    return ContactFormResponse.model_validate(submission)


# ---------------------------------------------------------------------------
# GET  /api/v1/contacts  — list all submissions (admin)
# ---------------------------------------------------------------------------

@router.get(
    "/contacts",
    response_model=list[ContactFormResponse],
    summary="List all submissions (admin use)",
)
async def list_submissions(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
) -> list[ContactFormResponse]:
    from repository import ContactRepository

    repo = ContactRepository(db)
    submissions = repo.get_all(skip=skip, limit=limit)
    return [ContactFormResponse.model_validate(s) for s in submissions]
