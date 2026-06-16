import { useState, lazy, Suspense } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { Routes, Route } from 'react-router-dom';
import { TransitionProvider } from '@showcase/core';
import ScaleWrapper from './components/ScaleWrapper/ScaleWrapper';
import WelcomeModal from './components/WelcomeModal/WelcomeModal';
import Home from './pages/Home/Home';

const EmbedSolar = lazy(() => import('./pages/EmbedSolar/EmbedSolar'));
const Mod01 = lazy(() => import('./pages/Mod01/Mod01'));
const Mod02 = lazy(() => import('./pages/Mod02/Mod02'));
const Mod03 = lazy(() => import('./pages/Mod03/Mod03'));
const Mod04 = lazy(() => import('./pages/Mod04/Mod04'));
const Mod05 = lazy(() => import('./pages/Mod05/Mod05'));
const Mod06 = lazy(() => import('./pages/Mod06/Mod06'));
const Mod07 = lazy(() => import('./pages/Mod07/Mod07'));

function MainApp() {
  const [started, setStarted] = useState(false);
  return (
    <ScaleWrapper>
      <TransitionProvider logoSrc="/img/logo2.png" overlayColor="#e8f0f3">
        {!started && <WelcomeModal onStart={() => setStarted(true)} />}
        {started && (
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/modulo/01" element={<Mod01 />} />
              <Route path="/modulo/02" element={<Mod02 />} />
              <Route path="/modulo/03" element={<Mod03 />} />
              <Route path="/modulo/04" element={<Mod04 />} />
              <Route path="/modulo/05" element={<Mod05 />} />
              <Route path="/modulo/06" element={<Mod06 />} />
              <Route path="/modulo/07" element={<Mod07 />} />
            </Routes>
          </Suspense>
        )}
      </TransitionProvider>
    </ScaleWrapper>
  );
}

export default function App() {
  return (
    <>
      <Analytics />
      <Routes>
        <Route path="/embed/solar" element={<EmbedSolar />} />
        <Route path="*" element={<MainApp />} />
      </Routes>
    </>
  );
}
