"use client";

import { useState, useEffect } from "react";
import { Car } from "@/lib/types";
import { getCars } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Search, Check } from "lucide-react";

interface CarSelectorProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export function CarSelector({ selectedIds, onChange }: CarSelectorProps) {
  const [cars, setCars] = useState<Car[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setCars(getCars());
  }, []);

  const toggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((i) => i !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const filtered = cars.filter((c) =>
    `${c.make} ${c.model} ${c.year}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search vehicles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>
      <p className="text-sm text-muted-foreground">
        {selectedIds.length} vehicle{selectedIds.length !== 1 ? "s" : ""} selected
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
        {filtered.map((car) => {
          const isSelected = selectedIds.includes(car.id);
          return (
            <button
              key={car.id}
              onClick={() => toggle(car.id)}
              className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-colors ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/30"
              }`}
            >
              <img
                src={car.image}
                alt={`${car.make} ${car.model}`}
                className="w-14 h-10 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {car.make} {car.model}
                </p>
                <p className="text-xs text-muted-foreground">
                  {car.year} &middot; ${car.price.toLocaleString()}
                </p>
              </div>
              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
