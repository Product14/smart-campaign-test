"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Campaign, CampaignType, DIMENSION_PRESETS } from "@/lib/types";
import { saveCampaign } from "@/lib/store";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CarSelector } from "@/components/campaigns/CarSelector";
import { SchedulePicker } from "@/components/campaigns/SchedulePicker";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Image,
  Monitor,
  Paintbrush,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const STEPS = ["Details", "Vehicles", "Schedule", "Finalize"];

export default function NewCampaignPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<CampaignType>("banner");
  const [dimensionIdx, setDimensionIdx] = useState(4); // Social Media default
  const [carIds, setCarIds] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredPresets = DIMENSION_PRESETS.filter((p) => p.category === type);

  const canNext = () => {
    if (step === 0) return title.trim().length > 0;
    return true;
  };

  const handleCreate = () => {
    const dim = DIMENSION_PRESETS[dimensionIdx] || DIMENSION_PRESETS[4];
    const now = new Date().toISOString();
    const campaign: Campaign = {
      id: `camp-${Date.now()}`,
      title,
      description,
      status: startDate ? "scheduled" : "draft",
      type,
      carIds,
      startDate: startDate || null,
      endDate: endDate || null,
      bannerData: null,
      templateId: null,
      thumbnail: null,
      dimensions: { width: dim.width, height: dim.height },
      createdAt: now,
      updatedAt: now,
    };
    saveCampaign(campaign);
    router.push(`/editor/${campaign.id}`);
  };

  return (
    <DashboardLayout>
      <Header title="Create Campaign" subtitle="Set up a new promotional campaign" />
      <div className="p-6 max-w-3xl mx-auto">
        {/* Progress steps */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0 transition-colors ${
                  i < step
                    ? "bg-primary text-white"
                    : i === step
                    ? "bg-primary text-white"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span
                className={`text-sm font-medium hidden sm:block ${
                  i <= step ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {s}
              </span>
              {i < STEPS.length - 1 && (
                <div
                  className={`h-px flex-1 ${
                    i < step ? "bg-primary" : "bg-border"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="bg-card rounded-xl border p-6 shadow-sm">
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold">Campaign Details</h2>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Campaign Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Summer Clearance Sale 2024"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of your campaign..."
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Campaign Type</label>
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
                      {t === "banner" ? (
                        <Image className="w-6 h-6 text-primary" />
                      ) : (
                        <Monitor className="w-6 h-6 text-primary" />
                      )}
                      <div className="text-left">
                        <p className="text-sm font-semibold capitalize">{t}</p>
                        <p className="text-xs text-muted-foreground">
                          {t === "banner" ? "Web & social ads" : "Large displays"}
                        </p>
                      </div>
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
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Select Vehicles</h2>
              <p className="text-sm text-muted-foreground">
                Choose the cars you want to promote in this campaign.
              </p>
              <CarSelector selectedIds={carIds} onChange={setCarIds} />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Schedule Campaign</h2>
              <SchedulePicker
                startDate={startDate}
                endDate={endDate}
                onStartChange={setStartDate}
                onEndChange={setEndDate}
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Review & Create</h2>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Title</span>
                  <span className="text-sm font-medium">{title}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Type</span>
                  <span className="text-sm font-medium capitalize">{type}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Dimensions</span>
                  <span className="text-sm font-medium">
                    {DIMENSION_PRESETS[dimensionIdx]?.label}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Vehicles</span>
                  <span className="text-sm font-medium">{carIds.length} selected</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Schedule</span>
                  <span className="text-sm font-medium">
                    {startDate
                      ? `${startDate} to ${endDate || "TBD"}`
                      : "Not scheduled (Draft)"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 p-4 rounded-lg bg-indigo-50 text-indigo-700">
                <Paintbrush className="w-5 h-5 shrink-0" />
                <p className="text-sm">
                  After creating, you&apos;ll be taken to the banner editor to design your creative.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => (step === 0 ? router.push("/") : setStep(step - 1))}
            >
              <ChevronLeft className="w-4 h-4" />
              {step === 0 ? "Cancel" : "Back"}
            </Button>
            {step < STEPS.length - 1 ? (
              <Button onClick={() => setStep(step + 1)} disabled={!canNext()}>
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={handleCreate}>
                <Paintbrush className="w-4 h-4" />
                Create & Design
              </Button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
