import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getDocument } from '../services/api';
import type { DocumentInfo } from '../types';

import SummaryView from '../components/features/SummaryView';
import QuizMode from '../components/features/QuizMode';
import FlashcardDeck from '../components/features/FlashcardDeck';
import NotesView from '../components/features/NotesView';
import FormulaSheet from '../components/features/FormulaSheet';
import ImportantPoints from '../components/features/ImportantPoints';
import InterviewPrep from '../components/features/InterviewPrep';
import RevisionPlan from '../components/features/RevisionPlan';
import ChatInterface from '../components/features/ChatInterface';

type FeatureType = 'summary' | 'quiz' | 'flashcards' | 'notes' | 'formulas' | 'important' | 'interview' | 'revision' | 'chat';

const FEATURES: { id: FeatureType; icon: string; label: string; field: keyof DocumentInfo }[] = [
  { id: 'summary', icon: '📝', label: 'Summary', field: 'has_summary' },
  { id: 'quiz', icon: '❓', label: 'Quiz', field: 'has_quiz' },
  { id: 'flashcards', icon: '🗂️', label: 'Flashcards', field: 'has_flashcards' },
  { id: 'notes', icon: '📒', label: 'Notes', field: 'has_notes' },
  { id: 'formulas', icon: '📐', label: 'Formulas', field: 'has_formulas' },
  { id: 'important', icon: '⭐', label: 'Important', field: 'has_important' },
  { id: 'interview', icon: '🎤', label: 'Interview', field: 'has_interview' },
  { id: 'revision', icon: '📅', label: 'Plan', field: 'has_revision' },
  { id: 'chat', icon: '💬', label: 'Ask AI', field: 'id' }, // Chat is always available
];

export default function StudyDashboard() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [doc, setDoc] = useState<DocumentInfo | null>(null);
  const [activeFeature, setActiveFeature] = useState<FeatureType>('summary');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getDocument(id)
      .then(setDoc)
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-indigo-500/50 h-10 w-10"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-white/10 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-white/10 rounded"></div>
              <div className="h-4 bg-white/10 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!doc) return null;

  const renderFeature = () => {
    if (!id) return null;
    switch (activeFeature) {
      case 'summary': return <SummaryView documentId={id} />;
      case 'quiz': return <QuizMode documentId={id} />;
      case 'flashcards': return <FlashcardDeck documentId={id} />;
      case 'notes': return <NotesView documentId={id} />;
      case 'formulas': return <FormulaSheet documentId={id} />;
      case 'important': return <ImportantPoints documentId={id} />;
      case 'interview': return <InterviewPrep documentId={id} />;
      case 'revision': return <RevisionPlan documentId={id} />;
      case 'chat': return <ChatInterface documentId={id} />;
      default: return null;
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 h-[calc(100vh-4rem)] flex flex-col md:flex-row gap-8">
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 shrink-0 flex flex-col">
        <div className="mb-8 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
          <h2 className="text-lg font-bold truncate text-gray-200" title={doc.filename}>{doc.filename}</h2>
          <div className="flex items-center space-x-2 mt-2">
            <span className="text-xs px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded-md font-medium uppercase">{doc.file_type}</span>
            <span className="text-xs text-gray-500">{doc.word_count.toLocaleString()} words</span>
          </div>
        </div>

        <nav className="flex md:flex-col overflow-x-auto md:overflow-visible gap-2 pb-4 md:pb-0 hide-scrollbar">
          {FEATURES.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFeature(f.id)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl whitespace-nowrap transition-all ${
                activeFeature === f.id 
                  ? 'bg-indigo-500/20 border border-indigo-500/30 text-indigo-300' 
                  : 'bg-transparent text-gray-400 hover:bg-white/5 hover:text-gray-200'
              }`}
            >
              <span className="text-xl">{f.icon}</span>
              <span className="font-medium flex-grow text-left">{f.label}</span>
              {f.id !== 'chat' && doc[f.field] && (
                <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></div>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow overflow-y-auto min-h-0 pr-2 pb-20 md:pb-0 custom-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFeature}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {renderFeature()}
          </motion.div>
        </AnimatePresence>
      </div>
      
    </div>
  );
}
