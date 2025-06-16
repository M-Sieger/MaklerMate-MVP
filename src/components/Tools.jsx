import React from 'react';
import '../styles/Tools.css';

const Tools = () => (
  <section id="tools" className="tools">
    <div className="tool">
      <h2>Werbetext-Generator</h2>
      <form id="form1">
        <input type="text" placeholder="Produktbeschreibung eingeben..." />
        <button type="submit">Generieren</button>
      </form>
      <div id="output1" className="output"></div>
    </div>

    <div className="tool">
      <h2>Exposé-Generator (Immobilie)</h2>
      <form id="form2">
        <textarea placeholder="Immobiliendetails eingeben..."></textarea>
        <button type="submit">Exposé erstellen</button>
      </form>
      <div id="output2" className="output"></div>
    </div>

    <div className="tool">
      <h2>HR-Bewerbungsanalyse</h2>
      <form id="form3">
        <textarea placeholder="Bewerbungstext eingeben..."></textarea>
        <button type="submit">Analysieren</button>
      </form>
      <div id="output3" className="output"></div>
    </div>
  </section>
);

export default Tools;
