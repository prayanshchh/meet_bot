# MeetBot

## 🚀 Project Goal
MeetBot is an AI-powered meeting assistant that can join your online meetings, record them, generate transcripts, and provide AI-generated summaries. The goal is to automate meeting documentation and make it easy to access, review, and share meeting content.

---

## 🛠️ Tech Stack

- **Frontend:** React (Vite), TypeScript, Tailwind CSS
- **Backend:** FastAPI (Python)
- **Database:** PostgreSQL
- **Object Storage:** MinIO (S3-compatible)
- **Authentication:** OAuth (Google, GitHub), JWT
- **Browser Automation:** Playwright (Python)
- **AI/NLP:** OpenAI API (for summaries)
- **Other:** Docker, Docker Compose

---

## 📋 Prerequisites

- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/) (for Docker setup)
- [Python 3.9+](https://www.python.org/) (for manual setup)
- [Node.js 18+](https://nodejs.org/) & [npm](https://www.npmjs.com/) (for frontend)
- [PostgreSQL 13+](https://www.postgresql.org/) (if not using Docker)
- [MinIO](https://min.io/) (if not using Docker)
- API keys for Google OAuth, GitHub OAuth, and OpenAI

---

## 📦 Setup Guide

### Option 1: **Run Everything with Docker (Recommended)**

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd meet_bot
   ```

2. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in all required secrets (DB, MinIO, OAuth, OpenAI, etc).

3. **Start all services:**
   ```bash
   docker-compose up --build
   ```
   This will start the backend, frontend, database, and MinIO.

4. **Access the app:**
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - MinIO Console: [http://localhost:9001](http://localhost:9001)
   - API: [http://localhost:8000](http://localhost:8000)

---

### Option 2: **Manual Setup (Without Docker)**

#### 1. **Backend (FastAPI + Playwright + DB)**

- **Install dependencies:**
  ```bash
  cd src/app
  python -m venv venv
  source venv/bin/activate
  pip install -r requirements.txt
  ```
- **Set up environment variables:**
  - Copy `.env.example` to `.env` and fill in all required secrets.
- **Run database migrations:**
  ```bash
  alembic upgrade head
  ```
- **Start the backend:**
  ```bash
  uvicorn main:app --reload --host 127.0.0.1 --port 8000
  ```

#### 2. **Frontend (React + Vite)**

- **Install dependencies:**
  ```bash
  cd ../../app-frontend
  npm install
  ```
- **Start the frontend:**
  ```bash
  npm run dev
  ```
- The app will be available at [http://localhost:5173](http://localhost:5173)

#### 3. **MinIO (Object Storage)**

- **Install and run MinIO:**
  - Download from [min.io](https://min.io/download)
  - Start MinIO server:
    ```bash
    minio server /data --console-address ":9001"
    ```
  - Access MinIO Console at [http://localhost:9001](http://localhost:9001)

#### 4. **PostgreSQL (Database)**

- **Install and run PostgreSQL** (if not already running)
- Create a database and user as specified in your `.env` file

---

## 📝 Notes
- Make sure all environment variables are set correctly in `.env`.
- For OAuth, set up your Google and GitHub apps to allow `http://localhost:8000` as a callback.
- For OpenAI summaries, set your OpenAI API key in the backend `.env`.
- If you use Docker, all services are networked together automatically.

---

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License
MIT 