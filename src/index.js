import './index.css';

// 📄 src/index.js — Parent mit "/*", plus geschützte /expose & /profile Routen
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
import ProtectedRoute from './routes/ProtectedRoute';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* WICHTIG: "/*" erlaubt tieferes Matching, falls App weitere <Routes> rendert */}
          <Route path="/*" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/expose" element={<ExposeTool />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
