import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { generateFormulas } from '../../services/api';

export default function FormulaSheet({ documentId }: { documentId: string }) {
  const [formulas, setFormulas] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const data = await generateFormulas(documentId);
      setFormulas(data.formulas);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-32 bg-white/5 rounded-2xl border border-white/5"></div>
        ))}
      </div>
    );
  }

  if (!formulas) {
    return (
      <div className="text-center py-20">
        <div className="text-4xl mb-4">📐</div>
        <h3 className="text-xl font-medium mb-2">Formulas & Definitions</h3>
        <p className="text-gray-400 mb-6">Extract all key formulas, equations, and core definitions.</p>
        <button onClick={handleGenerate} className="px-6 py-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30">
          Extract Formulas
        </button>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl">
      <div className="markdown-body font-serif text-lg">
        <ReactMarkdown>{formulas}</ReactMarkdown>
      </div>
    </motion.div>
  );
}
