"use client";

import React, { useState } from "react";
import {
  Calendar,
  MapPin,
  Users,
  Star,
  Heart,
  Share2,
  Clock,
  Ticket,
  TrendingUp,
} from "lucide-react";
import { Event } from "@/types";

interface EventCardProps {
  event: Event;
  onSelect?: (event: Event) => void;
  size?: "small" | "medium" | "large";
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onSelect,
  size = "medium",
}) => {
  const [isFavorite, setIsFavorite] = useState(false);

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
      full: date.toLocaleDateString("fr-FR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };
  };

  const dateInfo = event.startDateTime
    ? formatDate(event.startDateTime)
    : {
        day: "--",
        month: "--",
        time: "--:--",
        weekday: "--",
        full: "--",
      };
  const isUpcoming = event.startDateTime
    ? new Date(event.startDateTime) > new Date()
    : false;
  const isToday = event.startDateTime
    ? new Date(event.startDateTime).toDateString() === new Date().toDateString()
    : false;
  const isTomorrow = event.startDateTime
    ? new Date(event.startDateTime).toDateString() ===
      new Date(Date.now() + 24 * 60 * 60 * 1000).toDateString()
    : false;

  const availabilityPercentage =
    (event.availableSeats / event.totalSeats) * 100;

  const getAvailabilityColor = () => {
    if (availabilityPercentage > 50) return "text-green-600";
    if (availabilityPercentage > 20) return "text-yellow-600";
    return "text-red-600";
  };

  const getCardHeight = () => {
    switch (size) {
      case "small":
        return "h-64";
      case "large":
        return "h-96";
      default:
        return "h-80";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden">
      <div className="relative" onClick={() => onSelect?.(event)}>
        <img
          src={event.images?.[0] || "/api/placeholder/400/200"}
          alt={event.title}
          className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${
            size === "small" ? "h-32" : size === "large" ? "h-48" : "h-40"
          }`}
        />

        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {/* Date Badge */}
          <div className="bg-white rounded-lg shadow-md p-2 text-center min-w-[50px]">
            <div className="text-lg font-bold text-gray-900">
              {dateInfo.day}
            </div>
            <div className="text-xs text-gray-600 uppercase">
              {dateInfo.month}
            </div>
          </div>

          {/* Special Badges */}
          {isToday && (
            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Aujourd'hui
            </span>
          )}

          {isTomorrow && (
            <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Demain
            </span>
          )}

          {event.isFeatured && (
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              ⭐ Vedette
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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

        {/* Availability Warning */}
        {event.availableSeats < 10 && event.availableSeats > 0 && (
          <div className="absolute bottom-3 right-3">
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium animate-pulse">
              {event.availableSeats} places restantes !
            </span>
          </div>
        )}

        {/* Sold Out Overlay */}
        {event.availableSeats === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transform rotate-12">
              COMPLET
            </div>
          </div>
        )}

        {/* Trending Indicator */}
        {availabilityPercentage < 30 && event.availableSeats > 0 && (
          <div className="absolute bottom-3 left-3">
            <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Populaire
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        {/* Title and Price */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 flex-1 group-hover:text-blue-600 transition-colors">
            {event.title}
          </h3>
          <div className="ml-2 text-right">
            <div className="text-lg font-bold text-blue-600">
              {event.basePrice === 0 ? "Gratuit" : `${event.basePrice}€`}
            </div>
            {event.maxPrice &&
              event.basePrice &&
              event.maxPrice > event.basePrice && (
                <div className="text-sm text-gray-500">
                  jusqu'à {event.maxPrice}€
                </div>
              )}
          </div>
        </div>

        {/* Description */}
        {size !== "small" && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {event.description}
          </p>
        )}

        {/* Event Details */}
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-500 flex-shrink-0" />
            <span>{dateInfo.time}</span>
            {isUpcoming && (
              <span className="text-green-600 font-medium ml-1">• À venir</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-red-500 flex-shrink-0" />
            <span className="line-clamp-1">
              {event.venue?.city}, {event.venue?.address}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Users
              className={`h-4 w-4 ${getAvailabilityColor()} flex-shrink-0`}
            />
            <span>
              {event.availableSeats} / {event.totalSeats} places disponibles
            </span>
          </div>

          {size !== "small" && (
            <div className="flex items-center gap-2">
              <Ticket className="h-4 w-4 text-purple-500 flex-shrink-0" />
              <span className="capitalize">{event.category}</span>
            </div>
          )}
        </div>

        {/* Category and Rating */}
        <div className="flex items-center justify-between mb-3">
          <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium capitalize">
            {event.category}
          </span>

          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium">4.8</span>
            <span className="text-sm text-gray-500">(124)</span>
          </div>
        </div>

        {/* Availability Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Disponibilité</span>
            <span>{Math.round(availabilityPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                availabilityPercentage > 50
                  ? "bg-green-500"
                  : availabilityPercentage > 20
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${availabilityPercentage}%` }}
            />
          </div>
        </div>

        {/* Call to Action */}
        <button
          onClick={() => onSelect?.(event)}
          className={`w-full font-medium rounded-lg transition-all duration-300 ${
            event.availableSeats === 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed py-2"
              : "bg-blue-600 text-white hover:bg-blue-700 py-2 hover:shadow-md"
          }`}
          disabled={event.availableSeats === 0}
        >
          {event.availableSeats === 0 ? "Complet" : "Voir les détails"}
        </button>
      </div>
    </div>
  );
};

export default EventCard;
