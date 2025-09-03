"use client";

import React from "react";
import {
  Calendar,
  MapPin,
  Users,
  Star,
  Heart,
  Share2,
  Clock,
} from "lucide-react";
import { Event } from "@/types";

interface FeaturedEventsProps {
  events: Event[];
  isLoading: boolean;
  onEventSelect?: (event: Event) => void;
}

export const FeaturedEvents: React.FC<FeaturedEventsProps> = ({
  events,
  isLoading,
  onEventSelect,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="w-full h-48 bg-gray-200 animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">
          Aucun événement en vedette pour le moment
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <FeaturedEventCard
          key={event.id}
          event={event}
          onSelect={onEventSelect}
        />
      ))}
    </div>
  );
};

const FeaturedEventCard: React.FC<{
  event: Event;
  onSelect?: (event: Event) => void;
}> = ({ event, onSelect }) => {
  const [isFavorite, setIsFavorite] = React.useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate().toString().padStart(2, "0"),
      month: date.toLocaleDateString("fr-FR", { month: "short" }),
      time: date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const dateInfo = formatDate(event.startDateTime ?? "");
  const isUpcoming = new Date(event.startDateTime ?? "") > new Date();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group">
      <div className="relative" onClick={() => onSelect?.(event)}>
        <img
          src={event.images?.[0] || "/api/placeholder/400/250"}
          alt={event.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badge Featured */}
        <div className="absolute top-3 left-3">
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
            ⭐ Vedette
          </span>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            className={`p-2 rounded-full backdrop-blur-sm transition-all hover:scale-110 ${
              isFavorite
                ? "bg-red-500 text-white"
                : "bg-white/90 text-gray-700 hover:bg-white"
            }`}
          >
            <Heart
              className="h-4 w-4"
              fill={isFavorite ? "currentColor" : "none"}
            />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigator.share?.({
                title: event.title,
                text: event.description,
                url: window.location.href,
              });
            }}
            className="p-2 rounded-full bg-white/90 text-gray-700 hover:bg-white hover:scale-110 transition-all backdrop-blur-sm"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>

        {/* Date Badge */}
        <div className="absolute bottom-3 left-3">
          <div className="bg-white rounded-lg shadow-lg p-2 text-center min-w-[60px]">
            <div className="text-lg font-bold text-gray-900">
              {dateInfo.day}
            </div>
            <div className="text-xs text-gray-600 uppercase">
              {dateInfo.month}
            </div>
          </div>
        </div>

        {/* Availability Badge */}
        {event.availableSeats < 10 && event.availableSeats > 0 && (
          <div className="absolute bottom-3 right-3">
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Dernières places !
            </span>
          </div>
        )}

        {event.availableSeats === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold">
              COMPLET
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 flex-1">
            {event.title}
          </h3>
          <div className="ml-2 text-right">
            <div className="text-lg font-bold text-blue-600">
              {event.basePrice === 0 ? "Gratuit" : `${event.basePrice}€`}
            </div>
            {event.maxPrice && event.maxPrice > (event.basePrice ?? 0) && (
              <div className="text-sm text-gray-500">
                jusqu'à {event.maxPrice}€
              </div>
            )}
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-500" />
            <span>{dateInfo.time}</span>
            {isUpcoming && (
              <span className="text-green-600 font-medium ml-1">• À venir</span>
            )}
          </div>
          {/*           
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-red-500" />
            <span className="line-clamp-1">
              {event.venue?.city}, {event.venue?.address}
            </span>
          </div> */}

          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-green-500" />
            <span>
              {event.availableSeats} / {event.totalSeats} places disponibles
            </span>
          </div>
        </div>

        {/* Category and Rating */}
        <div className="flex items-center justify-between">
          <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium capitalize">
            {event.category}
          </span>

          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium">4.8</span>
            <span className="text-sm text-gray-500">(124)</span>
          </div>
        </div>

        {/* Progress Bar for Availability */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Disponibilité</span>
            <span>
              {Math.round((event.availableSeats / event.totalSeats) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                event.availableSeats / event.totalSeats > 0.5
                  ? "bg-green-500"
                  : event.availableSeats / event.totalSeats > 0.2
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
              style={{
                width: `${(event.availableSeats / event.totalSeats) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedEvents;
