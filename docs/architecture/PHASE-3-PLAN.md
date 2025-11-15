# 📋 Phase 3: Component Migration Plan

**Referenz:** `/DEVELOPMENT-INSTRUCTION.md` (Study-Guide Approach)

**Status:** 🔄 In Progress
**Estimated:** ~16-20h
**Goal:** Migrate all components to use new infrastructure (Stores + Services)

---

## 🎯 OVERVIEW

Phase 2 hat die **Infrastruktur** gebaut:
- ✅ API-Layer (apiClient, services, validation, retry, error-handling)
- ✅ State-Management (exposeStore, crmStore mit Zustand)
- ✅ Domain-Services (pdfService, exportService, LeadsStorageService)
- ✅ React-Hooks (useExpose) und Utils (leadHelpers)

**Phase 3 Ziel:** Components refactoren um diese Infrastruktur zu nutzen.

**Wichtig:** Befolge **DEVELOPMENT-INSTRUCTION.md** für:
- Service-Layer Pattern (keine Business-Logic in Components)
- Study-Guide Kommentare (File-Header, JSDoc, Inline-Comments)
- Error-Handling auf allen Ebenen
- Refactoring-Checklist vor jedem Commit

---

## 📊 MIGRATION STRATEGY

### Prinzipien (aus DEVELOPMENT-INSTRUCTION.md)

1. **Incremental Migration**
   - Ein Component/Feature zur Zeit
   - Commit nach jeder erfolgreichen Migration
   - Funktionalität bleibt unverändert (nur Architektur ändert sich)

2. **Study-Guide Comments**
   - File-Header mit ZWECK, ABHÄNGIGKEITEN, STATUS
   - Function JSDoc mit @param, @returns, @throws
   - Inline-Comments bei komplexer Logik (WARUM, nicht WAS)

3. **Testing Strategy**
   - Manuelle Tests nach jeder Migration
   - Vergleiche Verhalten vorher/nachher
   - Error-Pfade testen (Network-Fehler, Validation-Fehler)

---

## 🗂️ MIGRATION TASKS

### Task 3.1: ExposeTool.jsx → Stores + useExpose (6h)

**Current State:**
```javascript
// src/pages/ExposeTool.jsx
// ❌ Problem: Viele useState, manuelles localStorage, direkter API-Call via useAIHelper
const [formData, setFormData] = useState({...});
const [output, setOutput] = useState('');
const [images, setImages] = useState(() => {
  const saved = localStorage.getItem('maklermate_images');
  // ... manual parsing
});
// ... 6 more useState
```

**Target State:**
```javascript
/**
 * @fileoverview ExposeTool Page - Hauptseite für Exposé-Erstellung
 *
 * ZWECK:
 * - Formular für Immobilien-Daten
 * - AI-gestützte Exposé-Generierung via GPT-4o-mini
 * - Bild-Upload und Verwaltung
 * - Exposé-Export (PDF, JSON)
 *
 * ARCHITEKTUR:
 * - Presentational Component (UI only)
 * - State via useExposeStore (Zustand)
 * - Business-Logic via useExpose Hook
 * - Export via pdfService, exportService
 *
 * ABHÄNGIGKEITEN:
 * - stores/exposeStore.js (State-Management)
 * - hooks/useExpose.js (AI-Generierung)
 * - services/pdfService.js (PDF-Export)
 *
 * STATUS: 🟢 Production-Ready (migrated in Phase 3)
 */

import useExposeStore from '@/stores/exposeStore';
import { useExpose } from '@/hooks/useExpose';

export default function ExposeTool() {
  // STATE: Zustand Store (eliminiert prop-drilling)
  const formData = useExposeStore((state) => state.formData);
  const output = useExposeStore((state) => state.output);
  const images = useExposeStore((state) => state.images);
  const selectedStyle = useExposeStore((state) => state.selectedStyle);

  const { setFormData, setOutput } = useExposeStore();

  // HOOK: AI-Generierung (Business-Logic)
  const { generateExpose, isGenerating, error } = useExpose();

  // EVENT HANDLER: Exposé generieren
  const handleGenerate = async () => {
    const { data } = await generateExpose(formData, selectedStyle);
    if (data) {
      setOutput(data);
    }
  };

  return (
    // ... UI unchanged
  );
}
```

**Steps:**
1. Import useExposeStore, useExpose
2. Replace useState with store selectors
3. Replace useAIHelper with useExpose
4. Remove manual localStorage-Logik (store hat persist)
5. Add Study-Guide comments (File-Header, JSDoc)
6. Test: Formular, Generierung, Persistierung, Export
7. Commit: "feat(ExposeTool): migrate to exposeStore + useExpose"

