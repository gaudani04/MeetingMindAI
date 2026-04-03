# import os
# import asyncio
# from fastapi import APIRouter, WebSocket, WebSocketDisconnect
# from deepgram import (
#     DeepgramClient,
#     LiveTranscriptionEvents,
#     LiveOptions,
# )
# # Assuming this service is already defined in your project
# from services.summary_service import generate_live_summary

# router = APIRouter()

# DG_API_KEY = os.getenv("DEEPGRAM_API_KEY")
# if not DG_API_KEY:
#     raise Exception("DEEPGRAM_API_KEY not set in environment")

# # Initialize the Deepgram Client globally or per request
# dg_client = DeepgramClient(DG_API_KEY)

# @router.websocket("/ws/transcribe")
# async def websocket_endpoint(websocket: WebSocket):
#     await websocket.accept()
#     loop = asyncio.get_event_loop()
#     # FIX 1: Correct v3 connection syntax
#     dg_connection = dg_client.listen.live.v("1")
    
#     transcript_buffer = []

#     # FIX 2: Define the message handler to work with v3 event system
#     async def on_message(self, result, **kwargs):
#         # Access the transcript from the new v3 result object
#         sentence = result.channel.alternatives[0].transcript
        
#         if len(sentence.strip()) > 0:
#             transcript_buffer.append(sentence)
#             # Send immediate transcript to frontend
#             await websocket.send_json({"type": "transcript", "text": sentence})

#             # Handle summary logic
#             if len(transcript_buffer) % 5 == 0:
#                 chunk_text = " ".join(transcript_buffer[-5:])
#                 summary = await generate_live_summary(chunk_text)
#                 await websocket.send_json({"type": "summary", "text": summary})

#     async def on_error(self, error, **kwargs):
#         print(f"Deepgram Error: {error}")

#     # Register events
#     dg_connection.on(LiveTranscriptionEvents.Transcript, on_message)
#     dg_connection.on(LiveTranscriptionEvents.Error, on_error)

#     # FIX 3: Set options and START the connection
#     options = LiveOptions(
#         model="nova-2", # 'flux-general-en' is deprecated, 'nova-2' is recommended
#         encoding="linear16",
#         sample_rate=16000,
#         interim_results=False
#     )

#     if dg_connection.start(options) is False:
#         print("Failed to start Deepgram connection")
#         return

#     try:
#         while True:
#             # Receive binary audio from frontend
#             data = await websocket.receive_bytes()
            
#             if data == b"STOP":
#                 break

#             # FIX 4: Use .send() for binary data in v3
#             dg_connection.send(data)

#     except WebSocketDisconnect:
#         print("Frontend disconnected")
#     except Exception as e:
#         print(f"Unexpected Error: {e}")
#     finally:
#         # Properly close the Deepgram stream
#         dg_connection.finish()
#         await websocket.close()


import os
import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from deepgram import (
    DeepgramClient,
    LiveTranscriptionEvents,
    LiveOptions,
)

from services.summary_service import generate_live_summary

router = APIRouter()

DG_API_KEY = os.getenv("DEEPGRAM_API_KEY")
print(DG_API_KEY)
if not DG_API_KEY:
    raise Exception("DEEPGRAM_API_KEY not set in environment")

dg_client = DeepgramClient(DG_API_KEY)


@router.websocket("/ws/transcribe")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    dg_connection = dg_client.listen.live.v("1")
    transcript_buffer = []

    loop = asyncio.get_event_loop()  # 👈 needed for async calls inside sync handler

    # ✅ FIX 1: make this NORMAL function (not async)
    def on_message(self, result, **kwargs):
        try:
            print("RAW RESULT:", result)
            # ✅ FIX 2: safe extraction
            if not result or not hasattr(result, "channel"):
                return

            alternatives = result.channel.alternatives
            if not alternatives:
                return

            sentence = alternatives[0].transcript

            if sentence.strip():
                transcript_buffer.append(sentence)

                # ✅ FIX 3: run async send safely
                asyncio.run_coroutine_threadsafe(
                    websocket.send_json({
                        "type": "transcript",
                        "text": sentence
                    }),
                    loop
                )

                # Summary logic
                if len(transcript_buffer) % 5 == 0:
                    chunk_text = " ".join(transcript_buffer[-5:])

                    async def process_summary():
                        summary = await generate_live_summary(chunk_text)
                        await websocket.send_json({
                            "type": "summary",
                            "text": summary
                        })

                    asyncio.run_coroutine_threadsafe(
                        process_summary(),
                        loop
                    )

        except Exception as e:
            print("Handler error:", e)

    def on_error(self, error, **kwargs):
        print(f"Deepgram Error: {error}")

    dg_connection.on(LiveTranscriptionEvents.Transcript, on_message)
    dg_connection.on(LiveTranscriptionEvents.Error, on_error)

    options = LiveOptions(
        model="nova-2",
        encoding="linear16",
        sample_rate=16000, 
        interim_results=True,
        punctuate=True,
         # added later
         diarize=True,
    )
   

    if dg_connection.start(options) is False:
        print("Failed to start Deepgram connection")
        return

    try:
        while True:
            data = await websocket.receive_bytes()

            if data == b"STOP":
                break

            # ✅ FIX 4: ensure valid bytes only
            if isinstance(data, bytes):
                dg_connection.send(data)

    except WebSocketDisconnect:
        print("Frontend disconnected")

    except Exception as e:
        print(f"Unexpected Error: {e}")

    finally:
        dg_connection.finish()
        await websocket.close()