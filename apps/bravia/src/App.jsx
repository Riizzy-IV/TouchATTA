import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { TransitionProvider } from '@showcase/core';
import { PreloadProvider } from './context/PreloadContext';
import ScaleWrapper from './components/ScaleWrapper/ScaleWrapper';
import Splash from './pages/Splash/Splash';
import Home from './pages/Home/Home';
import Localizacao from './pages/Localizacao/Localizacao';
import Projeto from './pages/Projeto/Projeto';
import Galeria from './pages/Galeria/Galeria';

export default function App() {
  const [started, setStarted] = useState(false);

  if (!started) {
    return <Splash onStart={() => setStarted(true)} />;
  }

  return (
    <ScaleWrapper>
      <TransitionProvider logoSrc="/img/bravia-simbolo-preto.svg" overlayColor="#E5E2DD">
        <PreloadProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/localizacao" element={<Localizacao />} />
            <Route path="/projeto" element={<Projeto />} />
            <Route path="/galeria" element={<Galeria />} />
          </Routes>
        </PreloadProvider>
      </TransitionProvider>
    </ScaleWrapper>
  );
}
