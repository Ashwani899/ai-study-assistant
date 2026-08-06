import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { generateSummary } from '../../services/api';

export default function SummaryView({ documentId, initialSummary }: { documentId: string, initialSummary?: string }) {
  const [summary, setSummary] = useState<string | null>(initialSummary || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await generateSummary(documentId);
      setSummary(data.summary);
    } catch (err) {
      setError('Failed to generate summary.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialSummary) setSummary(initialSummary);
  }, [initialSummary]);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-white/5 rounded-lg w-1/3"></div>
        <div className="h-4 bg-white/5 rounded w-full"></div>
        <div className="h-4 bg-white/5 rounded w-5/6"></div>
        <div className="h-4 bg-white/5 rounded w-4/6"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="text-4xl mb-4">⚠️</div>
        <p className="text-red-400 mb-4">{error}</p>
        <button onClick={handleGenerate} className="px-6 py-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30 transition-colors">Retry</button>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="text-center py-20">
        <div className="text-4xl mb-4">📝</div>
        <h3 className="text-xl font-medium mb-2">No summary generated yet</h3>
        <p className="text-gray-400 mb-6">Create a concise summary of your document's key points.</p>
        <button 
          onClick={handleGenerate}
          className="px-6 py-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30 transition-colors"
        >
          Generate Summary
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl"
    >
      <div className="markdown-body">
        <ReactMarkdown>{summary}</ReactMarkdown>
      </div>
    </motion.div>
  );
}
