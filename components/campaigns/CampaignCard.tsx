"use client";

import { Campaign } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Paintbrush,
  Copy,
  Trash2,
  Calendar,
  Image,
  Monitor,
  MoreVertical,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { useState, useRef, useEffect } from "react";

interface CampaignCardProps {
  campaign: Campaign;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}

const statusConfig: Record<string, { variant: "default" | "success" | "warning" | "secondary" | "destructive"; label: string }> = {
  draft: { variant: "secondary", label: "Draft" },
  scheduled: { variant: "warning", label: "Scheduled" },
  active: { variant: "success", label: "Active" },
  completed: { variant: "default", label: "Completed" },
};

export function CampaignCard({ campaign, onDelete, onDuplicate }: CampaignCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const status = statusConfig[campaign.status];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-card rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
      <div className="relative h-40 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
        {campaign.thumbnail ? (
          <img
            src={campaign.thumbnail}
            alt={campaign.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-400">
            {campaign.type === "billboard" ? (
              <Monitor className="w-10 h-10" />
            ) : (
              <Image className="w-10 h-10" />
            )}
            <span className="text-xs font-medium uppercase tracking-wider">
              {campaign.dimensions.width} x {campaign.dimensions.height}
            </span>
          </div>
        )}
        <Badge variant={status.variant} className="absolute top-3 left-3">
          {status.label}
        </Badge>
        <Badge variant="outline" className="absolute top-3 right-3 bg-white/90 text-xs">
          {campaign.type}
        </Badge>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-sm line-clamp-1">{campaign.title}</h3>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 rounded hover:bg-secondary transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-muted-foreground" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-8 bg-popover border rounded-lg shadow-lg py-1 w-36 z-10">
                <button
                  onClick={() => { onDuplicate(campaign.id); setMenuOpen(false); }}
                  className="flex items-center gap-2 px-3 py-2 text-sm w-full hover:bg-accent transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" /> Duplicate
                </button>
                <button
                  onClick={() => { onDelete(campaign.id); setMenuOpen(false); }}
                  className="flex items-center gap-2 px-3 py-2 text-sm w-full hover:bg-accent transition-colors text-destructive"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {campaign.description}
        </p>

        {(campaign.startDate || campaign.endDate) && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {campaign.startDate
                ? format(new Date(campaign.startDate), "MMM d, yyyy")
                : "Not set"}
              {campaign.endDate &&
                ` - ${format(new Date(campaign.endDate), "MMM d, yyyy")}`}
            </span>
          </div>
        )}

        <div className="flex gap-2">
          <Link href={`/editor/${campaign.id}`} className="flex-1">
            <Button size="sm" className="w-full" variant="default">
              <Paintbrush className="w-3.5 h-3.5" />
              Edit Banner
            </Button>
          </Link>
          <Link href={`/campaigns/${campaign.id}/edit`}>
            <Button size="sm" variant="outline">
              Edit
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
