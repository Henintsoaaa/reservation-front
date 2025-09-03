import { useState, useEffect } from "react";
import { reservationsApi } from "@/lib/api";
import { Reservation, ReservationStatus } from "@/types";

export const useUserData = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [venues, setVenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [reservationsData, venuesData] = await Promise.all([
        reservationsApi.getMyReservations(),
        Promise.resolve([]), // Venues no longer exist
      ]);

      setReservations(reservationsData);
      setVenues(venuesData);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const createReservation = async (reservationData: any) => {
    try {
      const newReservation = await reservationsApi.create(reservationData);
      setReservations((prev) => [newReservation, ...prev]);
      return newReservation;
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message || "Failed to create reservation"
      );
    }
  };

  const updateReservation = async (id: string, updateData: any) => {
    try {
      const updatedReservation = await reservationsApi.update(id, updateData);
      setReservations((prev) =>
        prev.map((reservation) =>
          reservation.id === id ? updatedReservation : reservation
        )
      );
      return updatedReservation;
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message || "Failed to update reservation"
      );
    }
  };

  const cancelReservation = async (id: string) => {
    try {
      const updatedReservation = await reservationsApi.updateStatus(
        id,
        ReservationStatus.CANCELLED
      );
      setReservations((prev) =>
        prev.map((reservation) =>
          reservation.id === id ? updatedReservation : reservation
        )
      );
      return updatedReservation;
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message || "Failed to cancel reservation"
      );
    }
  };

  const deleteReservation = async (id: string) => {
    try {
      await reservationsApi.delete(id);
      setReservations((prev) =>
        prev.filter((reservation) => reservation.id !== id)
      );
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message || "Failed to delete reservation"
      );
    }
  };

  const refreshReservations = async () => {
    try {
      const reservationsData = await reservationsApi.getMyReservations();
      setReservations(reservationsData);
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message || "Failed to refresh reservations"
      );
    }
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
    createReservation,
    updateReservation,
    cancelReservation,
    deleteReservation,
    refreshReservations,
  };
};
