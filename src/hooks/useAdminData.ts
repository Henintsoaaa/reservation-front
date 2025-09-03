"use client";

import { useState, useEffect } from "react";
import { reservationsApi } from "@/lib/api";
import { Reservation, ReservationStatus } from "@/types";

export const useAdminData = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [venues, setVenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [reservationsData, venuesData] = await Promise.all([
        reservationsApi.getAll(),
        Promise.resolve([]), // Venues no longer exist
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
    try {
      // Venue deletion is no longer supported
      console.log("Venue deletion is no longer supported");
      setVenues((prev) => prev.filter((venue) => venue.id !== id));
    } catch (err) {
      setError("Failed to delete venue");
    }
  };

  const addVenue = (newVenue: any) => {
    setVenues((prev) => [...prev, newVenue]);
  };

  const updateVenue = (updatedVenue: any) => {
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
