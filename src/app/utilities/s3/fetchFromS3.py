from app.utilities.s3.s3_client import bucket

def fetch_file_from_gcs(file_key: str) -> bytes:
    try:
        blob = bucket.blob(file_key)
        return blob.download_as_bytes()
    except Exception as e:
        print(f"Error fetching file from GCS: {e}")
        return None
