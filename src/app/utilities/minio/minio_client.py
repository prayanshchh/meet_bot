import os
import boto3
from botocore.client import Config
from dotenv import load_dotenv

load_dotenv()

MINIO_ACCESS_KEY = os.getenv('MINIO_ACCESS_KEY')
MINIO_SECRET_KEY = os.getenv('MINIO_SECRET_KEY')
MINIO_ENDPOINT = os.getenv('MINIO_ENDPOINT')
MINIO_REGION = os.getenv('MINIO_REGION')
MINIO_BUCKET = os.getenv('MINIO_BUCKET')

if not all([MINIO_ACCESS_KEY, MINIO_SECRET_KEY, MINIO_ENDPOINT, MINIO_REGION, MINIO_BUCKET]):
    raise ValueError("MinIO environment variables are not fully defined")

s3_client = boto3.client(
    's3',
    endpoint_url=MINIO_ENDPOINT,
    aws_access_key_id=MINIO_ACCESS_KEY,
    aws_secret_access_key=MINIO_SECRET_KEY,
    config=Config(signature_version='s3v4'),
    region_name=MINIO_REGION
)
