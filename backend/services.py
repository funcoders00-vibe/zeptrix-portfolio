import logging
import re
from sqlalchemy.orm import Session

from models import ContactSubmission
from schemas import ContactFormRequest
from repository import ContactRepository

logger = logging.getLogger(__name__)

BLOCKED_DOMAINS = {
    "mailinator.com",
    "guerrillamail.com",
    "10minutemail.com",
    "trashmail.com",
    "tempmail.com",
    "throwam.com",
    "yopmail.com",
}


class ContactService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.repo = ContactRepository(db)

    def submit_contact_form(self, data: ContactFormRequest) -> ContactSubmission:
        self._check_email_domain(data.email)
        self._check_description(data.description)
        self._check_phone(data.phone)

        return self.repo.create(data)

    def _check_email_domain(self, email: str) -> None:
        domain = email.split("@")[-1].lower()

        if domain in BLOCKED_DOMAINS:
            raise ValueError(
                "Please use a permanent email address."
            )

    def _check_description(self, description: str) -> None:
        stripped = description.strip()

        if len(stripped.split()) < 5:
            raise ValueError(
                "Please provide at least 5 words describing your project."
            )

    def _check_phone(self, phone: str) -> None:
        digits = re.sub(r"\D", "", phone)

        if len(set(digits)) == 1:
            raise ValueError(
                "Phone number appears to be invalid."
            )