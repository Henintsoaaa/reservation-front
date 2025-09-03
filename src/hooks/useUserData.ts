import { useState, useEffect } from "react";
import { bookingsApi, usersApi, eventsApi } from "@/lib/api";
import { Booking } from "@/types";

export const useUserData = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userEvents, setUserEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [bookingsData, profile] = await Promise.all([
        bookingsApi.getMyBookings(),
        usersApi.getMe(),
      ]);

      setBookings(bookingsData);
      setUserProfile(profile);

      // Charger les événements liés aux bookings
      if (bookingsData.length > 0) {
        const eventIds = [
          ...new Set(bookingsData.map((booking) => booking.eventId)),
        ];
        const eventsPromises = eventIds.map((id) => eventsApi.getById(id));
        const eventsData = await Promise.all(eventsPromises);
        setUserEvents(eventsData);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (bookingData: any) => {
    try {
      const newBooking = await bookingsApi.create(bookingData);
      setBookings((prev) => [newBooking, ...prev]);
      return newBooking;
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message || "Failed to create booking"
      );
    }
  };

  const updateBooking = async (id: string, updateData: any) => {
    try {
      const updatedBooking = await bookingsApi.update(id, updateData);
      setBookings((prev) =>
        prev.map((booking) => (booking.id === id ? updatedBooking : booking))
      );
      return updatedBooking;
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message || "Failed to update booking"
      );
    }
  };

  const cancelBooking = async (id: string) => {
    try {
      const updatedBooking = await bookingsApi.cancel(id);
      setBookings((prev) =>
        prev.map((booking) => (booking.id === id ? updatedBooking : booking))
      );
      return updatedBooking;
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message || "Failed to cancel booking"
      );
    }
  };

  const deleteBooking = async (id: string) => {
    try {
      await bookingsApi.cancel(id);
      setBookings((prev) => prev.filter((booking) => booking.id !== id));
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message || "Failed to delete booking"
      );
    }
  };

  const refreshBookings = async () => {
    try {
      const bookingsData = await bookingsApi.getMyBookings();
      setBookings(bookingsData);
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message || "Failed to refresh bookings"
      );
    }
  };

  const updateProfile = async (updateData: any) => {
    try {
      if (!userProfile?.id) throw new Error("User profile not loaded");
      const updatedProfile = await usersApi.update(userProfile.id, updateData);
      setUserProfile(updatedProfile);
      return updatedProfile;
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message || "Failed to update profile"
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    bookings,
    userProfile,
    userEvents,
    loading,
    error,
    fetchData,
    createBooking,
    updateBooking,
    cancelBooking,
    deleteBooking,
    refreshBookings,
    updateProfile,
  };
};
