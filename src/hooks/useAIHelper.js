// 📂 src/hooks/useAIHelper.js

import { useState } from 'react';

import toast from 'react-hot-toast'; // ✅ User-Feedback bei Fehlern

// 🔁 GPT-Hook – sendet Prompt an GPT-4o Proxy und liefert Ergebnis zurück
export default function useAIHelper() {
  // 🌀 Ladeindikator, um Buttons zu deaktivieren oder Spinner zu zeigen
  const [isLoading, setIsLoading] = useState(false);

  // 🧠 Hauptfunktion: Prompt senden → GPT-Antwort holen
  const fetchGPT = async (prompt) => {
    setIsLoading(true); // Ladezustand aktivieren

    try {
      const res = await fetch('/api/gpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error(`Fehler beim Abrufen: ${res.status}`);
      }

      const data = await res.json();

      // ✅ GPT-Antwort zurückgeben (z. B. Follow-Up-Text)
      return data.result;
    } catch (err) {
      console.error('GPT API Fehler:', err);
      toast.error('GPT-Generierung fehlgeschlagen.'); // 🔔 Benutzerfeedback
      return null;
    } finally {
      setIsLoading(false); // Ladezustand zurücksetzen
    }
  };

  // 📦 Rückgabe: GPT-Funktion + Ladeindikator
  return { fetchGPT, isLoading };
}
