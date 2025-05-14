import uuid
from sqlalchemy import Column, String, ForeignKey, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid = True), primary_key=True, default=uuid.uuid4, unique=True)
    email = Column(String, unique=True, nullable=False, index=True)
    name = Column(String)
    oauth_provider = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    meetings = relationship("Meeting", back_populates="user")

class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(UUID(as_uuid = True), primary_key=True, default= uuid.uuid4, unique= True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    meeting_url = Column(String, nullable = False)
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    created_at = Column(DateTime, default= datetime.utcnow)

    user = relationship("User", back_populates="meetings")
    recording = relationship("Recording", back_populates="meeting", uselist=False)
    summary = relationship("Summary", back_populates= "meeting", uselist=False)

class Recording(Base):
    __tablename__ = "recordings"

    id = Column(UUID(as_uuid = True), primary_key=True, default= uuid.uuid4, unique=True)
    meeting_id = Column(UUID(as_uuid= True), ForeignKey("meetings.id"), nullable = False, unique= True)
    file_name = Column(String, nullable=False, unique= True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    meeting = relationship("Meeting", back_populates="recording")

class Summary(Base):
    __tablename__ = "summaries"

    id = Column(UUID(as_uuid= True), primary_key=True, default= uuid.uuid4, unique = True)
    meeting_id = Column(UUID(as_uuid = True), ForeignKey("meetings.id"), nullable = False, unique= True)
    summary_url = Column(String, nullable = False)
    generated_at = Column(DateTime, default= datetime.utcnow)

    meeting = relationship("Meeting", back_populates = "summary")

