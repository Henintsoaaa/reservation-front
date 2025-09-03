"use client";

import React from "react";
import { Event } from "@/types";
import { PromotionalBanners } from "./PromotionalBanners";
import { HeroSection } from "./HeroSection";
import { TrendingSection } from "./TrendingSection";
import { QuickActionsSection } from "./QuickActionsSection";
import { useHomePage } from "./useHomePage";

interface HomePageProps {
  onEventSelect?: (event: Event) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onEventSelect }) => {
  const {
    featuredEvents,
    availableEvents,
    allEvents,
    searchQuery,
    filters,
    showFilters,
    setSearchQuery,
    setFilters,
    setShowFilters,
    handleSearch,
    handleFilterChange,
    searchResults,
    isLoading,
    apiError,
    refreshData,
  } = useHomePage();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Search */}
      <HeroSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filters={filters}
        setFilters={setFilters}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* API Status and Debug Info */}
        {apiError && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <strong>Erreur API:</strong> {apiError}
            <button
              onClick={refreshData}
              className="ml-4 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* API Statistics */}
        <div className="mb-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Statistiques
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <p className="font-medium text-blue-700">Événements totaux</p>
              <p className="text-2xl font-bold text-blue-900">
                {allEvents.length}
              </p>
            </div>
            <div className="text-center">
              <p className="font-medium text-green-700">
                Événements en vedette
              </p>
              <p className="text-2xl font-bold text-green-900">
                {featuredEvents.length}
              </p>
            </div>
            <div className="text-center">
              <p className="font-medium text-purple-700">
                Événements disponibles
              </p>
              <p className="text-2xl font-bold text-purple-900">
                {availableEvents.length}
              </p>
            </div>
            <div className="text-center">
              <p className="font-medium text-orange-700">
                Résultats de recherche
              </p>
              <p className="text-2xl font-bold text-orange-900">
                {searchResults.length}
              </p>
            </div>
          </div>
          <div className="mt-2 text-center"></div>
        </div>

        {/* Promotional Banners */}
        <PromotionalBanners />

        {/* Search Results */}
        {searchResults.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Résultats de recherche ({searchResults.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.slice(0, 6).map((event) => (
                <div
                  key={event.id}
                  className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onEventSelect?.(event)}
                >
                  <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {event.description}
                  </p>
                  <p className="text-sm text-gray-500">
                    {event.venue?.name || "Lieu non spécifié"}
                  </p>
                  <p className="text-lg font-bold text-blue-600 mt-2">
                    {event.ticketPrice}€
                  </p>
                  <div className="flex justify-between items-center mt-3 text-sm">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {event.category}
                    </span>
                    <span className="text-gray-500">
                      {event.availableSeats} places disponibles
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Trending Events */}
        <TrendingSection
          events={featuredEvents.length > 0 ? featuredEvents : availableEvents}
          onEventSelect={onEventSelect}
        />

        {/* All Available Events */}
        {availableEvents.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Tous les événements disponibles ({availableEvents.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {availableEvents.slice(0, 8).map((event) => (
                <div
                  key={event.id}
                  className="bg-white p-3 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onEventSelect?.(event)}
                >
                  <h4 className="font-semibold mb-1 text-sm">{event.title}</h4>
                  <p className="text-xs text-gray-600 mb-1">
                    {event.venue?.name}
                  </p>
                  <p className="text-sm font-bold text-green-600">
                    {event.ticketPrice} Ar
                  </p>
                  <p className="text-xs text-gray-500">
                    {event.availableSeats} places
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Quick Actions */}
        <QuickActionsSection
          filters={filters}
          setFilters={setFilters}
          onSearch={handleSearch}
        />
      </div>
    </div>
  );
};

export default HomePage;
