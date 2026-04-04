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


def generate_transcript_highlights(transcript: str, segments: list) -> list:
    """Map LLM-identified key moments to Whisper segment time ranges."""
    if not segments:
        return []

    n = len(segments)
    numbered = "\n".join(
        f'[{i}] {s["start"]:.1f}s–{s["end"]:.1f}s: {s["text"]}'
        for i, s in enumerate(segments)
    )
    prompt = f"""You analyze a meeting transcript split into timed segments.

Find key moments: decisions made, important discussions, and critical insights.
Each highlight must cover a contiguous range of segment indices (inclusive).

Rules:
- segment indices are 0 to {n - 1} only.
- segment_start <= segment_end.
- type must be exactly one of: decision, discussion, insight.
- title: short (max ~8 words).
- summary: 1–2 sentences, factual, grounded only in what was said.
- Aim for about 3–10 highlights for a long meeting; fewer if the meeting is short or thin.
- If nothing clearly qualifies, return an empty highlights array.

Numbered segments:
{numbered}

Full transcript:
{transcript}

Return JSON with this shape only:
{{"highlights": [{{"type": "decision"|"discussion"|"insight", "segment_start": <int>, "segment_end": <int>, "title": "<string>", "summary": "<string>"}}]}}
"""
    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
        response_format={"type": "json_object"},
    )
    raw = json.loads(completion.choices[0].message.content)
    items = raw.get("highlights") or []
    if not isinstance(items, list):
        return []

    allowed = {"decision", "discussion", "insight"}
    out = []
    for h in items:
        if not isinstance(h, dict):
            continue
        try:
            si = int(h["segment_start"])
            ei = int(h["segment_end"])
        except (KeyError, TypeError, ValueError):
            continue
        si = max(0, min(si, n - 1))
        ei = max(0, min(ei, n - 1))
        if si > ei:
            si, ei = ei, si
        typ = h.get("type", "discussion")
        if typ not in allowed:
            typ = "discussion"
        title = str(h.get("title", "Key moment")).strip()[:200]
        summary = str(h.get("summary", "")).strip()[:1000]
        if not title and not summary:
            continue
        out.append(
            {
                "type": typ,
                "start_sec": segments[si]["start"],
                "end_sec": segments[ei]["end"],
                "title": title or "Key moment",
                "summary": summary,
            }
        )
    out.sort(key=lambda x: x["start_sec"])
    return out


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