import { useState, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { TransitionProvider } from '@showcase/core';
import Home from './pages/Home/Home';

const Mod01 = lazy(() => import('./pages/Mod01/Mod01'));

function MainApp() {
  const [started, setStarted] = useState(false);
  return (
    <TransitionProvider logoSrc="/img/logo.png" overlayColor="#ffffff">
      {/* TODO: adicionar WelcomeModal do cliente B */}
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/modulo/01" element={<Mod01 />} />
        </Routes>
      </Suspense>
    </TransitionProvider>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="*" element={<MainApp />} />
    </Routes>
  );
}
