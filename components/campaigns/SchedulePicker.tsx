"use client";

import { Input } from "@/components/ui/input";
import { Calendar, Info } from "lucide-react";

interface SchedulePickerProps {
  startDate: string;
  endDate: string;
  onStartChange: (date: string) => void;
  onEndChange: (date: string) => void;
}

export function SchedulePicker({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
}: SchedulePickerProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 text-blue-700 text-sm">
        <Info className="w-4 h-4 shrink-0" />
        <span>Set dates to schedule your campaign or leave blank to save as draft.</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="text-sm font-medium mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            Start Date
          </div>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => onStartChange(e.target.value)}
          />
        </div>
        <div>
          <div className="text-sm font-medium mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            End Date
          </div>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => onEndChange(e.target.value)}
            min={startDate || undefined}
          />
        </div>
      </div>
      {startDate && endDate && new Date(endDate) < new Date(startDate) && (
        <p className="text-sm text-destructive">End date must be after start date.</p>
      )}
    </div>
  );
}
