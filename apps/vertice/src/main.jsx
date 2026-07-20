import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';

const ALLOWED_HOSTS = ['showcase.zimbel.com.br', 'touchatta.zimbel.com.br', 'localhost'];
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
