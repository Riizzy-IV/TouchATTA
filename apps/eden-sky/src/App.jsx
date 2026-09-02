import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { TransitionProvider } from '@showcase/core';
import ScaleWrapper from './components/ScaleWrapper/ScaleWrapper';
import Splash from './pages/Splash/Splash';
import Home from './pages/Home/Home';
import AreasComuns from './pages/AreasComuns/AreasComuns';
import Projeto from './pages/Projeto/Projeto';

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
          <Route path="/modulo/03" element={<Projeto />} />
          <Route path="/modulo/04" element={<AreasComuns />} />
        </Routes>
      </TransitionProvider>
    </ScaleWrapper>
  );
}
