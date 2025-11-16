/**
 * @fileoverview App Context - Global User & Plan Context
 *
 * ZWECK:
 * - Globaler User-/Plan-State für SaaS-Integration
 * - Vorbereitung für Multi-User & Subscription-Modell
 * - Feature-Flags basierend auf Plan (Free vs. Pro)
 *
 * VERWENDUNG:
 * - In index.tsx als Provider um App gelegt
 * - Via useAppContext() Hook in Components verwenden
 *
 * MVP-STATUS:
 * - userId und plan werden aus LocalStorage gelesen (Fallback: null)
 * - Keine echte Auth-Integration (kommt in v0.2.x mit NextAuth)
 *
 * SAAS-INTEGRATION:
 * - In Next.js-Version werden userId und plan vom Host geliefert:
 *   <AppContextProvider userId={session.user.id} plan={session.user.plan}>
 *     <MaklerMateApp />
 *   </AppContextProvider>
 *
 * AUTOR: Liberius (MaklerMate MVP)
 * LETZTE ÄNDERUNG: 2025-11-16
 * STATUS: 🔧 In Preparation (SaaS Integration)
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';

// ==================== TYPES ====================

/**
 * Subscription Plans
 *
 * FEATURES:
 * - free: Basis-Features (limitiert)
 * - pro: Alle Features (unlimitiert)
 */
export type Plan = 'free' | 'pro';

/**
 * Plan-Limits
 *
 * VERWENDUNG:
 * - Limitiere Features basierend auf Plan
 * - Zeige Upgrade-Hinweise bei Limit-Erreichen
 */
export interface PlanLimits {
  /** Maximale Anzahl gespeicherter Exposés */
  maxExposes: number;

  /** Maximale Anzahl Leads im CRM */
  maxLeads: number;

  /** Maximale Anzahl Bilder pro Exposé */
  maxImagesPerExpose: number;

  /** AI-Generierungen pro Monat */
  maxAIGenerations: number;

  /** PDF-Exports pro Monat */
  maxPDFExports: number;
}

/**
 * Plan-Features
 *
 * VERWENDUNG:
 * - Feature-Flags für Plan-spezifische Funktionen
 */
export interface PlanFeatures {
  /** AI-Text-Generierung */
  aiTextGeneration: boolean;

  /** PDF-Export */
  pdfExport: boolean;

  /** CRM-Light */
  crmLight: boolean;

  /** Erweiterte Statistiken */
  advancedStats: boolean;

  /** Export/Import (JSON, CSV) */
  exportImport: boolean;

  /** Multi-Device Sync (via Supabase) */
  multiDeviceSync: boolean;

  /** Priority Support */
  prioritySupport: boolean;
}

/**
 * App Context Value Type
 */
export interface AppContextValue {
  /** User ID (null im MVP, von NextAuth in v0.2.x+) */
  userId: string | null;

  /** Subscription Plan (free | pro) */
  plan: Plan;

  /** Plan-Limits */
  limits: PlanLimits;

  /** Plan-Features */
  features: PlanFeatures;

  /** Set User ID (für Testing/MVP) */
  setUserId: (userId: string | null) => void;

  /** Set Plan (für Testing/MVP) */
  setPlan: (plan: Plan) => void;

  /** Check ob Feature verfügbar ist */
  hasFeature: (feature: keyof PlanFeatures) => boolean;

  /** Check ob Limit erreicht wurde */
  isLimitReached: (resource: keyof PlanLimits, currentCount: number) => boolean;
}

// ==================== CONSTANTS ====================

/**
 * Plan-Limits Konfiguration
 *
 * NOTE: Diese Werte sind Platzhalter für das MVP.
 *       In v0.2.x+ werden sie aus der Datenbank geladen.
 */
export const PLAN_LIMITS: Record<Plan, PlanLimits> = {
  free: {
    maxExposes: 5,
    maxLeads: 20,
    maxImagesPerExpose: 3,
    maxAIGenerations: 10,
    maxPDFExports: 5,
  },
  pro: {
    maxExposes: Infinity,
    maxLeads: Infinity,
    maxImagesPerExpose: 10,
    maxAIGenerations: Infinity,
    maxPDFExports: Infinity,
  },
};

