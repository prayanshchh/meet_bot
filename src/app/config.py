import os
from dotenv import load_dotenv

load_dotenv()

REQUIRED_VARS = [
    "GCS_BUCKET",
    "DATABASE_URL",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "SECRET_KEY",
    "GOOGLE_WEBHOOK_CLIENT_TOKEN",
    "WEBHOOK_PUBLIC_URL",
    "OPENAI_API_KEY",
]

missing = [var for var in REQUIRED_VARS if not os.getenv(var)]
if missing:
    raise EnvironmentError(f"Missing required environment variables: {', '.join(missing)}")

GCS_BUCKET = os.getenv("GCS_BUCKET")
DATABASE_URL = os.getenv("DATABASE_URL")
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
SECRET_KEY = os.getenv("SECRET_KEY")
GOOGLE_WEBHOOK_CLIENT_TOKEN = os.getenv("GOOGLE_WEBHOOK_CLIENT_TOKEN")
WEBHOOK_PUBLIC_URL = os.getenv("WEBHOOK_PUBLIC_URL")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY") 