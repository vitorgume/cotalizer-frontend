import './index.css'
import App from './App.tsx'
import { api, hydrateAccessToken } from './utils/axios.ts';
import ReactDOM from 'react-dom/client';
import React from 'react';

async function bootstrap() {
  try {
    await Promise.allSettled([
      hydrateAccessToken(),
      api.get('/csrf') 
    ]);
  } finally {
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
}

bootstrap();
