import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { TransitionProvider } from '@showcase/core';
import ScaleWrapper from './components/ScaleWrapper/ScaleWrapper';
import Splash from './pages/Splash/Splash';
import Home from './pages/Home/Home';

export default function App() {
  const [started, setStarted] = useState(false);

  if (!started) {
    return <Splash onStart={() => setStarted(true)} />;
  }

  return (
    <ScaleWrapper>
      <TransitionProvider logoSrc="/img/emblema.avif" overlayColor="#15130f">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </TransitionProvider>
    </ScaleWrapper>
  );
}
