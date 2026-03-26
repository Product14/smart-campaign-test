import { Campaign, Car } from "./types";
import { MOCK_CARS, SAMPLE_CAMPAIGNS } from "./mock-data";

const CAMPAIGNS_KEY = "smart_campaigns";
const CARS_KEY = "smart_campaigns_cars";
const INITIALIZED_KEY = "smart_campaigns_initialized";

function initializeIfNeeded() {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(INITIALIZED_KEY)) return;

  localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(SAMPLE_CAMPAIGNS));
  localStorage.setItem(CARS_KEY, JSON.stringify(MOCK_CARS));
  localStorage.setItem(INITIALIZED_KEY, "true");
}

// Campaigns
export function getCampaigns(): Campaign[] {
  if (typeof window === "undefined") return [];
  initializeIfNeeded();
  const data = localStorage.getItem(CAMPAIGNS_KEY);
  return data ? JSON.parse(data) : [];
}

export function getCampaign(id: string): Campaign | null {
  const campaigns = getCampaigns();
  return campaigns.find((c) => c.id === id) || null;
}

export function saveCampaign(campaign: Campaign): void {
  const campaigns = getCampaigns();
  const index = campaigns.findIndex((c) => c.id === campaign.id);
  if (index >= 0) {
    campaigns[index] = { ...campaign, updatedAt: new Date().toISOString() };
  } else {
    campaigns.push(campaign);
  }
  localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(campaigns));
}

export function deleteCampaign(id: string): void {
  const campaigns = getCampaigns().filter((c) => c.id !== id);
  localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(campaigns));
}

export function duplicateCampaign(id: string): Campaign | null {
  const campaign = getCampaign(id);
  if (!campaign) return null;

  const newCampaign: Campaign = {
    ...campaign,
    id: `camp-${Date.now()}`,
    title: `${campaign.title} (Copy)`,
    status: "draft",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  saveCampaign(newCampaign);
  return newCampaign;
}

// Cars
export function getCars(): Car[] {
  if (typeof window === "undefined") return [];
  initializeIfNeeded();
  const data = localStorage.getItem(CARS_KEY);
  return data ? JSON.parse(data) : [];
}

export function getCar(id: string): Car | null {
  const cars = getCars();
  return cars.find((c) => c.id === id) || null;
}

export function saveCar(car: Car): void {
  const cars = getCars();
  const index = cars.findIndex((c) => c.id === car.id);
  if (index >= 0) {
    cars[index] = car;
  } else {
    cars.push(car);
  }
  localStorage.setItem(CARS_KEY, JSON.stringify(cars));
}

export function deleteCar(id: string): void {
  const cars = getCars().filter((c) => c.id !== id);
  localStorage.setItem(CARS_KEY, JSON.stringify(cars));
}
