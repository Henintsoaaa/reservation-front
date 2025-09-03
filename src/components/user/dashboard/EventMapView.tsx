"use client";

import React, { useState, useEffect } from "react";
import {
  MapPin,
  Calendar,
  Users,
  Star,
  Navigation,
  Layers,
  Search,
  Filter,
} from "lucide-react";
import { Event } from "@/types";

interface EventMapViewProps {
  events: Event[];
  onEventSelect?: (event: Event) => void;
}

export const EventMapView: React.FC<EventMapViewProps> = ({
  events,
  onEventSelect,
}) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 48.8566, lng: 2.3522 }); // Paris par défaut
  const [zoom, setZoom] = useState(10);
  const [showSatellite, setShowSatellite] = useState(false);

  useEffect(() => {
    // Demander la géolocalisation de l'utilisateur
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          setMapCenter(location);
        },
        (error) => {
          console.log("Géolocalisation refusée:", error);
        }
      );
    }
  }, []);

  // Simuler une carte interactive (en production, vous utiliseriez Google Maps, Mapbox, etc.)
  const MapPlaceholder: React.FC = () => (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-100 to-green-100 rounded-lg overflow-hidden">
      {/* Map Background */}
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full" viewBox="0 0 400 300">
          {/* Simulated roads */}
          <path d="M0,150 L400,150" stroke="#94a3b8" strokeWidth="3" />
          <path d="M200,0 L200,300" stroke="#94a3b8" strokeWidth="3" />
          <path d="M0,100 L400,100" stroke="#cbd5e1" strokeWidth="2" />
          <path d="M0,200 L400,200" stroke="#cbd5e1" strokeWidth="2" />
          <path d="M100,0 L100,300" stroke="#cbd5e1" strokeWidth="2" />
          <path d="M300,0 L300,300" stroke="#cbd5e1" strokeWidth="2" />
        </svg>
      </div>

      {/* User Location */}
      {userLocation && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg">
            <div className="w-8 h-8 bg-blue-600 rounded-full opacity-20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-ping"></div>
          </div>
        </div>
      )}

      {/* Event Markers */}
      {events.map((event, index) => {
        const position = {
          x: 20 + (index % 8) * 45 + Math.random() * 10,
          y: 20 + Math.floor(index / 8) * 60 + Math.random() * 10,
        };

        return (
          <div
            key={event.id}
            className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group"
            style={{ left: `${position.x}%`, top: `${position.y}%` }}
            onClick={() => setSelectedEvent(event)}
          >
            {/* Marker */}
            <div
              className={`relative ${
                selectedEvent?.id === event.id ? "z-50" : "z-10"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full border-2 border-white shadow-lg transition-all duration-300 ${
                  selectedEvent?.id === event.id
                    ? "bg-red-500 scale-125"
                    : "bg-blue-500 hover:scale-110"
                }`}
              >
                <MapPin className="h-4 w-4 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>

              {/* Event preview on hover */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="bg-white rounded-lg shadow-xl p-3 min-w-[200px] border border-gray-200">
                  <h4 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-1">
                    {event.title}
                  </h4>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(event.startDateTime ?? "").toLocaleDateString(
                          "fr-FR"
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{event.availableSeats} places</span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs font-semibold text-blue-600">
                    {event.basePrice === 0 ? "Gratuit" : `${event.basePrice}€`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const calculateDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): string => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance < 1
      ? `${Math.round(distance * 1000)} m`
      : `${distance.toFixed(1)} km`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden h-[600px] flex">
      {/* Map Container */}
      <div className="flex-1 relative">
        {/* Map Controls */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          <div className="bg-white rounded-lg shadow-md p-2 flex gap-2">
            <button
              onClick={() => setZoom(Math.min(zoom + 1, 18))}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Zoom avant"
            >
              +
            </button>
            <button
              onClick={() => setZoom(Math.max(zoom - 1, 3))}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Zoom arrière"
            >
              -
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-2 flex gap-2">
            <button
              onClick={() => userLocation && setMapCenter(userLocation)}
              className="p-2 hover:bg-gray-100 rounded transition-colors text-blue-600"
              title="Ma position"
              disabled={!userLocation}
            >
              <Navigation className="h-4 w-4" />
            </button>

            <button
              onClick={() => setShowSatellite(!showSatellite)}
              className={`p-2 hover:bg-gray-100 rounded transition-colors ${
                showSatellite ? "text-blue-600" : "text-gray-600"
              }`}
              title="Vue satellite"
            >
              <Layers className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Search on Map */}
        <div className="absolute top-4 right-4 z-20">
          <div className="bg-white rounded-lg shadow-md p-2 flex items-center gap-2 w-64">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher sur la carte..."
              className="flex-1 text-sm outline-none"
            />
            <button className="p-1 hover:bg-gray-100 rounded">
              <Filter className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Map */}
        <MapPlaceholder />

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 z-20 bg-white rounded-lg shadow-md p-3">
          <h4 className="font-semibold text-sm text-gray-900 mb-2">Légende</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <span>Événements disponibles</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Événement sélectionné</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full border-2 border-white"></div>
              <span>Votre position</span>
            </div>
          </div>
        </div>
      </div>

      {/* Event Details Sidebar */}
      <div className="w-80 border-l border-gray-200 bg-gray-50 flex flex-col">
        {selectedEvent ? (
          <>
            {/* Selected Event Details */}
            <div className="p-4 bg-white border-b border-gray-200">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                {selectedEvent.title}
              </h3>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span>
                    {new Date(
                      selectedEvent.startDateTime ?? ""
                    ).toLocaleDateString("fr-FR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-red-500" />
                  <span>{selectedEvent.venue?.address}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-green-500" />
                  <span>{selectedEvent.availableSeats} places disponibles</span>
                </div>

                {/* Distance calculation not available without coordinates */}
                <div className="flex items-center gap-2">
                  <Navigation className="h-4 w-4 text-purple-500" />
                  <span>Coordonnées non disponibles</span>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {selectedEvent.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">4.8</span>
                  <span className="text-sm text-gray-500">(124)</span>
                </div>

                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">
                    {selectedEvent.basePrice === 0
                      ? "Gratuit"
                      : `${selectedEvent.basePrice}€`}
                  </div>
                </div>
              </div>

              <button
                onClick={() => onEventSelect?.(selectedEvent)}
                className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Voir les détails
              </button>
            </div>
          </>
        ) : (
          <div className="p-4 text-center text-gray-500">
            <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Sélectionnez un événement sur la carte pour voir les détails</p>
          </div>
        )}

        {/* Events List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h4 className="font-semibold text-gray-900 mb-3">
              Tous les événements ({events.length})
            </h4>

            <div className="space-y-2">
              {events.map((event) => (
                <button
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    selectedEvent?.id === event.id
                      ? "bg-blue-50 border border-blue-200"
                      : "bg-white hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  <h5 className="font-medium text-sm text-gray-900 mb-1 line-clamp-1">
                    {event.title}
                  </h5>

                  <div className="text-xs text-gray-600 space-y-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(event.startDateTime ?? "").toLocaleDateString(
                          "fr-FR"
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span className="line-clamp-1">{event.venue?.city}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full capitalize">
                      {event.category}
                    </span>

                    <span className="text-xs font-semibold text-blue-600">
                      {event.basePrice === 0
                        ? "Gratuit"
                        : `${event.basePrice}€`}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventMapView;
