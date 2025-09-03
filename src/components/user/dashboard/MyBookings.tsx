"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  Ticket,
  Download,
  Edit3,
  Trash2,
  QrCode,
  Star,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Filter,
  Search,
  ArrowRight,
} from "lucide-react";
import { Booking, BookingStatus } from "@/types";
import { bookingsApi } from "@/lib/api";

interface MyBookingsProps {
  onEventSelect?: (eventId: string) => void;
}

export const MyBookings: React.FC<MyBookingsProps> = ({ onEventSelect }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "cancelled">(
    "upcoming"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setIsLoading(true);
      const userBookings = await bookingsApi.getMyBookings();
      setBookings(userBookings);
    } catch (error) {
      console.error("Error loading bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.event?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.event?.venue?.city
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

    const now = new Date();
    const eventDate = new Date(booking.event?.startDateTime || "");

    switch (activeTab) {
      case "upcoming":
        return (
          matchesSearch &&
          eventDate > now &&
          booking.status !== BookingStatus.CANCELLED
        );
      case "past":
        return (
          matchesSearch &&
          eventDate <= now &&
          booking.status !== BookingStatus.CANCELLED
        );
      case "cancelled":
        return matchesSearch && booking.status === BookingStatus.CANCELLED;
      default:
        return matchesSearch;
    }
  });

  const getStatusIcon = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case BookingStatus.PENDING:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case BookingStatus.CANCELLED:
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return "Confirmé";
      case BookingStatus.PENDING:
        return "En attente";
      case BookingStatus.CANCELLED:
        return "Annulé";
      case BookingStatus.COMPLETED:
        return "Terminé";
      default:
        return status;
    }
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return "text-green-700 bg-green-100";
      case BookingStatus.PENDING:
        return "text-yellow-700 bg-yellow-100";
      case BookingStatus.CANCELLED:
        return "text-red-700 bg-red-100";
      case BookingStatus.COMPLETED:
        return "text-blue-700 bg-blue-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await bookingsApi.cancel(bookingId);
      await loadBookings(); // Recharger les données
      setShowCancelModal(false);
      setSelectedBooking(null);
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  const handleDownloadTicket = (booking: Booking) => {
    // Simuler le téléchargement d'un billet
    const ticketData = {
      bookingReference: booking.bookingReference,
      eventTitle: booking.event?.title,
      eventDate: booking.event?.startDateTime,
      venue: booking.event?.venue?.name,
      numberOfTickets: booking.numberOfTickets,
      qrCode: booking.qrCode,
    };

    const dataStr = JSON.stringify(ticketData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ticket-${booking.bookingReference}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const tabs = [
    {
      key: "upcoming" as const,
      label: "À venir",
      count: bookings.filter(
        (b) =>
          new Date(b.event?.startDateTime || "") > new Date() &&
          b.status !== BookingStatus.CANCELLED
      ).length,
    },
    {
      key: "past" as const,
      label: "Passés",
      count: bookings.filter(
        (b) =>
          new Date(b.event?.startDateTime || "") <= new Date() &&
          b.status !== BookingStatus.CANCELLED
      ).length,
    },
    {
      key: "cancelled" as const,
      label: "Annulés",
      count: bookings.filter((b) => b.status === BookingStatus.CANCELLED)
        .length,
    },
  ];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex gap-4">
                <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Mes réservations
        </h1>
        <p className="text-gray-600">
          Gérez toutes vos réservations d'événements
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par événement ou lieu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Filter className="h-5 w-5" />
          Filtres
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.key
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
                <span
                  className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    activeTab === tab.key
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-12">
          <Ticket className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? "Aucun résultat trouvé" : "Aucune réservation"}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery
              ? "Essayez de modifier votre recherche"
              : activeTab === "upcoming"
              ? "Vous n'avez pas encore de réservations à venir"
              : activeTab === "past"
              ? "Vous n'avez pas d'événements passés"
              : "Vous n'avez pas de réservations annulées"}
          </p>
          {!searchQuery && activeTab === "upcoming" && (
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Découvrir des événements
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onEventSelect={onEventSelect}
              onDownloadTicket={handleDownloadTicket}
              onCancelBooking={(booking) => {
                setSelectedBooking(booking);
                setShowCancelModal(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelModal && selectedBooking && (
        <CancelBookingModal
          booking={selectedBooking}
          onConfirm={() => handleCancelBooking(selectedBooking.id)}
          onClose={() => {
            setShowCancelModal(false);
            setSelectedBooking(null);
          }}
        />
      )}
    </div>
  );
};

// Composant pour chaque carte de réservation
const BookingCard: React.FC<{
  booking: Booking;
  onEventSelect?: (eventId: string) => void;
  onDownloadTicket: (booking: Booking) => void;
  onCancelBooking: (booking: Booking) => void;
}> = ({ booking, onEventSelect, onDownloadTicket, onCancelBooking }) => {
  const [showActions, setShowActions] = useState(false);

  const getStatusIcon = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case BookingStatus.PENDING:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case BookingStatus.CANCELLED:
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return "Confirmé";
      case BookingStatus.PENDING:
        return "En attente";
      case BookingStatus.CANCELLED:
        return "Annulé";
      case BookingStatus.COMPLETED:
        return "Terminé";
      default:
        return status;
    }
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return "text-green-700 bg-green-100";
      case BookingStatus.PENDING:
        return "text-yellow-700 bg-yellow-100";
      case BookingStatus.CANCELLED:
        return "text-red-700 bg-red-100";
      case BookingStatus.COMPLETED:
        return "text-blue-700 bg-blue-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      full: date.toLocaleDateString("fr-FR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      day: date.getDate().toString().padStart(2, "0"),
      month: date.toLocaleDateString("fr-FR", { month: "short" }),
    };
  };

  const dateInfo = formatDate(booking.event?.startDateTime || "");
  const isUpcoming = new Date(booking.event?.startDateTime || "") > new Date();
  const canCancel = isUpcoming && booking.status === BookingStatus.CONFIRMED;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200">
      <div className="flex">
        {/* Event Image */}
        <div className="relative w-32 md:w-40 flex-shrink-0">
          <img
            src={booking.event?.images?.[0] || "/api/placeholder/200/150"}
            alt={booking.event?.title}
            className="w-full h-32 md:h-40 object-cover"
          />

          {/* Date Badge */}
          <div className="absolute top-3 left-3">
            <div className="bg-white rounded-lg shadow-md p-2 text-center min-w-[50px]">
              <div className="text-sm font-bold text-gray-900">
                {dateInfo.day}
              </div>
              <div className="text-xs text-gray-600 uppercase">
                {dateInfo.month}
              </div>
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="flex-1 p-4 md:p-6">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-1">
                  {booking.event?.title}
                </h3>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {getStatusIcon(booking.status)}
                    {getStatusText(booking.status)}
                  </span>

                  <span className="font-medium">
                    Réf: {booking.bookingReference}
                  </span>
                </div>
              </div>

              {/* Actions Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowActions(!showActions)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <MoreHorizontal className="h-5 w-5 text-gray-500" />
                </button>

                {showActions && (
                  <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[160px]">
                    <button
                      onClick={() => {
                        onEventSelect?.(booking.event?.id || "");
                        setShowActions(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                    >
                      <ArrowRight className="h-4 w-4" />
                      Voir l'événement
                    </button>

                    <button
                      onClick={() => {
                        onDownloadTicket(booking);
                        setShowActions(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Télécharger billet
                    </button>

                    {canCancel && (
                      <button
                        onClick={() => {
                          onCancelBooking(booking);
                          setShowActions(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-red-600 flex items-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Annuler
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Event Meta */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span>{dateInfo.full}</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-green-500" />
                <span>{dateInfo.time}</span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-red-500" />
                <span className="line-clamp-1">
                  {booking.event?.venue?.name}, {booking.event?.venue?.city}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Ticket className="h-4 w-4 text-purple-500" />
                <span>{booking.numberOfTickets} billet(s)</span>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="flex items-center justify-between mt-auto">
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">
                  {booking.totalPrice}€
                </div>
                <div className="text-sm text-gray-500">
                  {booking.ticketType && `Type: ${booking.ticketType}`}
                </div>
              </div>

              <div className="flex gap-2">
                {booking.qrCode && (
                  <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                    <QrCode className="h-5 w-5" />
                  </button>
                )}

                <button
                  onClick={() => onDownloadTicket(booking)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden md:inline">Télécharger</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal de confirmation d'annulation
const CancelBookingModal: React.FC<{
  booking: Booking;
  onConfirm: () => void;
  onClose: () => void;
}> = ({ booking, onConfirm, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Annuler la réservation
            </h3>
          </div>

          <p className="text-gray-600 mb-6">
            Êtes-vous sûr de vouloir annuler votre réservation pour "
            {booking.event?.title}" ? Cette action est irréversible.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Garder ma réservation
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Oui, annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
