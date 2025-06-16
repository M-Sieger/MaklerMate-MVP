import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdToolHub.css';

export default function AdToolHub() {
  const navigate = useNavigate();

  return (
    <div className="adtoolhub">
      <h1>AdTool Hub 🧠</h1>
      <p>Wähle deinen Werbetext-Typ für zielgerichtete GPT-Ergebnisse:</p>

      <div className="category-grid">

        <div className="category-card" onClick={() => navigate('/ads/online')}>
          <div className="icon">🎯</div>
          <h3>Online-Werbung</h3>
          <p>Google Ads, Instagram Ads & Social Posts.</p>
          <button>Jetzt starten</button>
        </div>

        <div className="category-card" onClick={() => navigate('/ads/email')}>
          <div className="icon">✉️</div>
          <h3>E-Mail & Funnels</h3>
          <p>Betreffzeilen, Sequenzen & Launch-Mails.</p>
          <button>Jetzt schreiben</button>
        </div>

        <div className="category-card" onClick={() => navigate('/ads/claim')}>
          <div className="icon">🧱</div>
          <h3>Claims & Branding</h3>
          <p>Slogans, Markenclaims & Positionierung.</p>
          <button>Jetzt starten</button>
        </div>

        <div className="category-card" onClick={() => navigate('/ads/sales')}>
          <div className="icon">📣</div>
          <h3>Pitch / B2B / Sales</h3>
          <p>Value Props, Angebots-Texte, Decks.</p>
          <button>Jetzt schreiben</button>
        </div>

        <div className="category-card" onClick={() => navigate('/ads/video')}>
          <div className="icon">📺</div>
          <h3>Script & Video</h3>
          <p>TikTok, Reels, YouTube Hook & Skript.</p>
          <button>Jetzt texten</button>
        </div>

        <div className="category-card" onClick={() => navigate('/ads/press')}>
          <div className="icon">📰</div>
          <h3>Presse & PR</h3>
          <p>Mitteilungen, Ankündigungen, Brand-News.</p>
          <button>Jetzt schreiben</button>
        </div>

      </div>
    </div>
  );
}
