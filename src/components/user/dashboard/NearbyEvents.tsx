"use client";

import React, { useState, useEffect } from "react";
import {
  MapPin,
  Navigation,
  Calendar,
  Users,
  Star,
  Clock,
  Loader2,
} from "lucide-react";
import { Event } from "@/types";
import { eventsApi } from "@/lib/api";

interface NearbyEventsProps {
  userLocation: { lat: number; lng: number };
  onEventSelect?: (event: Event) => void;
}

export const NearbyEvents: React.FC<NearbyEventsProps> = ({
  userLocation,
  onEventSelect,
}) => {
  const [nearbyEvents, setNearbyEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRadius, setSelectedRadius] = useState(25);

  const radiusOptions = [
    { value: 10, label: "10 km" },
    { value: 25, label: "25 km" },
    { value: 50, label: "50 km" },
    { value: 100, label: "100 km" },
  ];

  useEffect(() => {
    loadNearbyEvents();
  }, [userLocation, selectedRadius]);

  const loadNearbyEvents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const events = await eventsApi.getNearby(
        userLocation.lat,
        userLocation.lng,
        selectedRadius
      );
      setNearbyEvents(events);
    } catch (error) {
      console.error("Error loading nearby events:", error);
      setError("Impossible de charger les événements à proximité");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDistance = (eventLat: number, eventLng: number): string => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = ((eventLat - userLocation.lat) * Math.PI) / 180;
    const dLng = ((eventLng - userLocation.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((userLocation.lat * Math.PI) / 180) *
        Math.cos((eventLat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance < 1
      ? `${Math.round(distance * 1000)} m`
      : `${distance.toFixed(1)} km`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Recherche d'événements à proximité...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">⚠️ {error}</div>
        <button
          onClick={loadNearbyEvents}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Radius Selector */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2 text-gray-700">
          <Navigation className="h-5 w-5" />
          <span className="font-medium">Rayon de recherche :</span>
        </div>
        <div className="flex gap-2">
          {radiusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedRadius(option.value)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedRadius === option.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {nearbyEvents.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun événement trouvé
          </h3>
          <p className="text-gray-600 mb-4">
            Aucun événement dans un rayon de {selectedRadius} km
          </p>
          <button
            onClick={() => setSelectedRadius(Math.min(selectedRadius * 2, 100))}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Élargir la recherche
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {nearbyEvents.map((event) => (
            <NearbyEventCard
              key={event.id}
              event={event}
              distance="Distance non disponible"
              onSelect={onEventSelect}
            />
          ))}

          {nearbyEvents.length > 0 && (
            <div className="text-center pt-4">
              <p className="text-sm text-gray-500">
                {nearbyEvents.length} événement(s) trouvé(s) dans un rayon de{" "}
                {selectedRadius} km
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface NearbyEventCardProps {
  event: Event;
  distance: string;
  onSelect?: (event: Event) => void;
}

const NearbyEventCard: React.FC<NearbyEventCardProps> = ({
  event,
  distance,
  onSelect,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate().toString().padStart(2, "0"),
      month: date.toLocaleDateString("fr-FR", { month: "short" }),
      time: date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      weekday: date.toLocaleDateString("fr-FR", { weekday: "short" }),
    };
  };

  const dateInfo = formatDate(event.startDateTime ?? "");
  const isToday =
    new Date(event.startDateTime ?? "").toDateString() ===
    new Date().toDateString();
  const isTomorrow =
    new Date(event.startDateTime ?? "").toDateString() ===
    new Date(Date.now() + 24 * 60 * 60 * 1000).toDateString();

  return (
    <div
      onClick={() => onSelect?.(event)}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group border border-gray-200 hover:border-blue-300"
    >
      <div className="flex">
        {/* Event Image */}
        <div className="relative w-24 md:w-32 flex-shrink-0">
          <img
            src={event.images?.[0] || "/api/placeholder/200/200"}
            alt={event.title}
            className="w-full h-24 md:h-32 object-cover rounded-l-lg group-hover:scale-105 transition-transform duration-300"
          />

          {/* Distance Badge */}
          <div className="absolute top-2 left-2">
            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {distance}
            </span>
          </div>
        </div>

        {/* Event Details */}
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                {event.title}
              </h3>

              <p className="text-gray-600 text-sm line-clamp-2 mt-1">
                {event.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span>
                    {isToday
                      ? "Aujourd'hui"
                      : isTomorrow
                      ? "Demain"
                      : `${dateInfo.weekday} ${dateInfo.day} ${dateInfo.month}`}
                  </span>
                  <span className="text-gray-400">•</span>
                  <Clock className="h-4 w-4 text-green-500" />
                  <span>{dateInfo.time}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-purple-500" />
                  <span>{event.availableSeats} places</span>
                </div>

                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span>4.8</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-gray-600 line-clamp-1">
                    <span className="line-clamp-1 text-sm text-gray-600">
                      {event.venue?.address}, {event.venue?.city}
                    </span>
                  </span>
                </div>

                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">
                    {event.basePrice === 0 ? "Gratuit" : `${event.basePrice}€`}
                  </div>
                  {event.maxPrice !== undefined &&
                    event.basePrice !== undefined &&
                    event.maxPrice > event.basePrice && (
                      <div className="text-sm text-gray-500">
                        jusqu'à {event.maxPrice}€
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Button */}
        <div className="flex items-center p-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
            Voir détails
          </button>
        </div>
      </div>
    </div>
  );
};

export default NearbyEvents;
