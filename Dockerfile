FROM mcr.microsoft.com/playwright/python:v1.21.0-focal

WORKDIR /app/src
COPY ./src /app/src
RUN pip install -r app/requirements.txt
RUN playwright install

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]