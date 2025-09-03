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
  ArrowRight,
} from "lucide-react";
import { Event } from "@/types";

interface EventListItemProps {
  event: Event;
  onSelect?: (event: Event) => void;
}

export const EventListItem: React.FC<EventListItemProps> = ({
  event,
  onSelect,
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

  const dateInfo = formatDate(event.startDateTime ?? "");
  const isUpcoming = new Date(event.startDateTime ?? "") > new Date();
  const isToday =
    new Date(event.startDateTime ?? "").toDateString() ===
    new Date().toDateString();
  const isTomorrow =
    new Date(event.startDateTime ?? "").toDateString() ===
    new Date(Date.now() + 24 * 60 * 60 * 1000).toDateString();

  const availabilityPercentage =
    (event.availableSeats / event.totalSeats) * 100;

  const getAvailabilityColor = () => {
    if (availabilityPercentage > 50) return "text-green-600";
    if (availabilityPercentage > 20) return "text-yellow-600";
    return "text-red-600";
  };

  const getAvailabilityStatus = () => {
    if (event.availableSeats === 0)
      return { text: "Complet", color: "text-red-600" };
    if (event.availableSeats < 10)
      return { text: "Dernières places", color: "text-orange-600" };
    if (availabilityPercentage > 50)
      return { text: "Disponible", color: "text-green-600" };
    return { text: "Places limitées", color: "text-yellow-600" };
  };

  const availabilityStatus = getAvailabilityStatus();

  return (
    <div
      onClick={() => onSelect?.(event)}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group border border-gray-200 hover:border-blue-300"
    >
      <div className="flex">
        {/* Event Image */}
        <div className="relative w-32 md:w-48 flex-shrink-0">
          <img
            src={event.images?.[0] || "/api/placeholder/300/200"}
            alt={event.title}
            className="w-full h-32 md:h-40 object-cover rounded-l-lg group-hover:scale-105 transition-transform duration-300"
          />

          {/* Date Badge */}
          <div className="absolute top-3 left-3">
            <div className="bg-white rounded-lg shadow-md p-2 text-center min-w-[50px]">
              <div className="text-sm md:text-lg font-bold text-gray-900">
                {dateInfo.day}
              </div>
              <div className="text-xs text-gray-600 uppercase">
                {dateInfo.month}
              </div>
            </div>
          </div>

          {/* Special Badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-1">
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
                ⭐
              </span>
            )}
          </div>

          {/* Availability Warning */}
          {event.availableSeats < 10 && event.availableSeats > 0 && (
            <div className="absolute bottom-3 left-3">
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium animate-pulse">
                {event.availableSeats} restantes
              </span>
            </div>
          )}

          {/* Sold Out Overlay */}
          {event.availableSeats === 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-l-lg">
              <div className="bg-red-600 text-white px-3 py-1 rounded-lg font-semibold text-sm">
                COMPLET
              </div>
            </div>
          )}
        </div>

        {/* Event Details */}
        <div className="flex-1 p-4 md:p-6">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-lg md:text-xl text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors mb-1">
                  {event.title}
                </h3>

                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium capitalize">
                    {event.category}
                  </span>

                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-medium">4.8</span>
                    <span className="text-gray-500">(124)</span>
                  </div>

                  {availabilityPercentage < 30 && event.availableSeats > 0 && (
                    <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Populaire
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 ml-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFavorite(!isFavorite);
                  }}
                  className={`p-2 rounded-full transition-all hover:scale-110 ${
                    isFavorite
                      ? "bg-red-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
                  className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-110 transition-all"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
              {event.description}
            </p>

            {/* Event Meta Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <span>
                  {isToday
                    ? "Aujourd'hui"
                    : isTomorrow
                    ? "Demain"
                    : `${dateInfo.weekday} ${dateInfo.day} ${dateInfo.month}`}
                  {" • "}
                  {dateInfo.time}
                </span>
                {isUpcoming && (
                  <span className="text-green-600 font-medium">• À venir</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-red-500 flex-shrink-0" />
                <span className="line-clamp-1">
                  <span className="line-clamp-1 text-sm text-gray-600">
                    {event.venue?.city}, {event.venue?.address}
                  </span>
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

              <div className="flex items-center gap-2">
                <Ticket className="h-4 w-4 text-purple-500 flex-shrink-0" />
                <span className={`font-medium ${availabilityStatus.color}`}>
                  {availabilityStatus.text}
                </span>
              </div>
            </div>

            {/* Availability Progress Bar */}
            <div className="mb-4">
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

            {/* Bottom Section */}
            <div className="flex items-center justify-between">
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {event.basePrice === 0 ? "Gratuit" : `${event.basePrice}€`}
                </div>
                {event.maxPrice && event.maxPrice > (event.basePrice ?? 0) && (
                  <div className="text-sm text-gray-500">
                    jusqu'à {event.maxPrice}€
                  </div>
                )}
              </div>

              <button
                className={`flex items-center gap-2 px-6 py-2 font-medium rounded-lg transition-all duration-300 ${
                  event.availableSeats === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md group-hover:scale-105"
                }`}
                disabled={event.availableSeats === 0}
              >
                {event.availableSeats === 0 ? "Complet" : "Voir les détails"}
                {event.availableSeats > 0 && (
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventListItem;
