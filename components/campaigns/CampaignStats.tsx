"use client";

import { Campaign } from "@/lib/types";
import { LayoutDashboard, Zap, Clock, FileEdit } from "lucide-react";

interface CampaignStatsProps {
  campaigns: Campaign[];
}

export function CampaignStats({ campaigns }: CampaignStatsProps) {
  const total = campaigns.length;
  const active = campaigns.filter((c) => c.status === "active").length;
  const scheduled = campaigns.filter((c) => c.status === "scheduled").length;
  const drafts = campaigns.filter((c) => c.status === "draft").length;

  const stats = [
    {
      label: "Total Campaigns",
      value: total,
      icon: LayoutDashboard,
      color: "bg-indigo-50 text-indigo-600",
      iconBg: "bg-indigo-100",
    },
    {
      label: "Active",
      value: active,
      icon: Zap,
      color: "bg-emerald-50 text-emerald-600",
      iconBg: "bg-emerald-100",
    },
    {
      label: "Scheduled",
      value: scheduled,
      icon: Clock,
      color: "bg-amber-50 text-amber-600",
      iconBg: "bg-amber-100",
    },
    {
      label: "Drafts",
      value: drafts,
      icon: FileEdit,
      color: "bg-slate-50 text-slate-600",
      iconBg: "bg-slate-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-card rounded-xl border p-5 flex items-center gap-4 shadow-sm"
        >
          <div className={`w-12 h-12 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
            <stat.icon className={`w-6 h-6 ${stat.color.split(" ")[1]}`} />
          </div>
          <div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
