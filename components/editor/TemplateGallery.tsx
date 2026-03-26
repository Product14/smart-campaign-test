"use client";

import { BANNER_TEMPLATES } from "@/lib/templates";
import { BannerTemplate } from "@/lib/types";
import { Paintbrush } from "lucide-react";

interface TemplateGalleryProps {
  onSelect: (template: BannerTemplate) => void;
  onBlank: () => void;
}

const categoryColors: Record<string, string> = {
  sale: "bg-red-100 text-red-700",
  launch: "bg-blue-100 text-blue-700",
  seasonal: "bg-green-100 text-green-700",
  luxury: "bg-amber-100 text-amber-700",
  business: "bg-indigo-100 text-indigo-700",
};

export function TemplateGallery({ onSelect, onBlank }: TemplateGalleryProps) {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Choose a Template</h3>
          <p className="text-sm text-muted-foreground">
            Start with a template or create from scratch
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <button
          onClick={onBlank}
          className="group aspect-video rounded-xl border-2 border-dashed border-primary/30 hover:border-primary flex flex-col items-center justify-center gap-2 transition-colors bg-primary/5"
        >
          <Paintbrush className="w-8 h-8 text-primary/50 group-hover:text-primary transition-colors" />
          <span className="text-sm font-medium text-primary/70 group-hover:text-primary transition-colors">
            Blank Canvas
          </span>
        </button>

        {BANNER_TEMPLATES.map((tmpl) => {
          const parsed = JSON.parse(tmpl.canvasJSON);
          const bg = parsed.background || "#f0f0f0";
          return (
            <button
              key={tmpl.id}
              onClick={() => onSelect(tmpl)}
              className="group rounded-xl border overflow-hidden hover:ring-2 hover:ring-primary transition-all shadow-sm hover:shadow-md"
            >
              <div
                className="aspect-video flex items-center justify-center p-4 relative"
                style={{ backgroundColor: bg }}
              >
                <div className="text-center">
                  <p
                    className="font-bold text-sm"
                    style={{
                      color: bg === "#18181b" || bg === "#0f172a" || bg === "#065f46" || bg === "#1e3a5f" || bg === "#0c2340"
                        ? "#ffffff"
                        : "#ffffff",
                    }}
                  >
                    {tmpl.name}
                  </p>
                </div>
                <span
                  className={`absolute top-2 left-2 text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                    categoryColors[tmpl.category] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {tmpl.category}
                </span>
              </div>
              <div className="p-2 bg-white">
                <p className="text-xs font-medium text-left truncate">{tmpl.name}</p>
                <p className="text-[10px] text-muted-foreground text-left truncate">
                  {tmpl.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
