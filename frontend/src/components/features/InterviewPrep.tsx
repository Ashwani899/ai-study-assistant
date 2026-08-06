import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateInterview } from '../../services/api';
import type { InterviewQuestion } from '../../types';

export default function InterviewPrep({ documentId }: { documentId: string }) {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const data = await generateInterview(documentId);
      setQuestions(data.questions);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4 text-indigo-400">
        <svg className="animate-spin h-8 w-8" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
        <p>Preparing interview questions...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-4xl mb-4">🎤</div>
        <h3 className="text-xl font-medium mb-2">Interview & Viva Prep</h3>
        <p className="text-gray-400 mb-6">Generate common questions asked by professors or interviewers.</p>
        <button onClick={handleGenerate} className="px-6 py-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30">
          Start Prep
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {questions.map((q, i) => (
        <motion.div 
          key={i}
          className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden"
        >
          <button
            onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
            className="w-full px-6 py-4 flex items-start text-left focus:outline-none"
          >
            <span className="text-indigo-400 font-bold mr-4">Q{i+1}.</span>
            <span className="font-medium text-gray-200 flex-grow">{q.question}</span>
            <svg 
              className={`w-5 h-5 text-gray-500 transform transition-transform ${expandedIdx === i ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <AnimatePresence>
            {expandedIdx === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-6 pb-4 pt-2 text-gray-400 border-t border-white/5 bg-black/20"
              >
                <span className="block text-xs uppercase tracking-wider text-emerald-400 font-semibold mb-2">Suggested Answer</span>
                <p className="leading-relaxed">{q.suggested_answer}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}
