// App.js – Definiert das Routing & verbindet Seiten mit Layout

import React from 'react';

import {
  Route,
  Routes,
} from 'react-router-dom';

// 🔁 Layout enthält Navbar + <Outlet /> für darunterliegende Seiten
import Layout from './components/Layout';
import CRMTool from './pages/CRM/CRMTool';
import ExposeTool
  from './pages/ExposeTool'; // ggf. anpassen, falls du die Exposé-Seite außerhalb von /CRM hast
// 🧩 Seiten, die im Layout geladen werden sollen
import Home from './pages/Home';

const App = () => {
  return (
    <Routes>
      {/* 🌐 Haupt-Route mit Layout (z. B. Navbar, Footer, etc.) */}
      <Route path="/" element={<Layout />}>

        {/* 🏠 Startseite – geladen bei genau "/" */}
        <Route index element={<Home />} />

        {/* 📇 CRM Tool – erreichbar über /crm */}
        <Route path="crm" element={<CRMTool />} />

        {/* 📄 Exposé Tool – erreichbar über /expose */}
        <Route path="expose" element={<ExposeTool />} />

      </Route>
    </Routes>
  );
};

export default App;
