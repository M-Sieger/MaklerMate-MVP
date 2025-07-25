// index.js – Einstiegspunkt der App
import './styles/button.css';
import './index.css'; // globales Styling
import './fonts.css';              // ✅ Schrift aktivieren
import './styles/theme.css';       // ✅ Farbvariablen global

import React from 'react';

import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App'; // lädt alle Routen

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App /> {/* App enthält Routing-Logik */}
    </BrowserRouter>
  </React.StrictMode>
);
