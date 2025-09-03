"use client";

import React, { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Star,
} from "lucide-react";
import { Event } from "@/types";

interface EventCalendarViewProps {
  events: Event[];
  onEventSelect?: (event: Event) => void;
}

export const EventCalendarView: React.FC<EventCalendarViewProps> = ({
  events,
  onEventSelect,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthNames = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

  // Group events by date
  const eventsByDate = useMemo(() => {
    const grouped: { [key: string]: Event[] } = {};

    events.forEach((event) => {
      if (!event.startDateTime) return;
      const date = new Date(event.startDateTime);
      const dateKey = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(event);
    });

    return grouped;
  }, [events]);

  // Get calendar days for current month
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startCalendar = new Date(firstDay);
    startCalendar.setDate(startCalendar.getDate() - firstDay.getDay());

    const days: Date[] = [];
    const current = new Date(startCalendar);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  }, [currentDate]);

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getDateKey = (date: Date) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  };

  const getEventsForDate = (date: Date) => {
    return eventsByDate[getDateKey(date)] || [];
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const isSelectedDate = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Calendar Header */}
      <div className="bg-blue-600 text-white p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigateMonth("prev")}
            className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <h2 className="text-xl font-semibold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>

          <button
            onClick={() => navigateMonth("next")}
            className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Calendar Grid */}
        <div className="flex-1 p-4">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-gray-500 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date, index) => {
              const eventsForDay = getEventsForDate(date);
              const hasEvents = eventsForDay.length > 0;

              return (
                <button
                  key={index}
                  onClick={() => setSelectedDate(date)}
                  className={`
                    relative p-2 min-h-[80px] border rounded-lg transition-all duration-200
                    ${
                      isCurrentMonth(date)
                        ? "border-gray-200 hover:border-blue-300"
                        : "border-gray-100 text-gray-400"
                    }
                    ${
                      isToday(date)
                        ? "bg-blue-50 border-blue-300 text-blue-700 font-semibold"
                        : ""
                    }
                    ${
                      isSelectedDate(date)
                        ? "bg-blue-100 border-blue-500"
                        : "hover:bg-gray-50"
                    }
                    ${hasEvents ? "cursor-pointer" : ""}
                  `}
                >
                  {/* Date Number */}
                  <div className="text-sm font-medium mb-1">
                    {date.getDate()}
                  </div>

                  {/* Event Indicators */}
                  {hasEvents && (
                    <div className="space-y-1">
                      {eventsForDay.slice(0, 2).map((event, eventIndex) => (
                        <div
                          key={eventIndex}
                          className="text-xs bg-blue-500 text-white px-1 py-0.5 rounded truncate"
                          title={event.title}
                        >
                          {event.title}
                        </div>
                      ))}

                      {eventsForDay.length > 2 && (
                        <div className="text-xs text-blue-600 font-medium">
                          +{eventsForDay.length - 2} autres
                        </div>
                      )}
                    </div>
                  )}

                  {/* Event Count Dot */}
                  {hasEvents && (
                    <div className="absolute top-1 right-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Events Panel */}
        {selectedDate && (
          <div className="w-80 border-l border-gray-200 bg-gray-50">
            <div className="p-4 border-b border-gray-200 bg-white">
              <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-blue-500" />
                {selectedDate.toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </h3>
              <p className="text-sm text-gray-600">
                {selectedDateEvents.length} événement(s)
              </p>
            </div>

            <div className="p-4 max-h-96 overflow-y-auto">
              {selectedDateEvents.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Aucun événement ce jour</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDateEvents.map((event) => (
                    <EventDayCard
                      key={event.id}
                      event={event}
                      onSelect={onEventSelect}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quick Navigation */}
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentDate(new Date())}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Aujourd'hui
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => {
                const today = new Date();
                setCurrentDate(today);
                setSelectedDate(today);
              }}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Événements du jour
            </button>

            <button
              onClick={() => {
                const weekend = new Date();
                weekend.setDate(weekend.getDate() + (6 - weekend.getDay()));
                setCurrentDate(weekend);
                setSelectedDate(weekend);
              }}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Ce weekend
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component for event cards in the day panel
const EventDayCard: React.FC<{
  event: Event;
  onSelect?: (event: Event) => void;
}> = ({ event, onSelect }) => {
  const formatTime = (dateString?: string) => {
    if (!dateString) return "--:--";
    return new Date(dateString).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      onClick={() => onSelect?.(event)}
      className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-200 hover:border-blue-300"
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-gray-900 line-clamp-2 flex-1">
          {event.title}
        </h4>
        <div className="text-right ml-2">
          <div className="text-sm font-bold text-blue-600">
            {event.basePrice === 0 ? "Gratuit" : `${event.basePrice}€`}
          </div>
        </div>
      </div>

      <div className="space-y-1 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{formatTime(event.startDateTime)}</span>
        </div>

        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          <span className="line-clamp-1">{event.venue?.city}</span>
        </div>

        <div className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          <span>{event.availableSeats} places</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-2">
        <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium capitalize">
          {event.category}
        </span>

        <div className="flex items-center gap-1">
          <Star className="h-3 w-3 text-yellow-400 fill-current" />
          <span className="text-xs font-medium">4.8</span>
        </div>
      </div>
    </div>
  );
};

export default EventCalendarView;