---

### Task 3.2: ImageUpload.jsx → exposeStore (2h)

**Current State:**
```javascript
// ❌ Problem: Props drilling (images, setImages), duplicate localStorage
<ImageUpload images={images} setImages={setImages} />
```

**Target State:**
```javascript
/**
 * @fileoverview ImageUpload Component - Bild-Upload und Verwaltung
 *
 * ZWECK:
 * - Drag & Drop Bild-Upload
 * - Bild-Preview mit Captions
 * - Persistierung via exposeStore
 *
 * ARCHITEKTUR:
 * - Self-contained Component (kein Prop-Drilling)
 * - State via useExposeStore (images, captions)
 * - Auto-Persistierung via Zustand
 *
 * STATUS: 🟢 Production-Ready (migrated in Phase 3)
 */

import useExposeStore from '@/stores/exposeStore';

export default function ImageUpload() {
  // STATE: Direkt aus Store (kein Prop-Drilling!)
  const images = useExposeStore((state) => state.images);
  const captions = useExposeStore((state) => state.captions);

  const { addImage, removeImage, updateCaption } = useExposeStore();

  // ... Rest unverändert
}
```

**Steps:**
1. Remove Props (images, setImages)
2. Import useExposeStore
3. Use store selectors + actions
4. Remove manual localStorage (store hat persist)
5. Update ExposeTool.jsx: `<ImageUpload />` (ohne Props)
6. Add comments
7. Test: Upload, Remove, Captions, Persistierung
8. Commit: "feat(ImageUpload): migrate to exposeStore, eliminate prop-drilling"

---

### Task 3.3: ExportButtons.jsx → pdfService + exportService (3h)

**Current State:**
```javascript
// ❌ Problem: Import von pdfExportExpose (alte Util)
import { exportExposeWithImages } from '../utils/pdfExportExpose';

// ❌ Problem: Inline PDF-Logic
const handleExportPDF = async () => {
  // ... direkte jsPDF-Aufrufe
};
```

**Target State:**
```javascript
/**
 * @fileoverview ExportButtons Component - Export-Aktionen für Exposé
 *
 * ZWECK:
 * - PDF-Export (Exposé mit Bildern)
 * - JSON-Export (für CRM-Import)
 * - Text-Kopieren (Zwischenablage)
 * - Exposé speichern (localStorage)
 *
 * ARCHITEKTUR:
 * - Presentational Component
 * - Export-Logic in pdfService, exportService
 * - State via useExposeStore
 *
 * ABHÄNGIGKEITEN:
 * - services/pdfService.js (PDF-Generation)
 * - services/exportService.js (JSON/CSV Export)
 *
 * STATUS: 🟢 Production-Ready (migrated in Phase 3)
 */

import pdfService from '@/services/pdfService';
import exportService from '@/services/exportService';
import useExposeStore from '@/stores/exposeStore';

export default function ExportButtons() {
  const formData = useExposeStore((state) => state.formData);
  const output = useExposeStore((state) => state.output);
  const images = useExposeStore((state) => state.images);
  const captions = useExposeStore((state) => state.captions);

  const { saveExpose } = useExposeStore();

  // PDF-EXPORT: Delegiert an pdfService
  const handleExportPDF = () => {
    pdfService.exportExposeAsPDF(formData, output, images, captions);
  };

  // JSON-EXPORT: Delegiert an exportService
  const handleExportJSON = () => {
    const fullData = { formData, output, selectedStyle, images, captions };
    exportService.exportExposeAsJSON(fullData);
  };

  // CLIPBOARD: Native API
  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    toast.success('📋 Text kopiert!');
  };

  // ... Rest
}
```

**Steps:**
1. Import pdfService, exportService
2. Replace pdfExportExpose mit pdfService.exportExposeAsPDF()
3. Add exportService.exportExposeAsJSON()
4. Use useExposeStore statt Props
5. Add Study-Guide comments
6. Test: PDF-Download, JSON-Download, Copy
7. Commit: "feat(ExportButtons): migrate to pdfService + exportService"

---

### Task 3.4: CRMTool.jsx → useCRMStore (4h)

**Current State:**
```javascript
// ❌ Problem: useLocalStorageLeads (144 LOC Monster-Hook)
const { leads, addLead, updateLead, deleteLead } = useLocalStorageLeads();
```

