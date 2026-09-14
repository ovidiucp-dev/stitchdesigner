# StitchDesigner — Backlog and Version Outlook

**Status:** Active  
**Current released baseline:** MVP 0.1  
**Purpose:** Record ideas and improvements that are explicitly outside the current released scope.  
**Rule:** An item being in the backlog does not imply approval for immediate implementation.

---

## 1. Explicit backlog

### BL-001 — Resize an existing pattern

Allow the user to change the width and/or height of an existing pattern after creation, including adding or removing rows and columns.

**Notes**
- Must define what happens to stitches outside the new bounds.
- Should preserve the current Pattern model.
- Not part of MVP 0.1.

**Suggested target:** 0.2

---

### BL-002 — Professional PDF export

Generate a professional printable PDF version of a pattern.

Potential content:
- pattern title and information;
- dimensions;
- grid;
- symbols;
- legend;
- color list;
- pagination for large patterns.

**Notes**
- Separate from the current PNG export.
- Requires print-oriented layout decisions.

**Suggested target:** 0.4

---

### BL-003 — Symbols on pattern and black-and-white symbol version

Display the symbol assigned to each thread/color directly on the pattern and provide a separate black-and-white version based on symbols.

Potential behavior:
- color view;
- symbol overlay view;
- black-and-white symbol-only view;
- printable/exportable symbol representation.

**Rationale**
Useful when colors are visually similar and for traditional printed cross-stitch patterns.

**Suggested target:** 0.2

---

### BL-004 — Select, copy, paste and move pattern sections

Allow the user to select a rectangular or free pattern section and perform editing operations on the selected stitches.

Initial scope:
- rectangular selection;
- copy;
- paste;
- move;
- delete selected stitches;
- undo/redo support.

Possible later extensions:
- rotate;
- mirror;
- duplicate multiple times.

**Suggested target:** 0.2

---

### BL-005 — Detect repeated pattern sections

Detect repeated motifs or sections inside a pattern, especially useful for borders and repeating decorative bands.

Example:
- identify that a motif repeats every N stitches;
- highlight repeated blocks;
- allow the user to inspect the base repeat;
- optionally use the detected repeat to simplify editing.

**Important**
The first implementation should be deterministic and pattern-based, not AI-based.

**Suggested target:** 0.3

---

## 2. Future product capabilities already documented

These are already part of the broader product direction but are not included in MVP 0.1.

### Editor evolution
- fill areas;
- advanced selection operations;
- symbols by color;
- additional stitch types;
- backstitch;
- French knots and other special stitches.

### Threads and materials
- real manufacturer catalogs, only after legal/use verification;
- DMC / Anchor / other manufacturers;
- stitch count by color;
- estimated thread length;
- skein estimation;
- final embroidery dimensions;
- recommended fabric dimensions.

### Image conversion evolution
- HEIC or additional formats if justified;
- more advanced background processing;
- subject-aware image preprocessing;
- face/eye/detail preservation;
- more advanced image-to-pattern quality improvements;
- AI only if it demonstrably improves the deterministic engine.

### Pattern management
- local pattern library;
- thumbnails and metadata;
- duplicate / rename / delete;
- later cloud synchronization.

### Later product phases
- PWA;
- native mobile applications;
- Stitch Mode / embroidery progress tracking;
- users and profiles;
- sharing and collaboration;
- marketplace and pattern sales.

---

## 3. Proposed version sequence

### Version 0.2 — Editor Productivity & Symbols

**Goal:** Make manual editing substantially faster and make patterns easier to read.

Proposed scope:
- BL-001 resize existing pattern;
- BL-003 symbols on pattern;
- black-and-white symbol view;
- BL-004 rectangular selection;
- copy / paste / move / delete selection;
- full undo/redo integration for these operations.

**Estimated relative effort:** Medium–High.

**Why first**
These functions improve both manually created patterns and patterns generated from images without requiring a new backend or architectural change.

---

### Version 0.3 — Repetition & Pattern Intelligence

**Goal:** Make StitchDesigner more effective for structured designs such as borders.

Proposed scope:
- BL-005 deterministic repeat detection;
- highlight repeated sections;
- identify repeat size / offset;
- duplicate a selected motif multiple times;
- basic mirror/repeat editing if validated during design.

**Estimated relative effort:** Medium.

**Dependency**
Builds naturally on the selection model introduced in 0.2.

---

### Version 0.4 — Professional Output & Materials

**Goal:** Produce patterns suitable for printing and practical embroidery use.

Proposed scope:
- BL-002 professional PDF export;
- printable symbol grid;
- legend;
- stitches by color;
- physical dimensions;
- basic material estimation.

**Estimated relative effort:** Medium–High.

**Dependency**
Benefits from the symbol system completed in 0.2.

---

### Version 0.5 — Thread Catalogs & Pattern Library

**Goal:** Improve real-world thread usage and project management.

Potential scope:
- internal pattern library;
- thumbnails / rename / duplicate / delete;
- verified manufacturer palettes where legally usable;
- color matching against selected manufacturer catalog;
- improved material calculations.

**Estimated relative effort:** High.

**Important**
Commercial thread catalogs must not be incorporated until legal and data-use conditions have been verified.

---

### Version 0.6 — Advanced Stitching

**Goal:** Expand the editor beyond full cross stitches.

Potential scope:
- half stitch;
- quarter stitch;
- three-quarter stitch;
- backstitch;
- French knots / selected special stitches.

**Estimated relative effort:** High.

**Impact**
This version will require a controlled extension of the Pattern/Stitch model and rendering/editing rules.

---

### Version 0.7 — Advanced Image Processing

**Goal:** Improve difficult image conversions beyond the deterministic MVP engine.

Potential scope:
- better subject/background separation;
- edge/detail preservation;
- portrait/animal handling;
- more advanced cleanup;
- optional AI preprocessing only after measurable comparison with the classic engine.

**Estimated relative effort:** High–Very High.

---

### Version 1.0 — Public Product Baseline

**Possible readiness criteria**
- stable editor;
- strong image-to-pattern workflow;
- selection and productivity tools;
- symbols and professional printable output;
- materials information;
- reliable pattern library;
- production-quality UX and testing;
- clear licensing position for any commercial thread data used.

The exact 1.0 scope should be approved later based on real user feedback rather than fixed now.

---

## 4. Recommended immediate order

1. Keep current MVP 0.1 stable while evaluating the production deployment and domain.
2. Plan Version 0.2 around editor productivity and symbols.
3. Implement repetition detection only after the selection/copy/paste model is stable.
4. Build professional PDF output after the symbol representation is mature.
5. Delay high-risk architecture changes, commercial catalogs and AI until their value is demonstrated.

---

## 5. Pending non-functional decision

### Domain

The application is currently deployed and working on Vercel.

**Decision pending:** whether to keep the `vercel.app` address temporarily or connect a custom StitchDesigner domain.

This is a publication decision, not a product feature.