/**
 * Plan-Features Konfiguration
 */
export const PLAN_FEATURES: Record<Plan, PlanFeatures> = {
  free: {
    aiTextGeneration: true,
    pdfExport: true,
    crmLight: true,
    advancedStats: false,
    exportImport: false,
    multiDeviceSync: false,
    prioritySupport: false,
  },
  pro: {
    aiTextGeneration: true,
    pdfExport: true,
    crmLight: true,
    advancedStats: true,
    exportImport: true,
    multiDeviceSync: true,
    prioritySupport: true,
  },
};

// ==================== CONTEXT ====================

const AppContext = createContext<AppContextValue | null>(null);

/**
 * App Provider Props
 */
export interface AppProviderProps {
  children: ReactNode;

  /**
   * User ID (optional)
   *
   * MVP: Aus LocalStorage gelesen (Fallback: null)
   * SaaS: Von NextAuth/Host-System übergeben
   */
  userId?: string | null;

  /**
   * Subscription Plan (optional)
   *
   * MVP: Aus LocalStorage gelesen (Fallback: 'free')
   * SaaS: Von NextAuth/Host-System übergeben (z.B. aus Stripe)
   */
  plan?: Plan;
}

/**
 * App Provider Component
 *
 * FEATURES:
 * - User-/Plan-State Management
 * - Feature-Flags basierend auf Plan
 * - Limit-Checks für Ressourcen
 *
 * MVP-VERWENDUNG:
 * ```tsx
 * <AppProvider>
 *   <App />
 * </AppProvider>
 * ```
 *
 * SAAS-VERWENDUNG:
 * ```tsx
 * <AppProvider userId={session.user.id} plan={session.user.plan}>
 *   <MaklerMateApp />
 * </AppProvider>
 * ```
 */
export function AppProvider({ children, userId: initialUserId, plan: initialPlan }: AppProviderProps): JSX.Element {
  // NOTE: In the MVP, we load userId/plan from LocalStorage (fallback to props).
  //       In v0.2.x+, these will be passed from the Next.js host (NextAuth session).

  const [userId, setUserId] = useState<string | null>(() => {
    if (initialUserId !== undefined) return initialUserId;
    return localStorage.getItem('maklermate_userId') || null;
  });

  const [plan, setPlan] = useState<Plan>(() => {
    if (initialPlan !== undefined) return initialPlan;
    const stored = localStorage.getItem('maklermate_plan') as Plan | null;
    return stored || 'free';
  });

  // Persist to LocalStorage (MVP only)
  useEffect(() => {
    if (userId) {
      localStorage.setItem('maklermate_userId', userId);
    } else {
      localStorage.removeItem('maklermate_userId');
    }
  }, [userId]);

  useEffect(() => {
    localStorage.setItem('maklermate_plan', plan);
  }, [plan]);

  // Compute limits & features based on plan
  const limits = useMemo(() => PLAN_LIMITS[plan], [plan]);
  const features = useMemo(() => PLAN_FEATURES[plan], [plan]);

  // Helper: Check if feature is available
  const hasFeature = (feature: keyof PlanFeatures): boolean => {
    return features[feature];
  };

  // Helper: Check if limit is reached
  const isLimitReached = (resource: keyof PlanLimits, currentCount: number): boolean => {
    const limit = limits[resource];
    if (limit === Infinity) return false;
    return currentCount >= limit;
  };

  const value: AppContextValue = useMemo(
    () => ({
      userId,
      plan,
      limits,
      features,
      setUserId,
      setPlan,
      hasFeature,
      isLimitReached,
    }),
    [userId, plan, limits, features]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/**
 * Hook: useAppContext
 *
 * VERWENDUNG:
 * ```tsx
 * const { userId, plan, hasFeature, isLimitReached } = useAppContext();
 *
 * if (!hasFeature('advancedStats')) {
 *   return <UpgradePrompt feature="Erweiterte Statistiken" />;
 * }
 *
 * if (isLimitReached('maxExposes', savedExposes.length)) {
 *   return <LimitReachedMessage limit={limits.maxExposes} />;
 * }
 * ```
 */
export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppContext must be used within <AppProvider>');
  }
  return ctx;
}

/**
 * Export for testing
 */
export { AppContext };