**Target State:**
```javascript
/**
 * @fileoverview CRMTool Page - Lead-Verwaltung
 *
 * ZWECK:
 * - Lead-Erfassung (Name, Kontakt, Status, Type)
 * - Lead-Tabelle mit Filter und Search
 * - Export (CSV, PDF, JSON)
 * - Cross-Tab-Sync via Zustand
 *
 * ARCHITEKTUR:
 * - Presentational Component
 * - State via useCRMStore (Zustand)
 * - Export via exportService, pdfService
 *
 * ABHÄNGIGKEITEN:
 * - stores/crmStore.js (Lead-State)
 * - services/exportService.js (CSV/JSON Export)
 * - services/pdfService.js (PDF-Tabelle)
 *
 * STATUS: 🟢 Production-Ready (migrated in Phase 3)
 */

import useCRMStore from '@/stores/crmStore';
import exportService from '@/services/exportService';
import pdfService from '@/services/pdfService';

export default function CRMTool() {
  // STATE: Zustand Store
  const leads = useCRMStore((state) => state.leads);
  const filter = useCRMStore((state) => state.filter);
  const searchQuery = useCRMStore((state) => state.searchQuery);

  const { addLead, updateLead, deleteLead, setFilter, setSearchQuery } = useCRMStore();

  // COMPUTED: Gefilterte Leads (via Store)
  const filteredLeads = useCRMStore((state) => state.getFilteredLeads());

  // EXPORT: Delegiert an Services
  const handleExportCSV = () => {
    exportService.exportLeadsAsCSV(filteredLeads);
  };

  const handleExportPDF = () => {
    pdfService.exportLeadsAsPDF(filteredLeads);
  };

  return (
    // ... UI unchanged
  );
}
```

**Steps:**
1. Import useCRMStore
2. Replace useLocalStorageLeads mit useCRMStore
3. Use getFilteredLeads() für Filter-Logik
4. Update LeadForm: Use store actions
5. Update LeadTable: Use store actions
6. Add Study-Guide comments
7. Test: Add, Edit, Delete, Filter, Search, Export
8. Commit: "feat(CRMTool): migrate to useCRMStore"

---

### Task 3.5: LeadForm.jsx + LeadTable.jsx → useCRMStore (2h)

**Current State:**
```javascript
// LeadForm.jsx
export default function LeadForm({ onAddLead }) {
  // ...
}

// LeadTable.jsx
export default function LeadTable({ leads, onUpdateLead, onDeleteLead }) {
  // ...
}
```

**Target State:**
```javascript
/**
 * @fileoverview LeadForm Component - Lead-Erfassung
 *
 * ZWECK:
 * - Formular für neue Leads
 * - Validation (Name required)
 * - Auto-ID-Generation
 *
 * ARCHITEKTUR:
 * - Self-contained Component
 * - State via useCRMStore
 *
 * STATUS: 🟢 Production-Ready (migrated in Phase 3)
 */

import useCRMStore from '@/stores/crmStore';

export default function LeadForm() {
  const { addLead } = useCRMStore();

  // ... Form-Logic unverändert, aber calls addLead() direkt
}

/**
 * @fileoverview LeadTable Component - Lead-Tabelle
 *
 * ZWECK:
 * - Tabellen-Anzeige aller Leads
 * - Inline-Editing (Status, Notiz)
 * - Delete-Action
 *
 * ARCHITEKTUR:
 * - Presentational Component
 * - State via useCRMStore
 *
 * STATUS: 🟢 Production-Ready (migrated in Phase 3)
 */

import useCRMStore from '@/stores/crmStore';

export default function LeadTable() {
  const leads = useCRMStore((state) => state.leads);
  const { updateLead, deleteLead } = useCRMStore();

  // ... Table-Logic unverändert
}
```

**Steps:**
1. Remove Props von beiden Components
2. Import useCRMStore
3. Use store selectors + actions
4. Update CRMTool.jsx: `<LeadForm />`, `<LeadTable />` (ohne Props)
5. Add comments
6. Test: Add Lead, Edit Lead, Delete Lead
7. Commit: "feat(LeadForm+LeadTable): migrate to useCRMStore, eliminate prop-drilling"

---

## 🗑️ CLEANUP TASKS

### Task 3.6: Delete Old Code (1h)

**After successful migration, DELETE:**

