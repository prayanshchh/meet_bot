from utilities.fetchFromMinIO import fetch_file_from_minio;
from utilities.convert_webm_to_mp3 import convert_webm_bytes_to_mp3;
from utilities.transcribe import transcribe_audio_bytes
from utilities.summary import generate_summary;
import os

file = fetch_file_from_minio("audio_sample.mp3", os.getenv('MINIO_BUCKET'))

text = transcribe_audio_bytes(file)

summary = generate_summary(text)
