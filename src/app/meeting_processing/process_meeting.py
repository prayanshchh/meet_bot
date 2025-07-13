import os
import httpx
from app.meeting_processing.audio_utils import video_to_audio
from app.meeting_processing.whisper_utils import transcribe_with_whisper_api
from app.meeting_processing.llm_utils import generate_summary_with_openai

async def process_meeting(video_path: str) -> tuple[str, str]:
    audio_path = video_path.replace('.webm', '.mp3')
    video_to_audio(video_path, audio_path)
    print(f"Audio saved at: {audio_path}")

    transcript = await transcribe_with_whisper_api(audio_path)
    print(f"Transcript generated: {len(transcript)} characters")

    summary = await generate_summary_with_openai(transcript)
    print(f"Summary generated: {len(summary)} characters")

    try:
        os.remove(audio_path)
        print(f"Deleted local audio file: {audio_path}")
    except Exception as e:
        print(f"Failed to delete local audio file: {e}")

    return transcript, summary