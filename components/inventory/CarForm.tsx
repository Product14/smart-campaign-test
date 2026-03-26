"use client";

import { useState, useEffect } from "react";
import { Car } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface CarFormProps {
  car?: Car | null;
  open: boolean;
  onClose: () => void;
  onSave: (car: Car) => void;
}

const emptyFields = {
  make: "",
  model: "",
  year: new Date().getFullYear(),
  price: 0,
  image: "",
  color: "",
  mileage: 0,
  fuelType: "Gasoline",
  features: [] as string[],
};

export function CarForm({ car, open, onClose, onSave }: CarFormProps) {
  const [form, setForm] = useState(car || { id: "", ...emptyFields });
  const [featuresText, setFeaturesText] = useState(
    car ? car.features.join(", ") : ""
  );

  useEffect(() => {
    if (car) {
      setForm(car);
      setFeaturesText(car.features.join(", "));
    } else {
      setForm({ id: "", ...emptyFields });
      setFeaturesText("");
    }
  }, [car, open]);

  const isEdit = !!car;

  const handleSave = () => {
    const carData: Car = {
      ...form,
      id: form.id || `car-${Date.now()}`,
      features: featuresText
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
      image:
        form.image ||
        `https://placehold.co/600x400/1a1a2e/e0e0e0?text=${encodeURIComponent(form.make + " " + form.model)}`,
    };
    onSave(carData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Car" : "Add New Car"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Make</label>
              <Input
                value={form.make}
                onChange={(e) => setForm({ ...form, make: e.target.value })}
                placeholder="Toyota"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Model</label>
              <Input
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                placeholder="Camry"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Year</label>
              <Input
                type="number"
                value={form.year}
                onChange={(e) =>
                  setForm({ ...form, year: parseInt(e.target.value) || 0 })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Price ($)</label>
              <Input
                type="number"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: parseInt(e.target.value) || 0 })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Color</label>
              <Input
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                placeholder="Midnight Black"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Fuel Type</label>
              <select
                value={form.fuelType}
                onChange={(e) => setForm({ ...form, fuelType: e.target.value })}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              >
                <option>Gasoline</option>
                <option>Diesel</option>
                <option>Hybrid</option>
                <option>Electric</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Mileage</label>
            <Input
              type="number"
              value={form.mileage}
              onChange={(e) =>
                setForm({ ...form, mileage: parseInt(e.target.value) || 0 })
              }
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Image URL</label>
            <Input
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="https://... (optional)"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">
              Features (comma-separated)
            </label>
            <Input
              value={featuresText}
              onChange={(e) => setFeaturesText(e.target.value)}
              placeholder="Apple CarPlay, Lane Assist, ..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>{isEdit ? "Save Changes" : "Add Car"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
