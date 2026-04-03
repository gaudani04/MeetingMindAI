from groq import Groq
import os
from dotenv import load_dotenv
import json

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def generate_meeting_insights(transcript: str):
    prompt = f"""
You are a strict meeting analysis engine.

Your job is to extract structured insights from a meeting transcript.

IMPORTANT RULES:
- Do NOT guess or assume missing information
- Do NOT say phrases like "it seems", "you mentioned", "you are asking"
- Only extract what is explicitly said
- Be concise and factual
- If something is not present, return empty array []
- Output MUST be valid JSON only (no extra text)

Return JSON with:
- "title": short meeting title
- "summary": array of key discussion points
- "action_items": array of objects with "task", "owner", "deadline"
- "key_insights": important observations
- "risks": problems or blockers mentioned

Transcript:
{transcript}
"""
    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
        response_format={"type": "json_object"}
    )
    return json.loads(completion.choices[0].message.content)

def chat_with_notes(transcript: str, summary: str, question: str):
    prompt = f"""
    You are an AI assistant answering questions based ONLY on the provided meeting transcript and summary. 
    If the answer is not found, say 'Not mentioned'.
    
    Context:
    Summary: {summary}
    Transcript: {transcript}
    
    Question: {question}
    """
    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.1
    )
    return completion.choices[0].message.content