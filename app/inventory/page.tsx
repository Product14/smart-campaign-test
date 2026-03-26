"use client";

import { useState, useEffect } from "react";
import { Car } from "@/lib/types";
import { getCars, saveCar, deleteCar } from "@/lib/store";
import { Header } from "@/components/layout/Header";
import { CarCard } from "@/components/inventory/CarCard";
import { CarForm } from "@/components/inventory/CarForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, Car as CarIcon } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function InventoryPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [search, setSearch] = useState("");
  const [fuelFilter, setFuelFilter] = useState<string>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  useEffect(() => {
    setCars(getCars());
  }, []);

  const refresh = () => setCars(getCars());

  const handleSave = (car: Car) => {
    saveCar(car);
    refresh();
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this car from inventory?")) {
      deleteCar(id);
      refresh();
    }
  };

  const handleEdit = (car: Car) => {
    setEditingCar(car);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingCar(null);
  };

  const fuelTypes = ["all", ...new Set(cars.map((c) => c.fuelType))];

  const filtered = cars.filter((c) => {
    const matchesSearch =
      `${c.make} ${c.model}`.toLowerCase().includes(search.toLowerCase()) ||
      c.color.toLowerCase().includes(search.toLowerCase());
    const matchesFuel = fuelFilter === "all" || c.fuelType === fuelFilter;
    return matchesSearch && matchesFuel;
  });

  return (
    <DashboardLayout>
      <Header title="Car Inventory" subtitle="Manage your vehicle inventory" />
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            {fuelTypes.map((f) => (
              <button
                key={f}
                onClick={() => setFuelFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
                  fuelFilter === f
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search cars..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
            <Button onClick={() => { setEditingCar(null); setFormOpen(true); }}>
              <PlusCircle className="w-4 h-4" />
              Add Car
            </Button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
              <CarIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No cars found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {search || fuelFilter !== "all"
                ? "Try adjusting your filters"
                : "Add your first car to the inventory"}
            </p>
            <Button onClick={() => { setEditingCar(null); setFormOpen(true); }}>
              <PlusCircle className="w-4 h-4" />
              Add Car
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        <CarForm
          car={editingCar}
          open={formOpen}
          onClose={handleCloseForm}
          onSave={handleSave}
        />
      </div>
    </DashboardLayout>
  );
}
