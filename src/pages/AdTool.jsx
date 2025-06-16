import React, { useState } from 'react';
import '../styles/AdTool.css';
import { fetchAdText } from '../api/openai';




const TEXTTYPES = [
  { label: '🧠 Social Media Ad (Instagram)', value: 'social_ad_instagram' },
  { label: '🔍 Google Ads Headline + CTA', value: 'google_ad' },
  { label: '🛍️ Produktbeschreibung (SEO)', value: 'product_description' },
  { label: '🧭 Landingpage Benefittext', value: 'landingpage' },
  { label: '📨 Newsletter-Teaser', value: 'newsletter' }
];

export default function AdTool() {
  const [input, setInput] = useState('');
  const [textType, setTextType] = useState(TEXTTYPES[0].value);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) {
      setError('Bitte gib eine Beschreibung ein.');
      return;
    }
    setLoading(true);
    setError('');
    setOutput('');

    try {
      const result = await fetchAdText(input, textType);
      setOutput(result);
    } catch (err) {
      setError('Fehler bei der Anfrage.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adtool-container">
      <h1>Werbetext-Generator</h1>
      <form onSubmit={handleSubmit}>
        <label>Textformat auswählen:</label>
        <select value={textType} onChange={(e) => setTextType(e.target.value)}>
          {TEXTTYPES.map((type) => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Beschreibe dein Produkt oder deine Dienstleistung..."
          rows={4}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Generiere...' : 'Werbetext erstellen'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {output && (
        <div className="output-box">
          <h3>Dein Werbetext:</h3>
          <p>{output}</p>
        </div>
      )}
    </div>
  );
}
