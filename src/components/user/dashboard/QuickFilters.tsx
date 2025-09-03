"use client";

import React from "react";
import { MapPin, Calendar, TrendingUp } from "lucide-react";
import { EventFilter } from "@/types";

interface QuickFiltersProps {
  filters: EventFilter;
  setFilters: (filters: EventFilter) => void;
  onSearch: () => void;
}

export const QuickFilters: React.FC<QuickFiltersProps> = ({
  filters,
  setFilters,
  onSearch,
}) => {
  const handleNearbyClick = () => {
    // Logic for nearby events
    onSearch();
  };

  const handleWeekendClick = () => {
    const now = new Date();
    const weekend = new Date(now);
    weekend.setDate(now.getDate() + (6 - now.getDay()));
    setFilters({
      ...filters,
      // Add weekend date range logic here
    });
    onSearch();
  };

  const handlePopularClick = () => {
    setFilters({
      ...filters,
      sortBy: "popularity",
      sortOrder: "desc",
    });
    onSearch();
  };

  return (
    <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-200">
      <button
        onClick={handleNearbyClick}
        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
      >
        <MapPin className="h-4 w-4" />
        <span className="text-sm">Près de moi</span>
      </button>

      <button
        onClick={handleWeekendClick}
        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
      >
        <Calendar className="h-4 w-4" />
        <span className="text-sm">Ce weekend</span>
      </button>

      <button
        onClick={handlePopularClick}
        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
      >
        <TrendingUp className="h-4 w-4" />
        <span className="text-sm">Populaires</span>
      </button>
    </div>
  );
};
