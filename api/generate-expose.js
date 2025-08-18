// 📄 /api/generate-expose.js
// Vercel Serverless: schützt OPENAI_API_KEY und prüft Supabase-Session.
// Nutzt dynamic import, damit keine "type: module"-Änderung nötig ist.

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    // 🔐 Access Token aus Header
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Missing access token' });

    // 🧩 Supabase client (dynamic import → funktioniert auch ohne ESM-Flag)
    const { createClient } = await import('@supabase/supabase-js');

    const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    // 👤 Session prüfen
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData?.user) return res.status(401).json({ error: 'Invalid session' });

    // 📥 Prompt
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { prompt } = body || {};
    if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

    if (!OPENAI_API_KEY) return res.status(500).json({ error: 'OPENAI_API_KEY not configured' });

    // 🧠 OpenAI
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You write German real estate exposés.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!openaiRes.ok) {
      const details = await openaiRes.text();
      return res.status(openaiRes.status).json({ error: 'OpenAI error', details });
    }

    const data = await openaiRes.json();
    const text = data?.choices?.[0]?.message?.content ?? '';
    return res.status(200).json({ ok: true, text });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Server error', details: String(e?.message || e) });
  }
}