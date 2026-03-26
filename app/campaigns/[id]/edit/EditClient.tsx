"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Campaign, CampaignType, DIMENSION_PRESETS } from "@/lib/types";
import { getCampaign, saveCampaign } from "@/lib/store";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CarSelector } from "@/components/campaigns/CarSelector";
import { SchedulePicker } from "@/components/campaigns/SchedulePicker";
import { Save, ChevronLeft, Paintbrush, Image, Monitor } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function EditClient() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<CampaignType>("banner");
  const [carIds, setCarIds] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dimensionIdx, setDimensionIdx] = useState(4);

  useEffect(() => {
    const c = getCampaign(id);
    if (c) {
      setCampaign(c);
      setTitle(c.title);
      setDescription(c.description);
      setType(c.type);
      setCarIds(c.carIds);
      setStartDate(c.startDate || "");
      setEndDate(c.endDate || "");
      const idx = DIMENSION_PRESETS.findIndex(
        (p) => p.width === c.dimensions.width && p.height === c.dimensions.height
      );
      if (idx >= 0) setDimensionIdx(idx);
    }
  }, [id]);

  const handleSave = () => {
    if (!campaign) return;
    const dim = DIMENSION_PRESETS[dimensionIdx] || DIMENSION_PRESETS[4];
    const updated: Campaign = {
      ...campaign,
      title,
      description,
      type,
      carIds,
      startDate: startDate || null,
      endDate: endDate || null,
      status: startDate ? "scheduled" : "draft",
      dimensions: { width: dim.width, height: dim.height },
    };
    saveCampaign(updated);
    router.push("/");
  };

  if (!campaign) {
    return (
      <DashboardLayout>
        <Header title="Edit Campaign" />
        <div className="p-6 text-center py-20">
          <p className="text-muted-foreground">Campaign not found.</p>
          <Button variant="outline" className="mt-4" onClick={() => router.push("/")}>
            Back to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Header title="Edit Campaign" subtitle={campaign.title} />
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <div className="bg-card rounded-xl border p-6 shadow-sm space-y-5">
          <h2 className="text-lg font-semibold">Campaign Details</h2>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Type</label>
            <div className="grid grid-cols-2 gap-3">
              {(["banner", "billboard"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setType(t);
                    const first = DIMENSION_PRESETS.findIndex((p) => p.category === t);
                    if (first >= 0) setDimensionIdx(first);
                  }}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-colors ${
                    type === t
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  {t === "banner" ? <Image className="w-6 h-6 text-primary" /> : <Monitor className="w-6 h-6 text-primary" />}
                  <span className="text-sm font-semibold capitalize">{t}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Dimensions</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DIMENSION_PRESETS.map((p, idx) => (
                <button
                  key={p.label}
                  onClick={() => setDimensionIdx(idx)}
                  className={`text-left p-3 rounded-lg border text-sm transition-colors ${
                    dimensionIdx === idx
                      ? "border-primary bg-primary/5 font-medium"
                      : "border-border hover:border-primary/30"
                  } ${p.category !== type ? "opacity-40 pointer-events-none" : ""}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold">Vehicles</h2>
          <CarSelector selectedIds={carIds} onChange={setCarIds} />
        </div>

        <div className="bg-card rounded-xl border p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold">Schedule</h2>
          <SchedulePicker
            startDate={startDate}
            endDate={endDate}
            onStartChange={setStartDate}
            onEndChange={setEndDate}
          />
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => router.push("/")}>
            <ChevronLeft className="w-4 h-4" />
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push(`/editor/${campaign.id}`)}>
              <Paintbrush className="w-4 h-4" />
              Open Editor
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
