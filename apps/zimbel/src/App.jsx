import { Routes, Route } from 'react-router-dom';
import ScaleWrapper from './components/ScaleWrapper/ScaleWrapper';
import Home from './pages/Home/Home';

export default function App() {
  return (
    <ScaleWrapper>
      <Routes>
        <Route path="*" element={<Home />} />
      </Routes>
    </ScaleWrapper>
  );
}