```bash
# Old Hooks (replaced by Stores + useExpose)
src/hooks/useAIHelper.js          # 🗑️ → useExpose.js
src/hooks/useLocalStorageLeads.js # 🗑️ → crmStore.js + LeadsStorageService.js
src/hooks/useSavedExposes.js      # 🗑️ → exposeStore.js (loadExpose action)

# Old Utils (replaced by Services)
src/utils/crmExport.js            # 🗑️ → exportService.js
src/utils/crmExportLeads.js       # 🗑️ → exportService.js
src/utils/pdfExport.js            # 🗑️ → pdfService.js
```

**Steps:**
1. Verify: Keine Imports mehr von diesen Files (grep)
2. Delete Files
3. Update imports falls irgendwo noch referenziert
4. Commit: "chore: remove old hooks and utils replaced by stores and services"

---

## 📝 MIGRATION CHECKLIST (Pro Component)

Vor jedem Commit (aus DEVELOPMENT-INSTRUCTION.md):

### ✅ Code Quality
- [ ] File-Header Kommentar (ZWECK, ARCHITEKTUR, ABHÄNGIGKEITEN, STATUS)
- [ ] JSDoc für alle exportierten Functions
- [ ] Inline-Comments bei komplexer Logik (WARUM)
- [ ] Keine Magic Numbers
- [ ] Keine console.log (nur in Development-Mode)

### ✅ Architecture
- [ ] Component ist <200 Zeilen
- [ ] Keine Business-Logik im Component (nur UI + Event-Handler)
- [ ] State via Store (useExposeStore oder useCRMStore)
- [ ] Export-Logic via Services (pdfService, exportService)
- [ ] Error-Handling vorhanden (try/catch, error states)

### ✅ Testing
- [ ] Manuell getestet: Happy Path
- [ ] Manuell getestet: Error Path (Network-Fehler, Validation-Fehler)
- [ ] Manuell getestet: Edge Cases (leere Daten, große Daten)
- [ ] Vergleich mit Original-Verhalten (keine Regression)

### ✅ Commit
- [ ] Aussagekräftige Commit-Message (feat/fix/refactor)
- [ ] Referenz zu DEVELOPMENT-INSTRUCTION.md
- [ ] Details im Commit-Body (Was, Warum, Getestet)

---

## 🎯 SUCCESS CRITERIA

Phase 3 ist abgeschlossen wenn:

1. **Alle Components migriert:**
   - ✅ ExposeTool.jsx → useExposeStore + useExpose
   - ✅ ImageUpload.jsx → useExposeStore
   - ✅ ExportButtons.jsx → pdfService + exportService
   - ✅ CRMTool.jsx → useCRMStore
   - ✅ LeadForm.jsx → useCRMStore
   - ✅ LeadTable.jsx → useCRMStore

2. **Alle alten Files gelöscht:**
   - 🗑️ useAIHelper.js, useLocalStorageLeads.js, useSavedExposes.js
   - 🗑️ crmExport.js, crmExportLeads.js, pdfExport.js

3. **Study-Guide Comments:**
   - Jeder migrierte Component hat File-Header
   - Alle Functions haben JSDoc
   - Komplexe Logik hat Inline-Comments

4. **Funktionalität unverändert:**
   - Alle Features funktionieren wie vorher
   - Keine Regressions
   - Error-Handling verbessert (via errorHandler.js)

5. **Architecture Clean:**
   - Kein Prop-Drilling mehr
   - Alle Business-Logic in Services
   - Alle State in Stores

---

## 📊 ESTIMATED TIME

| Task | Estimated | Complexity |
|------|-----------|------------|
| 3.1 ExposeTool → Stores + useExpose | 6h | High (viel State) |
| 3.2 ImageUpload → exposeStore | 2h | Low (nur Props) |
| 3.3 ExportButtons → Services | 3h | Medium (neue APIs) |
| 3.4 CRMTool → useCRMStore | 4h | High (viel Logic) |
| 3.5 LeadForm+Table → useCRMStore | 2h | Low (nur Props) |
| 3.6 Cleanup Old Code | 1h | Low (nur Delete) |
| **TOTAL** | **18h** | |

**Buffer:** +2h für unerwartete Issues = **20h Total**

---

## 🚀 START COMMAND

```bash
# 1. Lese DEVELOPMENT-INSTRUCTION.md
cat DEVELOPMENT-INSTRUCTION.md

# 2. Lese Phase 3 Plan
cat docs/architecture/PHASE-3-PLAN.md

# 3. Start mit Task 3.1
# "Migrate ExposeTool.jsx to useExposeStore + useExpose
#  according to DEVELOPMENT-INSTRUCTION.md Study-Guide Approach"
```

---

**NEXT:** Task 3.1 - ExposeTool.jsx Migration 🚀
