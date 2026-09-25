import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import Home from '../pages/Home';
import Summary from '../pages/Summary';
import ModelComparisonPage from '../pages/ModelComparisonPage';
import Prediction from '../pages/Prediction';
import HowItWorks from '../pages/HowItWorks';
import Performance from '../pages/Performance';
import History from '../pages/History';
import About from '../pages/About';
import Contact from '../pages/Contact';
import NotFound from '../pages/NotFound';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

function AnimatedPage({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<AnimatedPage><Home /></AnimatedPage>} />
        <Route path="/summary" element={<AnimatedPage><Summary /></AnimatedPage>} />
        <Route path="/model-comparison" element={<AnimatedPage><ModelComparisonPage /></AnimatedPage>} />
        <Route path="/models" element={<Navigate to="/model-comparison" replace />} />
        <Route path="/dashboard" element={<Navigate to="/prediction" replace />} />
        <Route path="/prediction" element={<AnimatedPage><Prediction /></AnimatedPage>} />
        <Route path="/how-it-works" element={<AnimatedPage><HowItWorks /></AnimatedPage>} />
        <Route path="/performance" element={<AnimatedPage><Performance /></AnimatedPage>} />
        <Route path="/history" element={<AnimatedPage><History /></AnimatedPage>} />
        <Route path="/dataset" element={<Navigate to="/history" replace />} />
        <Route path="/about" element={<AnimatedPage><About /></AnimatedPage>} />
        <Route path="/contact" element={<AnimatedPage><Contact /></AnimatedPage>} />
        <Route path="*" element={<AnimatedPage><NotFound /></AnimatedPage>} />
      </Routes>
    </AnimatePresence>
  );
}
