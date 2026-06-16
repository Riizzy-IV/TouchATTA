import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';

const ALLOWED_HOST = 'showcase.zimbel.com.br';
if (window.location.hostname !== ALLOWED_HOST && window.location.hostname !== 'localhost') {
  document.body.innerHTML = '';
  throw new Error('Unauthorized');
}

document.addEventListener('contextmenu', e => e.preventDefault());

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
