"use client";

import React, { useState, useEffect } from "react";
import {
  MapPin,
  Users,
  DollarSign,
  Calendar,
  Search,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { venuesApi, reservationsApi } from "@/lib/api";
import { Venue } from "@/types";

interface AvailableVenuesProps {
  onVenueSelect?: (venue: Venue) => void;
}

const AvailableVenues: React.FC<AvailableVenuesProps> = ({ onVenueSelect }) => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterStartTime, setFilterStartTime] = useState("");
  const [filterEndTime, setFilterEndTime] = useState("");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [availabilityData, setAvailabilityData] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    fetchVenues();
  }, []);

  useEffect(() => {
    filterVenues();
  }, [venues, searchTerm, showAvailableOnly, availabilityData]);

  useEffect(() => {
    if (filterDate && filterStartTime && filterEndTime && venues.length > 0) {
      checkVenuesAvailability();
    } else {
      setAvailabilityData({});
    }
  }, [filterDate, filterStartTime, filterEndTime, venues]);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      const data = await venuesApi.getAll();
      setVenues(data);
      setFilteredVenues(data);
    } catch (err: any) {
      setError("Failed to fetch venues");
    } finally {
      setLoading(false);
    }
  };

  const checkVenuesAvailability = async () => {
    if (!filterDate || !filterStartTime || !filterEndTime) return;

    const startDateTime = new Date(`${filterDate}T${filterStartTime}`);
    const endDateTime = new Date(`${filterDate}T${filterEndTime}`);

    const availabilityPromises = venues.map(async (venue) => {
      try {
        const result = await reservationsApi.checkAvailability(
          venue.id,
          startDateTime.toISOString(),
          endDateTime.toISOString()
        );
        return { venueId: venue.id, available: result.available };
      } catch {
        return { venueId: venue.id, available: false };
      }
    });

    const results = await Promise.all(availabilityPromises);
    const availabilityMap = results.reduce((acc, { venueId, available }) => {
      acc[venueId] = available;
      return acc;
    }, {} as { [key: string]: boolean });

    setAvailabilityData(availabilityMap);
  };

  const filterVenues = () => {
    let filtered = venues;

    if (searchTerm) {
      filtered = filtered.filter(
        (venue) =>
          venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          venue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          venue.location.address
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          venue.location.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (showAvailableOnly && Object.keys(availabilityData).length > 0) {
      filtered = filtered.filter(
        (venue) => availabilityData[venue.id] === true
      );
    }

    setFilteredVenues(filtered);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-MG", {
      style: "currency",
      currency: "MGA",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateEstimatedPrice = (venue: Venue) => {
    if (!filterStartTime || !filterEndTime) return null;

    const startTime = new Date(`2000-01-01T${filterStartTime}`);
    const endTime = new Date(`2000-01-01T${filterEndTime}`);
    const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

    return hours > 0 ? venue.pricePerHour * hours : null;
  };

  const getAvailabilityBadge = (venue: Venue) => {
    if (Object.keys(availabilityData).length === 0) return null;

    const isAvailable = availabilityData[venue.id];

    if (isAvailable === true) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          ✅ Available
        </span>
      );
    } else if (isAvailable === false) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          ❌ Not Available
        </span>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading venues...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchVenues}>Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search & Filter Venues
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search venues
            </label>
            <input
              type="text"
              placeholder="Search by name, description, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time
              </label>
              <input
                type="time"
                value={filterStartTime}
                onChange={(e) => setFilterStartTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time
              </label>
              <input
                type="time"
                value={filterEndTime}
                onChange={(e) => setFilterEndTime(e.target.value)}
                min={filterStartTime}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-end">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showAvailableOnly}
                  onChange={(e) => setShowAvailableOnly(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">
                  Show available only
                </span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Available Venues ({filteredVenues.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredVenues.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No venues found</p>
              <p className="text-sm text-gray-500">
                Try adjusting your search criteria or filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVenues.map((venue) => {
                const estimatedPrice = calculateEstimatedPrice(venue);
                return (
                  <Card
                    key={venue.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-lg text-gray-900">
                          {venue.name}
                        </h3>
                        {getAvailabilityBadge(venue)}
                      </div>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {venue.description}
                      </p>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="truncate">
                            {venue.location.address}, {venue.location.city}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span>Capacity: {venue.capacity} people</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span>
                            {formatCurrency(venue.pricePerHour)} per hour
                          </span>
                        </div>

                        {estimatedPrice && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-indigo-500" />
                            <span className="font-medium text-indigo-600">
                              Estimated: {formatCurrency(estimatedPrice)}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <Button
                          onClick={() => {
                            if (onVenueSelect) {
                              onVenueSelect(venue);
                            } else {
                              alert(
                                `Selected ${venue.name}. Please go to "New Reservation" tab to create a booking.`
                              );
                            }
                          }}
                          className="w-full"
                          size="sm"
                          disabled={availabilityData[venue.id] === false}
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          {availabilityData[venue.id] === false
                            ? "Not Available"
                            : "Book This Venue"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AvailableVenues;
