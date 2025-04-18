import boto3
import os
from botocore.client import Config
from dotenv import load_dotenv

load_dotenv()

# Load environment variables
MINIO_ACCESS_KEY = os.getenv('MINIO_ACCESS_KEY')
MINIO_SECRET_KEY = os.getenv('MINIO_SECRET_KEY')
MINIO_ENDPOINT = os.getenv('MINIO_ENDPOINT')
MINIO_BUCKET = os.getenv('MINIO_BUCKET')
MINIO_REGION = os.getenv('MINIO_REGION')

if not MINIO_ACCESS_KEY or not MINIO_SECRET_KEY or not MINIO_ENDPOINT or not MINIO_REGION or not MINIO_BUCKET:
    raise ValueError("MinIO environment variables are not defined")

# Create the S3 client for MinIO
s3_client = boto3.client(
    's3',
    endpoint_url=MINIO_ENDPOINT,
    aws_access_key_id=MINIO_ACCESS_KEY,
    aws_secret_access_key=MINIO_SECRET_KEY,
    config=Config(signature_version='s3v4'),
    region_name=MINIO_REGION
)

def generate_upload_url(filename: str) -> str:
    url = s3_client.generate_presigned_url(
        'put_object',
        Params={
            'Bucket': MINIO_BUCKET,
            'Key': filename,
            'ContentType': 'video/webm'
        },
        ExpiresIn=3600
    )
    return url
