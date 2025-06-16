import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AdTool from './pages/AdTool';
import ExposeTool from './pages/ExposeTool';
import HRTool from './pages/HRTool';
import './styles/Navbar.css';
import AdToolHub from './pages/AdToolHub';
import OnlineAdsTool from './pages/OnlineAdsTool';

import EmailFunnelsTool from './pages/EmailFunnelsTool';
import ClaimTool from './pages/ClaimTool';
import ScriptVideoTool from './pages/ScriptVideoTool';
import PressPRTool from './pages/PressPRTool';
import B2BSalesTool from './pages/B2BSalesTool';
import './styles/DesignTheme.css';
import './styles/Tabs.css'; // falls du Tabs nicht nur aus TabbedForm importierst

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tools/ad" element={<AdTool />} />
        <Route path="/tools/expose" element={<ExposeTool />} />
        <Route path="/tools/hr" element={<HRTool />} />
        <Route path="/ads" element={<AdToolHub />} />
        <Route path="/ads/online" element={<OnlineAdsTool />} />
        <Route path="/ads/email" element={<EmailFunnelsTool />} />
        <Route path="/ads/claim" element={<ClaimTool />} />
        <Route path="/ads/video" element={<ScriptVideoTool />} />
        <Route path="/ads/press" element={<PressPRTool />} />
        <Route path="/ads/sales" element={<B2BSalesTool />} />
      </Routes>
    </Router>
  );
}

export default App;
