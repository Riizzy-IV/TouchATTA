import { useState, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { TransitionProvider } from '@showcase/core';
import ScaleWrapper from './components/ScaleWrapper/ScaleWrapper';
import WelcomeModal from './components/WelcomeModal/WelcomeModal';
import Home from './pages/Home/Home';

const Mod02 = lazy(() => import('./pages/Mod02/Mod02'));
const Mod03 = lazy(() => import('./pages/Mod03/Mod03'));
const Mod04 = lazy(() => import('./pages/Mod04/Mod04'));

const isEmbedded = new URLSearchParams(window.location.search).has('embed');

export default function App() {
  const [started, setStarted] = useState(isEmbedded);

  return (
    <ScaleWrapper>
      <TransitionProvider>
        {!started && <WelcomeModal onStart={() => setStarted(true)} />}
        {started && (
          <Suspense fallback={null}>
            <Routes>
              <Route path="/"          element={<Home />} />
              <Route path="/modulo/02" element={<Mod02 />} />
              <Route path="/modulo/03" element={<Mod03 />} />
              <Route path="/modulo/04" element={<Mod04 />} />
            </Routes>
          </Suspense>
        )}
      </TransitionProvider>
    </ScaleWrapper>
  );
}
