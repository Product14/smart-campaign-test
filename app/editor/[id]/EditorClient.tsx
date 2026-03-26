"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import * as fabric from "fabric";
import { Campaign, Car, BannerTemplate } from "@/lib/types";
import { getCampaign, saveCampaign, getCars } from "@/lib/store";
import { CanvasEditor } from "@/components/editor/CanvasEditor";
import { EditorToolbar } from "@/components/editor/EditorToolbar";
import { PropertiesPanel } from "@/components/editor/PropertiesPanel";
import { TemplateGallery } from "@/components/editor/TemplateGallery";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Layout, Paintbrush } from "lucide-react";
import Link from "next/link";

type EditorMode = "templates" | "canvas";

export default function EditorClient() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [selected, setSelected] = useState<fabric.FabricObject | null>(null);
  const [mode, setMode] = useState<EditorMode>("templates");
  const [canvasKey, setCanvasKey] = useState(0);
  const [initialData, setInitialData] = useState<string | null>(null);

  useEffect(() => {
    const c = getCampaign(id);
    if (c) {
      setCampaign(c);
      const allCars = getCars();
      const linked = allCars.filter((car) => c.carIds.includes(car.id));
      setCars(linked.length > 0 ? linked : allCars.slice(0, 4));

      if (c.bannerData) {
        setInitialData(c.bannerData);
        setMode("canvas");
      }
    }
  }, [id]);

  const handleCanvasReady = useCallback((c: fabric.Canvas) => {
    setCanvas(c);
  }, []);

  const handleSelectionChange = useCallback((obj: fabric.FabricObject | null) => {
    setSelected(obj);
  }, []);

  const handleSelectTemplate = (template: BannerTemplate) => {
    setInitialData(template.canvasJSON);
    setMode("canvas");
    setCanvasKey((k) => k + 1);
  };

  const handleBlankCanvas = () => {
    setInitialData(null);
    setMode("canvas");
    setCanvasKey((k) => k + 1);
  };

  const handleSave = () => {
    if (!canvas || !campaign) return;
    const json = JSON.stringify(canvas.toJSON());
    const thumbnail = canvas.toDataURL({
      format: "png",
      quality: 0.5,
      multiplier: 0.3,
    });
    const updated: Campaign = {
      ...campaign,
      bannerData: json,
      thumbnail,
      updatedAt: new Date().toISOString(),
    };
    saveCampaign(updated);
    setCampaign(updated);
    alert("Campaign saved successfully!");
  };

  const handleExport = () => {
    if (!canvas) return;
    const dataUrl = canvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 2,
    });
    const link = document.createElement("a");
    link.download = `${campaign?.title || "banner"}.png`;
    link.href = dataUrl;
    link.click();
  };

  if (!campaign) {
    return (
      <div className="p-6 text-center py-20">
        <p className="text-muted-foreground">Campaign not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/")}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="bg-card border-b px-4 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button size="icon" variant="ghost">
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-sm font-semibold">{campaign.title}</h2>
            <p className="text-xs text-muted-foreground">
              {campaign.dimensions.width} x {campaign.dimensions.height} &middot;{" "}
              {campaign.type}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={mode === "templates" ? "default" : "outline"}
            onClick={() => setMode("templates")}
          >
            <Layout className="w-4 h-4" />
            Templates
          </Button>
          <Button
            size="sm"
            variant={mode === "canvas" ? "default" : "outline"}
            onClick={() => {
              if (mode !== "canvas") handleBlankCanvas();
            }}
          >
            <Paintbrush className="w-4 h-4" />
            Canvas
          </Button>
        </div>
      </div>

      {mode === "templates" ? (
        <div className="flex-1 overflow-auto">
          <TemplateGallery
            onSelect={handleSelectTemplate}
            onBlank={handleBlankCanvas}
          />
        </div>
      ) : (
        <>
          <EditorToolbar
            canvas={canvas}
            cars={cars}
            onSave={handleSave}
            onExport={handleExport}
          />
          <div className="flex flex-1 overflow-hidden">
            <CanvasEditor
              key={canvasKey}
              width={campaign.dimensions.width}
              height={campaign.dimensions.height}
              initialData={initialData}
              onCanvasReady={handleCanvasReady}
              onSelectionChange={handleSelectionChange}
            />
            <PropertiesPanel canvas={canvas} selected={selected} />
          </div>
        </>
      )}
    </div>
  );
}
