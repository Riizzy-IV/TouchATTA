import { Routes, Route } from 'react-router-dom';
import { TransitionProvider } from '@showcase/core';
import ScaleWrapper from './components/ScaleWrapper/ScaleWrapper';
import Home from './pages/Home/Home';
import Localizacao from './pages/Localizacao/Localizacao';
import Projeto from './pages/Projeto/Projeto';

export default function App() {
  return (
    <ScaleWrapper>
      <TransitionProvider logoSrc="/img/logo.png" overlayColor="#f5f0e8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/modulo/02" element={<Localizacao />} />
          <Route path="/modulo/03" element={<Projeto />} />
        </Routes>
      </TransitionProvider>
    </ScaleWrapper>
  );
}
