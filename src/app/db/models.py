import uuid
from sqlalchemy import Column, String, ForeignKey, DateTime, UniqueConstraint, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True)
    email = Column(String, unique=True, nullable=False, index=True)
    name = Column(String)
    oauth_provider = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    access_token = Column(String, nullable=False)
    refresh_token = Column(String, nullable=False)
    token_uri = Column(String, nullable=False)
    scopes = Column(Text, nullable=True)
    token_expires_at = Column(DateTime(timezone=True), nullable=True)

    meetings = relationship("Meeting", back_populates="user")
    calendar_channels = relationship("CalendarChannel", back_populates="user")
    calendar_sync_tokens = relationship("CalendarSyncToken", back_populates="user")

class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    meeting_url = Column(String, nullable=False)
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    google_event_id = Column(String, nullable=True, unique=False)
    calendar_id = Column(String, nullable=True)

    user = relationship("User", back_populates="meetings")
    recording = relationship("Recording", back_populates="meeting", uselist=False)
    summary = relationship("Summary", back_populates="meeting", uselist=False)


class Recording(Base):
    __tablename__ = "recordings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True)
    meeting_id = Column(
        UUID(as_uuid=True), ForeignKey("meetings.id"), nullable=False, unique=True
    )
    file_name = Column(String, nullable=False, unique=True)
    uploaded_at = Column(DateTime, default=datetime.now(timezone.utc))

    meeting = relationship("Meeting", back_populates="recording")

class Summary(Base):
    __tablename__ = "summaries"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True)
    meeting_id = Column(
        UUID(as_uuid=True), ForeignKey("meetings.id"), nullable=False, unique=True
    )
    summary_text = Column(Text, nullable=False)  # Store the actual summary content
    transcript = Column(Text, nullable=True)     # Store the transcript as well
    generated_at = Column(DateTime, default=datetime.now(timezone.utc))

    meeting = relationship("Meeting", back_populates="summary")

class CalendarChannel(Base):
    __tablename__ = "calendar_channels"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True)
    resource_id = Column(String, nullable=False)
    calendar_id = Column(String, nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    client_token = Column(String, nullable=True)
    expiration_time = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    user = relationship("User", back_populates="calendar_channels")

class CalendarSyncToken(Base):
    __tablename__ = "calendar_sync_tokens"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True)
    calendar_id = Column(String, nullable=False, unique=True, index=True)
    user_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True
    )
    sync_token = Column(String, nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
    created_at = Column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    user = relationship("User", back_populates="calendar_sync_tokens")

    __table_args__ = (
        UniqueConstraint("calendar_id", "user_id", name="_user_calendar_sync_token_uc"),
    )
