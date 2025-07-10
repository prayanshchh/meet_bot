FROM mcr.microsoft.com/playwright/python:v1.21.0-focal

WORKDIR /app
COPY ./src/app /app
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
RUN playwright install --with-deps

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"] 