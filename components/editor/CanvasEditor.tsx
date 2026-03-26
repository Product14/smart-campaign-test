"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import * as fabric from "fabric";

interface CanvasEditorProps {
  width: number;
  height: number;
  initialData?: string | null;
  onCanvasReady?: (canvas: fabric.Canvas) => void;
  onSelectionChange?: (obj: fabric.FabricObject | null) => void;
}

export function CanvasEditor({
  width,
  height,
  initialData,
  onCanvasReady,
  onSelectionChange,
}: CanvasEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const [zoom, setZoom] = useState(1);

  const initCanvas = useCallback(() => {
    if (!canvasRef.current || fabricRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width,
      height,
      backgroundColor: "#ffffff",
      selection: true,
    });

    canvas.on("selection:created", (e) => {
      onSelectionChange?.(e.selected?.[0] || null);
    });
    canvas.on("selection:updated", (e) => {
      onSelectionChange?.(e.selected?.[0] || null);
    });
    canvas.on("selection:cleared", () => {
      onSelectionChange?.(null);
    });
    canvas.on("object:modified", () => {
      onSelectionChange?.(canvas.getActiveObject() || null);
    });

    fabricRef.current = canvas;
    onCanvasReady?.(canvas);

    if (initialData) {
      try {
        canvas.loadFromJSON(initialData).then(() => {
          canvas.renderAll();
        });
      } catch {
        // ignore invalid JSON
      }
    }

    // Compute initial zoom to fit the container
    const containerWidth = canvasRef.current.parentElement?.clientWidth || 800;
    const scale = Math.min(1, (containerWidth - 40) / width);
    setZoom(scale);
  }, [width, height, initialData, onCanvasReady, onSelectionChange]);

  useEffect(() => {
    initCanvas();
    return () => {
      fabricRef.current?.dispose();
      fabricRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex-1 overflow-auto bg-slate-100 flex items-start justify-center p-5">
      <div
        className="shadow-xl border rounded-lg overflow-hidden"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "top center",
        }}
      >
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
