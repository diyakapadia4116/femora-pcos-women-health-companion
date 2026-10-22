import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { pingBackend } from './services/api.js';

// Pre-warm the Render backend on app load (prevents 30s cold-start delay on first real request)
pingBackend();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
