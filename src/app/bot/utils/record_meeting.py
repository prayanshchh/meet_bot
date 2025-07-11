import os
import uuid
import requests
from datetime import datetime, timezone
from app.utilities.minio.generatePresignedURL import generate_upload_url
from app.db.database import SessionLocal
from app.db.models import Recording, Summary
from app.meeting_processing.process_meeting import process_meeting

async def record_meeting(video_path, meeting_id):
    print(f"Video saved at: {video_path}")

    transcript, summary = await process_meeting(video_path)
    print(f"Transcript: {transcript}")
    print(f"Summary: {summary}")

    db = SessionLocal()
    try:
        summary_record = Summary(
            meeting_id=meeting_id,
            summary_text=summary,
            transcript=transcript,
            generated_at=datetime.now(timezone.utc)
        )
        db.add(summary_record)
        db.commit()
        print(f"Stored summary and transcript for meeting {meeting_id}")
    except Exception as e:
        db.rollback()
        print(f"Failed to store summary: {e}")
    finally:
        db.close()

    file_name = f"meeting-{meeting_id}-{uuid.uuid4()}.webm"
    put_signed_url = generate_upload_url(file_name)

    with open(video_path, "rb") as f:
        resp = requests.put(put_signed_url, data=f, headers={"Content-Type": "video/webm"})
        print("Upload response:", resp.status_code)
        if resp.status_code == 200:
            print("Video uploaded to MinIO successfully.")
        else:
            print("Failed to upload video to MinIO.")
            return None

    db = SessionLocal()
    try:
        rec = Recording(
            meeting_id=meeting_id,
            file_name=file_name,
            uploaded_at=datetime.now(timezone.utc)
        )
        db.add(rec)
        db.commit()
        print(f"Inserted recording row for meeting {meeting_id}")
    except Exception as e:
        db.rollback()
        print(f"Failed to insert recording row: {e}")
        return None
    finally:
        db.close()

    try:
        os.remove(video_path)
        print(f"Deleted local video file: {video_path}")
    except Exception as e:
        print(f"Failed to delete local files: {e}")

    return file_name 