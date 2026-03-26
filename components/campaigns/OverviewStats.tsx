"use client";

import { Campaign, Car } from "@/lib/types";
import { Car as CarIcon, Megaphone, LinkIcon, CarFront, Warehouse } from "lucide-react";
import Link from "next/link";

interface OverviewStatsProps {
  campaigns: Campaign[];
  cars: Car[];
}

export function OverviewStats({ campaigns, cars }: OverviewStatsProps) {
  const totalCars = cars.length;

  const linkedCarIds = new Set(campaigns.flatMap((c) => c.carIds));
  const carsInCampaigns = linkedCarIds.size;
  const unlinkedCars = totalCars - carsInCampaigns;

  const activeCampaignCarIds = new Set(
    campaigns.filter((c) => c.status === "active").flatMap((c) => c.carIds)
  );
  const carsInActiveCampaigns = activeCampaignCarIds.size;

  return (
    <div className="rounded-2xl border bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-500 p-6 text-white shadow-lg">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left: Title area */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
            <Warehouse className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Inventory & Campaigns</h2>
            <p className="text-sm text-indigo-100">
              Overview of your vehicles and promotional reach
            </p>
          </div>
        </div>

        {/* Right: Stat pills */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Link href="/inventory" className="group">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 hover:bg-white/20 transition-colors cursor-pointer">
              <div className="flex items-center gap-2 mb-1">
                <CarIcon className="w-4 h-4 text-indigo-200" />
                <span className="text-xs text-indigo-200 font-medium">Total Inventory</span>
              </div>
              <p className="text-2xl font-bold">{totalCars}</p>
            </div>
          </Link>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
            <div className="flex items-center gap-2 mb-1">
              <LinkIcon className="w-4 h-4 text-emerald-300" />
              <span className="text-xs text-indigo-200 font-medium">In Campaigns</span>
            </div>
            <p className="text-2xl font-bold">
              {carsInCampaigns}
              <span className="text-sm font-normal text-indigo-200 ml-1">
                / {totalCars}
              </span>
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
            <div className="flex items-center gap-2 mb-1">
              <Megaphone className="w-4 h-4 text-amber-300" />
              <span className="text-xs text-indigo-200 font-medium">Active Promos</span>
            </div>
            <p className="text-2xl font-bold">
              {carsInActiveCampaigns}
              <span className="text-sm font-normal text-indigo-200 ml-1">vehicles</span>
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
            <div className="flex items-center gap-2 mb-1">
              <CarFront className="w-4 h-4 text-rose-300" />
              <span className="text-xs text-indigo-200 font-medium">Not Promoted</span>
            </div>
            <p className="text-2xl font-bold">
              {unlinkedCars}
              <span className="text-sm font-normal text-indigo-200 ml-1">vehicles</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
