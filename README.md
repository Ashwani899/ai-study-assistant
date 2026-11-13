# AI Study Assistant

A full-stack study companion prototype for turning course documents into summaries, quizzes, flashcards, structured notes, formula sheets, revision plans, and document-grounded Q&A.

> **Project status:** Learning/portfolio prototype. Generated answers and study materials can contain errors. Check them against the original lecture material and instructor guidance.

## Features

| Capability | Purpose |
|---|---|
| PDF, PPT, and DOCX upload | Extract text from course material |
| Summaries and notes | Organize key ideas and explanations |
| Quizzes and flashcards | Support retrieval practice and active recall |
| Formula sheets and key points | Surface definitions and equations |
| Revision plans | Turn material into a suggested study schedule |
| Document Q&A | Ask questions about an uploaded document |

## Stack

| Layer | Technologies |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Backend | Python, FastAPI, Uvicorn |
| AI | OpenAI API |
| Database | SQLAlchemy async, SQLite |
| Parsing | PyMuPDF, python-pptx, python-docx |

## Run locally

Requirements: Python 3.11+, Node.js, npm.

### Backend

```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Add your own API key to .env.
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm ci
npm run dev
```

The Vite app is expected at `http://localhost:5173`; the backend health endpoint is `GET /api/health` on port 8000. Check the frontend API client and Vite configuration for the exact proxy/base URL.

## Environment

Backend `.env`:

```env
OPENAI_API_KEY=
DATABASE_URL=sqlite+aiosqlite:///./studyai.db
FRONTEND_URL=http://localhost:5173
```

Do not commit API keys, uploaded course documents, database files, or user data.

## Repository layout

```text
frontend/   React + TypeScript application
backend/
  app/
    routes/     upload, generation, and chat endpoints
    services/   extraction and AI logic
    main.py     FastAPI application
    database.py async database setup
    models.py   data models
  requirements.txt
README.md
```

## API surface

The backend currently registers upload, generate, and chat routers under `/api`, plus `GET /api/health`. The route modules define the current request and response contracts.

## Deployment and security

A Render blueprint is included for the API, and the frontend contains Vercel configuration. Set `OPENAI_API_KEY` and `FRONTEND_URL` as platform environment variables. The API must use a strict CORS allow-list of trusted frontend origins; wildcard origins should not be combined with credentialed requests.

Before a public launch, add upload size/type validation, rate limits, authentication or per-user data isolation, document retention/deletion controls, and tests for malformed or oversized files.

## Limitations

- AI output may hallucinate or omit information; cross-check it against the source document.
- Revision plans are suggestions, not personalized academic advice.
- Do not upload confidential, copyrighted, or personally identifying material unless you have permission and an appropriate privacy arrangement.

## License

MIT (see repository license file).
