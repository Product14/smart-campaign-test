"use client";

import { Car } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Fuel, Gauge } from "lucide-react";

interface CarCardProps {
  car: Car;
  onEdit: (car: Car) => void;
  onDelete: (id: string) => void;
}

export function CarCard({ car, onEdit, onDelete }: CarCardProps) {
  return (
    <div className="bg-card rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
      <div className="relative h-44 bg-gradient-to-br from-slate-100 to-slate-200">
        <img
          src={car.image}
          alt={`${car.make} ${car.model}`}
          className="w-full h-full object-cover"
        />
        <Badge variant="default" className="absolute top-3 right-3">
          {car.year}
        </Badge>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h3 className="font-semibold text-sm">
              {car.make} {car.model}
            </h3>
            <p className="text-lg font-bold text-primary">
              ${car.price.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <Fuel className="w-3.5 h-3.5" />
            {car.fuelType}
          </span>
          <span className="flex items-center gap-1">
            <Gauge className="w-3.5 h-3.5" />
            {car.mileage.toLocaleString()} mi
          </span>
          <span className="inline-block w-3 h-3 rounded-full border" style={{ backgroundColor: car.color.toLowerCase().includes("white") ? "#f0f0f0" : car.color.toLowerCase().includes("black") ? "#1a1a1a" : car.color.toLowerCase().includes("red") ? "#dc2626" : car.color.toLowerCase().includes("blue") ? "#2563eb" : car.color.toLowerCase().includes("green") ? "#16a34a" : car.color.toLowerCase().includes("gray") || car.color.toLowerCase().includes("grey") ? "#6b7280" : "#8b5cf6" }} />
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {car.features.slice(0, 3).map((f) => (
            <Badge key={f} variant="secondary" className="text-[10px]">
              {f}
            </Badge>
          ))}
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1" onClick={() => onEdit(car)}>
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </Button>
          <Button size="sm" variant="outline" onClick={() => onDelete(car.id)}>
            <Trash2 className="w-3.5 h-3.5 text-destructive" />
          </Button>
        </div>
      </div>
    </div>
  );
}
