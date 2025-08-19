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

const root = ReactDOM.createRoot(document.getElementById('root'));
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
