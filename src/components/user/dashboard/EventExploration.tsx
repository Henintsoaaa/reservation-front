"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Grid,
  List,
  Calendar as CalendarIcon,
  Map,
  SlidersHorizontal,
  ArrowUpDown,
} from "lucide-react";
import { Event, EventFilter, PaginationParams } from "@/types";
import { eventsApi } from "@/lib/api";
import { EventCard } from "./EventCard";
import { EventListItem } from "./EventListItem";
import { EventCalendarView } from "./EventCalendarView";
import { EventMapView } from "./EventMapView";
import { SearchFilters } from "./SearchFilters";

type ViewMode = "grid" | "list" | "calendar" | "map";

interface EventExplorationProps {
  onEventSelect?: (event: Event) => void;
}

export const EventExploration: React.FC<EventExplorationProps> = ({
  onEventSelect,
}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filters, setFilters] = useState<EventFilter>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    limit: 12,
  });
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadEvents();
  }, [filters, pagination, searchQuery]);

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      const response = await eventsApi.getAll({ ...filters, ...pagination });
      setEvents(response.data);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error loading events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination({ page: 1, limit: 12 });
    setFilters((prev) => ({ ...prev, searchQuery }));
  };

  const handleFilterChange = (newFilters: EventFilter) => {
    setFilters(newFilters);
    setPagination({ page: 1, limit: 12 });
  };

  const viewModeButtons = [
    { mode: "grid" as ViewMode, icon: Grid, label: "Grille" },
    { mode: "list" as ViewMode, icon: List, label: "Liste" },
    { mode: "calendar" as ViewMode, icon: CalendarIcon, label: "Calendrier" },
    { mode: "map" as ViewMode, icon: Map, label: "Carte" },
  ];

  const renderEvents = () => {
    if (isLoading) {
      return <LoadingSkeleton viewMode={viewMode} />;
    }

    if (events.length === 0) {
      return <EmptyState />;
    }

    switch (viewMode) {
      case "grid":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onSelect={onEventSelect}
              />
            ))}
          </div>
        );

      case "list":
        return (
          <div className="space-y-4">
            {events.map((event) => (
              <EventListItem
                key={event.id}
                event={event}
                onSelect={onEventSelect}
              />
            ))}
          </div>
        );

      case "calendar":
        return (
          <EventCalendarView events={events} onEventSelect={onEventSelect} />
        );

      case "map":
        return <EventMapView events={events} onEventSelect={onEventSelect} />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher des événements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                  showFilters
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Filter className="h-5 w-5" />
                Filtres
              </button>

              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <ArrowUpDown className="h-5 w-5" />
                Trier
              </button>

              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Rechercher
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4">
              <SearchFilters
                filters={filters}
                onChange={handleFilterChange}
                onClose={() => setShowFilters(false)}
              />
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* View Mode Selector and Results Count */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-white rounded-lg shadow-sm border border-gray-200 p-1">
              {viewModeButtons.map(({ mode, icon: Icon, label }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === mode
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                  title={label}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>

            <div className="text-sm text-gray-600">
              {isLoading
                ? "Chargement..."
                : `${events.length} événement(s) trouvé(s)`}
            </div>
          </div>

          {/* Quick Filters */}
          <div className="hidden md:flex items-center gap-2">
            <QuickFilter
              label="Aujourd'hui"
              active={false}
              onClick={() => {
                const today = new Date();
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);
                handleFilterChange({
                  ...filters,
                  //   dateRange: { start: today, end: tomorrow },
                });
              }}
            />
            <QuickFilter
              label="Ce weekend"
              active={false}
              onClick={() => {
                const now = new Date();
                const saturday = new Date(now);
                saturday.setDate(now.getDate() + (6 - now.getDay()));
                const sunday = new Date(saturday);
                sunday.setDate(saturday.getDate() + 1);
                handleFilterChange({
                  ...filters,
                  //   dateRange: { start: saturday, end: sunday },
                });
              }}
            />
            <QuickFilter
              label="Gratuit"
              active={
                filters.priceRange?.min === 0 && filters.priceRange?.max === 0
              }
              onClick={() => {
                handleFilterChange({
                  ...filters,
                  priceRange: { min: 0, max: 0 },
                });
              }}
            />
          </div>
        </div>

        {/* Events Display */}
        {renderEvents()}

        {/* Pagination */}
        {!isLoading &&
          events.length > 0 &&
          viewMode !== "calendar" &&
          viewMode !== "map" && (
            <div className="mt-8">
              <Pagination
                currentPage={pagination.page}
                totalPages={totalPages}
                onPageChange={(page) =>
                  setPagination((prev) => ({ ...prev, page }))
                }
              />
            </div>
          )}
      </div>
    </div>
  );
};

// Quick Filter Component
const QuickFilter: React.FC<{
  label: string;
  active: boolean;
  onClick: () => void;
}> = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
      active
        ? "bg-blue-600 text-white"
        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
    }`}
  >
    {label}
  </button>
);

// Loading Skeleton Component
const LoadingSkeleton: React.FC<{ viewMode: ViewMode }> = ({ viewMode }) => {
  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-4 animate-pulse"
          >
            <div className="flex gap-4">
              <div className="w-24 h-24 bg-gray-200 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
        >
          <div className="w-full h-48 bg-gray-200" />
          <div className="p-4 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
};

// Empty State Component
const EmptyState: React.FC = () => (
  <div className="text-center py-16">
    <div className="text-6xl mb-4">🔍</div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">
      Aucun événement trouvé
    </h3>
    <p className="text-gray-600 mb-6">
      Essayez de modifier vos filtres ou votre recherche
    </p>
    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
      Réinitialiser les filtres
    </button>
  </div>
);

// Pagination Component
const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = pages.slice(
    Math.max(0, currentPage - 3),
    Math.min(totalPages, currentPage + 2)
  );

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        Précédent
      </button>

      {visiblePages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 border rounded-lg ${
            page === currentPage
              ? "border-blue-500 bg-blue-50 text-blue-700"
              : "border-gray-300 hover:bg-gray-50"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        Suivant
      </button>
    </div>
  );
};

export default EventExploration;
