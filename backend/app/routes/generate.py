from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db, Document
from ..models import (
    SummaryResponse, QuizResponse, FlashcardsResponse, NotesResponse,
    FormulasResponse, ImportantPointsResponse, InterviewResponse, RevisionPlanResponse
)
from ..services.ai_service import (
    generate_summary, generate_quiz, generate_flashcards, generate_notes,
    generate_formulas, generate_important_points, generate_interview_questions, generate_revision_plan
)
import json

router = APIRouter()


async def get_doc(doc_id: str, db: AsyncSession):
    doc = await db.get(Document, doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc


@router.post("/summarize/{doc_id}", response_model=SummaryResponse)
async def summarize(doc_id: str, regenerate: bool = False, db: AsyncSession = Depends(get_db)):
    doc = await get_doc(doc_id, db)
    if doc.summary and not regenerate:
        return {"summary": doc.summary}

    try:
        summary = await generate_summary(doc.raw_text)
        doc.summary = summary
        await db.commit()
        return {"summary": summary}
    except Exception as exc:
        await db.rollback()
        raise HTTPException(status_code=500, detail="Unable to generate a summary.") from exc


@router.post("/quiz/{doc_id}", response_model=QuizResponse)
async def quiz(
    doc_id: str,
    num_questions: int = Query(default=10, ge=1, le=30),
    regenerate: bool = False,
    db: AsyncSession = Depends(get_db),
):
    doc = await get_doc(doc_id, db)
    if doc.quiz and not regenerate:
        cached_questions = json.loads(doc.quiz)
        if isinstance(cached_questions, list) and len(cached_questions) == num_questions:
            return {"questions": cached_questions}

    try:
        questions = await generate_quiz(doc.raw_text, num_questions)
        doc.quiz = json.dumps(questions)
        await db.commit()
        return {"questions": questions}
    except Exception as exc:
        await db.rollback()
        raise HTTPException(status_code=500, detail="Unable to generate quiz questions.") from exc


@router.post("/flashcards/{doc_id}", response_model=FlashcardsResponse)
async def flashcards(doc_id: str, regenerate: bool = False, db: AsyncSession = Depends(get_db)):
    doc = await get_doc(doc_id, db)
    if doc.flashcards and not regenerate:
        return {"cards": json.loads(doc.flashcards)}

    try:
        cards = await generate_flashcards(doc.raw_text)
        doc.flashcards = json.dumps(cards)
        await db.commit()
        return {"cards": cards}
    except Exception as exc:
        await db.rollback()
        raise HTTPException(status_code=500, detail="Unable to generate flashcards.") from exc


@router.post("/notes/{doc_id}", response_model=NotesResponse)
async def notes(doc_id: str, regenerate: bool = False, db: AsyncSession = Depends(get_db)):
    doc = await get_doc(doc_id, db)
    if doc.notes and not regenerate:
        return {"notes": doc.notes}

    try:
        notes_text = await generate_notes(doc.raw_text)
        doc.notes = notes_text
        await db.commit()
        return {"notes": notes_text}
    except Exception as exc:
        await db.rollback()
        raise HTTPException(status_code=500, detail="Unable to generate study notes.") from exc


@router.post("/formulas/{doc_id}", response_model=FormulasResponse)
async def formulas(doc_id: str, regenerate: bool = False, db: AsyncSession = Depends(get_db)):
    doc = await get_doc(doc_id, db)
    if doc.formulas and not regenerate:
        return {"formulas": doc.formulas}

    try:
        formulas_text = await generate_formulas(doc.raw_text)
        doc.formulas = formulas_text
        await db.commit()
        return {"formulas": formulas_text}
    except Exception as exc:
        await db.rollback()
        raise HTTPException(status_code=500, detail="Unable to extract formulas.") from exc


@router.post("/important/{doc_id}", response_model=ImportantPointsResponse)
async def important(doc_id: str, regenerate: bool = False, db: AsyncSession = Depends(get_db)):
    doc = await get_doc(doc_id, db)
    if doc.important_points and not regenerate:
        return {"points": doc.important_points}

    try:
        points = await generate_important_points(doc.raw_text)
        doc.important_points = points
        await db.commit()
        return {"points": points}
    except Exception as exc:
        await db.rollback()
        raise HTTPException(status_code=500, detail="Unable to extract important points.") from exc


@router.post("/interview/{doc_id}", response_model=InterviewResponse)
async def interview(doc_id: str, regenerate: bool = False, db: AsyncSession = Depends(get_db)):
    doc = await get_doc(doc_id, db)
    if doc.interview_questions and not regenerate:
        return {"questions": json.loads(doc.interview_questions)}

    try:
        questions = await generate_interview_questions(doc.raw_text)
        doc.interview_questions = json.dumps(questions)
        await db.commit()
        return {"questions": questions}
    except Exception as exc:
        await db.rollback()
        raise HTTPException(status_code=500, detail="Unable to generate interview questions.") from exc


@router.post("/revision/{doc_id}", response_model=RevisionPlanResponse)
async def revision(doc_id: str, regenerate: bool = False, db: AsyncSession = Depends(get_db)):
    doc = await get_doc(doc_id, db)
    if doc.revision_plan and not regenerate:
        return {"plan": doc.revision_plan}

    try:
        plan = await generate_revision_plan(doc.raw_text)
        doc.revision_plan = plan
        await db.commit()
        return {"plan": plan}
    except Exception as exc:
        await db.rollback()
        raise HTTPException(status_code=500, detail="Unable to generate a revision plan.") from exc
