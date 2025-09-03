// "use client";

import React from "react";
import { SearchBar } from "./SearchBar";
import { EventFilter } from "@/types";

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: EventFilter;
  setFilters: (filters: EventFilter) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  onSearch: () => void;
  onFilterChange: (filters: EventFilter) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  setSearchQuery,
  filters,
  setFilters,
  showFilters,
  setShowFilters,
  onSearch,
  onFilterChange,
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Découvrez des événements extraordinaires
          </h1>
          <p className="text-xl opacity-90">
            Trouvez et réservez les meilleurs événements près de chez vous
          </p>
        </div>

        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filters={filters}
          setFilters={setFilters}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          onSearch={onSearch}
          onFilterChange={onFilterChange}
        />
      </div>
    </div>
  );
};
