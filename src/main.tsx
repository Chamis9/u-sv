
import { createRoot } from 'react-dom/client'
import React from 'react'
import App from './App.tsx'
import './index.css'
import { HelmetProvider } from 'react-helmet-async'

const root = createRoot(document.getElementById("root")!);

// Use StrictMode only in development
if (import.meta.env.DEV) {
  root.render(
    <React.StrictMode>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </React.StrictMode>
  );
} else {
  root.render(
    <HelmetProvider>
      <App />
    </HelmetProvider>
  );
}
