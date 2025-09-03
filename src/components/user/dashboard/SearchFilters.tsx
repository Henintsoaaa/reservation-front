"use client";

import React, { useState } from "react";
import {
  X,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Tag,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import { EventFilter, EventCategory } from "@/types";

interface SearchFiltersProps {
  filters: EventFilter;
  onChange: (filters: EventFilter) => void;
  onClose: () => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onChange,
  onClose,
}) => {
  const [tempFilters, setTempFilters] = useState<EventFilter>(filters);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const categories = [
    { value: EventCategory.CONCERT, label: "Concerts", icon: "🎵" },
    { value: EventCategory.THEATER, label: "Théâtre", icon: "🎭" },
    { value: EventCategory.SPORTS, label: "Sports", icon: "⚽" },
    { value: EventCategory.CONFERENCE, label: "Conférences", icon: "💼" },
    { value: EventCategory.EXHIBITION, label: "Expositions", icon: "🎨" },
    { value: EventCategory.FESTIVAL, label: "Festivals", icon: "🎪" },
    { value: EventCategory.WORKSHOP, label: "Ateliers", icon: "🛠️" },
    { value: EventCategory.OTHER, label: "Autres", icon: "📝" },
  ];

  const datePresets = [
    {
      label: "Aujourd'hui",
      value: () => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        return { start: today, end: tomorrow };
      },
    },
    {
      label: "Ce weekend",
      value: () => {
        const now = new Date();
        const saturday = new Date(now);
        saturday.setDate(now.getDate() + (6 - now.getDay()));
        const sunday = new Date(saturday);
        sunday.setDate(saturday.getDate() + 1);
        return { start: saturday, end: sunday };
      },
    },
    {
      label: "Cette semaine",
      value: () => {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);
        return { start: startOfWeek, end: endOfWeek };
      },
    },
    {
      label: "Ce mois",
      value: () => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return { start: startOfMonth, end: endOfMonth };
      },
    },
  ];

  const priceRanges = [
    { label: "Gratuit", min: 0, max: 0 },
    { label: "Moins de 20€", min: 0, max: 20 },
    { label: "20€ - 50€", min: 20, max: 50 },
    { label: "50€ - 100€", min: 50, max: 100 },
    { label: "Plus de 100€", min: 100, max: 1000 },
  ];

  const applyFilters = () => {
    onChange(tempFilters);
    onClose();
  };

  const resetFilters = () => {
    setTempFilters({});
    onChange({});
    onClose();
  };

  const updateFilter = (key: keyof EventFilter, value: any) => {
    setTempFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5" />
          Filtres avancés
        </h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      <div className="space-y-6">
        {/* Date Filter */}
        <div className="space-y-3">
          <button
            onClick={() => toggleSection("date")}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              <span className="font-medium text-gray-900">Date</span>
            </div>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                activeSection === "date" ? "rotate-180" : ""
              }`}
            />
          </button>

          {activeSection === "date" && (
            <div className="pl-7 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {datePresets.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => updateFilter("dateRange", preset.value())}
                    className={`p-2 text-sm rounded-lg border transition-colors ${
                      tempFilters.dateRange &&
                      JSON.stringify(tempFilters.dateRange) ===
                        JSON.stringify(preset.value())
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de début
                  </label>
                  <input
                    type="date"
                    value={
                      tempFilters.dateRange?.start
                        ? (typeof tempFilters.dateRange.start === "string"
                            ? new Date(tempFilters.dateRange.start)
                            : tempFilters.dateRange.start
                          )
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={(e) => {
                      const newDate = new Date(e.target.value);
                      updateFilter("dateRange", {
                        ...tempFilters.dateRange,
                        start: newDate,
                      });
                    }}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de fin
                  </label>
                  <input
                    type="date"
                    value={
                      tempFilters.dateRange?.end
                        ? (typeof tempFilters.dateRange.end === "string"
                            ? new Date(tempFilters.dateRange.end)
                            : tempFilters.dateRange.end
                          )
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={(e) => {
                      const newDate = new Date(e.target.value);
                      updateFilter("dateRange", {
                        ...tempFilters.dateRange,
                        end: newDate,
                      });
                    }}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Location Filter */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-red-500" />
            <span className="font-medium text-gray-900">Lieu</span>
          </div>
          <input
            type="text"
            placeholder="Ville, région, pays..."
            value={tempFilters.location || ""}
            onChange={(e) => updateFilter("location", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Category Filter */}
        <div className="space-y-3">
          <button
            onClick={() => toggleSection("category")}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-purple-500" />
              <span className="font-medium text-gray-900">Catégorie</span>
            </div>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                activeSection === "category" ? "rotate-180" : ""
              }`}
            />
          </button>

          {activeSection === "category" && (
            <div className="pl-7 grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() =>
                    updateFilter(
                      "category",
                      tempFilters.category === category.value
                        ? undefined
                        : category.value
                    )
                  }
                  className={`p-3 text-sm rounded-lg border transition-colors text-left ${
                    tempFilters.category === category.value
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{category.icon}</span>
                    <span>{category.label}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Price Filter */}
        <div className="space-y-3">
          <button
            onClick={() => toggleSection("price")}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <span className="font-medium text-gray-900">Prix</span>
            </div>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                activeSection === "price" ? "rotate-180" : ""
              }`}
            />
          </button>

          {activeSection === "price" && (
            <div className="pl-7 space-y-3">
              <div className="grid grid-cols-1 gap-2">
                {priceRanges.map((range, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      updateFilter("priceRange", {
                        min: range.min,
                        max: range.max,
                      })
                    }
                    className={`p-2 text-sm rounded-lg border transition-colors text-left ${
                      tempFilters.priceRange?.min === range.min &&
                      tempFilters.priceRange?.max === range.max
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prix min (€)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={tempFilters.priceRange?.min || ""}
                    onChange={(e) =>
                      updateFilter("priceRange", {
                        ...tempFilters.priceRange,
                        min: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prix max (€)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="1000"
                    value={tempFilters.priceRange?.max || ""}
                    onChange={(e) =>
                      updateFilter("priceRange", {
                        ...tempFilters.priceRange,
                        max: parseInt(e.target.value) || 1000,
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Availability Filter */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-500" />
            <span className="font-medium text-gray-900">Disponibilité</span>
          </div>
          <div className="pl-7">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum de places disponibles
            </label>
            <input
              type="number"
              min="1"
              placeholder="1"
              value={tempFilters.availableSeats || ""}
              onChange={(e) =>
                updateFilter(
                  "availableSeats",
                  parseInt(e.target.value) || undefined
                )
              }
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Sort Options */}
        <div className="space-y-3">
          <button
            onClick={() => toggleSection("sort")}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-gray-500" />
              <span className="font-medium text-gray-900">Trier par</span>
            </div>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                activeSection === "sort" ? "rotate-180" : ""
              }`}
            />
          </button>

          {activeSection === "sort" && (
            <div className="pl-7 space-y-2">
              {[
                { value: "date", label: "Date" },
                { value: "price", label: "Prix" },
                { value: "popularity", label: "Popularité" },
                { value: "distance", label: "Distance" },
              ].map((sort) => (
                <div key={sort.value} className="flex items-center gap-3">
                  <button
                    onClick={() => updateFilter("sortBy", sort.value)}
                    className={`flex-1 p-2 text-sm rounded-lg border transition-colors text-left ${
                      tempFilters.sortBy === sort.value
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {sort.label}
                  </button>

                  {tempFilters.sortBy === sort.value && (
                    <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                      <button
                        onClick={() => updateFilter("sortOrder", "asc")}
                        className={`px-3 py-1 text-xs ${
                          tempFilters.sortOrder === "asc"
                            ? "bg-blue-500 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => updateFilter("sortOrder", "desc")}
                        className={`px-3 py-1 text-xs ${
                          tempFilters.sortOrder === "desc"
                            ? "bg-blue-500 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        ↓
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={resetFilters}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Réinitialiser
        </button>
        <button
          onClick={applyFilters}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Appliquer les filtres
        </button>
      </div>
    </div>
  );
};

export default SearchFilters;
