from datetime import timedelta
from app.utilities.s3.s3_client import bucket

def generate_upload_url(filename: str) -> str:
    blob = bucket.blob(filename)
    url = blob.generate_signed_url(
        version="v4",
        expiration=timedelta(hours=1),
        method="PUT",
        content_type="video/webm",
    )
    return url


def generate_view_url(filename: str) -> str:
    blob = bucket.blob(filename)
    url = blob.generate_signed_url(
        version="v4",
        expiration=timedelta(hours=1),
        method="GET",
    )
    return url
