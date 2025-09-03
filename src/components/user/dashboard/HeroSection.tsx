// "use client";

import React from "react";
import { SearchBar } from "./SearchBar";
import { EventFilter } from "@/types";
import { Sparkles, Calendar, Users, MapPin } from "lucide-react";

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
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
            <span className="text-yellow-300 font-medium tracking-wide uppercase text-sm">
              Discover Amazing Events
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            <span className="gradient-text-accent">Find Your Next</span>
            <br />
            <span className="text-white">Adventure</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Discover extraordinary experiences, connect with amazing people, and
            create unforgettable memories
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-12 animate-slide-up">
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

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in">
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">1000+</div>
            <div className="text-white/70 text-sm">Events Monthly</div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">50K+</div>
            <div className="text-white/70 text-sm">Happy Users</div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">100+</div>
            <div className="text-white/70 text-sm">Cities</div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">99.9%</div>
            <div className="text-white/70 text-sm">Satisfaction</div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1200 120"
          className="w-full h-12 fill-current text-slate-50"
        >
          <path d="M0,0V46.29C47.79,22.18,103.59,32.58,158,28,402.17,11.91,691.27,48.42,1200,46.29V0Z"></path>
        </svg>
      </div>
    </div>
  );
};
