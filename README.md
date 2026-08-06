# AI Study Assistant

An intelligent study companion for college students. Upload lecture PDFs, PPTs, or notes and get AI-powered summaries, quizzes, flashcards, notes, formula sheets, revision plans, and an interactive Q&A chatbot.

![StudyAI](https://img.shields.io/badge/StudyAI-Campus-6366f1?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?style=flat-square&logo=openai)

## Features

| Feature | Description |
|---|---|
| **PDF/PPT Upload** | Drag-and-drop upload with instant text extraction |
| **AI Summary** | Concise, structured summaries of any document |
| **Smart Quiz** | Auto-generated MCQs with explanations |
| **Flashcards** | Interactive flip cards for active recall |
| **Lecture Notes** | Structured notes from slides with key takeaways |
| **Formula Sheet** | Extracted formulas, equations, and definitions |
| **Important Points** | Highlighted key concepts and must-know facts |
| **Interview Prep** | Generated interview questions from the material |
| **Revision Plan** | Day-by-day study schedule based on content |
| **Ask Anything** | Chat with your document — ask questions, get answers |

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS v4 |
| Backend | Python 3.11+ + FastAPI |
| AI | OpenAI API (GPT-4o-mini) |
| Database | SQLite (SQLAlchemy async) |
| File Parsing | PyMuPDF (PDF), python-pptx (PPT), python-docx (DOCX) |

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- OpenAI API key

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux
pip install -r requirements.txt
cp .env.example .env           # Add your OPENAI_API_KEY
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev                    # http://localhost:5173
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/upload` | Upload PDF/PPT/DOCX |
| GET | `/api/document/{id}` | Get document metadata |
| POST | `/api/summarize/{id}` | Generate summary |
| POST | `/api/quiz/{id}` | Generate quiz questions |
| POST | `/api/flashcards/{id}` | Generate flashcards |
| POST | `/api/notes/{id}` | Generate structured notes |
| POST | `/api/formulas/{id}` | Extract formula sheet |
| POST | `/api/important/{id}` | Extract important points |
| POST | `/api/interview/{id}` | Generate interview questions |
| POST | `/api/revision/{id}` | Generate revision plan |
| POST | `/api/chat/{id}` | Ask a question about the document |

## Deployment

- **Frontend**: Vercel — connect your GitHub repo
- **Backend**: Render — use `render.yaml`, set env vars

## License

MIT
