"use client";

import { useState, useEffect } from "react";
import { reservationsApi, venuesApi } from "@/lib/api";
import { Reservation, Venue, ReservationStatus } from "@/types";

export const useAdminData = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [reservationsData, venuesData] = await Promise.all([
        reservationsApi.getAll(),
        venuesApi.getAll(),
      ]);
      setReservations(reservationsData);
      setVenues(venuesData);
    } catch (err: any) {
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const updateReservationStatus = async (
    id: string,
    status: ReservationStatus
  ) => {
    try {
      await reservationsApi.updateStatus(id, status);
      await fetchData(); // Refresh data
    } catch (err: any) {
      setError(err.message || "Failed to update reservation status");
    }
  };

  const deleteReservation = async (id: string) => {
    if (!confirm("Are you sure you want to delete this reservation?")) return;

    try {
      await reservationsApi.delete(id);
      await fetchData(); // Refresh data
    } catch (err: any) {
      setError(err.message || "Failed to delete reservation");
    }
  };

  const deleteVenue = async (id: string) => {
    if (!confirm("Are you sure you want to delete this venue?")) return;

    try {
      await venuesApi.delete(id);
      await fetchData();
    } catch (err: any) {
      setError(err.message || "Failed to delete venue");
    }
  };

  const addVenue = (newVenue: Venue) => {
    setVenues((prev) => [...prev, newVenue]);
  };

  const updateVenue = (updatedVenue: Venue) => {
    setVenues((prev) =>
      prev.map((venue) => (venue.id === updatedVenue.id ? updatedVenue : venue))
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    reservations,
    venues,
    loading,
    error,
    fetchData,
    updateReservationStatus,
    deleteReservation,
    deleteVenue,
    addVenue,
    updateVenue,
  };
};
