// server/gpt-proxy.js

import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// 🧠 GPT-Proxy-Endpunkt
app.post('/api/gpt', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt fehlt' });
  }

  try {
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

    res.json({ result: text.trim() });
  } catch (err) {
    console.error("❌ GPT-Proxy-Fehler:", err);
    res.status(500).json({ error: "GPT-Proxy failed" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ GPT-Proxy läuft auf http://localhost:${PORT}`);
});
