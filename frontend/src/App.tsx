import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import StudyDashboard from './pages/StudyDashboard';

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#0a0a12] text-gray-100 font-sans selection:bg-indigo-500/30">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/20 blur-[120px]" />
      </div>

      <Navbar />
      
      <main className="relative pt-16">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/study/:id" element={<StudyDashboard />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
