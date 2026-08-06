import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { generateImportant } from '../../services/api';

export default function ImportantPoints({ documentId }: { documentId: string }) {
  const [points, setPoints] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const data = await generateImportant(documentId);
      setPoints(data.points);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse p-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-start space-x-4">
            <div className="w-8 h-8 rounded-full bg-white/5 shrink-0"></div>
            <div className="h-16 bg-white/5 rounded-xl w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!points) {
    return (
      <div className="text-center py-20">
        <div className="text-4xl mb-4">⭐</div>
        <h3 className="text-xl font-medium mb-2">Important Points</h3>
        <p className="text-gray-400 mb-6">Identify the most critical concepts you must know for exams.</p>
        <button onClick={handleGenerate} className="px-6 py-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30">
          Highlight Key Points
        </button>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl">
      <div className="markdown-body">
        <ReactMarkdown>{points}</ReactMarkdown>
      </div>
    </motion.div>
  );
}
