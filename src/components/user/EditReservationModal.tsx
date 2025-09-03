"use client";

import React, { useState, useEffect } from "react";
import { X, Calendar, Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { reservationsApi } from "@/lib/api";
import { Reservation, Event } from "@/types";

interface EditReservationModalProps {
  reservation: Reservation;
  onClose: () => void;
  onUpdated: () => void;
}

const EditReservationModal: React.FC<EditReservationModalProps> = ({
  reservation,
  onClose,
  onUpdated,
}) => {
  const [formData, setFormData] = useState({
    venueId: (reservation as any).venueId || "",
    startTime: new Date(reservation.startTime).toISOString().slice(0, 16),
    endTime: new Date(reservation.endTime).toISOString().slice(0, 16),
  });
  const [venues, setVenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [availability, setAvailability] = useState<boolean | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  useEffect(() => {
    fetchVenues();
  }, []);

  useEffect(() => {
    if (formData.venueId && formData.startTime && formData.endTime) {
      checkAvailability();
    }
  }, [formData.venueId, formData.startTime, formData.endTime]);

  const fetchVenues = async () => {
    try {
      // Venues are no longer separate entities
      setVenues([]);
    } catch (err: any) {
      setError("Failed to fetch venues");
    }
  };

  const checkAvailability = async () => {
    if (!formData.venueId || !formData.startTime || !formData.endTime) {
      setAvailability(null);
      return;
    }

    const originalStartTime = new Date(reservation.startTime)
      .toISOString()
      .slice(0, 16);
    const originalEndTime = new Date(reservation.endTime)
      .toISOString()
      .slice(0, 16);

    if (
      formData.venueId === (reservation as any).venueId &&
      formData.startTime === originalStartTime &&
      formData.endTime === originalEndTime
    ) {
      setAvailability(true);
      return;
    }

    try {
      setCheckingAvailability(true);
      const startTime = new Date(formData.startTime).toISOString();
      const endTime = new Date(formData.endTime).toISOString();

      // Availability checking is no longer supported
      setAvailability(false);
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

      await reservationsApi.update(reservation.id, {
        venueId: formData.venueId,
        startTime,
        endTime,
      });

      onUpdated();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update reservation");
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
  };

  const selectedVenue = venues.find((v) => v.id === formData.venueId);
  const startDate = new Date(formData.startTime);
  const endDate = new Date(formData.endTime);
  const durationHours =
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Edit Reservation
            </CardTitle>
            <Button
              onClick={onClose}
              variant="outline"
              size="sm"
              className="p-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
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
                Venue
              </label>
              <select
                name="venueId"
                value={formData.venueId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select a venue</option>
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
                <p className="text-sm text-blue-700 mb-1">
                  {selectedVenue.description}
                </p>
                <p className="text-sm text-blue-600">
                  📍 {selectedVenue.location.address},{" "}
                  {selectedVenue.location.city}
                </p>
                <p className="text-sm text-blue-600">
                  👥 Capacity: {selectedVenue.capacity} people
                </p>
                <p className="text-sm text-blue-600">
                  💰 {formatCurrency(selectedVenue.pricePerHour)} per hour
                </p>
              </div>
            )}

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
                <p className="text-sm text-indigo-700">
                  Duration: {durationHours.toFixed(1)} hours
                </p>
                <p className="text-lg font-bold text-indigo-800">
                  Total: {formatCurrency(estimatedPrice)}
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !availability || checkingAvailability}
                className="flex-1"
              >
                {loading ? "Updating..." : "Update Reservation"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditReservationModal;
