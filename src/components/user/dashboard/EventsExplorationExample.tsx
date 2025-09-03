"use client";

import React, { useState } from "react";
import EventsExploration from "./EventsExploration";
import EventDetails from "./EventDetails";
import { Event } from "@/types";

/**
 * Composant d'exemple pour démontrer l'utilisation du composant EventsExploration
 * intégré avec les APIs réelles.
 */
const EventsExplorationExample: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventDetails, setShowEventDetails] = useState(false);

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  const handleBackToExploration = () => {
    setShowEventDetails(false);
    setSelectedEvent(null);
  };

  if (showEventDetails && selectedEvent) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={handleBackToExploration}
            className="mb-6 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            ← Retour à l'exploration
          </button>
          <EventDetails
            eventId={selectedEvent.id}
            onBack={handleBackToExploration}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Découvrir les événements
          </h1>
          <p className="mt-2 text-gray-600">
            Explorez tous les événements disponibles et trouvez celui qui vous
            convient.
          </p>
        </div>

        <EventsExploration onEventSelect={handleEventSelect} />
      </div>
    </div>
  );
};

export default EventsExplorationExample;
