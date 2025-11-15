// 📄 Footer.tsx – Fixierter Footer im Apple-Glasmorph-Stil

import './Footer.css';

import React from 'react';

import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <p>
        © 2025 <strong>MaklerMate</strong> · powered by GPT ·{' '}
        <Link to="/impressum" className="footerLink">Impressum</Link>
      </p>
    </footer>
  );
}
