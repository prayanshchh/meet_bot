from .celery_app import app
from bot.main import main as meetbot

@app.task(name="worker.tasks.start_meetbot")
def start_meetbot(meeting_url: str, meeting_id: str):
    meetbot(meet_url= meeting_url, meet_id=meeting_id)