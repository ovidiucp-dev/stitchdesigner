# StitchDesigner — Version 0.2 Plan

**Version:** 0.2  
**Working name:** Editor Productivity & Symbols  
**Status:** Approved for planning  
**Previous version:** MVP 0.1

---

# 1. Objective

Version 0.2 will improve the productivity and readability of the StitchDesigner editor without changing the approved architecture.

The main goals are:

- make patterns easier to read using thread symbols;
- provide a black-and-white symbol representation;
- allow rectangular area selection;
- allow multi-stitch editing operations;
- allow existing patterns to be resized;
- preserve full compatibility with Pattern 1.0 and `.stitch` files whenever possible.

Version 0.2 must not introduce backend services, user accounts, cloud storage, AI services, third-party graphical editor frameworks, or commercial thread catalogs.

---

# 2. Scope

Version 0.2 includes exclusively:

## 0.2-A — Pattern symbols

The editor will support three visual modes:

1. Color
2. Color + Symbols
3. Symbols

Each thread already has a symbol.

Changing the visual mode must never modify the Pattern data.

### Color

Current rendering behavior.

Each stitch is displayed using its thread color.

### Color + Symbols

Each stitch is displayed using:

- thread color as background;
- thread symbol centered inside the cell.

The symbol must remain readable at practical zoom levels.

### Symbols

The pattern is displayed as:

- white or neutral background;
- black symbols;
- grid visible;
- no dependency on thread color for interpretation.

---

# 3. Black-and-white symbol export

Version 0.2 will add a separate PNG export intended for printing or pattern reading.

Conceptual flow:

Pattern
→ Symbol Renderer
→ Canvas
→ PNG

The result must contain:

- pattern grid;
- thread symbols;
- black-and-white representation.

Professional PDF layout is not included in version 0.2.

It remains planned for a later version.

---

# 4. Rectangular selection

A new editor tool will be added:

- Stitch
- Erase
- Select
- Pan

The Select tool will allow the user to drag from one grid cell to another and create a rectangular selection.

The selection will contain conceptually:

- x;
- y;
- width;
- height.

Selection is editor state.

It is NOT part of Pattern and will NOT be saved in `.stitch`.

Only rectangular selection is included in version 0.2.

The following are explicitly excluded:

- freehand selection;
- lasso selection;
- selection by color;
- automatic motif detection.

---

# 5. Copy

When an area is selected, Copy will copy the stitches contained inside the rectangle.

The clipboard will preserve:

- selection width;
- selection height;
- stitches;
- each stitch position relative to the selection origin;
- stitch colorId;
- stitch type.

Empty cells inside the selection remain empty.

Copy does not modify Pattern.

---

# 6. Paste

Paste will allow the copied block to be positioned somewhere else in the pattern.

Rule:

If a pasted stitch falls on an existing stitch, the pasted stitch replaces the existing stitch.

Paste must respect pattern boundaries.

Stitches outside pattern boundaries must not be created.

The exact user interaction for positioning the pasted block will be defined during implementation, using the simplest interaction that provides a good editor experience.

---

# 7. Delete selection

The user will be able to delete all stitches inside the current rectangular selection.

Deleting a selected area must be recorded as one editor operation.

One Undo must restore the complete deleted area.

---

# 8. Move selection

Move will relocate the selected stitches from one area to another.

Conceptually:

Copy selection
→ remove original stitches
→ place stitches at destination

But from the user perspective this must behave as one single operation.

One Undo must restore the entire previous state of the moved area.

One Redo must apply the complete move again.

---

# 9. Resize existing pattern

Version 0.2 will allow changing the width and/or height of an existing pattern.

A new Resize Pattern action/dialog will allow editing:

- Width
- Height

For version 0.2, pattern origin remains fixed at:

0,0

Increasing dimensions adds empty cells:

- to the right;
- to the bottom.

Reducing dimensions removes cells:

- from the right;
- from the bottom.

No center/top/right/bottom anchoring options will be introduced in 0.2.

If reducing the dimensions would remove existing stitches, StitchDesigner must warn the user before applying the change.

Example:

"28 stitches will be removed because they are outside the new pattern size. Continue?"

The resize will only occur after confirmation.

---

# 10. Undo / Redo evolution

Version 0.1 history primarily supports individual stitch changes.

Version 0.2 requires history to support complete editor operations.

