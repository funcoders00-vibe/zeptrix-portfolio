import logging
from uuid import UUID

from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from models import ContactSubmission
from schemas import ContactFormRequest
from email_service import send_notification_email

logger = logging.getLogger(__name__)


class ContactRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create(self, data: ContactFormRequest) -> ContactSubmission:
        submission = ContactSubmission(
            name        = data.name,
            email       = data.email,
            phone       = data.phone,
            service     = data.service,
            description = data.description,
            currency    = data.currency,
            budget      = data.budget,
        )
        try:
            self.db.add(submission)
            self.db.commit()
            self.db.refresh(submission)
            logger.info("Saved submission id=%s", submission.id)
        except SQLAlchemyError as exc:
            self.db.rollback()
            logger.error("DB error: %s", exc)
            raise

        try:
            send_notification_email(submission)
        except Exception as exc:
            logger.error(
                "Email failed for submission %s (data was saved): %s",
                submission.id, exc,
            )
            # Swallow email errors — the record is already committed.
        return submission

    def get_by_id(self, submission_id: UUID) -> ContactSubmission | None:
        return (
            self.db.query(ContactSubmission)
            .filter(ContactSubmission.id == submission_id)
            .first()
        )

    def get_all(self, skip: int = 0, limit: int = 100) -> list[ContactSubmission]:
        return (
            self.db.query(ContactSubmission)
            .order_by(ContactSubmission.created_at.desc())
            .offset(skip).limit(limit).all()
        )
