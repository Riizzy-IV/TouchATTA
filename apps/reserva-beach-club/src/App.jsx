import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { TransitionProvider } from '@showcase/core';
import ScaleWrapper from './components/ScaleWrapper/ScaleWrapper';
import Splash from './pages/Splash/Splash';
import Home from './pages/Home/Home';
import Localizacao from './pages/Localizacao/Localizacao';
import Projeto from './pages/Projeto/Projeto';
import Galeria from './pages/Galeria/Galeria';
import Socio from './pages/Socio/Socio';

export default function App() {
  const [started, setStarted] = useState(false);

  if (!started) {
    return <Splash onStart={() => setStarted(true)} />;
  }

  return (
    <ScaleWrapper>
      <TransitionProvider logoSrc="/img/logo.svg" overlayColor="#141412" logoOnDark>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/modulo/02" element={<Localizacao />} />
          <Route path="/modulo/03" element={<Projeto />} />
          <Route path="/modulo/04" element={<Galeria />} />
          <Route path="/modulo/05" element={<Socio />} />
        </Routes>
      </TransitionProvider>
    </ScaleWrapper>
  );
}
