import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { generateRevision } from '../../services/api';

export default function RevisionPlan({ documentId }: { documentId: string }) {
  const [plan, setPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const data = await generateRevision(documentId);
      setPlan(data.plan);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse p-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-white/5 rounded-xl border border-white/5"></div>
        ))}
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="text-center py-20">
        <div className="text-4xl mb-4">📅</div>
        <h3 className="text-xl font-medium mb-2">Structured Revision Plan</h3>
        <p className="text-gray-400 mb-6">Get a tailored day-by-day plan to master this document before exams.</p>
        <button onClick={handleGenerate} className="px-6 py-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30">
          Create Timeline
        </button>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl">
      <div className="markdown-body">
        <ReactMarkdown>{plan}</ReactMarkdown>
      </div>
    </motion.div>
  );
}
