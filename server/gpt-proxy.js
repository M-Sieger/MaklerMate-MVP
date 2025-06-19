// server/gpt-proxy.js

// 📦 Standard-Module im CommonJS-Stil laden
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fetch = require('node-fetch');

// 🔑 .env-Datei einlesen (z. B. für OPENAI_API_KEY)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// 🔧 Middleware aktivieren
app.use(cors());
app.use(express.json());

// 🧠 Haupt-Endpunkt: GPT-Text generieren
app.post('/api/gpt', async (req, res) => {
  const { prompt } = req.body;

  // ❌ Prompt fehlt
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt fehlt' });
  }

  try {
    // 📡 Anfrage an OpenAI senden
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content;

    if (!text) throw new Error("Antwort leer");

    // ✅ GPT-Antwort an Frontend zurückgeben
    res.json({ result: text.trim() });
  } catch (err) {
    console.error("❌ GPT-Proxy-Fehler:", err);
    res.status(500).json({ error: "GPT-Proxy failed" });
  }
});

// 🚀 Starte Server
app.listen(PORT, () => {
  console.log(`✅ GPT-Proxy läuft auf http://localhost:${PORT}`);
});
