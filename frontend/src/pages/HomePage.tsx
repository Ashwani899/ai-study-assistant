import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import FileUpload from '../components/upload/FileUpload';
import type { DocumentInfo } from '../types';

export default function HomePage() {
  const navigate = useNavigate();

  const handleUploadComplete = (doc: DocumentInfo) => {
    navigate(`/study/${doc.id}`);
  };

  const features = [
    { icon: '📝', title: 'Smart Summaries', desc: 'Instantly condense long documents into readable summaries.' },
    { icon: '❓', title: 'Interactive Quizzes', desc: 'Test your knowledge with auto-generated multiple choice questions.' },
    { icon: '🗂️', title: 'Flashcards', desc: 'Master concepts with spaced-repetition flashcards.' },
    { icon: '📒', title: 'Detailed Notes', desc: 'Get structured, comprehensive notes for deep study.' },
    { icon: '📐', title: 'Formula Extraction', desc: 'Pull out key formulas and definitions automatically.' },
    { icon: '⭐', title: 'Important Points', desc: 'Highlight the most critical things you need to remember.' },
    { icon: '🎤', title: 'Interview Prep', desc: 'Prepare with AI-generated viva and interview questions.' },
    { icon: '📅', title: 'Revision Plan', desc: 'Get a timeline to structure your study sessions.' },
    { icon: '💬', title: 'Ask AI', desc: 'Chat directly with your document to get instant answers.' },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-20 relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-3xl mb-12"
      >
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-br from-indigo-300 via-white to-violet-400 bg-clip-text text-transparent">
          Your AI Study Companion
        </h1>
        <p className="text-xl text-gray-400 leading-relaxed">
          Upload lectures, notes, or slides. Get instant summaries, quizzes, flashcards, and personalized study plans.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full mb-32"
      >
        <FileUpload onUploadComplete={handleUploadComplete} />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="w-full max-w-7xl"
      >
        <h2 className="text-3xl font-bold text-center mb-12 text-white">Supercharge your learning</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl hover:bg-white/[0.04] hover:border-indigo-500/30 transition-colors cursor-default group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform origin-left">{f.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-200">{f.title}</h3>
              <p className="text-gray-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
