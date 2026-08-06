export interface DocumentInfo {
  id: string;
  filename: string;
  file_type: string;
  word_count: number;
  created_at: string;
  has_summary: boolean;
  has_quiz: boolean;
  has_flashcards: boolean;
  has_notes: boolean;
  has_formulas: boolean;
  has_important: boolean;
  has_interview: boolean;
  has_revision: boolean;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface InterviewQuestion {
  question: string;
  suggested_answer: string;
}
