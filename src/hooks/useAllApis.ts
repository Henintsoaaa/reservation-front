"use client";

import { useState, useEffect } from "react";
import {
  authApi,
  eventsApi,
  bookingsApi,
  reviewsApi,
  usersApi,
} from "@/lib/api";
import { Event, Booking, Review, User, AuthResponse } from "@/types";

export const useAllApis = () => {
  // State management for all data
  const [events, setEvents] = useState<Event[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [availableEvents, setAvailableEvents] = useState<Event[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<string | null>(null);

  // Helper function to handle loading states
  const setLoadingState = (key: string, isLoading: boolean) => {
    setLoading((prev) => ({ ...prev, [key]: isLoading }));
  };

  // Auth API methods
  const login = async (credentials: any): Promise<AuthResponse> => {
    try {
      setLoadingState("auth", true);
      const response = await authApi.login(credentials);
      await getProfile(); // Refresh profile after login
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
      throw err;
    } finally {
      setLoadingState("auth", false);
    }
  };

  const register = async (userData: any): Promise<AuthResponse> => {
    try {
      setLoadingState("auth", true);
      const response = await authApi.register(userData);
      await getProfile(); // Get profile after registration
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
      throw err;
    } finally {
      setLoadingState("auth", false);
    }
  };

  const getProfile = async () => {
    try {
      setLoadingState("profile", true);
      const profile = await authApi.getProfile();
      setCurrentUser(profile);
      return profile;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to get profile");
      return null;
    } finally {
      setLoadingState("profile", false);
    }
  };

  const refreshToken = async () => {
    try {
      return await authApi.refreshToken();
    } catch (err: any) {
      setError(err.response?.data?.message || "Token refresh failed");
      throw err;
    }
  };

  // Events API methods
  const loadAllEvents = async () => {
    try {
      setLoadingState("events", true);
      const [allEvents, featured, available] = await Promise.all([
        eventsApi.getAll(),
        eventsApi.getFeatured(),
        eventsApi.getAvailable(),
      ]);

      setEvents(Array.isArray(allEvents) ? allEvents : allEvents.data || []);
      setFeaturedEvents(featured);
      setAvailableEvents(available);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load events");
    } finally {
      setLoadingState("events", false);
    }
  };

  const getEventById = async (id: string) => {
    try {
      return await eventsApi.getById(id);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to get event");
      throw err;
    }
  };

  const searchEvents = async (query: string, filters?: any) => {
    try {
      setLoadingState("search", true);
      return await eventsApi.searchEvents(query, filters);
    } catch (err: any) {
      setError(err.response?.data?.message || "Search failed");
      throw err;
    } finally {
      setLoadingState("search", false);
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
    try {
      await eventsApi.delete(id);
      setEvents((prev) => prev.filter((event) => event.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete event");
      throw err;
    }
  };

  // Bookings API methods
  const loadAllBookings = async () => {
    try {
      setLoadingState("bookings", true);
      const allBookings = await bookingsApi.getAll();
      setBookings(allBookings);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoadingState("bookings", false);
    }
  };

  const loadMyBookings = async () => {
    try {
      setLoadingState("myBookings", true);
      const userBookings = await bookingsApi.getMyBookings();
      setMyBookings(userBookings);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load my bookings");
    } finally {
      setLoadingState("myBookings", false);
    }
  };

  const createBooking = async (bookingData: any) => {
    try {
      const newBooking = await bookingsApi.create(bookingData);
      setBookings((prev) => [newBooking, ...prev]);
      setMyBookings((prev) => [newBooking, ...prev]);
      return newBooking;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create booking");
      throw err;
    }
  };

  const updateBooking = async (id: string, bookingData: any) => {
    try {
      const updatedBooking = await bookingsApi.update(id, bookingData);
      setBookings((prev) =>
        prev.map((booking) => (booking.id === id ? updatedBooking : booking))
      );
      setMyBookings((prev) =>
        prev.map((booking) => (booking.id === id ? updatedBooking : booking))
      );
      return updatedBooking;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update booking");
      throw err;
    }
  };

  const cancelBooking = async (id: string) => {
    try {
      const cancelledBooking = await bookingsApi.cancel(id);
      setBookings((prev) =>
        prev.map((booking) => (booking.id === id ? cancelledBooking : booking))
      );
      setMyBookings((prev) =>
        prev.map((booking) => (booking.id === id ? cancelledBooking : booking))
      );
      return cancelledBooking;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to cancel booking");
      throw err;
    }
  };

  const getEventStats = async (eventId: string) => {
    try {
      return await bookingsApi.getEventStats(eventId);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to get event stats");
      throw err;
    }
  };

  const getAvailableSeats = async (eventId: string) => {
    try {
      return await bookingsApi.getAvailableSeats(eventId);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to get available seats");
      throw err;
    }
  };

  // Reviews API methods
  const loadAllReviews = async () => {
    try {
      setLoadingState("reviews", true);
      const allReviews = await reviewsApi.getAll();
      setReviews(allReviews);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load reviews");
    } finally {
      setLoadingState("reviews", false);
    }
  };

  const getReviewById = async (id: string) => {
    try {
      return await reviewsApi.getById(id);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to get review");
      throw err;
    }
  };

  const getEventReviews = async (eventId: string) => {
    try {
      return await reviewsApi.getByEvent(eventId);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to get event reviews");
      return [];
    }
  };

  const createReview = async (reviewData: any) => {
    try {
      const newReview = await reviewsApi.create(reviewData);
      setReviews((prev) => [newReview, ...prev]);
      return newReview;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create review");
      throw err;
    }
  };

  const updateReview = async (id: string, reviewData: any) => {
    try {
      const updatedReview = await reviewsApi.update(id, reviewData);
      setReviews((prev) =>
        prev.map((review) => (review.id === id ? updatedReview : review))
      );
      return updatedReview;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update review");
      throw err;
    }
  };

  const deleteReview = async (id: string) => {
    try {
      await reviewsApi.delete(id);
      setReviews((prev) => prev.filter((review) => review.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete review");
      throw err;
    }
  };

  // Users API methods (Admin only)
  const loadAllUsers = async () => {
    try {
      setLoadingState("users", true);
      const allUsers = await usersApi.getAll();
      setUsers(allUsers);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoadingState("users", false);
    }
  };

  const getUserById = async (id: string) => {
    try {
      return await usersApi.getById(id);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to get user");
      throw err;
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
      if (currentUser?.id === id) {
        setCurrentUser(updatedUser);
      }
      return updatedUser;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update user");
      throw err;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await usersApi.delete(id);
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete user");
      throw err;
    }
  };

  // Initialize data on mount
  const initializeData = async () => {
    try {
      setError(null);
      await Promise.all([loadAllEvents(), loadAllReviews(), getProfile()]);
    } catch (err: any) {
      console.error("Error initializing data:", err);
    }
  };

  const refreshAllData = async () => {
    await initializeData();
    if (currentUser) {
      await loadMyBookings();
    }
  };

  useEffect(() => {
    initializeData();
  }, []);

  return {
    // State
    events,
    featuredEvents,
    availableEvents,
    bookings,
    myBookings,
    reviews,
    users,
    currentUser,
    loading,
    error,

    // Setters
    setError,

    // Auth methods
    login,
    register,
    getProfile,
    refreshToken,

    // Events methods
    loadAllEvents,
    getEventById,
    searchEvents,
    createEvent,
    updateEvent,
    deleteEvent,

    // Bookings methods
    loadAllBookings,
    loadMyBookings,
    createBooking,
    updateBooking,
    cancelBooking,
    getEventStats,
    getAvailableSeats,

    // Reviews methods
    loadAllReviews,
    getReviewById,
    getEventReviews,
    createReview,
    updateReview,
    deleteReview,

    // Users methods
    loadAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,

    // Utility methods
    initializeData,
    refreshAllData,
  };
};
