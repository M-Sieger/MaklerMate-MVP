// server/gpt-proxy.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.post("/api/gpt", async (req, res) => {
  const prompt = req.body.prompt;
  if (!prompt) return res.status(400).json({ error: "Prompt fehlt" });

  try {
    const result = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.json({ result: result.data.choices[0].message.content });
  } catch (err) {
    console.error("❌ Fehler bei OpenAI:", err.response?.data || err.message);
    return res.status(500).json({ error: "GPT-Proxy-Fehler" });
  }
});

app.listen(PORT, () => {
  console.log(`🧠 GPT-Proxy läuft auf http://localhost:${PORT}`);
});
