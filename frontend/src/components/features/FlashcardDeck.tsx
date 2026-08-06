import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { generateFlashcards } from '../../services/api';
import type { Flashcard } from '../../types';

export default function FlashcardDeck({ documentId }: { documentId: string }) {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (cards.length === 0) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      } else if (e.code === 'ArrowRight') {
        nextCard();
      } else if (e.code === 'ArrowLeft') {
        prevCard();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cards.length, currentIdx]);

  const loadCards = async () => {
    setLoading(true);
    try {
      const data = await generateFlashcards(documentId);
      setCards(data.cards);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIdx(i => Math.min(cards.length - 1, i + 1)), 150);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIdx(i => Math.max(0, i - 1)), 150);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4 text-indigo-400">
        <svg className="animate-spin h-8 w-8" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
        <p>Generating flashcards...</p>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-4xl mb-4">🗂️</div>
        <h3 className="text-xl font-medium mb-2">Master your material</h3>
        <p className="text-gray-400 mb-6">Generate spaced-repetition flashcards for key concepts.</p>
        <button onClick={loadCards} className="px-6 py-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30">
          Generate Flashcards
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center">
      <div className="mb-6 text-gray-400 font-medium">
        Card {currentIdx + 1} of {cards.length}
      </div>

      <div className="relative w-full h-[400px] preserve-3d cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
        <motion.div
          className="absolute inset-0 preserve-3d"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
        >
          {/* Front */}
          <div className="absolute inset-0 backface-hidden bg-white/[0.04] border border-white/10 rounded-3xl p-10 flex flex-col items-center justify-center text-center">
            <span className="absolute top-4 left-4 text-xs font-semibold tracking-wider text-indigo-400 uppercase">Front</span>
            <h3 className="text-2xl font-medium">{cards[currentIdx].front}</h3>
            <p className="absolute bottom-6 text-sm text-gray-500">Click or press Space to flip</p>
          </div>

          {/* Back */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-indigo-900/20 border border-indigo-500/30 rounded-3xl p-10 flex flex-col items-center justify-center text-center">
            <span className="absolute top-4 left-4 text-xs font-semibold tracking-wider text-violet-400 uppercase">Back</span>
            <p className="text-xl text-gray-200">{cards[currentIdx].back}</p>
          </div>
        </motion.div>
      </div>

      <div className="mt-8 flex items-center justify-between w-full max-w-sm">
        <button onClick={prevCard} disabled={currentIdx === 0} className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        
        {isFlipped && (
          <div className="flex space-x-2">
            <button onClick={nextCard} className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30">Review again</button>
            <button onClick={nextCard} className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30">Know it</button>
          </div>
        )}

        <button onClick={nextCard} disabled={currentIdx === cards.length - 1} className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
}
