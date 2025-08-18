// 📄 src/lib/supabaseClient.js
// Zweck: Zentrale Supabase-Instanz für das Frontend (Vite).
// Hinweis: VITE_ Prefix ist Pflicht, sonst liest Vite die Variablen nicht ein.

import { createClient } from '@supabase/supabase-js';

// 🔐 Diese Werte kommen aus Vercel (Project → Settings → Environment Variables)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 🧠 Einmalig erzeugen und in der App wiederverwenden
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
