"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  EditorHeader,
} from "@/components/editor/EditorHeader";

import {
  NewPatternDialog,
} from "@/components/editor/NewPatternDialog";

import {
  PalettePanel,
} from "@/components/editor/PalettePanel";

import {
  PatternCanvas,
} from "@/components/editor/PatternCanvas";

import {
  StatusBar,
} from "@/components/editor/StatusBar";

import {
  ToolsPanel,
} from "@/components/editor/ToolsPanel";

import type {
  EditorTool,
} from "@/components/editor/ToolsPanel";

import {
  internalPalette,
} from "@/data/internalPalette";

import {
  CELL_SIZE,
  renderPatternToCanvas,
} from "@/lib/canvasRenderer";

import {
  recordHistoryEntry,
  redoPatternChange,
  undoPatternChange,
} from "@/lib/editorHistory";

import {
  getStitchAt,
  updatePatternCell,
} from "@/lib/patternOperations";

import {
  isValidPattern,
} from "@/lib/patternValidation";

import type {
  Pattern,
  Stitch,
  StitchHistoryEntry,
} from "@/types/pattern";

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 4;

export default function Home() {
  const canvasRef =
    useRef<HTMLCanvasElement | null>(
      null,
    );

  const workspaceRef =
    useRef<HTMLElement | null>(
      null,
    );

  const fileInputRef =
    useRef<HTMLInputElement | null>(
      null,
    );

  const panStartRef = useRef({
    x: 0,
    y: 0,
    scrollLeft: 0,
    scrollTop: 0,
  });

  const [
    showNewPattern,
    setShowNewPattern,
  ] =
    useState(false);

  const [
    pattern,
    setPattern,
  ] =
    useState<Pattern | null>(
      null,
    );

  const [name, setName] =
    useState("Mi patrón");

  const [width, setWidth] =
    useState(100);

  const [height, setHeight] =
    useState(80);

  const [
    fabricType,
    setFabricType,
  ] =
    useState("aida");

  const [
    fabricCount,
    setFabricCount,
  ] =
    useState(14);

  const [
    fabricColor,
    setFabricColor,
  ] =
    useState("#ffffff");

  const [
    selectedColorId,
    setSelectedColorId,
  ] =
    useState(
      internalPalette[0].id,
    );

  const [
    selectedTool,
    setSelectedTool,
  ] =
    useState<EditorTool>(
      "stitch",
    );

  const [zoom, setZoom] =
    useState(1);

  const [
    isPanning,
    setIsPanning,
  ] =
    useState(false);

  const [
    undoStack,
    setUndoStack,
  ] =
    useState<
      StitchHistoryEntry[]
    >([]);

  const [
    redoStack,
    setRedoStack,
  ] =
    useState<
      StitchHistoryEntry[]
    >([]);

  const activePalette =
    pattern &&
    pattern.palette.length > 0
      ? pattern.palette
      : internalPalette;

  const selectedThread =
    activePalette.find(
      (thread) =>
        thread.id ===
        selectedColorId,
    ) ??
    activePalette[0];

  function openNewPatternDialog() {
    setName("Mi patrón");
    setWidth(100);
    setHeight(80);
    setFabricType("aida");
    setFabricCount(14);
    setFabricColor("#ffffff");

    setShowNewPattern(
      true,
    );
  }

  function createPattern() {
    if (
      name.trim() === "" ||
      !Number.isInteger(width) ||
      width <= 0 ||
      !Number.isInteger(height) ||
      height <= 0 ||
      fabricCount <= 0
    ) {
      alert(
        "Revisa los datos del patrón. Ancho, alto y count deben ser válidos.",
      );

      return;
    }

    const now =
      new Date().toISOString();

    const newPattern: Pattern =
      {
        version: "1.0",

        id:
          crypto.randomUUID(),

        name:
          name.trim(),

        width,
        height,

        fabric: {
          type:
            fabricType,

          count:
            fabricCount,

          color:
            fabricColor,
        },

        palette:
          internalPalette,

        stitches: [],

        metadata: {
          createdAt: now,
          updatedAt: now,
        },
      };

    setPattern(
      newPattern,
    );

    setSelectedColorId(
      internalPalette[0].id,
    );

    setSelectedTool(
      "stitch",
    );

    setZoom(1);

    setUndoStack([]);
    setRedoStack([]);

    setShowNewPattern(
      false,
    );
  }

  function addHistoryEntry(
    entry: StitchHistoryEntry,
  ) {
    const history =
      recordHistoryEntry(
        undoStack,
        entry,
      );

    setUndoStack(
      history.undoStack,
    );

    setRedoStack(
      history.redoStack,
    );
  }

  function handleCanvasClick(
    event:
      React.MouseEvent<HTMLCanvasElement>,
  ) {
    if (
      !pattern ||
      selectedTool === "pan"
    ) {
      return;
    }

    const canvas =
      canvasRef.current;

    if (!canvas) {
      return;
    }

    const rect =
      canvas.getBoundingClientRect();

    const scaleX =
      canvas.width /
      rect.width;

    const scaleY =
      canvas.height /
      rect.height;

    const mouseX =
      (
        event.clientX -
        rect.left
      ) * scaleX;

    const mouseY =
      (
        event.clientY -
        rect.top
      ) * scaleY;

    const x =
      Math.floor(
        mouseX /
          CELL_SIZE,
      );

    const y =
      Math.floor(
        mouseY /
          CELL_SIZE,
      );

    if (
      x < 0 ||
      y < 0 ||
      x >= pattern.width ||
      y >= pattern.height
    ) {
      return;
    }

    const existingStitch =
      getStitchAt(
        pattern,
        x,
        y,
      );

    if (
      selectedTool ===
      "erase"
    ) {
      if (
        !existingStitch
      ) {
        return;
      }

      const historyEntry:
        StitchHistoryEntry =
        {
          x,
          y,
          before:
            existingStitch,
          after: null,
        };

      setPattern(
        updatePatternCell(
          pattern,
          x,
          y,
          null,
        ),
      );

      addHistoryEntry(
        historyEntry,
      );

      return;
    }

    const newStitch:
      Stitch = {
        x,
        y,

        colorId:
          selectedColorId,

        type: "full",
      };

    if (
      existingStitch &&
      existingStitch.colorId ===
        newStitch.colorId &&
      existingStitch.type ===
        newStitch.type
    ) {
      return;
    }

    const historyEntry:
      StitchHistoryEntry =
      {
        x,
        y,

        before:
          existingStitch,

        after:
          newStitch,
      };

    setPattern(
      updatePatternCell(
        pattern,
        x,
        y,
        newStitch,
      ),
    );

    addHistoryEntry(
      historyEntry,
    );
  }

  function handleUndo() {
    if (!pattern) {
      return;
    }

    const result =
      undoPatternChange(
        pattern,
        undoStack,
        redoStack,
      );

    if (!result) {
      return;
    }

    setPattern(
      result.pattern,
    );

    setUndoStack(
      result.undoStack,
    );

    setRedoStack(
      result.redoStack,
    );
  }

  function handleRedo() {
    if (!pattern) {
      return;
    }

    const result =
      redoPatternChange(
        pattern,
        undoStack,
        redoStack,
      );

    if (!result) {
      return;
    }

    setPattern(
      result.pattern,
    );

    setUndoStack(
      result.undoStack,
    );

    setRedoStack(
      result.redoStack,
    );
  }

  function sanitizeFilename(
    value: string,
  ) {
    const sanitized =
      value
        .trim()
        .replace(
          /[<>:"/\\|?*]+/g,
          "-",
        )
        .replace(
          /\s+/g,
          "-",
        );

    return (
      sanitized ||
      "pattern"
    );
  }

  function savePattern() {
    if (!pattern) {
      return;
    }

    const patternToSave:
      Pattern = {
        ...pattern,

        metadata: {
          ...pattern.metadata,

          updatedAt:
            new Date()
              .toISOString(),
        },
      };

    setPattern(
      patternToSave,
    );

    const json =
      JSON.stringify(
        patternToSave,
        null,
        2,
      );

    const blob =
      new Blob(
        [json],
        {
          type:
            "application/json",
        },
      );

    const url =
      URL.createObjectURL(
        blob,
      );

    const link =
      document.createElement(
        "a",
      );

    link.href = url;

    link.download =
      `${sanitizeFilename(
        patternToSave.name,
      )}.stitch`;

    document.body.appendChild(
      link,
    );

    link.click();
    link.remove();

    URL.revokeObjectURL(
      url,
    );
  }

  function openPatternFileSelector() {
    fileInputRef.current?.click();
  }

  async function handleOpenPattern(
    event:
      React.ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const text =
        await file.text();

      const data:
        unknown =
        JSON.parse(text);

      if (
        !isValidPattern(
          data,
        )
      ) {
        alert(
          "El archivo no es un patrón StitchDesigner válido o utiliza una versión no compatible.",
        );

        event.target.value =
          "";

        return;
      }

      setPattern(data);

      setSelectedColorId(
        data.palette[0]?.id ??
          internalPalette[0]
            .id,
      );

      setSelectedTool(
        "stitch",
      );

      setZoom(1);

      setUndoStack([]);
      setRedoStack([]);
    } catch {
      alert(
        "No se ha podido abrir el archivo. Comprueba que es un archivo .stitch válido.",
      );
    }

    event.target.value =
      "";
  }

  function exportPatternAsPng() {
    if (!pattern) {
      return;
    }

    const canvas =
      canvasRef.current;

    if (!canvas) {
      return;
    }

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          alert(
            "No se ha podido generar la imagen PNG.",
          );

          return;
        }

        const url =
          URL.createObjectURL(
            blob,
          );

        const link =
          document.createElement(
            "a",
          );

        link.href = url;

        link.download =
          `${sanitizeFilename(
            pattern.name,
          )}.png`;

        document.body.appendChild(
          link,
        );

        link.click();
        link.remove();

        URL.revokeObjectURL(
          url,
        );
      },
      "image/png",
    );
  }

  function changeZoom(
    amount: number,
  ) {
    if (!pattern) {
      return;
    }

    setZoom(
      (currentZoom) => {
        const newZoom =
          currentZoom +
          amount;

        return Math.min(
          MAX_ZOOM,

          Math.max(
            MIN_ZOOM,

            Math.round(
              newZoom *
                100,
            ) / 100,
          ),
        );
      },
    );
  }

  function resetZoom() {
    if (!pattern) {
      return;
    }

    setZoom(1);
  }

  function handleWheel(
    event:
      React.WheelEvent<HTMLElement>,
  ) {
    if (!pattern) {
      return;
    }

    event.preventDefault();

    if (
      event.deltaY < 0
    ) {
      changeZoom(
        0.1,
      );
    } else {
      changeZoom(
        -0.1,
      );
    }
  }

  function handlePanStart(
    event:
      React.MouseEvent<HTMLElement>,
  ) {
    if (
      selectedTool !==
      "pan"
    ) {
      return;
    }

    const workspace =
      workspaceRef.current;

    if (!workspace) {
      return;
    }

    setIsPanning(
      true,
    );

    panStartRef.current =
      {
        x:
          event.clientX,

        y:
          event.clientY,

        scrollLeft:
          workspace.scrollLeft,

        scrollTop:
          workspace.scrollTop,
      };
  }

  function handlePanMove(
    event:
      React.MouseEvent<HTMLElement>,
  ) {
    if (
      !isPanning ||
      selectedTool !==
        "pan"
    ) {
      return;
    }

    const workspace =
      workspaceRef.current;

    if (!workspace) {
      return;
    }

    const deltaX =
      event.clientX -
      panStartRef.current
        .x;

    const deltaY =
      event.clientY -
      panStartRef.current
        .y;

    workspace.scrollLeft =
      panStartRef.current
        .scrollLeft -
      deltaX;

    workspace.scrollTop =
      panStartRef.current
        .scrollTop -
      deltaY;
  }

  function handlePanEnd() {
    setIsPanning(
      false,
    );
  }

  useEffect(() => {
    const canvas =
      canvasRef.current;

    if (
      !canvas ||
      !pattern
    ) {
      return;
    }

    renderPatternToCanvas(
      canvas,
      pattern,
    );
  }, [pattern]);

  const displayedWidth =
    pattern?.width ??
    100;

  const displayedHeight =
    pattern?.height ??
    80;

  const displayedStitches =
    pattern
      ?.stitches
      .length ?? 0;

  const displayedColors =
    pattern
      ? new Set(
          pattern.stitches.map(
            (stitch) =>
              stitch.colorId,
          ),
        ).size
      : 0;

  return (
    <main className="h-screen overflow-hidden bg-slate-100 text-slate-900">
      <div className="flex h-full min-h-0 flex-col">
        <div className="shrink-0">
          <EditorHeader
            patternName={
              pattern?.name ??
              null
            }
            hasPattern={
              Boolean(pattern)
            }
            canUndo={
              Boolean(pattern) &&
              undoStack.length > 0
            }
            canRedo={
              Boolean(pattern) &&
              redoStack.length > 0
            }
            fileInputRef={
              fileInputRef
            }
            onNew={
              openNewPatternDialog
            }
            onOpen={
              openPatternFileSelector
            }
            onSave={
              savePattern
            }
            onUndo={
              handleUndo
            }
            onRedo={
              handleRedo
            }
            onExportPng={
              exportPatternAsPng
            }
            onOpenFile={
              handleOpenPattern
            }
          />
        </div>

        <section className="grid min-h-0 flex-1 grid-cols-[180px_minmax(0,1fr)_240px] overflow-hidden">
          <ToolsPanel
            selectedTool={
              selectedTool
            }
            onSelectTool={
              setSelectedTool
            }
          />

          <PatternCanvas
            pattern={
              pattern
            }
            zoom={
              zoom
            }
            selectedTool={
              selectedTool
            }
            isPanning={
              isPanning
            }
            canvasRef={
              canvasRef
            }
            workspaceRef={
              workspaceRef
            }
            onCanvasClick={
              handleCanvasClick
            }
            onWheel={
              handleWheel
            }
            onPanStart={
              handlePanStart
            }
            onPanMove={
              handlePanMove
            }
            onPanEnd={
              handlePanEnd
            }
          />

          <PalettePanel
            palette={
              activePalette
            }
            selectedThread={
              selectedThread
            }
            selectedColorId={
              selectedColorId
            }
            onSelectColor={
              setSelectedColorId
            }
          />
        </section>

        <div className="shrink-0">
          <StatusBar
            width={
              displayedWidth
            }
            height={
              displayedHeight
            }
            stitches={
              displayedStitches
            }
            colors={
              displayedColors
            }
            zoom={
              zoom
            }
            hasPattern={
              Boolean(pattern)
            }
            minZoom={
              MIN_ZOOM
            }
            maxZoom={
              MAX_ZOOM
            }
            onZoomOut={() =>
              changeZoom(
                -0.25,
              )
            }
            onZoomIn={() =>
              changeZoom(
                0.25,
              )
            }
            onResetZoom={
              resetZoom
            }
          />
        </div>
      </div>

      <NewPatternDialog
        open={
          showNewPattern
        }
        name={
          name
        }
        width={
          width
        }
        height={
          height
        }
        fabricType={
          fabricType
        }
        fabricCount={
          fabricCount
        }
        fabricColor={
          fabricColor
        }
        onNameChange={
          setName
        }
        onWidthChange={
          setWidth
        }
        onHeightChange={
          setHeight
        }
        onFabricTypeChange={
          setFabricType
        }
        onFabricCountChange={
          setFabricCount
        }
        onFabricColorChange={
          setFabricColor
        }
        onCancel={() =>
          setShowNewPattern(
            false,
          )
        }
        onCreate={
          createPattern
        }
      />
    </main>
  );
}