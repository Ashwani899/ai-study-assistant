from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db, Document
from ..models import ChatRequest, ChatResponse
from ..services.ai_service import chat_with_document
import json

router = APIRouter()

@router.post("/chat/{doc_id}", response_model=ChatResponse)
async def chat(doc_id: str, req: ChatRequest, db: AsyncSession = Depends(get_db)):
    doc = await db.get(Document, doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    history = json.loads(doc.chat_history) if doc.chat_history else []
    history = history[-10:]
    
    try:
        res = await chat_with_document(doc.raw_text, req.message, history)
        answer = res.get("answer", "")
        sources = res.get("sources", [])
        
        history.append({"user": req.message, "assistant": answer})
        doc.chat_history = json.dumps(history)
        await db.commit()
        
        return ChatResponse(answer=answer, sources=sources)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
