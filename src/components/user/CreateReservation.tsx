"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Users, DollarSign, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { reservationsApi, venuesApi } from "@/lib/api";
import { Venue } from "@/types";

interface CreateReservationProps {
  onReservationCreated: () => void;
  preselectedVenue?: any;
  onVenueChange?: () => void;
}

const CreateReservation: React.FC<CreateReservationProps> = ({
  onReservationCreated,
  preselectedVenue,
  onVenueChange,
}) => {
  const [formData, setFormData] = useState({
    venueId: preselectedVenue?.id || "",
    startTime: "",
    endTime: "",
  });
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingVenues, setLoadingVenues] = useState(true);
  const [error, setError] = useState("");
  const [availability, setAvailability] = useState<boolean | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  useEffect(() => {
    fetchVenues();
  }, []);

  useEffect(() => {
    if (preselectedVenue) {
      setFormData((prev) => ({ ...prev, venueId: preselectedVenue.id }));
    }
  }, [preselectedVenue]);

  useEffect(() => {
    if (formData.venueId && formData.startTime && formData.endTime) {
      checkAvailability();
    } else {
      setAvailability(null);
    }
  }, [formData.venueId, formData.startTime, formData.endTime]);

  const fetchVenues = async () => {
    try {
      setLoadingVenues(true);
      const data = await venuesApi.getAll();
      setVenues(data);
    } catch (err: any) {
      setError("Failed to fetch venues");
    } finally {
      setLoadingVenues(false);
    }
  };

  const checkAvailability = async () => {
    if (!formData.venueId || !formData.startTime || !formData.endTime) {
      setAvailability(null);
      return;
    }

    try {
      setCheckingAvailability(true);
      const startTime = new Date(formData.startTime).toISOString();
      const endTime = new Date(formData.endTime).toISOString();

      const result = await reservationsApi.checkAvailability(
        formData.venueId,
        startTime,
        endTime
      );
      setAvailability(result.available);
    } catch (err: any) {
      setError("Failed to check availability");
      setAvailability(false);
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!availability) {
      setError("Selected time slot is not available");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const startTime = new Date(formData.startTime).toISOString();
      const endTime = new Date(formData.endTime).toISOString();

      await reservationsApi.create({
        venueId: formData.venueId,
        startTime,
        endTime,
      });

      setFormData({
        venueId: "",
        startTime: "",
        endTime: "",
      });
      setAvailability(null);

      onReservationCreated();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create reservation");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");

    if (name === "venueId" && onVenueChange) {
      onVenueChange();
    }
  };

  const selectedVenue = venues.find((v) => v.id === formData.venueId);
  const startDate = formData.startTime ? new Date(formData.startTime) : null;
  const endDate = formData.endTime ? new Date(formData.endTime) : null;
  const durationHours =
    startDate && endDate
      ? (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)
      : 0;
  const estimatedPrice =
    selectedVenue && durationHours > 0
      ? selectedVenue.pricePerHour * durationHours
      : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-MG", {
      style: "currency",
      currency: "MGA",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getDefaultStartTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1, 0, 0, 0);
    return now.toISOString().slice(0, 16);
  };

  const getDefaultEndTime = () => {
    const start = formData.startTime
      ? new Date(formData.startTime)
      : new Date();
    start.setHours(start.getHours() + 2);
    return start.toISOString().slice(0, 16);
  };

  if (loadingVenues) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading venues...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Create New Reservation
          {preselectedVenue && (
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              Venue Pre-selected
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Select Venue
            </label>
            <select
              name="venueId"
              value={formData.venueId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Choose a venue</option>
              {venues.map((venue) => (
                <option key={venue.id} value={venue.id}>
                  {venue.name} - {formatCurrency(venue.pricePerHour)}/hour
                </option>
              ))}
            </select>
          </div>

          {selectedVenue && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h4 className="font-medium text-blue-900 mb-2">
                {selectedVenue.name}
              </h4>
              <p className="text-sm text-blue-700 mb-2">
                {selectedVenue.description}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-600">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {selectedVenue.location.address},{" "}
                    {selectedVenue.location.city}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>Capacity: {selectedVenue.capacity} people</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  <span>
                    {formatCurrency(selectedVenue.pricePerHour)} per hour
                  </span>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Options
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const start = getDefaultStartTime();
                  const end = new Date(start);
                  end.setHours(end.getHours() + 1);
                  setFormData((prev) => ({
                    ...prev,
                    startTime: start,
                    endTime: end.toISOString().slice(0, 16),
                  }));
                }}
              >
                1 Hour
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const start = getDefaultStartTime();
                  const end = new Date(start);
                  end.setHours(end.getHours() + 2);
                  setFormData((prev) => ({
                    ...prev,
                    startTime: start,
                    endTime: end.toISOString().slice(0, 16),
                  }));
                }}
              >
                2 Hours
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const start = getDefaultStartTime();
                  const end = new Date(start);
                  end.setHours(end.getHours() + 4);
                  setFormData((prev) => ({
                    ...prev,
                    startTime: start,
                    endTime: end.toISOString().slice(0, 16),
                  }));
                }}
              >
                4 Hours
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const start = getDefaultStartTime();
                  const end = new Date(start);
                  end.setDate(end.getDate() + 1);
                  setFormData((prev) => ({
                    ...prev,
                    startTime: start,
                    endTime: end.toISOString().slice(0, 16),
                  }));
                }}
              >
                All Day
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Start Time
            </label>
            <input
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              min={new Date().toISOString().slice(0, 16)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              End Time
            </label>
            <input
              type="datetime-local"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              min={formData.startTime}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {checkingAvailability && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <p className="text-yellow-700 text-sm">
                Checking availability...
              </p>
            </div>
          )}

          {availability === false && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-700 text-sm">
                ❌ This time slot is not available for the selected venue.
              </p>
            </div>
          )}

          {availability === true && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <p className="text-green-700 text-sm">
                ✅ This time slot is available!
              </p>
            </div>
          )}

          {estimatedPrice > 0 && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-md p-4">
              <h4 className="font-medium text-indigo-900 mb-2">
                Price Estimate
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm text-indigo-700">
                <div>
                  <span className="font-medium">Duration:</span>{" "}
                  {durationHours.toFixed(1)} hours
                </div>
                <div>
                  <span className="font-medium">Rate:</span>{" "}
                  {formatCurrency(selectedVenue?.pricePerHour || 0)}/hour
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-indigo-200">
                <span className="text-lg font-bold text-indigo-800">
                  Total: {formatCurrency(estimatedPrice)}
                </span>
              </div>
            </div>
          )}

          <div className="pt-4">
            <Button
              type="submit"
              disabled={loading || !availability || checkingAvailability}
              className="w-full"
              size="lg"
            >
              {loading ? "Creating Reservation..." : "Create Reservation"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateReservation;
