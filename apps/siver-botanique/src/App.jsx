import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { TransitionProvider } from '@showcase/core';
import ScaleWrapper from './components/ScaleWrapper/ScaleWrapper';
import Splash from './pages/Splash/Splash';
import Home from './pages/Home/Home';
import Localizacao from './pages/Localizacao/Localizacao';
import Projeto from './pages/Projeto/Projeto';
import AreasComuns from './pages/AreasComuns/AreasComuns';
import Unidades from './pages/Unidades/Unidades';

export default function App() {
  const [started, setStarted] = useState(false);

  if (!started) {
    return <Splash onStart={() => setStarted(true)} />;
  }

  return (
    <ScaleWrapper>
      <TransitionProvider logoSrc="/img/logo.avif" overlayColor="#f5f0e8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/modulo/02" element={<Localizacao />} />
          <Route path="/modulo/03" element={<Projeto />} />
          <Route path="/modulo/04" element={<AreasComuns />} />
          <Route path="/modulo/05" element={<Unidades />} />
        </Routes>
      </TransitionProvider>
    </ScaleWrapper>
  );
}
