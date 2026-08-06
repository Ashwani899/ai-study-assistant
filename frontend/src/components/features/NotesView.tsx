import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { generateNotes } from '../../services/api';

export default function NotesView({ documentId }: { documentId: string }) {
  const [notes, setNotes] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const data = await generateNotes(documentId);
      setNotes(data.notes);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse p-8">
        <div className="h-10 bg-white/5 rounded-lg w-1/4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-white/5 rounded w-full"></div>
          <div className="h-4 bg-white/5 rounded w-5/6"></div>
          <div className="h-4 bg-white/5 rounded w-4/6"></div>
        </div>
        <div className="h-32 bg-white/5 rounded-xl w-full"></div>
      </div>
    );
  }

  if (!notes) {
    return (
      <div className="text-center py-20">
        <div className="text-4xl mb-4">📒</div>
        <h3 className="text-xl font-medium mb-2">Detailed Study Notes</h3>
        <p className="text-gray-400 mb-6">Generate comprehensive, structured notes from your document.</p>
        <button onClick={handleGenerate} className="px-6 py-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30">
          Generate Notes
        </button>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/[0.02] border border-white/5 p-8 md:p-12 rounded-3xl">
      <div className="markdown-body">
        <ReactMarkdown>{notes}</ReactMarkdown>
      </div>
    </motion.div>
  );
}
