from faster_whisper import WhisperModel
import os

# Load model locally (downloads on first run)
model = WhisperModel("base", device="cpu", compute_type="int8")

def transcribe_audio_file(file_path: str) -> str:
    segments, _ = model.transcribe(file_path, beam_size=5)
    return " ".join([segment.text for segment in segments])