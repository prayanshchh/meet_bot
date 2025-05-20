from celery import Celery
import os
from dotenv import load_dotenv


load_dotenv()

CELERY_BROKER_URL = os.getenv("CELERY_BROKER_URL")

app = Celery(
    "meetbot",
    broker=CELERY_BROKER_URL,
)

import worker.tasks

app.conf.update(
    task_serializer='json',
    result_serializer='json',
    accept_content= ['json'],
    timezone= 'UTC',
    enable_utc=True
)

