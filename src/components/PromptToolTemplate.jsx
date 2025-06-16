import React, { useState } from 'react';
import TabbedForm from './TabbedForm';
import '../styles/AdTool.css';

export default function PromptToolTemplate({
  title = 'GPT Tool',
  formats,
  extraTabs = [],
  apiFunction,
  useTabs = false
}) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFormat, setSelectedFormat] = useState(formats ? formats[0].value : '');
  const [extras, setExtras] = useState({});

  const handleChangeExtra = (e) => {
    setExtras({ ...extras, [e.target.name]: e.target.value });
  };

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
      const payload = { input, format: selectedFormat, ...extras };
      const result = await apiFunction(payload);
      setOutput(result);
    } catch (err) {
      setError('Fehler bei der GPT-Anfrage.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  const renderTabs = () => {
    const tabs = extraTabs.map(tab => ({
      label: tab.label,
      content: (
        <div className="tab-fields">
          {tab.fields.map((field) => (
            <div key={field.name}>
              <label>{field.label}</label>
              <input
                name={field.name}
                type="text"
                placeholder={field.label}
                onChange={handleChangeExtra}
              />
            </div>
          ))}
        </div>
      )
    }));

    return <TabbedForm tabs={tabs} />;
  };

  return (
    <div className="adtool-container">
      <h1>{title}</h1>
      <form onSubmit={handleSubmit}>
        {formats && (
          <>
            <label>Textformat auswählen:</label>
            <select value={selectedFormat} onChange={(e) => setSelectedFormat(e.target.value)}>
              {formats.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </>
        )}

        {useTabs && extraTabs.length > 0 && renderTabs()}

        <label>Zusätzliche Beschreibung / Notizen:</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Beschreibe dein Produkt oder Anliegen..."
          rows={5}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Generiere...' : 'Text erstellen'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {output && (
        <div className="output-box">
          <h3>Ergebnis:</h3>
          <p>{output}</p>
          <button onClick={handleCopy}>📋 Kopieren</button>
        </div>
      )}
    </div>
  );
}
