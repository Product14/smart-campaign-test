"use client";

import { useEffect, useState } from "react";
import * as fabric from "fabric";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Palette,
  Move,
  Maximize,
} from "lucide-react";

interface PropertiesPanelProps {
  canvas: fabric.Canvas | null;
  selected: fabric.FabricObject | null;
}

const FONT_FAMILIES = [
  "Arial",
  "Helvetica",
  "Georgia",
  "Times New Roman",
  "Courier New",
  "Verdana",
  "Impact",
];

const FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48, 56, 64, 72, 80, 96];

export function PropertiesPanel({ canvas, selected }: PropertiesPanelProps) {
  const [fill, setFill] = useState("#000000");
  const [stroke, setStroke] = useState("");
  const [strokeWidth, setStrokeWidth] = useState(0);
  const [opacity, setOpacity] = useState(100);
  const [fontSize, setFontSize] = useState(32);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontWeight, setFontWeight] = useState("normal");
  const [fontStyle, setFontStyle] = useState("normal");
  const [underline, setUnderline] = useState(false);
  const [textAlign, setTextAlign] = useState("left");
  const [bgColor, setBgColor] = useState("#ffffff");

  useEffect(() => {
    if (!selected) return;
    setFill((selected.fill as string) || "#000000");
    setStroke((selected.stroke as string) || "");
    setStrokeWidth(selected.strokeWidth || 0);
    setOpacity(Math.round((selected.opacity || 1) * 100));

    if (selected instanceof fabric.Textbox) {
      setFontSize(selected.fontSize || 32);
      setFontFamily(selected.fontFamily || "Arial");
      setFontWeight((selected.fontWeight as string) || "normal");
      setFontStyle(selected.fontStyle || "normal");
      setUnderline(selected.underline || false);
      setTextAlign(selected.textAlign || "left");
    }
  }, [selected]);

  useEffect(() => {
    if (!canvas) return;
    setBgColor((canvas.backgroundColor as string) || "#ffffff");
  }, [canvas]);

  const update = (props: Record<string, unknown>) => {
    if (!canvas || !selected) return;
    selected.set(props);
    canvas.renderAll();
  };

  const updateBg = (color: string) => {
    if (!canvas) return;
    setBgColor(color);
    canvas.backgroundColor = color;
    canvas.renderAll();
  };

  const isText = selected instanceof fabric.Textbox;

  if (!selected) {
    return (
      <div className="w-64 bg-card border-l p-4 overflow-y-auto shrink-0">
        <h3 className="font-semibold text-sm mb-4">Properties</h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Canvas Background</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => updateBg(e.target.value)}
                className="w-8 h-8 rounded border cursor-pointer"
              />
              <Input
                value={bgColor}
                onChange={(e) => updateBg(e.target.value)}
                className="flex-1 h-8 text-xs"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-8">
            Select an object to edit its properties
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-card border-l p-4 overflow-y-auto shrink-0">
      <h3 className="font-semibold text-sm mb-4">Properties</h3>
      <div className="space-y-4">
        {/* Fill */}
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block flex items-center gap-1">
            <Palette className="w-3 h-3" /> Fill Color
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={fill}
              onChange={(e) => {
                setFill(e.target.value);
                update({ fill: e.target.value });
              }}
              className="w-8 h-8 rounded border cursor-pointer"
            />
            <Input
              value={fill}
              onChange={(e) => {
                setFill(e.target.value);
                update({ fill: e.target.value });
              }}
              className="flex-1 h-8 text-xs"
            />
          </div>
        </div>

        {/* Stroke */}
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Stroke</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={stroke || "#000000"}
              onChange={(e) => {
                setStroke(e.target.value);
                update({ stroke: e.target.value });
              }}
              className="w-8 h-8 rounded border cursor-pointer"
            />
            <Input
              type="number"
              value={strokeWidth}
              onChange={(e) => {
                const v = parseInt(e.target.value) || 0;
                setStrokeWidth(v);
                update({ strokeWidth: v, stroke: stroke || "#000000" });
              }}
              className="w-16 h-8 text-xs"
              min={0}
              max={20}
            />
          </div>
        </div>

        {/* Opacity */}
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Opacity</label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={100}
              value={opacity}
              onChange={(e) => {
                const v = parseInt(e.target.value);
                setOpacity(v);
                update({ opacity: v / 100 });
              }}
              className="flex-1"
            />
            <span className="text-xs w-8 text-right">{opacity}%</span>
          </div>
        </div>

        {/* Text Properties */}
        {isText && (
          <>
            <div className="border-t pt-3">
              <label className="text-xs text-muted-foreground mb-1.5 block">Font Family</label>
              <select
                value={fontFamily}
                onChange={(e) => {
                  setFontFamily(e.target.value);
                  update({ fontFamily: e.target.value });
                }}
                className="w-full h-8 rounded border border-input bg-background px-2 text-xs"
              >
                {FONT_FAMILIES.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Font Size</label>
              <select
                value={fontSize}
                onChange={(e) => {
                  const v = parseInt(e.target.value);
                  setFontSize(v);
                  update({ fontSize: v });
                }}
                className="w-full h-8 rounded border border-input bg-background px-2 text-xs"
              >
                {FONT_SIZES.map((s) => (
                  <option key={s} value={s}>
                    {s}px
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Style</label>
              <div className="flex gap-1">
                <Button
                  size="icon"
                  variant={fontWeight === "bold" ? "default" : "outline"}
                  className="w-8 h-8"
                  onClick={() => {
                    const v = fontWeight === "bold" ? "normal" : "bold";
                    setFontWeight(v);
                    update({ fontWeight: v });
                  }}
                >
                  <Bold className="w-3.5 h-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant={fontStyle === "italic" ? "default" : "outline"}
                  className="w-8 h-8"
                  onClick={() => {
                    const v = fontStyle === "italic" ? "normal" : "italic";
                    setFontStyle(v);
                    update({ fontStyle: v });
                  }}
                >
                  <Italic className="w-3.5 h-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant={underline ? "default" : "outline"}
                  className="w-8 h-8"
                  onClick={() => {
                    setUnderline(!underline);
                    update({ underline: !underline });
                  }}
                >
                  <Underline className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Alignment</label>
              <div className="flex gap-1">
                {(["left", "center", "right"] as const).map((align) => (
                  <Button
                    key={align}
                    size="icon"
                    variant={textAlign === align ? "default" : "outline"}
                    className="w-8 h-8"
                    onClick={() => {
                      setTextAlign(align);
                      update({ textAlign: align });
                    }}
                  >
                    {align === "left" && <AlignLeft className="w-3.5 h-3.5" />}
                    {align === "center" && <AlignCenter className="w-3.5 h-3.5" />}
                    {align === "right" && <AlignRight className="w-3.5 h-3.5" />}
                  </Button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Canvas Background */}
        <div className="border-t pt-3">
          <label className="text-xs text-muted-foreground mb-1.5 block">Canvas Background</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={bgColor}
              onChange={(e) => updateBg(e.target.value)}
              className="w-8 h-8 rounded border cursor-pointer"
            />
            <Input
              value={bgColor}
              onChange={(e) => updateBg(e.target.value)}
              className="flex-1 h-8 text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
