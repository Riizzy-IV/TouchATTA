import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';

const ALLOWED_HOSTS = ['catalog.zimbel.com.br', 'zimbel.touchatta.com.br', 'zimbel.vercel.app', 'localhost'];
if (!ALLOWED_HOSTS.includes(window.location.hostname)) {
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
