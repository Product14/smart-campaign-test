export type CampaignStatus = "draft" | "scheduled" | "active" | "completed";
export type CampaignType = "banner" | "billboard";

export interface Campaign {
  id: string;
  title: string;
  description: string;
  status: CampaignStatus;
  type: CampaignType;
  carIds: string[];
  startDate: string | null;
  endDate: string | null;
  bannerData: string | null;
  templateId: string | null;
  thumbnail: string | null;
  dimensions: { width: number; height: number };
  createdAt: string;
  updatedAt: string;
}

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  image: string;
  color: string;
  mileage: number;
  fuelType: string;
  features: string[];
}

export interface BannerTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  canvasJSON: string;
  dimensions: { width: number; height: number };
}

export interface DimensionPreset {
  label: string;
  width: number;
  height: number;
  category: string;
}

export const DIMENSION_PRESETS: DimensionPreset[] = [
  { label: "Web Banner (728x90)", width: 728, height: 90, category: "banner" },
  { label: "Medium Rectangle (300x250)", width: 300, height: 250, category: "banner" },
  { label: "Leaderboard (728x90)", width: 728, height: 90, category: "banner" },
  { label: "Half Page (300x600)", width: 300, height: 600, category: "banner" },
  { label: "Social Media (1200x630)", width: 1200, height: 630, category: "banner" },
  { label: "Instagram Post (1080x1080)", width: 1080, height: 1080, category: "banner" },
  { label: "Billboard HD (1920x1080)", width: 1920, height: 1080, category: "billboard" },
  { label: "Billboard Wide (2560x720)", width: 2560, height: 720, category: "billboard" },
  { label: "Billboard Vertical (1080x1920)", width: 1080, height: 1920, category: "billboard" },
];
