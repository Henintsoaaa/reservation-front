"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Star,
  Heart,
  Share2,
  ArrowLeft,
  Ticket,
  CreditCard,
  Phone,
  Mail,
  Globe,
  Camera,
  ChevronLeft,
  ChevronRight,
  Timer,
  AlertTriangle,
} from "lucide-react";
import { Event, Booking, Review } from "@/types";
import { eventsApi, bookingsApi, reviewsApi } from "@/lib/api";

interface EventDetailsProps {
  eventId: string;
  onBack?: () => void;
  onBookingSuccess?: (booking: Booking) => void;
}

export const EventDetails: React.FC<EventDetailsProps> = ({
  eventId,
  onBack,
  onBookingSuccess,
}) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [numberOfTickets, setNumberOfTickets] = useState(1);
  const [selectedTicketType, setSelectedTicketType] = useState("standard");
  const [isBooking, setIsBooking] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  const ticketTypes = [
    {
      id: "standard",
      name: "Standard",
      price: 0,
      description: "Accès standard à l'événement",
    },
    {
      id: "premium",
      name: "Premium",
      price: 20,
      description: "Accès privilégié + boissons incluses",
    },
    {
      id: "vip",
      name: "VIP",
      price: 50,
      description: "Accès VIP + meet & greet + cadeaux",
    },
  ];

  useEffect(() => {
    loadEventDetails();
  }, [eventId]);

  useEffect(() => {
    if (event) {
      const interval = setInterval(() => {
        updateTimeRemaining();
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [event]);

  const loadEventDetails = async () => {
    try {
      setIsLoading(true);
      const [eventData, eventReviews] = await Promise.all([
        eventsApi.getById(eventId),
        reviewsApi.getByEvent(eventId),
      ]);

      setEvent(eventData);
      setReviews(eventReviews);
    } catch (error) {
      console.error("Error loading event details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTimeRemaining = () => {
    if (!event) return;

    const now = new Date().getTime();
    const eventStart = new Date(event.startDateTime ?? "").getTime();
    const difference = eventStart - now;

    if (difference <= 0) {
      setTimeRemaining("Événement en cours ou terminé");
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      setTimeRemaining(`${days}j ${hours}h ${minutes}m`);
    } else if (hours > 0) {
      setTimeRemaining(`${hours}h ${minutes}m`);
    } else {
      setTimeRemaining(`${minutes}m`);
    }
  };

  const handleBooking = async () => {
    if (!event) return;

    try {
      setIsBooking(true);
      const selectedType = ticketTypes.find((t) => t.id === selectedTicketType);
      const totalPrice =
        ((event.basePrice ?? 0) + (selectedType?.price || 0)) * numberOfTickets;

      const booking = await bookingsApi.create({
        eventId: event.id,
        numberOfTickets,
        ticketType: selectedTicketType,
        totalPrice,
      });

      setShowBookingModal(false);
      onBookingSuccess?.(booking);
    } catch (error) {
      console.error("Booking error:", error);
    } finally {
      setIsBooking(false);
    }
  };

  const navigateImage = (direction: "prev" | "next") => {
    if (!event?.images?.length) return;

    if (direction === "prev") {
      setCurrentImageIndex((prev) =>
        prev === 0 ? event.images!.length - 1 : prev - 1
      );
    } else {
      setCurrentImageIndex((prev) =>
        prev === event.images!.length - 1 ? 0 : prev + 1
      );
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 animate-pulse">
        <div className="h-64 bg-gray-200"></div>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Événement non trouvé
          </h2>
          <button
            onClick={onBack}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  const dateInfo = formatDate(event.startDateTime ?? "");
  const availabilityPercentage =
    (event.availableSeats / event.totalSeats) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec image */}
      <div className="relative h-96 overflow-hidden">
        {event.images && event.images.length > 0 ? (
          <>
            <img
              src={event.images[currentImageIndex]}
              alt={event.title}
              className="w-full h-full object-cover"
            />

            {/* Navigation d'images */}
            {event.images.length > 1 && (
              <>
                <button
                  onClick={() => navigateImage("prev")}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={() => navigateImage("next")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>

                {/* Indicateurs */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {event.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
            <Camera className="h-24 w-24 text-white/50" />
          </div>
        )}

        {/* Overlay avec gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

        {/* Bouton retour */}
        <button
          onClick={onBack}
          className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>

        {/* Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
              isFavorite
                ? "bg-red-500 text-white"
                : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            <Heart
              className="h-6 w-6"
              fill={isFavorite ? "currentColor" : "none"}
            />
          </button>

          <button
            onClick={() =>
              navigator.share?.({
                title: event.title,
                text: event.description,
                url: window.location.href,
              })
            }
            className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
          >
            <Share2 className="h-6 w-6" />
          </button>
        </div>

        {/* Informations principales */}
        <div className="absolute bottom-6 left-6 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">{dateInfo.day}</div>
              <div className="text-sm uppercase">{dateInfo.month}</div>
            </div>

            {event.isFeatured && (
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                ⭐ Événement vedette
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.title}</h1>
          <p className="text-lg opacity-90">{event.venue?.city}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Informations essentielles */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Informations essentielles
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    <div>
                      <div className="font-medium text-gray-900">
                        {dateInfo.full}
                      </div>
                      <div className="text-sm text-gray-600">
                        Date de l'événement
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="font-medium text-gray-900">
                        {dateInfo.time}
                      </div>
                      <div className="text-sm text-gray-600">
                        Heure de début
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-purple-500" />
                    <div>
                      <div className="font-medium text-gray-900">
                        {event.availableSeats} / {event.totalSeats}
                      </div>
                      <div className="text-sm text-gray-600">
                        Places disponibles
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-red-500 mt-1" />
                    <div>
                      <div className="font-medium text-gray-900">
                        {event.venue?.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {event.venue?.address}
                      </div>
                      <div className="text-sm text-gray-600">
                        {event.venue?.city}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Ticket className="h-5 w-5 text-indigo-500" />
                    <div>
                      <div className="font-medium text-gray-900 capitalize">
                        {event.category}
                      </div>
                      <div className="text-sm text-gray-600">Catégorie</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Disponibilité en temps réel */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Disponibilité en temps réel
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Places disponibles</span>
                  <span
                    className={`font-bold ${
                      availabilityPercentage > 50
                        ? "text-green-600"
                        : availabilityPercentage > 20
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {event.availableSeats} / {event.totalSeats}
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      availabilityPercentage > 50
                        ? "bg-green-500"
                        : availabilityPercentage > 20
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${availabilityPercentage}%` }}
                  />
                </div>

                {event.availableSeats < 10 && event.availableSeats > 0 && (
                  <div className="flex items-center gap-2 text-orange-600">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="font-medium">
                      Attention : il ne reste que {event.availableSeats} places
                      !
                    </span>
                  </div>
                )}

                {timeRemaining && (
                  <div className="flex items-center gap-2 text-blue-600">
                    <Timer className="h-5 w-5" />
                    <span>Début dans : {timeRemaining}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Avis et évaluations */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Avis et évaluations
                </h2>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="font-bold">4.8</span>
                  <span className="text-gray-500">({reviews.length} avis)</span>
                </div>
              </div>

              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.slice(0, 3).map((review) => (
                    <div
                      key={review.id}
                      className="border-b border-gray-200 pb-4 last:border-b-0"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-medium text-gray-900">
                          {review.user?.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString(
                            "fr-FR"
                          )}
                        </span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Aucun avis pour cet événement</p>
              )}
            </div>
          </div>

          {/* Sidebar de réservation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {event.basePrice === 0
                    ? "Gratuit"
                    : `À partir de ${event.basePrice}€`}
                </div>
                {event.maxPrice && event.maxPrice > (event.basePrice ?? 0) && (
                  <div className="text-gray-600">jusqu'à {event.maxPrice}€</div>
                )}
              </div>

              {event.availableSeats > 0 ? (
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-4"
                >
                  Réserver maintenant
                </button>
              ) : (
                <button className="w-full bg-gray-400 text-white py-3 rounded-lg font-semibold cursor-not-allowed mb-4">
                  Complet
                </button>
              )}

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <span>Paiement sécurisé</span>
                </div>
                <div className="flex items-center gap-2">
                  <Ticket className="h-4 w-4" />
                  <span>E-billet instantané</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>Support 24/7</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Organisateur
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>contact@organizer.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <span>www.organizer.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de réservation */}
      {showBookingModal && (
        <BookingModal
          event={event}
          ticketTypes={ticketTypes}
          numberOfTickets={numberOfTickets}
          setNumberOfTickets={setNumberOfTickets}
          selectedTicketType={selectedTicketType}
          setSelectedTicketType={setSelectedTicketType}
          isBooking={isBooking}
          onConfirm={handleBooking}
          onClose={() => setShowBookingModal(false)}
        />
      )}
    </div>
  );
};

// Composant Modal de réservation
const BookingModal: React.FC<{
  event: Event;
  ticketTypes: any[];
  numberOfTickets: number;
  setNumberOfTickets: (n: number) => void;
  selectedTicketType: string;
  setSelectedTicketType: (type: string) => void;
  isBooking: boolean;
  onConfirm: () => void;
  onClose: () => void;
}> = ({
  event,
  ticketTypes,
  numberOfTickets,
  setNumberOfTickets,
  selectedTicketType,
  setSelectedTicketType,
  isBooking,
  onConfirm,
  onClose,
}) => {
  const selectedType = ticketTypes.find((t) => t.id === selectedTicketType);
  const basePrice = event.basePrice + (selectedType?.price || 0);
  const totalPrice = basePrice * numberOfTickets;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              Réserver des billets
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          {/* Sélection du nombre de billets */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de billets
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  setNumberOfTickets(Math.max(1, numberOfTickets - 1))
                }
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                -
              </button>
              <span className="px-4 py-2 border border-gray-300 rounded-lg font-medium">
                {numberOfTickets}
              </span>
              <button
                onClick={() =>
                  setNumberOfTickets(
                    Math.min(event.availableSeats, numberOfTickets + 1)
                  )
                }
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Sélection du type de billet */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de billet
            </label>
            <div className="space-y-2">
              {ticketTypes.map((type) => (
                <label
                  key={type.id}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="ticketType"
                    value={type.id}
                    checked={selectedTicketType === type.id}
                    onChange={(e) => setSelectedTicketType(e.target.value)}
                    className="text-blue-600"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{type.name}</div>
                    <div className="text-sm text-gray-600">
                      {type.description}
                    </div>
                  </div>
                  <div className="font-medium text-gray-900">
                    {type.price === 0 ? "" : `+${type.price}€`}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Récapitulatif */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Récapitulatif</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Prix unitaire</span>
                <span>{basePrice}€</span>
              </div>
              <div className="flex justify-between">
                <span>Quantité</span>
                <span>{numberOfTickets}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2">
                <span>Total</span>
                <span>{totalPrice}€</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={onConfirm}
              disabled={isBooking}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isBooking ? "Réservation..." : "Confirmer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
