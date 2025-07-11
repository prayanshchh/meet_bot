FROM mcr.microsoft.com/playwright/python:v1.53.0-noble

WORKDIR /app/src
COPY ./src /app/src
RUN pip install -r app/requirements.txt
RUN playwright install
RUN apt-get update && apt-get install -y ffmpeg

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]