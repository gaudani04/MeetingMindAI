from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import api
from websocket import audio

app = FastAPI(title="Smart Meeting Notes AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api.router, prefix="/api")
app.include_router(audio.router)
@app.get("/")
def test():
    return {"ok": True}
# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)