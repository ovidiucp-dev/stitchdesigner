import { updatePatternCell } from "@/lib/patternOperations";

import type {
  Pattern,
  StitchHistoryEntry,
} from "@/types/pattern";

export type HistoryState = {
  pattern: Pattern;
  undoStack: StitchHistoryEntry[];
  redoStack: StitchHistoryEntry[];
};

export function recordHistoryEntry(
  undoStack: StitchHistoryEntry[],
  entry: StitchHistoryEntry,
) {
  return {
    undoStack: [
      ...undoStack,
      entry,
    ],
    redoStack: [],
  };
}

export function undoPatternChange(
  pattern: Pattern,
  undoStack: StitchHistoryEntry[],
  redoStack: StitchHistoryEntry[],
): HistoryState | null {
  if (undoStack.length === 0) {
    return null;
  }

  const entry =
    undoStack[
      undoStack.length - 1
    ];

  return {
    pattern: updatePatternCell(
      pattern,
      entry.x,
      entry.y,
      entry.before,
    ),

    undoStack:
      undoStack.slice(0, -1),

    redoStack: [
      ...redoStack,
      entry,
    ],
  };
}

export function redoPatternChange(
  pattern: Pattern,
  undoStack: StitchHistoryEntry[],
  redoStack: StitchHistoryEntry[],
): HistoryState | null {
  if (redoStack.length === 0) {
    return null;
  }

  const entry =
    redoStack[
      redoStack.length - 1
    ];

  return {
    pattern: updatePatternCell(
      pattern,
      entry.x,
      entry.y,
      entry.after,
    ),

    undoStack: [
      ...undoStack,
      entry,
    ],

    redoStack:
      redoStack.slice(0, -1),
  };
}