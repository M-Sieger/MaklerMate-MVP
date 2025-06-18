// Home.jsx – Startseite mit ToolCards zur Auswahl der Tools

import React from 'react';

import ToolCards
  from '../components/ToolCards'; // Cards mit z. B. Exposé, CRM etc.

const Home = () => {
  return (
    <div>
      {/* Hauptüberschrift */}
      <h1>🏠 Willkommen bei MaklerMate</h1>
      
      {/* Kurzbeschreibung */}
      <p>Wähle eines der folgenden Tools:</p>

      {/* Einbindung der ToolCards-Komponente */}
      <ToolCards />
    </div>
  );
};

export default Home;
