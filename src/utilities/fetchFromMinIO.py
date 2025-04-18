import boto3
import os
from botocore.client import Config

MINIO_ACCESS_KEY = os.getenv('MINIO_ACCESS_KEY')
MINIO_SECRET_KEY = os.getenv('MINIO_SECRET_KEY')
MINIO_ENDPOINT = os.getenv('MINIO_ENDPOINT')
MINIO_BUCKET = os.getenv('MINIO_BUCKET')
MINIO_REGION = os.getenv('MINIO_REGION')

if not MINIO_ACCESS_KEY or not MINIO_SECRET_KEY or not MINIO_ENDPOINT or not MINIO_REGION or not MINIO_BUCKET:
    raise ValueError("MinIO environment variables are not defined")

s3 = boto3.client(
    's3',
    enpoint_url=MINIO_ENDPOINT,
    aws_access_key_id = MINIO_ACCESS_KEY,
    aws_secret_access_key = MINIO_SECRET_KEY,
    config = Config(signature_version='s3v4'),
    region_name = MINIO_REGION
)

def fetch_file_from_minio(file_key: str, bucket_name: str) -> bytes:
    try:
        response = s3.get_object(Bucket=bucket_name, Key=file_key)
        return response['Body'].read()
    except Exception as e:
        print(f"Error fetching file from MinIO: {e}")
        return None