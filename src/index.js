// Globale CSS-Datei (optional, für Reset & Basisstyles)
import './index.css';

// React und ReactDOM importieren
import React from 'react';

import ReactDOM from 'react-dom/client';
// Importiere die Router-Komponenten von React Router v6+
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

// Hauptkomponente der App (dort wird das Routing definiert)
import App from './App';

// 📌 Erstelle den Router mit den Pfaden und Komponenten
// Aktuell zeigen wir nur "/" auf <App />
const router = createBrowserRouter([
  {
    path: '/',       // URL-Pfad
    element: <App /> // Komponente, die bei diesem Pfad geladen wird
  }
]);

// 🔁 Rendern der gesamten App in das HTML-Element mit ID "root"
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* RouterProvider verbindet den Router mit der App */}
    <RouterProvider router={router} />
  </React.StrictMode>
);
