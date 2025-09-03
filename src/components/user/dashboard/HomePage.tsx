"use client";

import React from "react";
import { Event } from "@/types";
import { Calendar, Star, Users, Search } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Modern Hero Section */}
      <div className="relative overflow-hidden">
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
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* API Status */}
        {apiError && (
          <div className="mb-8 p-6 glass border border-red-300/30 text-red-700 rounded-2xl animate-fade-in">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">!</span>
              </div>
              <div>
                <strong>Connection Issue:</strong> {apiError}
                <button
                  onClick={refreshData}
                  className="ml-4 px-4 py-2 bg-red-500 text-white rounded-xl text-sm hover:bg-red-600 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modern Statistics Dashboard */}
        <div className="mb-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="card-elevated p-6 text-center group hover-scale">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              Total Events
            </p>
            <p className="text-3xl font-bold gradient-text">
              {allEvents.length}
            </p>
          </div>

          <div className="card-elevated p-6 text-center group hover-scale">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <Star className="h-6 w-6 text-white" />
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Featured</p>
            <p className="text-3xl font-bold gradient-text-accent">
              {featuredEvents.length}
            </p>
          </div>

          <div className="card-elevated p-6 text-center group hover-scale">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Available</p>
            <p className="text-3xl font-bold gradient-text-secondary">
              {availableEvents.length}
            </p>
          </div>

          <div className="card-elevated p-6 text-center group hover-scale">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <Search className="h-6 w-6 text-white" />
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              Search Results
            </p>
            <p className="text-3xl font-bold gradient-text">
              {searchResults.length}
            </p>
          </div>
        </div>

        {/* Promotional Banners */}
        <div className="mb-12">
          <PromotionalBanners />
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <section className="mb-16 animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Search Results
                </h2>
                <p className="text-gray-600">
                  Found {searchResults.length} events matching your criteria
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {searchResults.slice(0, 6).map((event, index) => (
                <div
                  key={event.id}
                  className="card-elevated p-6 cursor-pointer group animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => onEventSelect?.(event)}
                >
                  <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl mb-4 flex items-center justify-center">
                    <Calendar className="h-8 w-8 text-white" />
                  </div>

                  <h3 className="font-bold text-xl mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">
                    {event.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">
                      {event.venue?.name || "Venue TBA"}
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                      {event.category}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold gradient-text">
                      ${event.ticketPrice}
                    </span>
                    <span className="text-sm text-gray-500">
                      {event.availableSeats} seats left
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Trending Events */}
        <div className="mb-16">
          <TrendingSection
            events={
              featuredEvents.length > 0 ? featuredEvents : availableEvents
            }
            onEventSelect={onEventSelect}
          />
        </div>

        {/* All Available Events */}
        {availableEvents.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  All Events
                </h2>
                <p className="text-gray-600">
                  Discover all {availableEvents.length} available events
                </p>
              </div>
              <button className="btn-gradient px-6 py-3 text-white font-medium rounded-xl hover-scale">
                View All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {availableEvents.slice(0, 8).map((event, index) => (
                <div
                  key={event.id}
                  className="card-elevated p-4 cursor-pointer hover-scale animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => onEventSelect?.(event)}
                >
                  <div className="aspect-square bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg mb-3 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>

                  <h4 className="font-semibold text-gray-900 mb-2 text-sm line-clamp-2">
                    {event.title}
                  </h4>

                  <p className="text-xs text-gray-600 mb-2">
                    {event.venue?.name}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold gradient-text">
                      ${event.ticketPrice}
                    </span>
                    <span className="text-xs text-gray-500">
                      {event.availableSeats} left
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <QuickActionsSection
            filters={filters}
            setFilters={setFilters}
            onSearch={handleSearch}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
