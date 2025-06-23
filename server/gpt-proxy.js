// Datei: gpt-proxy.js

const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const https = require('https');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// 🧠 GPT-Proxy-Endpunkt
app.post('/api/gpt', (req, res) => {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', () => {
    try {
      const parsed = JSON.parse(body);
      const { prompt } = parsed;

      if (!prompt) {
        return res.status(400).json({ error: 'Prompt fehlt' });
      }

      const requestData = JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 300,
      });

      const options = {
        hostname: 'api.openai.com',
        path: '/v1/chat/completions',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(requestData)
        }
      };

      const apiReq = https.request(options, (apiRes) => {
        let apiBody = '';

        apiRes.on('data', (chunk) => {
          apiBody += chunk;
        });

        apiRes.on('end', () => {
          try {
            const data = JSON.parse(apiBody);
            console.log("📦 RAW API-Antwort:", JSON.stringify(data, null, 2));

            const text = data?.choices?.[0]?.message?.content;

            if (!text) {
              throw new Error("Antwort leer – vollständige Antwort siehe Konsole");
            }

            // ✅ Korrekte Antwort senden
            res.json({ result: text.trim() });
          } catch (parseErr) {
            console.error("❌ Fehler beim Parsen der API-Antwort:", parseErr);
            res.status(500).json({ error: "Ungültige Antwort vom GPT-Server" });
          }
        });
      });

      apiReq.on('error', (e) => {
        console.error("❌ GPT-Proxy-Fehler:", e);
        res.status(500).json({ error: "GPT-Proxy failed" });
      });

      apiReq.write(requestData);
      apiReq.end();
    } catch (err) {
      console.error("❌ Fehler beim JSON-Parsing:", err);
      res.status(400).json({ error: "Ungültige JSON-Daten im Request" });
    }
  });
});

app.listen(PORT, () => {
  console.log(`✅ GPT-Proxy läuft auf http://localhost:${PORT}`);
});
