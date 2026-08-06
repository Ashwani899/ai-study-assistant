from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime

class DocumentResponse(BaseModel):
    id: str
    filename: str
    file_type: str
    word_count: int
    created_at: datetime
    has_summary: bool
    has_quiz: bool
    has_flashcards: bool
    has_notes: bool
    has_formulas: bool
    has_important: bool
    has_interview: bool
    has_revision: bool

class SummaryResponse(BaseModel):
    summary: str

class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    correct_answer: int
    explanation: str

class QuizResponse(BaseModel):
    questions: List[QuizQuestion]

class Flashcard(BaseModel):
    front: str
    back: str

class FlashcardsResponse(BaseModel):
    cards: List[Flashcard]

class NotesResponse(BaseModel):
    notes: str

class FormulasResponse(BaseModel):
    formulas: str

class ImportantPointsResponse(BaseModel):
    points: str

class InterviewResponse(BaseModel):
    questions: List[Dict[str, str]]

class RevisionPlanResponse(BaseModel):
    plan: str

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    answer: str
    sources: List[str]
