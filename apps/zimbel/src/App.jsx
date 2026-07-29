import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
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
      <Routes>
        <Route path="*" element={<Home />} />
      </Routes>
    </ScaleWrapper>
  );
}
