# AI Study Assistant

A full-stack study companion prototype for turning course documents into summaries, quizzes, flashcards, structured notes, formula sheets, revision plans, and document-grounded Q&A.

> **Project status:** Learning/portfolio prototype. Generated answers and study materials can contain errors. Check them against the original lecture material and instructor guidance.

## Features

| Capability | Purpose |
|---|---|
| PDF, PPTX, and DOCX upload | Extract text and supported table content from course material |
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

Requirements: Python 3.11+, Node.js, and npm.

### Backend

```bash
cd backend
python -m venv .venv
# Windows: .venv\\Scripts\\activate
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

The Vite development server is expected at `http://localhost:5173`; the API health endpoint is `GET /api/health` on port 8000. Check the frontend API client and Vite configuration for the exact proxy/base URL.

## Environment

Backend `.env`:

```env
OPENAI_API_KEY=
DATABASE_URL=sqlite+aiosqlite:///./studyai.db
FRONTEND_URL=http://localhost:5173
```

Do not commit API keys, uploaded course documents, database files, or user data.

## Upload validation currently implemented

The API currently:

- accepts only PDF, PPTX, and DOCX extensions;
- enforces a configurable server-side upload limit (25 MB by default);
- rejects empty files, invalid document containers/signatures, unreadable files, and documents with no extractable text;
- extracts supported text and table content from DOCX/PPTX files; and
- stores extracted text in the application database rather than retaining the original upload bytes in the document record.

The backend tests cover parser rejection cases and frontend/backend route alignment. They are not a full end-to-end test of database persistence, concurrent uploads, or every generation workflow.

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
  tests/        parser and API-route regression tests
  requirements.txt
.github/workflows/ci.yml
README.md
```

## API and CI

The backend registers upload, document retrieval, generation, and chat routes under `/api`, plus `GET /api/health`. The route modules define the current request and response contracts.

GitHub Actions runs backend pytest checks and a production frontend build on pushes and pull requests to `main`. A successful CI run verifies those checks; it does not prove a live deployment or production readiness.

## Security and production gaps

The API uses a configured CORS allow-list rather than a wildcard. Before exposing this prototype to multiple users, add or verify:

- authentication and per-user document authorization/isolation;
- rate limits, quotas, and abuse controls for upload and AI-generation endpoints;
- explicit document retention and deletion workflows;
- production database migrations, backups, and access controls;
- reverse-proxy request-size limits and operational monitoring; and
- end-to-end tests for upload persistence, authorization, and generation failures.

AI output may hallucinate or omit information. Do not upload confidential, copyrighted, or personally identifying material unless you have permission and an appropriate privacy arrangement. No live deployment is claimed here.

## License

No license file is currently included. Do not assume reuse or redistribution rights until a license is explicitly added.
