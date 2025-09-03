"use client";

import { useState, useEffect } from "react";
import { Event, EventFilter } from "@/types";
import { useAllApis } from "@/hooks/useAllApis";

export const useHomePage = () => {
  const {
    events: allEvents,
    featuredEvents,
    availableEvents,
    reviews,
    loadAllEvents,
    searchEvents,
    getEventReviews,
    getEventStats,
    getAvailableSeats,
    loading,
    error: apiError,
  } = useAllApis();

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<EventFilter>({});
  const [showFilters, setShowFilters] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [searchResults, setSearchResults] = useState<Event[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    requestLocationPermission();
  }, []);

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
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const results = await searchEvents(searchQuery, filters);
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleFilterChange = (newFilters: EventFilter) => {
    setFilters(newFilters);
  };

  const getEventReviewsData = (eventId: string) => {
    return reviews.filter((review) => (review as any).eventId === eventId);
  };

  const loadEventDetails = async (eventId: string) => {
    try {
      const [eventReviews, availableSeats, eventStats] = await Promise.all([
        getEventReviews(eventId),
        getAvailableSeats(eventId),
        getEventStats(eventId),
      ]);

      return {
        reviews: eventReviews,
        availableSeats,
        stats: eventStats,
      };
    } catch (error) {
      console.error("Error loading event details:", error);
      throw error;
    }
  };

  const refreshData = async () => {
    await loadAllEvents();
  };

  // Clear search results when search query is empty
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
    }
  }, [searchQuery]);

  return {
    // State
    featuredEvents,
    availableEvents,
    allEvents,
    searchQuery,
    filters,
    isLoading: loading.events || isSearching,
    showFilters,
    userLocation,
    reviews,
    searchResults,
    apiError,

    // Setters
    setSearchQuery,
    setFilters,
    setShowFilters,
    setUserLocation,

    // Functions
    requestLocationPermission,
    handleSearch,
    handleFilterChange,
    getEventReviewsData,
    loadEventDetails,
    refreshData,
  };
};
