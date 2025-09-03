"use client";

import { useState, useEffect } from "react";
import { bookingsApi, usersApi, eventsApi, reviewsApi } from "@/lib/api";
import { Booking, User, Event, Review } from "@/types";

export const useAdminData = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [bookingsData, usersData, eventsData, reviewsData] =
        await Promise.all([
          bookingsApi.getAll(),
          usersApi.getAll(),
          eventsApi.getAll(),
          reviewsApi.getAll(),
        ]);

      setBookings(bookingsData);
      setUsers(usersData);
      setEvents(Array.isArray(eventsData) ? eventsData : eventsData.data || []);
      setReviews(reviewsData);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      const updatedBooking = await bookingsApi.update(id, { status });
      setBookings((prev) =>
        prev.map((booking) => (booking.id === id ? updatedBooking : booking))
      );
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to update booking status"
      );
    }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;

    try {
      await bookingsApi.cancel(id);
      setBookings((prev) => prev.filter((booking) => booking.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete booking");
    }
  };

  const createEvent = async (eventData: any) => {
    try {
      const newEvent = await eventsApi.create(eventData);
      setEvents((prev) => [newEvent, ...prev]);
      return newEvent;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create event");
      throw err;
    }
  };

  const updateEvent = async (id: string, eventData: any) => {
    try {
      const updatedEvent = await eventsApi.update(id, eventData);
      setEvents((prev) =>
        prev.map((event) => (event.id === id ? updatedEvent : event))
      );
      return updatedEvent;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update event");
      throw err;
    }
  };

  const deleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      await eventsApi.delete(id);
      setEvents((prev) => prev.filter((event) => event.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete event");
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await usersApi.delete(id);
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete user");
    }
  };

  const createUser = async (userData: any) => {
    try {
      const newUser = await usersApi.create(userData);
      setUsers((prev) => [newUser, ...prev]);
      return newUser;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create user");
      throw err;
    }
  };

  const updateUser = async (id: string, userData: any) => {
    try {
      const updatedUser = await usersApi.update(id, userData);
      setUsers((prev) =>
        prev.map((user) => (user.id === id ? updatedUser : user))
      );
      return updatedUser;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update user");
      throw err;
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      await reviewsApi.delete(id);
      setReviews((prev) => prev.filter((review) => review.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete review");
    }
  };

  const getEventStats = async (eventId: string) => {
    try {
      return await bookingsApi.getEventStats(eventId);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to get event stats");
      return null;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    bookings,
    users,
    events,
    reviews,
    loading,
    error,
    fetchData,
    updateBookingStatus,
    deleteBooking,
    createEvent,
    updateEvent,
    deleteEvent,
    createUser,
    updateUser,
    deleteUser,
    deleteReview,
    getEventStats,
  };
};
