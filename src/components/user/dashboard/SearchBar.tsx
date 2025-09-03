"use client";

import React from "react";
import { Search, Filter } from "lucide-react";
import { EventFilter } from "@/types";
import { SearchFilters } from "./SearchFilters";
import { QuickFilters } from "./QuickFilters";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: EventFilter;
  setFilters: (filters: EventFilter) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  onSearch: () => void;
  onFilterChange: (filters: EventFilter) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
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
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher des événements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              onKeyPress={(e) => e.key === "Enter" && onSearch()}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
            >
              <Filter className="h-5 w-5" />
              Filtres
            </button>

            <button
              onClick={onSearch}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Rechercher
            </button>
          </div>
        </div>

        <QuickFilters
          filters={filters}
          setFilters={setFilters}
          onSearch={onSearch}
        />
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="mt-4">
          <SearchFilters
            filters={filters}
            onChange={onFilterChange}
            onClose={() => setShowFilters(false)}
          />
        </div>
      )}
    </div>
  );
};
