"use client";

import * as fabric from "fabric";
import { Button } from "@/components/ui/button";
import {
  Type,
  Square,
  Circle,
  Triangle,
  ImagePlus,
  Download,
  Save,
  Undo2,
  Redo2,
  Trash2,
  Copy,
  Layers,
  ZoomIn,
  ZoomOut,
  Minus,
} from "lucide-react";
import { Car } from "@/lib/types";

interface EditorToolbarProps {
  canvas: fabric.Canvas | null;
  cars: Car[];
  onSave: () => void;
  onExport: () => void;
}

export function EditorToolbar({ canvas, cars, onSave, onExport }: EditorToolbarProps) {
  const addText = () => {
    if (!canvas) return;
    const text = new fabric.Textbox("Your Text Here", {
      left: 100,
      top: 100,
      width: 300,
      fontSize: 32,
      fontFamily: "Arial",
      fill: "#000000",
      fontWeight: "normal",
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  const addRect = () => {
    if (!canvas) return;
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      width: 200,
      height: 120,
      fill: "#3b82f6",
      rx: 8,
      ry: 8,
    });
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
  };

  const addCircle = () => {
    if (!canvas) return;
    const circle = new fabric.Circle({
      left: 150,
      top: 150,
      radius: 60,
      fill: "#8b5cf6",
    });
    canvas.add(circle);
    canvas.setActiveObject(circle);
    canvas.renderAll();
  };

  const addTriangle = () => {
    if (!canvas) return;
    const tri = new fabric.Triangle({
      left: 150,
      top: 100,
      width: 120,
      height: 120,
      fill: "#f59e0b",
    });
    canvas.add(tri);
    canvas.setActiveObject(tri);
    canvas.renderAll();
  };

  const addLine = () => {
    if (!canvas) return;
    const line = new fabric.Line([50, 100, 300, 100], {
      stroke: "#000000",
      strokeWidth: 3,
    });
    canvas.add(line);
    canvas.setActiveObject(line);
    canvas.renderAll();
  };

  const addImage = () => {
    if (!canvas) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const url = ev.target?.result as string;
        const imgEl = new Image();
        imgEl.onload = () => {
          const img = new fabric.FabricImage(imgEl, {
            left: 50,
            top: 50,
          });
          const scale = Math.min(300 / img.width!, 200 / img.height!);
          img.scale(scale);
          canvas.add(img);
          canvas.setActiveObject(img);
          canvas.renderAll();
        };
        imgEl.src = url;
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const addCarImage = (car: Car) => {
    if (!canvas) return;
    const imgEl = new Image();
    imgEl.crossOrigin = "anonymous";
    imgEl.onload = () => {
      const img = new fabric.FabricImage(imgEl, {
        left: 50,
        top: 50,
      });
      const scale = Math.min(300 / img.width!, 200 / img.height!);
      img.scale(scale);
      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.renderAll();
    };
    imgEl.src = car.image;
  };

  const deleteSelected = () => {
    if (!canvas) return;
    const active = canvas.getActiveObjects();
    active.forEach((obj) => canvas.remove(obj));
    canvas.discardActiveObject();
    canvas.renderAll();
  };

  const duplicateSelected = () => {
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active) return;
    active.clone().then((cloned: fabric.FabricObject) => {
      cloned.set({ left: (cloned.left || 0) + 20, top: (cloned.top || 0) + 20 });
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.renderAll();
    });
  };

  const bringForward = () => {
    if (!canvas) return;
    const obj = canvas.getActiveObject();
    if (obj) {
      canvas.bringObjectForward(obj);
      canvas.renderAll();
    }
  };

  const sendBackward = () => {
    if (!canvas) return;
    const obj = canvas.getActiveObject();
    if (obj) {
      canvas.sendObjectBackwards(obj);
      canvas.renderAll();
    }
  };

  return (
    <div className="bg-card border-b px-4 py-2 flex items-center gap-1 flex-wrap">
      <div className="flex items-center gap-1 pr-3 border-r mr-1">
        <Button size="icon" variant="ghost" title="Add Text" onClick={addText}>
          <Type className="w-4 h-4" />
        </Button>
        <Button size="icon" variant="ghost" title="Add Rectangle" onClick={addRect}>
          <Square className="w-4 h-4" />
        </Button>
        <Button size="icon" variant="ghost" title="Add Circle" onClick={addCircle}>
          <Circle className="w-4 h-4" />
        </Button>
        <Button size="icon" variant="ghost" title="Add Triangle" onClick={addTriangle}>
          <Triangle className="w-4 h-4" />
        </Button>
        <Button size="icon" variant="ghost" title="Add Line" onClick={addLine}>
          <Minus className="w-4 h-4" />
        </Button>
        <Button size="icon" variant="ghost" title="Upload Image" onClick={addImage}>
          <ImagePlus className="w-4 h-4" />
        </Button>
      </div>

      {cars.length > 0 && (
        <div className="flex items-center gap-1 pr-3 border-r mr-1">
          <span className="text-xs text-muted-foreground px-1">Cars:</span>
          {cars.slice(0, 4).map((car) => (
            <button
              key={car.id}
              onClick={() => addCarImage(car)}
              className="w-8 h-8 rounded border overflow-hidden hover:ring-2 hover:ring-primary transition-all"
              title={`Add ${car.make} ${car.model}`}
            >
              <img src={car.image} alt={car.make} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-1 pr-3 border-r mr-1">
        <Button size="icon" variant="ghost" title="Duplicate" onClick={duplicateSelected}>
          <Copy className="w-4 h-4" />
        </Button>
        <Button size="icon" variant="ghost" title="Delete" onClick={deleteSelected}>
          <Trash2 className="w-4 h-4" />
        </Button>
        <Button size="icon" variant="ghost" title="Bring Forward" onClick={bringForward}>
          <Layers className="w-4 h-4" />
        </Button>
        <Button size="icon" variant="ghost" title="Send Backward" onClick={sendBackward}>
          <Layers className="w-4 h-4 rotate-180" />
        </Button>
      </div>

      <div className="flex items-center gap-1 ml-auto">
        <Button size="sm" variant="outline" onClick={onSave}>
          <Save className="w-4 h-4" />
          Save
        </Button>
        <Button size="sm" variant="default" onClick={onExport}>
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>
    </div>
  );
}
