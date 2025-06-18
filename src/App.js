// React-Bibliothek importieren
import React from 'react';

// Importiere Routing-Komponenten für verschachtelte Pfade
import {
  Route,
  Routes,
} from 'react-router-dom';

// Layout enthält Navbar + <Outlet /> für Seiteninhalte
import Layout from './components/Layout';
import CRMTool from './pages/CRMTool';
import ExposeTool from './pages/ExposeTool';
// Die Seiten (Pages), die in deinem Projekt verwendet werden
import Home from './pages/Home';

const App = () => {
  return (
    // 🔁 Definiere alle Routen deiner App
    <Routes>

      {/* 🌐 Haupt-Layout-Route: alles, was "/" oder darunter ist */}
      {/* Layout enthält die Navbar und ein <Outlet /> für Seiteninhalt */}
      <Route path="/" element={<Layout />}>

        {/* 🏠 Startseite (Home.jsx), wird bei "/" geladen */}
        <Route index element={<Home />} />

        {/* 📇 CRM Tool – erreichbar unter "/crm" */}
        <Route path="crm" element={<CRMTool />} />

        {/* 📄 Exposé Tool – erreichbar unter "/expose" */}
        <Route path="expose" element={<ExposeTool />} />

      </Route>
    </Routes>
  );
};

export default App;
