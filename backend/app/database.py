import uuid
from datetime import datetime
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy import Column, String, Text, DateTime
from .config import settings

Base = declarative_base()

class Document(Base):
    __tablename__ = 'documents'
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    filename = Column(String, nullable=False)
    file_type = Column(String, nullable=False)
    raw_text = Column(Text, nullable=False)
    summary = Column(Text, nullable=True)
    quiz = Column(Text, nullable=True)
    flashcards = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    formulas = Column(Text, nullable=True)
    important_points = Column(Text, nullable=True)
    interview_questions = Column(Text, nullable=True)
    revision_plan = Column(Text, nullable=True)
    chat_history = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

engine = create_async_engine(settings.database_url, echo=False)
async_session = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

async def get_db():
    async with async_session() as session:
        yield session
