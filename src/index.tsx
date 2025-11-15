import './index.css';

import React from 'react';

import ReactDOM from 'react-dom/client';
import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom';

import App from './App';
import { AuthProvider } from './context/AuthContext';
import ExposeTool from './pages/ExposeTool';
import Login from './pages/Login';
import Profile from './pages/Profile';
import AppShell from './routes/AppShell';
import ProtectedRoute from './routes/ProtectedRoute';
import { validateEnvironment } from './utils/validateEnv';

// 🔐 Validiere Umgebungsvariablen vor App-Start
try {
  validateEnvironment();
} catch (error) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error(errorMessage);

  // Zeige Fehler im Browser wenn kritische Variablen fehlen
  document.body.innerHTML = `
    <div style="
      font-family: 'Courier New', monospace;
      padding: 2rem;
      max-width: 800px;
      margin: 2rem auto;
      background: #fff3cd;
      border: 2px solid #856404;
      border-radius: 8px;
    ">
      <h2 style="color: #856404; margin-top: 0;">⚠️ Konfigurationsfehler</h2>
      <pre style="
        white-space: pre-wrap;
        background: #fff;
        padding: 1rem;
        border-radius: 4px;
        border: 1px solid #ddd;
      ">${errorMessage}</pre>
    </div>
  `;
  throw error;
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Login bewusst ohne Header */}
          <Route path="/login" element={<Login />} />

          {/* Deine bestehende Landing/App bleibt wie sie ist */}
          <Route path="/*" element={<App />} />

          {/* Geschützte Seiten: immer mit Header */}
          <Route element={<AppShell />}>
            <Route element={<ProtectedRoute />}>
              <Route path="/expose" element={<ExposeTool />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
