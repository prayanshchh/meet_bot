from openai import OpenAI
from app.config import OPENAI_API_KEY

async def transcribe_with_whisper_api(audio_path: str, model: str = "gpt-4o-transcribe", prompt: str = None) -> str:
    api_key = OPENAI_API_KEY
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY not set in environment")

    client = OpenAI(api_key=api_key)
    with open(audio_path, "rb") as audio_file:
        kwargs = {
            "model": model,
            "file": audio_file,
        }
        if prompt:
            kwargs["prompt"] = prompt
        transcription = client.audio.transcriptions.create(**kwargs)
        return transcription.text 