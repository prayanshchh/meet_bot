#!/bin/sh
set -e

# Autogenerate and apply Alembic migration (dev only!)
alembic -c app/alembic.ini revision --autogenerate -m "auto migration" || true
alembic -c app/alembic.ini upgrade head

# Start the server
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 