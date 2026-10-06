import React from 'react';
import ReactDOM from 'react-dom/client';
import { KivraProvider } from './state/kivraStore';
import { AppShell } from './app/AppShell';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <KivraProvider>
      <AppShell />
    </KivraProvider>
  </React.StrictMode>
);
