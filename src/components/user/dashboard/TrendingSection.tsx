"use client";

import React from "react";
import { TrendingUp, ChevronRight } from "lucide-react";
import { Event } from "@/types";
import { TrendingEventCard } from "./TrendingEventCard";

interface TrendingSectionProps {
  events: Event[];
  onEventSelect?: (event: Event) => void;
}

export const TrendingSection: React.FC<TrendingSectionProps> = ({
  events,
  onEventSelect,
}) => {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-orange-500" />
          Tendances
        </h2>
        <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
          Voir tout
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.slice(0, 3).map((event) => (
          <TrendingEventCard
            key={event.id}
            event={event}
            onSelect={onEventSelect}
          />
        ))}
      </div>
    </section>
  );
};
