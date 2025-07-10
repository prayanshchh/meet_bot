#!/bin/sh
set -e

# Run Alembic migrations
alembic -c app/alembic.ini upgrade head

# Start the server
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 