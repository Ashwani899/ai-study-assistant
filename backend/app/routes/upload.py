from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db, Document
from ..models import DocumentResponse
from ..services.file_parser import parse_file
import uuid

router = APIRouter()

ALLOWED_EXTENSIONS = {"pdf", "pptx", "ppt", "docx", "doc"}

@router.post("/upload", response_model=DocumentResponse)
async def upload_document(file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    ext = file.filename.split(".")[-1].lower() if "." in file.filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    contents = await file.read()
    
    parsed = parse_file(contents, file.filename)
    
    doc = Document(
        id=str(uuid.uuid4()),
        filename=file.filename,
        file_type=ext,
        raw_text=parsed["raw_text"]
    )
    
    db.add(doc)
    await db.commit()
    await db.refresh(doc)
    
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
