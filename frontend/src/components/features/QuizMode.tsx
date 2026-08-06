import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateQuiz } from '../../services/api';
import type { QuizQuestion } from '../../types';

export default function QuizMode({ documentId }: { documentId: string }) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const startQuiz = async (count: number) => {
    setLoading(true);
    try {
      const data = await generateQuiz(documentId, count);
      setQuestions(data.questions);
      setCurrentIdx(0);
      setSelected(null);
      setShowAnswer(false);
      setScore(0);
      setFinished(false);
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
        <p>Generating quiz questions...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-4xl mb-4">❓</div>
        <h3 className="text-xl font-medium mb-2">Test your knowledge</h3>
        <p className="text-gray-400 mb-6">Generate a multiple choice quiz to test your understanding.</p>
        <div className="flex justify-center gap-4">
          {[5, 10, 15].map(n => (
            <button key={n} onClick={() => startQuiz(n)} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10">
              {n} Questions
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (finished) {
    const percent = Math.round((score / questions.length) * 100);
    return (
      <div className="text-center py-20 bg-white/[0.02] border border-white/5 rounded-3xl">
        <div className="text-6xl mb-6">{percent >= 80 ? '🏆' : percent >= 50 ? '👍' : '📚'}</div>
        <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
        <p className="text-xl text-gray-300 mb-8">You scored {score} out of {questions.length} ({percent}%)</p>
        <button onClick={() => setQuestions([])} className="px-6 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 font-medium">Try another quiz</button>
      </div>
    );
  }

  const q = questions[currentIdx];

  const handleCheck = () => {
    if (selected === null) return;
    setShowAnswer(true);
    if (selected === q.correct_answer) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx === questions.length - 1) {
      setFinished(true);
    } else {
      setCurrentIdx(i => i + 1);
      setSelected(null);
      setShowAnswer(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <span className="text-gray-400 font-medium">Question {currentIdx + 1} of {questions.length}</span>
        <div className="h-2 w-48 bg-white/10 rounded-full overflow-hidden">
          <motion.div className="h-full bg-indigo-500" initial={{width: 0}} animate={{width: `${((currentIdx)/questions.length)*100}%`}} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white/[0.04] border border-white/10 p-8 rounded-3xl"
        >
          <h3 className="text-2xl font-medium mb-8 leading-tight">{q.question}</h3>
          
          <div className="space-y-3 mb-8">
            {q.options.map((opt, i) => {
              let btnClass = "w-full text-left p-4 rounded-xl border transition-all ";
              if (!showAnswer) {
                btnClass += selected === i ? "bg-indigo-500/20 border-indigo-500 text-indigo-100" : "bg-white/5 border-white/10 hover:bg-white/10 text-gray-300";
              } else {
                if (i === q.correct_answer) {
                  btnClass += "bg-emerald-500/20 border-emerald-500 text-emerald-100";
                } else if (i === selected) {
                  btnClass += "bg-red-500/20 border-red-500 text-red-100";
                } else {
                  btnClass += "bg-white/5 border-white/10 opacity-50";
                }
              }

              return (
                <button
                  key={i}
                  disabled={showAnswer}
                  onClick={() => setSelected(i)}
                  className={btnClass}
                >
                  <span className="inline-block w-8 text-gray-500 font-medium">{String.fromCharCode(65+i)}.</span> {opt}
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {showAnswer && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-8 p-4 rounded-xl bg-white/5 border border-white/10 text-gray-300"
              >
                <strong className="text-white block mb-1">Explanation:</strong>
                {q.explanation}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-end">
            {!showAnswer ? (
              <button
                onClick={handleCheck}
                disabled={selected === null}
                className="px-6 py-2.5 rounded-xl bg-indigo-500 text-white font-medium disabled:opacity-50"
              >
                Check Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-white text-black font-medium"
              >
                {currentIdx === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
