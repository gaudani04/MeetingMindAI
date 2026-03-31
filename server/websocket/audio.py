from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import tempfile
import os
from services.transcriber import transcribe_audio_file

router = APIRouter()

@router.websocket("/ws/transcribe")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    # Create temp file for accumulating audio blobs
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".webm")
    try:
        while True:
            data = await websocket.receive_bytes()
            if data == b"STOP":
                break
            with open(temp_file.name, "ab") as f:
                f.write(data)
            
            # Simple chunk processing (in a prod app, use memory buffers and VAD)
            # For hackathon: we transcribe the growing file on every significant chunk
            text = transcribe_audio_file(temp_file.name)
            await websocket.send_json({"transcript": text})
            
    except WebSocketDisconnect:
        pass
    finally:
        os.remove(temp_file.name)