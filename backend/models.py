import uuid
import enum
from datetime import datetime

from sqlalchemy import Column, String, Text, Numeric, DateTime, Enum
from sqlalchemy.dialects.postgresql import UUID

from database import Base


class ServiceType(str, enum.Enum):
    AI_CHATBOT_DEVELOPMENT       = "ai_chatbot_development"
    AI_CUSTOMER_SUPPORT          = "ai_customer_support"
    CUSTOM_BUSINESS_DASHBOARDS   = "custom_business_dashboards"
    AI_POWERED_WEBSITES          = "ai_powered_websites"
    AI_VOICE_ASSISTANTS          = "ai_voice_assistants"
    INTERNAL_AI_TOOLS            = "internal_ai_tools"
    WEB_DEVELOPMENT              = "web_development"
   


SERVICE_LABELS: dict[ServiceType, str] = {
    ServiceType.AI_CHATBOT_DEVELOPMENT:     "AI Chatbot Development",
    ServiceType.AI_CUSTOMER_SUPPORT:        "AI Customer Support Systems",
    ServiceType.CUSTOM_BUSINESS_DASHBOARDS: "Custom Business Dashboards",
    ServiceType.AI_POWERED_WEBSITES:        "AI Powered Websites",
    ServiceType.AI_VOICE_ASSISTANTS:        "AI Voice Assistants",
    ServiceType.INTERNAL_AI_TOOLS:          "Internal AI Tools for Companies",
    ServiceType.WEB_DEVELOPMENT:            "Web Development",

}


class ContactSubmission(Base):
    __tablename__ = "contact_submissions"

    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name        = Column(String(100),  nullable=False)
    email       = Column(String(255),  nullable=False, index=True)
    phone       = Column(String(20),   nullable=False)
    service     = Column(Enum(ServiceType, name="service_type_enum"), nullable=False)
    description = Column(Text,         nullable=False)
    currency    = Column(String(10),   nullable=False, default="USD")
    budget      = Column(Numeric(14, 2), nullable=False)
    created_at  = Column(DateTime,     default=datetime.utcnow, nullable=False)

    def __repr__(self) -> str:
        return f"<ContactSubmission id={self.id} name={self.name} service={self.service}>"
