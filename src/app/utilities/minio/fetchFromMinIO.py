from minio_client import s3_client

load_dotenv()


def fetch_file_from_minio(file_key: str, bucket_name: str) -> bytes:
    try:
        response = s3_client.get_object(Bucket=bucket_name, Key=file_key)
        return response["Body"].read()
    except Exception as e:
        print(f"Error fetching file from MinIO: {e}")
        return None
