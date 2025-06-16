import React from 'react';
import '../styles/Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© {new Date().getFullYear()} GPT Suite – Webtools für smarte Businesslösungen</p>
        <div className="footer-links">
          <a href="#hero">Start</a>
          <a href="#tools">Tools</a>
          <a href="/impressum">Impressum</a>
          <a href="/datenschutz">Datenschutz</a>
        </div>
      </div>
    </footer>
  );
}
