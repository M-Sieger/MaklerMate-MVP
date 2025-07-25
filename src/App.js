// 📄 App.js – Zentrale Routing-Konfiguration + globales Theme-Styling

// ✅ Globales Styling & Fonts laden
import './fonts.css';       // 🔤 Schriftarten (Manrope)
import './styles/theme.css'; // 🎨 Farbvariablen & UI-Standards

import React from 'react';

// ✅ react-hot-toast für elegantes Toast-Feedback
import { Toaster } from 'react-hot-toast';
import {
  Route,
  Routes,
} from 'react-router-dom';

// 🔁 Layout enthält Navbar + Footer + <Outlet />
import Layout from './components/Layout';
// 🧩 Seiten
import CRMTool from './pages/CRM/CRMTool';     // 📇 CRM
import ExposeTool from './pages/ExposeTool';   // 🧾 Exposé-Generator
import Home from './pages/Home';               // 🏠 Startseite

const App = () => {
  return (
    <>
      {/* 🔀 Router mit Layout als Wrapper */}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />               {/* 🏠 Startseite */}
          <Route path="crm" element={<CRMTool />} />       {/* 📇 CRM */}
          <Route path="expose" element={<ExposeTool />} /> {/* 🧾 Exposé */}
        </Route>
      </Routes>

      {/* 🔔 Globale Toast-Anzeige für alle Feedback-Meldungen */}
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 2000,
          style: {
            background: '#222', // 🍏 edler, dezenter
            color: '#f1f1f1',
            borderRadius: '12px',
            fontFamily: 'Manrope, sans-serif',
          },
        }}
      />
    </>
  );
};

export default App;
