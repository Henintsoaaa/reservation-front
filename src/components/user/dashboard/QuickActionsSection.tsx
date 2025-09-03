// "use client";

import React from "react";
import { Calendar, Users, Star, Clock } from "lucide-react";
import { EventFilter } from "@/types";
import { QuickActionCard } from "./QuickActionCard";

interface QuickActionsSectionProps {
  filters: EventFilter;
  setFilters: (filters: EventFilter) => void;
  onSearch: () => void;
}

export const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({
  filters,
  setFilters,
  onSearch,
}) => {
  const handleWeekendAction = () => {
    const now = new Date();
    const weekend = new Date(now);
    weekend.setDate(now.getDate() + (6 - now.getDay()));
    setFilters({
      ...filters,
      dateRange: {
        start: weekend.toISOString(),
        end: new Date(
          weekend.getTime() + 2 * 24 * 60 * 60 * 1000
        ).toISOString(),
      },
    });
    onSearch();
  };

  const handleFreeAction = () => {
    setFilters({
      ...filters,
      priceRange: { min: 0, max: 0 },
    });
    onSearch();
  };

  const handlePopularAction = () => {
    setFilters({
      ...filters,
      sortBy: "popularity",
      sortOrder: "desc",
    });
    onSearch();
  };

  const handleLastMinuteAction = () => {
    setFilters({
      ...filters,
      availableSeats: 1,
    });
    onSearch();
  };

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Actions rapides</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickActionCard
          icon={<Calendar className="h-8 w-8" />}
          title="Ce weekend"
          description="Événements du weekend"
          onClick={handleWeekendAction}
        />

        <QuickActionCard
          icon={<Users className="h-8 w-8" />}
          title="Gratuit"
          description="Événements gratuits"
          onClick={handleFreeAction}
        />

        <QuickActionCard
          icon={<Star className="h-8 w-8" />}
          title="Mieux notés"
          description="Événements populaires"
          onClick={handlePopularAction}
        />

        <QuickActionCard
          icon={<Clock className="h-8 w-8" />}
          title="Dernière minute"
          description="Billets disponibles"
          onClick={handleLastMinuteAction}
        />
      </div>
    </section>
  );
};
