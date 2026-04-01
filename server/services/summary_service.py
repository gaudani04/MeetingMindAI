from groq import Groq
import os

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

async def generate_live_summary(text_chunk: str):
    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": "Summarize this in ONE short sentence."},
            {"role": "user", "content": text_chunk}
        ],
        temperature=0.3
    )

    return completion.choices[0].message.content