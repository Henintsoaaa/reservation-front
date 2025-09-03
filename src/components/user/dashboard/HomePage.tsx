"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Calendar,
  Filter,
  Star,
  Users,
  Clock,
  ChevronRight,
  TrendingUp,
  Heart,
  Share2,
} from "lucide-react";
import { Event, EventCategory, EventFilter } from "@/types";
import { eventsApi } from "@/lib/api";
import { FeaturedEvents } from "./FeaturedEvents";
import { SearchFilters } from "./SearchFilters";
import { EventCategories } from "./EventCategories";
import { NearbyEvents } from "./NearbyEvents";
import { PromotionalBanners } from "./PromotionalBanners";

interface HomePageProps {
  onEventSelect?: (event: Event) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onEventSelect }) => {
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<EventFilter>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    loadInitialData();
    requestLocationPermission();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      const featured = await eventsApi.getFeatured();
      setFeaturedEvents(featured);
    } catch (error) {
      console.error("Error loading initial data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const requestLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log("Location permission denied:", error);
        }
      );
    }
  };

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const results = await eventsApi.searchEvents(searchQuery, filters);
      // Handle search results - this would typically update a results view
      console.log("Search results:", results);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilters: EventFilter) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Search */}
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

          {/* Search Bar */}
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
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
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
                    onClick={handleSearch}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Rechercher
                  </button>
                </div>
              </div>

              {/* Location and Quick Filters */}
              <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-200">
                <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">Près de moi</span>
                </button>

                <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Ce weekend</span>
                </button>

                <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm">Populaires</span>
                </button>
              </div>
            </div>

            {/* Advanced Filters */}
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
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Promotional Banners */}
        <PromotionalBanners />

        {/* Event Categories */}
        <EventCategories
          onCategorySelect={(category: EventCategory) => {
            setFilters({ ...filters, category });
            handleSearch();
          }}
        />

        {/* Featured Events */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Événements en vedette
            </h2>
            <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
              Voir tout
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <FeaturedEvents
            events={featuredEvents}
            isLoading={isLoading}
            onEventSelect={onEventSelect}
          />
        </section>

        {/* Nearby Events */}
        {userLocation && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Événements près de vous
              </h2>
              <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                Voir tout
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <NearbyEvents
              userLocation={userLocation}
              onEventSelect={onEventSelect}
            />
          </section>
        )}

        {/* Trending Events */}
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
            {featuredEvents.slice(0, 3).map((event) => (
              <TrendingEventCard
                key={event.id}
                event={event}
                onSelect={onEventSelect}
              />
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Actions rapides
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickActionCard
              icon={<Calendar className="h-8 w-8" />}
              title="Ce weekend"
              description="Événements du weekend"
              onClick={() => {
                const now = new Date();
                const weekend = new Date(now);
                weekend.setDate(now.getDate() + (6 - now.getDay()));
                setFilters({
                  ...filters,
                  //   dateRange: {
                  //     start: weekend,
                  //     end: new Date(weekend.getTime() + 2 * 24 * 60 * 60 * 1000),
                  //   },
                });
                handleSearch();
              }}
            />

            <QuickActionCard
              icon={<Users className="h-8 w-8" />}
              title="Gratuit"
              description="Événements gratuits"
              onClick={() => {
                setFilters({
                  ...filters,
                  priceRange: { min: 0, max: 0 },
                });
                handleSearch();
              }}
            />

            <QuickActionCard
              icon={<Star className="h-8 w-8" />}
              title="Mieux notés"
              description="Événements populaires"
              onClick={() => {
                setFilters({
                  ...filters,
                  sortBy: "popularity",
                  sortOrder: "desc",
                });
                handleSearch();
              }}
            />

            <QuickActionCard
              icon={<Clock className="h-8 w-8" />}
              title="Dernière minute"
              description="Billets disponibles"
              onClick={() => {
                setFilters({
                  ...filters,
                  availableSeats: 1,
                });
                handleSearch();
              }}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

// Composant pour les cartes d'événements tendance
const TrendingEventCard: React.FC<{
  event: Event;
  onSelect?: (event: Event) => void;
}> = ({ event, onSelect }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
      <div className="relative" onClick={() => onSelect?.(event)}>
        <img
          src={
            event.imageUrl || event.images?.[0] || "/api/placeholder/400/200"
          }
          alt={event.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            className={`p-2 rounded-full ${
              isFavorite ? "bg-red-500 text-white" : "bg-white text-gray-600"
            } hover:scale-110 transition-all`}
          >
            <Heart
              className="h-4 w-4"
              fill={isFavorite ? "currentColor" : "none"}
            />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Handle share
            }}
            className="p-2 rounded-full bg-white text-gray-600 hover:scale-110 transition-all"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>

        <div className="absolute bottom-3 left-3">
          <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            Tendance
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          {event.title}
        </h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>
              {new Date(
                event.date || event.startDateTime || ""
              ).toLocaleDateString("fr-FR")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{event.venue?.city}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{event.availableSeats} places disponibles</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium">4.8</span>
            <span className="text-sm text-gray-500">(124)</span>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-blue-600">
              {(event.ticketPrice || event.basePrice || 0) === 0
                ? "Gratuit"
                : `${event.ticketPrice || event.basePrice}€`}
            </div>
            {event.maxPrice && event.maxPrice > (event.basePrice || 0) && (
              <div className="text-sm text-gray-500">
                jusqu&apos;à {event.maxPrice}€
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant pour les actions rapides
const QuickActionCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}> = ({ icon, title, description, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-105 text-left group"
    >
      <div className="text-blue-600 mb-3 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </button>
  );
};

export default HomePage;
