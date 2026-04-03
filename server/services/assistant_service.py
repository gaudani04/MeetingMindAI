from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()
print("GROQ KEY:", os.getenv("GROQ_API_KEY"))

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

async def get_answer(context: str, question: str):
    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "system",
                "content": "You are an interview assistant. Give short, confident answers."
            },
            {
                "role": "user",
                "content": f"Context:\n{context}\n\nQuestion:\n{question}"
            }
        ],
        temperature=0.2
    )

    return completion.choices[0].message.content