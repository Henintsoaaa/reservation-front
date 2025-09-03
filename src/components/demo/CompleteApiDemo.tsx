"use client";

import React, { useState, useEffect } from "react";
import { useAllApis } from "@/hooks/useAllApis";
import { Event, Booking, Review, User } from "@/types";

export const CompleteApiDemo: React.FC = () => {
  const {
    // Data states
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

    // Auth methods
    login,
    register,
    getProfile,

    // Event methods
    loadAllEvents,
    getEventById,
    searchEvents,
    createEvent,
    updateEvent,
    deleteEvent,

    // Booking methods
    loadAllBookings,
    loadMyBookings,
    createBooking,
    updateBooking,
    cancelBooking,
    getEventStats,
    getAvailableSeats,

    // Review methods
    loadAllReviews,
    getEventReviews,
    createReview,
    updateReview,
    deleteReview,

    // User methods
    loadAllUsers,
    createUser,
    updateUser,
    deleteUser,

    // Utility
    refreshAllData,
  } = useAllApis();

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [eventStats, setEventStats] = useState<any>(null);
  const [eventSeats, setEventSeats] = useState<any>(null);
  const [eventReviews, setEventReviews] = useState<Review[]>([]);

  // Demo des APIs d'authentification
  const handleDemoLogin = async () => {
    try {
      await login({
        email: "demo@example.com",
        password: "password123",
      });
      console.log("Login successful!");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // Demo des APIs d'événements
  const handleEventSelection = async (event: Event) => {
    setSelectedEvent(event);
    try {
      const [stats, seats, reviews] = await Promise.all([
        getEventStats(event.id),
        getAvailableSeats(event.id),
        getEventReviews(event.id),
      ]);
      setEventStats(stats);
      setEventSeats(seats);
      setEventReviews(reviews);
    } catch (error) {
      console.error("Error loading event details:", error);
    }
  };

  // Demo des APIs de réservation
  const handleCreateBooking = async () => {
    if (!selectedEvent) return;

    try {
      await createBooking({
        eventId: selectedEvent.id,
        numberOfTickets: 2,
        totalPrice: selectedEvent.ticketPrice * 2,
      });
      console.log("Booking created successfully!");
    } catch (error) {
      console.error("Booking failed:", error);
    }
  };

  // Demo des APIs d'avis
  const handleCreateReview = async () => {
    if (!selectedEvent) return;

    try {
      await createReview({
        eventId: selectedEvent.id,
        rating: 5,
        comment: "Excellent événement!",
      });
      console.log("Review created successfully!");
    } catch (error) {
      console.error("Review creation failed:", error);
    }
  };

  // Demo de recherche d'événements
  const handleSearchDemo = async () => {
    try {
      const results = await searchEvents("concert", {
        category: "music",
        location: "Paris",
      });
      console.log("Search results:", results);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Démonstration complète des APIs
      </h1>

      {/* Section d'authentification */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">
          🔐 APIs d'authentification
        </h2>
        <div className="flex gap-4">
          <button
            onClick={handleDemoLogin}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={loading.auth}
          >
            Demo Login
          </button>
          <button
            onClick={getProfile}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            disabled={loading.profile}
          >
            Get Profile
          </button>
        </div>
        {currentUser && (
          <div className="mt-4 p-3 bg-gray-100 rounded">
            <p>
              <strong>Utilisateur connecté:</strong> {currentUser.name} (
              {currentUser.email})
            </p>
          </div>
        )}
      </section>

      {/* Section des événements */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">🎫 APIs d'événements</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">
              Événements en vedette ({featuredEvents.length})
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {featuredEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-2 border rounded cursor-pointer hover:bg-gray-50"
                  onClick={() => handleEventSelection(event)}
                >
                  <h4 className="font-medium">{event.title}</h4>
                  <p className="text-sm text-gray-600">
                    {event.venue?.name || "Lieu non spécifié"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">
              Événements disponibles ({availableEvents.length})
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {availableEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-2 border rounded cursor-pointer hover:bg-gray-50"
                  onClick={() => handleEventSelection(event)}
                >
                  <h4 className="font-medium">{event.title}</h4>
                  <p className="text-sm text-gray-600">
                    {event.venue?.name || "Lieu non spécifié"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={handleSearchDemo}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Demo Recherche
          </button>
        </div>
      </section>

      {/* Section de l'événement sélectionné */}
      {selectedEvent && (
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            📋 Détails de l'événement
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <h3 className="font-semibold">{selectedEvent.title}</h3>
              <p className="text-gray-600">{selectedEvent.description}</p>
              <p className="mt-2">
                <strong>Prix:</strong> {selectedEvent.ticketPrice}€
              </p>
              <p>
                <strong>Lieu:</strong>{" "}
                {selectedEvent.venue?.name || "Lieu non spécifié"}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Statistiques</h4>
              {eventStats && (
                <div className="text-sm space-y-1">
                  <p>Total réservations: {eventStats.totalBookings || 0}</p>
                  <p>Places vendues: {eventStats.totalSeats || 0}</p>
                </div>
              )}
            </div>

            <div>
              <h4 className="font-semibold mb-2">Places disponibles</h4>
              {eventSeats && (
                <p className="text-sm">
                  Disponibles: {eventSeats.available || 0}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 flex gap-4">
            <button
              onClick={handleCreateBooking}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Réserver
            </button>
            <button
              onClick={handleCreateReview}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Laisser un avis
            </button>
          </div>
        </section>
      )}

      {/* Section des réservations */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">🎟️ APIs de réservation</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">
              Mes réservations ({myBookings.length})
            </h3>
            <button
              onClick={loadMyBookings}
              className="mb-2 px-3 py-1 bg-blue-500 text-white rounded text-sm"
              disabled={loading.myBookings}
            >
              Recharger
            </button>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {myBookings.map((booking) => (
                <div key={booking.id} className="p-2 border rounded text-sm">
                  <p>
                    <strong>Event:</strong> {booking.eventId}
                  </p>
                  <p>
                    <strong>Places:</strong> {booking.numberOfTickets}
                  </p>
                  <p>
                    <strong>Status:</strong> {booking.status}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">
              Toutes les réservations ({bookings.length})
            </h3>
            <button
              onClick={loadAllBookings}
              className="mb-2 px-3 py-1 bg-blue-500 text-white rounded text-sm"
              disabled={loading.bookings}
            >
              Recharger
            </button>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {bookings.slice(0, 5).map((booking) => (
                <div key={booking.id} className="p-2 border rounded text-sm">
                  <p>
                    <strong>Event:</strong> {booking.eventId}
                  </p>
                  <p>
                    <strong>User:</strong> {booking.userId}
                  </p>
                  <p>
                    <strong>Status:</strong> {booking.status}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section des avis */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">⭐ APIs d'avis</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">
              Tous les avis ({reviews.length})
            </h3>
            <button
              onClick={loadAllReviews}
              className="mb-2 px-3 py-1 bg-blue-500 text-white rounded text-sm"
              disabled={loading.reviews}
            >
              Recharger
            </button>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {reviews.slice(0, 5).map((review) => (
                <div key={review.id} className="p-2 border rounded text-sm">
                  <p>
                    <strong>Note:</strong> {(review as any).rating}/5
                  </p>
                  <p>
                    <strong>Commentaire:</strong> {(review as any).comment}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">
              Avis de l'événement sélectionné
            </h3>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {eventReviews.map((review) => (
                <div key={review.id} className="p-2 border rounded text-sm">
                  <p>
                    <strong>Note:</strong> {(review as any).rating}/5
                  </p>
                  <p>
                    <strong>Commentaire:</strong> {(review as any).comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section des utilisateurs (Admin) */}
      {currentUser?.role === "admin" && (
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            👥 APIs utilisateurs (Admin)
          </h2>
          <div>
            <h3 className="font-semibold mb-2">
              Utilisateurs ({users.length})
            </h3>
            <button
              onClick={loadAllUsers}
              className="mb-2 px-3 py-1 bg-blue-500 text-white rounded text-sm"
              disabled={loading.users}
            >
              Recharger
            </button>
            <div className="grid md:grid-cols-2 gap-4 max-h-40 overflow-y-auto">
              {users.map((user) => (
                <div key={user.id} className="p-2 border rounded text-sm">
                  <p>
                    <strong>Nom:</strong> {user.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Rôle:</strong> {user.role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section de statut */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">📊 Statut des APIs</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="font-semibold">États de chargement</p>
            <div className="text-sm mt-2">
              {Object.entries(loading).map(([key, isLoading]) => (
                <p
                  key={key}
                  className={isLoading ? "text-orange-600" : "text-green-600"}
                >
                  {key}: {isLoading ? "⏳" : "✅"}
                </p>
              ))}
            </div>
          </div>
          <div className="text-center">
            <p className="font-semibold">Événements</p>
            <p className="text-2xl font-bold text-blue-600">{events.length}</p>
          </div>
          <div className="text-center">
            <p className="font-semibold">Réservations</p>
            <p className="text-2xl font-bold text-green-600">
              {bookings.length}
            </p>
          </div>
          <div className="text-center">
            <p className="font-semibold">Avis</p>
            <p className="text-2xl font-bold text-yellow-600">
              {reviews.length}
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            <strong>Erreur:</strong> {error}
          </div>
        )}
      </section>

      {/* Bouton de rafraîchissement global */}
      <div className="text-center">
        <button
          onClick={refreshAllData}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
        >
          🔄 Rafraîchir toutes les données
        </button>
      </div>
    </div>
  );
};

export default CompleteApiDemo;
