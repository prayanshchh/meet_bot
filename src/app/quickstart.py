import datetime
import os.path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google.auth.transport.requests import Request as GoogleAuthRequest


SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"]
TOKEN_FILE = "token.json"
CREDENTIALS_FILE = "credentials.json"
CALENDAR_ID_TO_WATCH = "primary" 

def get_google_calendar_serive():
  creds = None
  if(os.path.exists(TOKEN_FILE)):
    creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
  if not creds or not creds.valid:
    if(creds and creds.expired and creds.refresh_token):
        creds.refresh(GoogleAuthRequest)
    else:
        flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_FILE, SCOPES)
        creds = flow.run_local_server(port=5490)
    with open(TOKEN_FILE, "w") as token:
        token.write(creds.to_json())
    return build("calendar", "v3", credentials=creds)
  
def get_meet_link(event):

    if 'conferenceData' in event and 'entryPoints' in event['conferenceData']:
        for entry_point in event['conferenceData']['entryPoints']:
            if entry_point.get('entryPointType') == 'video' and 'uri' in entry_point:
                return entry_point['uri']
    return None

def main():
  """Shows basic usage of the Google Calendar API.
  Prints the start, name, and Google Meet link of upcoming events.
  """
  creds = None

  if os.path.exists("token.json"):
    creds = Credentials.from_authorized_user_file("token.json", SCOPES)

  if not creds or not creds.valid:
    if creds and creds.expired and creds.refresh_token:
      creds.refresh(Request())
    else:
      flow = InstalledAppFlow.from_client_secrets_file(
          "credentials.json", SCOPES
      )
      creds = flow.run_local_server(port=5490)
    with open("token.json", "w") as token:
      token.write(creds.to_json())

  try:
    service = build("calendar", "v3", credentials=creds)

    now = datetime.datetime.now(tz=datetime.timezone.utc).isoformat()
    print("Getting upcoming events with Google Meet links...")

    events_result = (
        service.events()
        .list(
            calendarId="primary",
            timeMin=now,
            maxResults=20,
            singleEvents=True,
            orderBy="startTime",
        )
        .execute()
    )
    events = events_result.get("items", [])

    gmeet_events_found = False
    for event in events:
      meetlink = get_meet_link(event)
      
      if meetlink:
        gmeet_events_found = True
        start = event["start"].get("dateTime", event["start"].get("date"))
        print(f"Event: {event['summary']}")
        print(f"Start: {start}")
        print(f"Google Meet Link: {meetlink}")
        print("\n")

    if not gmeet_events_found:
      print("No upcoming Google Meet events found.")

  except HttpError as error:
    print(f"An error occurred: {error}")


if __name__ == "__main__":
  main()