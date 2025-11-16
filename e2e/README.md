# E2E Tests (Playwright)

End-to-End Tests für kritische User-Flows in MaklerMate.

## 🎯 Test-Coverage

### 1. Exposé-Generierung (`expose-generation.spec.ts`)
- Formular-Anzeige und -Validierung
- Daten-Eingabe und -Persistierung
- Exposé-Generierung (API-Call)
- PDF-Export
- Bild-Upload
- Responsive Design

### 2. CRM Leads Management (`crm-leads.spec.ts`)
- Lead erstellen, bearbeiten, löschen
- Status-Verwaltung
- Filter und Suche
- Export-Funktionen
- localStorage-Persistierung
- Responsive Design

### 3. Navigation (`navigation.spec.ts`)
- Homepage und Routing
- Navigation zwischen Seiten
- Responsive Navigation
- Error Handling
- Accessibility
- Performance

## 🚀 Verwendung

### Alle Tests ausführen
```bash
npm run e2e
```

### Mit sichtbarem Browser
```bash
npm run e2e:headed
```

### Interaktive UI
```bash
npm run e2e:ui
```

### Debug-Modus
```bash
npm run e2e:debug
```

### Einzelner Test
```bash
npx playwright test expose-generation.spec.ts
```

### Spezifischer Browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## 📊 Test-Reports

Nach Test-Ausführung:
```bash
npm run e2e:report
```

## ⚙️ Konfiguration

Siehe `playwright.config.ts` für:
- Browser-Konfiguration
- Timeout-Einstellungen
- Screenshot/Video-Settings
- Viewport-Größen
- Reporter-Settings

## 📝 Tests schreiben

### Beispiel: Neuer Test

```typescript
import { test, expect } from '@playwright/test';

test.describe('Mein Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/my-page');
  });

  test('should do something', async ({ page }) => {
    await page.click('button');
    await expect(page.locator('.result')).toBeVisible();
  });
});
```

### Best Practices

1. **Descriptive Test Names**: Verwende klare, beschreibende Namen
2. **beforeEach**: Setup-Code in `beforeEach` auslagern
3. **Data-TestIds**: Nutze `data-testid` für stabile Selektoren
4. **Timeouts**: Nutze `expect().toBeVisible({ timeout: 5000 })` für async Elemente
5. **Clean State**: Bereinige localStorage/State zwischen Tests

## 🔧 CI/CD

Tests laufen automatisch in GitHub Actions:
- Bei jedem Push zu `main` oder `claude/**`
- Bei Pull Requests
- Matrix-Testing: Chromium & Firefox

## 🐛 Debugging

### Visual Debugging
```bash
npm run e2e:debug
```

### Trace Viewer (nach fehlgeschlagenem Test)
```bash
npx playwright show-trace test-results/.../trace.zip
```

### Screenshots on Failure
Automatisch in `test-results/` gespeichert

## 📚 Dokumentation

- [Playwright Docs](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Selectors Guide](https://playwright.dev/docs/selectors)
