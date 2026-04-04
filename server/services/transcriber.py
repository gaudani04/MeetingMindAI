from faster_whisper import WhisperModel
import os

# Load model locally (downloads on first run)
model = WhisperModel("base", device="cpu", compute_type="int8")


def transcribe_audio_file(file_path: str) -> dict:
    """Returns full transcript text and per-segment timings for highlight analysis."""
    segments_iter, _ = model.transcribe(file_path, beam_size=5)
    segments = []
    for seg in segments_iter:
        text = (seg.text or "").strip()
        if not text:
            continue
        segments.append(
            {
                "start": float(seg.start),
                "end": float(seg.end),
                "text": text,
            }
        )
    full_text = " ".join(s["text"] for s in segments)
    return {"text": full_text, "segments": segments}