Conceptually:

HistoryEntry
→ Editor Operation

An operation may contain:

- one stitch change;
- multiple stitch changes;
- selection deletion;
- paste;
- move;
- resize.

Example:

Paste 47 stitches
→ Undo once
→ all 47 changes are reverted

Redo once
→ all 47 changes are restored

The implementation should remain operation-based.

Full copies of Pattern should not be stored for every normal editor action unless a specific operation demonstrates that this is necessary and justified.

---

# 11. Pattern model compatibility

The current Pattern model remains the common data model between:

- Editor;
- Image Converter;
- Exporter.

Version 0.2 should avoid changing the `.stitch` format unless a demonstrated technical need appears.

The following are editor state and must not be saved as Pattern data:

- active tool;
- current selection;
- clipboard;
- display mode;
- zoom;
- pan position.

Thread symbols remain part of Thread data.

---

# 12. Implementation sequence

Development will be divided into stable blocks.

## 0.2.1 — Symbol Renderer

Implement:

- Color mode;
- Color + Symbols mode;
- Symbols mode.

Test rendering before continuing.

## 0.2.2 — Symbol PNG Export

Implement black-and-white symbol PNG export.

Test independently before continuing.

## 0.2.3 — Selection Model

Implement:

- Select tool;
- rectangular selection state;
- drag selection interaction;
- Canvas selection rendering.

No Copy/Paste yet.

## 0.2.4 — Batch History

Extend Undo/Redo so a single editor action can contain multiple cell changes.

Validate existing 0.1 Undo/Redo behavior before continuing.

## 0.2.5 — Copy / Paste / Delete

Implement:

- internal clipboard;
- Copy;
- Paste;
- Delete Selection;
- pattern boundary handling.

Each operation must integrate with Undo/Redo.

## 0.2.6 — Move Selection

Implement moving a selected area as one atomic editor operation.

## 0.2.7 — Resize Pattern

Implement:

- Resize Pattern dialog;
- enlarge pattern;
- shrink pattern;
- warning when stitches would be removed;
- Undo/Redo if technically appropriate within the agreed history design.

## 0.2.8 — Regression Testing

Retest all functionality from 0.1 and all new functionality from 0.2.

Only after successful validation will version 0.2 be considered complete.

---

# 13. Explicitly excluded from version 0.2

The following are not included:

- repeat detection;
- border/cenefa detection;
- automatic motif detection;
- mirror;
- rotate;
- free selection;
- lasso selection;
- selection by color;
- fill tool;
- professional PDF export;
- advanced Pattern Sheet Export;
- commercial thread catalogs;
- backstitch;
- special stitches;
- cloud synchronization;
- login/users;
- marketplace;
- AI preprocessing;
- native mobile applications.

These remain in the backlog or later planned versions.

---

# 14. Acceptance criteria

Version 0.2 will be considered complete when the Product Owner can perform this complete workflow:

1. Create or open a pattern.
2. Switch between Color, Color + Symbols and Symbols views.
3. Verify that changing the view does not modify the pattern.
4. Export a normal color PNG.
5. Export a black-and-white symbol PNG.
6. Select a rectangular area.
7. Copy the selected area.
8. Paste it in another location.
9. Undo the paste with one Undo.
10. Redo the paste with one Redo.
11. Delete a selected area.
12. Undo the complete deletion.
13. Move a selected motif.
14. Undo the complete move with one Undo.
15. Resize the pattern larger.
16. Resize the pattern smaller.
17. Receive a warning when shrinking would delete stitches.
18. Save the resulting `.stitch` file.
19. Reopen the saved file.
20. Confirm that the pattern data remains correct.
21. Confirm that all MVP 0.1 functionality still works.

---

# 15. Architecture decision

Version 0.2 will continue using:

- Next.js;
- React;
- TypeScript;
- Tailwind CSS;
- HTML Canvas 2D;
- React state / Context;
- Pattern TypeScript model;
- `.stitch` JSON;
- browser-side processing.

No new structural dependency is approved for version 0.2.

---

# 16. Version completion rule

Each implementation block must follow:

Objective
→ Decision
→ Implementation
→ Test
→ Validation
→ Commit
→ Next block

A block will not be considered finished simply because the code compiles.

The Product Owner must validate the user-facing behavior before continuing to the next block.
