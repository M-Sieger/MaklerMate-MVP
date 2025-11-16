/**
 * @fileoverview Environment Variable Validation
 *
 * ZWECK:
 * - Prüft erforderliche ENV-Variablen
 * - Verhindert Runtime-Fehler durch Missing-Config
 * - Hilfreiche Fehlermeldungen
 *
 * AUTOR: Liberius (MaklerMate MVP)
 * STATUS: 🟢 Production-Ready (TypeScript Migration)
 */

/**
 * ENV Info Object
 */
export interface EnvInfo {
  nodeEnv: string | undefined;
  hasSupabaseUrl: boolean;
  hasSupabaseKey: boolean;
  isVercel: boolean;
  isDevelopment: boolean;
  isProduction: boolean;
}

/**
 * Validiert erforderliche Umgebungsvariablen
 *
 * @throws Error wenn erforderliche Variablen fehlen
 */
export function validateEnvironment(): void {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 🔑 Required: Supabase-Konfiguration
  if (!process.env.REACT_APP_SUPABASE_URL) {
    errors.push('REACT_APP_SUPABASE_URL ist nicht gesetzt');
  }

  if (!process.env.REACT_APP_SUPABASE_ANON_KEY) {
    errors.push('REACT_APP_SUPABASE_ANON_KEY ist nicht gesetzt');
  }

  // ⚠️ Optional aber empfohlen: OpenAI-Konfiguration
  const isProduction = process.env.NODE_ENV === 'production';
  const isVercelDeploy = process.env.VERCEL === '1';

  if (isProduction && !isVercelDeploy) {
    if (
      !process.env.REACT_APP_OPENAI_API_KEY &&
      !process.env.OPENAI_API_KEY
    ) {
      warnings.push(
        'Keine OpenAI API-Konfiguration gefunden. ' +
          'Exposé-Generierung funktioniert nur über Vercel Functions.'
      );
    }
  }

  // 🚨 Fehler werfen wenn kritische Variablen fehlen
  if (errors.length > 0) {
    const errorMessage = [
      '❌ Fehlende Umgebungsvariablen:',
      ...errors.map((e) => `  - ${e}`),
      '',
      '💡 Tipp: Erstelle eine .env Datei im Projekt-Root mit:',
      '  REACT_APP_SUPABASE_URL=your-supabase-url',
      '  REACT_APP_SUPABASE_ANON_KEY=your-anon-key',
      '',
      '📚 Mehr Infos: Siehe README.md oder .env.example',
    ].join('\n');

    throw new Error(errorMessage);
  }

  // ⚠️ Warnungen im Development-Mode ausgeben
  if (warnings.length > 0 && process.env.NODE_ENV === 'development') {
    console.warn('⚠️ Umgebungsvariablen-Warnungen:');
    warnings.forEach((w) => console.warn(`  - ${w}`));
  }

  // ✅ Erfolgreich validiert
  if (process.env.NODE_ENV === 'development') {
    console.log('✅ Umgebungsvariablen validiert');
  }
}

/**
 * Gibt sichere (nicht-sensitive) ENV-Infos für Debugging zurück
 *
 * @returns ENV Info Object
 */
export function getEnvInfo(): EnvInfo {
  return {
    nodeEnv: process.env.NODE_ENV,
    hasSupabaseUrl: !!process.env.REACT_APP_SUPABASE_URL,
    hasSupabaseKey: !!process.env.REACT_APP_SUPABASE_ANON_KEY,
    isVercel: process.env.VERCEL === '1',
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
  };
}
