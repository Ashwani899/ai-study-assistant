import axios from 'axios';
import type { DocumentInfo, QuizQuestion, Flashcard, InterviewQuestion } from '../types';

const API_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_URL,
});

export const uploadFile = async (file: File): Promise<DocumentInfo> => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post('/api/upload', formData);
  return data;
};

export const getDocument = async (id: string): Promise<DocumentInfo> => {
  const { data } = await api.get(`/api/document/${id}`);
  return data;
};

export const generateSummary = async (id: string): Promise<{ summary: string }> => {
  const { data } = await api.post(`/api/summarize/${id}`);
  return data;
};

export const generateQuiz = async (id: string, numQuestions: number = 5): Promise<{ questions: QuizQuestion[] }> => {
  const { data } = await api.post(`/api/quiz/${id}`, null, {
    params: { num_questions: numQuestions },
  });
  return data;
};

export const generateFlashcards = async (id: string): Promise<{ cards: Flashcard[] }> => {
  const { data } = await api.post(`/api/flashcards/${id}`);
  return data;
};

export const generateNotes = async (id: string): Promise<{ notes: string }> => {
  const { data } = await api.post(`/api/notes/${id}`);
  return data;
};

export const generateFormulas = async (id: string): Promise<{ formulas: string }> => {
  const { data } = await api.post(`/api/formulas/${id}`);
  return data;
};

export const generateImportant = async (id: string): Promise<{ points: string }> => {
  const { data } = await api.post(`/api/important/${id}`);
  return data;
};

export const generateInterview = async (id: string): Promise<{ questions: InterviewQuestion[] }> => {
  const { data } = await api.post(`/api/interview/${id}`);
  return data;
};

export const generateRevision = async (id: string): Promise<{ plan: string }> => {
  const { data } = await api.post(`/api/revision/${id}`);
  return data;
};

export const chatWithDoc = async (id: string, message: string): Promise<{ answer: string; sources: string[] }> => {
  const { data } = await api.post(`/api/chat/${id}`, { message });
  return data;
};
