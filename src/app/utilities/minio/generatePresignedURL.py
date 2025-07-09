from .minio_client import s3_client, MINIO_BUCKET


def generate_upload_url(filename: str) -> str:
    url = s3_client.generate_presigned_url(
        "put_object",
        Params={"Bucket": MINIO_BUCKET, "Key": filename, "ContentType": "video/webm"},
        ExpiresIn=3600,
    )
    return url


def generate_view_url(filename: str) -> str:
    url = s3_client.generate_presigned_url(
        "get_object",
        Params={
            "Bucket": MINIO_BUCKET,
            "Key": filename,
        },
        ExpiresIn=3600,
    )
    return url
