"use client";

import React, { useState } from "react";
import {
  Calendar,
  MapPin,
  Users,
  Star,
  TrendingUp,
  Heart,
  Share2,
} from "lucide-react";
import { Event } from "@/types";

interface TrendingEventCardProps {
  event: Event;
  onSelect?: (event: Event) => void;
}

export const TrendingEventCard: React.FC<TrendingEventCardProps> = ({
  event,
  onSelect,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
      <div className="relative" onClick={() => onSelect?.(event)}>
        <img
          src={
            event.imageUrl || event.images?.[0] || "/api/placeholder/400/200"
          }
          alt={event.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            className={`p-2 rounded-full ${
              isFavorite ? "bg-red-500 text-white" : "bg-white text-gray-600"
            } hover:scale-110 transition-all`}
          >
            <Heart
              className="h-4 w-4"
              fill={isFavorite ? "currentColor" : "none"}
            />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Handle share
            }}
            className="p-2 rounded-full bg-white text-gray-600 hover:scale-110 transition-all"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>

        <div className="absolute bottom-3 left-3">
          <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            Tendance
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          {event.title}
        </h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>
              {new Date(
                event.date || event.startDateTime || ""
              ).toLocaleDateString("fr-FR")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{event.venue?.city}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{event.availableSeats} places disponibles</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium">4.8</span>
            <span className="text-sm text-gray-500">(124)</span>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-blue-600">
              {(event.ticketPrice || event.basePrice || 0) === 0
                ? "Gratuit"
                : `${event.ticketPrice || event.basePrice}€`}
            </div>
            {event.maxPrice && event.maxPrice > (event.basePrice || 0) && (
              <div className="text-sm text-gray-500">
                jusqu&apos;à {event.maxPrice}€
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
