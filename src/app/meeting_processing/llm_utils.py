import os
from openai import AsyncOpenAI
from app.meeting_processing.prompts import MEETING_SUMMARY_PROMPT

async def generate_summary_with_openai(transcript: str, model: str = "gpt-4o", prompt: str = None) -> str:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY not set in environment")

    client = AsyncOpenAI(api_key=api_key)
    # Use the provided prompt or the default MEETING_SUMMARY_PROMPT, formatted with the transcript
    used_prompt = (prompt or MEETING_SUMMARY_PROMPT).format(transcript=transcript)
    messages = [
        {"role": "user", "content": used_prompt}
    ]
    response = await client.chat.completions.create(
        model=model,
        messages=messages
    )
    return response.choices[0].message.content 