from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from services.transcriber import transcribe_audio_file
from services.llm import generate_meeting_insights, chat_with_notes
from utils.firebase_db import save_meeting, get_meeting
from services.assistant_service import get_answer
from pydantic import BaseModel
import tempfile
import uuid
import os

router = APIRouter()

class AskRequest(BaseModel):
    transcript: str
    question: str


@router.post("/ask")
async def ask_ai(req: AskRequest):
    answer = await get_answer(
        context=req.transcript[-1000:],  # limit tokens
        question=req.question
    )
    return {"answer": answer}

@router.post("/upload")
async def upload_audio(file: UploadFile = File(...)):
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1])
    temp_file.close() 
    with open(temp_file.name, "wb") as f:
        f.write(await file.read())
    
    # 1. Transcribe
    transcript = transcribe_audio_file(temp_file.name)
    os.remove(temp_file.name)
    
    # 2. Analyze
    insights = generate_meeting_insights(transcript)
    
    # 3. Save
    meeting_id = str(uuid.uuid4())
    meeting_data = {
        "id": meeting_id,
        "transcript": transcript,
        "insights": insights
    }
    save_meeting(meeting_id, meeting_data)
    
    return meeting_data

@router.post("/chat")
async def chat(request: dict):
    
    meeting = get_meeting(request["meeting_id"])
    print("Fetched meeting:", meeting)

    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    
    answer = chat_with_notes(
        transcript=meeting["transcript"], 
        summary=str(meeting["insights"]["summary"]), 
        question=request["question"]
    )
    return {"answer": answer}