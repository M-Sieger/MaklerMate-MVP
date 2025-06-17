import React from 'react';

export default function GPTOutputBox({ gptOutput, selectedStyle, onCopy }) {
  return (
    <div className="gpt-output-container">
      <div className="output-header">
        <h3>GPT-Textvorschau</h3>
        <span className="style-badge">{selectedStyle}</span>
      </div>
      <pre className="output-text">{gptOutput}</pre>
      <button onClick={onCopy}>📋 Text kopieren</button>
    </div>
  );
}
