// 📄 src/index.js
// Zweck: App-Entry. Bindet den globalen AuthProvider ein und richtet die Routen ein.
// Hinweis: Wir halten die Routen minimal, damit dein bestehendes <App/> nicht zerschossen wird.

import './index.css';

import React from 'react';

import ReactDOM from 'react-dom/client';
import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom';

import App from './App';                    // deine Haupt-App-Shell
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';          // die Login-Seite

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* 🏠 App: enthält deine bestehenden Seiten/Navigation */}
          <Route path="/" element={<App />} />

          {/* 🔐 Login separat erreichbar */}
          <Route path="/login" element={<Login />} />

          {/* ✅ Beispiel: falls du eine komplette Seite schützen willst
              → Child-Routen unter ProtectedRoute legen.
              Aktuell auskommentiert, damit nichts bricht.
          */}
          {/*
          <Route element={<ProtectedRoute />}>
            <Route path="/expose" element={<YourExposePageComponent />} />
          </Route>
          */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
