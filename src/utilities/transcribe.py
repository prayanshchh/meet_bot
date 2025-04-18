import whisper
import tempfile
import os

def transcribe_audio_bytes(audio_bytes: bytes, model_size: str = "turbo") -> str:
    model = whisper.load_model(model_size)

    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as temp_audio_file:
        temp_audio_file.write(audio_bytes)
        temp_audio_path = temp_audio_file.name

    try:
        result = model.transcribe(temp_audio_path)
        return result["text"]

    finally:
        if os.path.exists(temp_audio_path):
            os.remove(temp_audio_path)
