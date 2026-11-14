from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
import uuid

from ..config import settings
from ..database import get_db, Document
from ..models import DocumentResponse
from ..services.file_parser import parse_file

router = APIRouter()

ALLOWED_EXTENSIONS = {"pdf", "pptx", "docx"}


@router.post("/upload", response_model=DocumentResponse)
async def upload_document(file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="A filename is required.")

    extension = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""
    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Only PDF, PPTX, and DOCX files are supported.")

    max_bytes = max(1, settings.max_file_size_mb) * 1024 * 1024
    contents = await file.read(max_bytes + 1)
    if len(contents) > max_bytes:
        raise HTTPException(
            status_code=413,
            detail=f"File exceeds the {settings.max_file_size_mb} MB upload limit."
        )
    if not contents:
        raise HTTPException(status_code=400, detail="The uploaded file is empty.")

    try:
        parsed = parse_file(contents, file.filename)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    doc = Document(
        id=str(uuid.uuid4()),
        filename=file.filename.replace("\\", "/").split("/")[-1],
        file_type=extension,
        raw_text=parsed["raw_text"]
    )

    db.add(doc)
    try:
        await db.commit()
        await db.refresh(doc)
    except Exception:
        await db.rollback()
        raise

    return DocumentResponse(
        id=doc.id,
        filename=doc.filename,
        file_type=doc.file_type,
        word_count=parsed["word_count"],
        created_at=doc.created_at,
        has_summary=bool(doc.summary),
        has_quiz=bool(doc.quiz),
        has_flashcards=bool(doc.flashcards),
        has_notes=bool(doc.notes),
        has_formulas=bool(doc.formulas),
        has_important=bool(doc.important_points),
        has_interview=bool(doc.interview_questions),
        has_revision=bool(doc.revision_plan)
    )


@router.get("/document/{doc_id}", response_model=DocumentResponse)
async def get_document(doc_id: str, db: AsyncSession = Depends(get_db)):
    doc = await db.get(Document, doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    word_count = len(doc.raw_text.split()) if doc.raw_text else 0

    return DocumentResponse(
        id=doc.id,
        filename=doc.filename,
        file_type=doc.file_type,
        word_count=word_count,
        created_at=doc.created_at,
        has_summary=bool(doc.summary),
        has_quiz=bool(doc.quiz),
        has_flashcards=bool(doc.flashcards),
        has_notes=bool(doc.notes),
        has_formulas=bool(doc.formulas),
        has_important=bool(doc.important_points),
        has_interview=bool(doc.interview_questions),
        has_revision=bool(doc.revision_plan)
    )
