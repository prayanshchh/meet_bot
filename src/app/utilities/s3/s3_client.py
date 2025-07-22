from google.cloud import storage
from app.config import GCS_BUCKET

gcs_client = storage.Client()
bucket = gcs_client.bucket(GCS_BUCKET)
