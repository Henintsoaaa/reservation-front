"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Grid,
  List,
  Calendar as CalendarIcon,
  Map,
  SlidersHorizontal,
  Star,
  MapPin,
  Users,
  Clock,
  ArrowUpDown,
  ChevronDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import {
  Event,
  EventCategory,
  EventFilter,
  PaginationParams,
  PaginatedResponse,
} from "@/types";
import { eventsApi } from "@/lib/api";

interface EventsExplorationProps {
  onEventSelect: (event: Event) => void;
}

const EventsExploration: React.FC<EventsExplorationProps> = ({
  onEventSelect,
}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<
    "grid" | "list" | "calendar" | "map"
  >("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);
  const eventsPerPage = 12;

  const [filter, setFilter] = useState<EventFilter>({
    sortBy: "date",
    sortOrder: "asc",
  });

  const [searchQuery, setSearchQuery] = useState("");

  // Recharger les événements quand les filtres changent
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery !== "" || Object.keys(filter).length > 2) {
        loadEvents();
      }
    }, 500); // Debounce de 500ms pour éviter trop d'appels API

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, filter]);

  // Charger les événements au premier rendu
  useEffect(() => {
    loadEvents();
  }, [currentPage]); // Recharger quand la page change

  // Appliquer les filtres locaux quand les événements changent
  useEffect(() => {
    if (events.length > 0) {
      applyFilters();
    }
  }, [events]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      // Construire les paramètres de recherche
      const searchParams: any = {
        page: currentPage,
        limit: eventsPerPage,
        ...filter,
      };

      if (searchQuery) {
        searchParams.search = searchQuery;
      }

      // Convertir dateRange en format string si nécessaire
      if (filter.dateRange) {
        searchParams.startDate = filter.dateRange.start;
        searchParams.endDate = filter.dateRange.end;
      }

      const response = await eventsApi.getAll(searchParams);

      // Adapter les données de l'API pour le frontend
      const adaptedEvents = response.data.map((event: Event) => ({
        ...event,
        // Adapter les propriétés manquantes
        images: event.imageUrl ? [event.imageUrl] : [],
        price: {
          min: event.ticketPrice || event.basePrice || 0,
          max: event.maxPrice || event.ticketPrice || 0,
        },
        startTime: event.startDateTime
          ? new Date(event.startDateTime).toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "20:00",
        endTime: event.endDateTime
          ? new Date(event.endDateTime).toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "23:00",
        artist: event.organizer, // Utiliser organizer comme artist
        rating: 4.5, // Valeur par défaut, à remplacer par les vraies données
        reviewCount: Math.floor(Math.random() * 200) + 50, // Valeur par défaut
        isPopular: event.isFeatured || false,
        isTrending: event.isActive || false,
        venue: {
          ...event.venue,
          location: {
            address: event.venue.address,
            city: event.venue.city,
            coordinates: { lat: 48.8566, lng: 2.3522 }, // Coordonnées par défaut (Paris)
          },
        },
      }));

      setEvents(adaptedEvents);
      setTotalEvents(response.total);
      setTotalPages(response.totalPages);
    } catch (error: any) {
      console.error("Erreur lors du chargement des événements:", error);
      setError("Impossible de charger les événements. Veuillez réessayer.");

      // Fallback avec données simulées en cas d'erreur
      const mockEvents: Event[] = [
        {
          id: "1",
          title: "Concert de Jazz Fusion",
          description:
            "Une soirée exceptionnelle avec les meilleurs artistes de jazz fusion",
          category: EventCategory.CONCERT,
          date: "2025-09-15",
          duration: 180,
          venue: {
            name: "Salle Olympia",
            address: "28 Boulevard des Capucines",
            city: "Paris",
            location: {
              address: "28 Boulevard des Capucines",
              city: "Paris",
              coordinates: { lat: 48.8698, lng: 2.3298 },
            },
            capacity: 2000,
          },
          totalSeats: 2000,
          availableSeats: 1000,
          ticketPrice: 45,
          organizer: "EventMasters",
          status: "active",
          images: ["/images/jazz-concert.jpg"],
          artist: "Jazz Masters Collective",
          startTime: "20:00",
          endTime: "23:00",
          price: { min: 45, max: 85 },
          rating: 4.8,
          reviewCount: 156,
          isPopular: true,
          isTrending: true,
          tags: ["jazz", "fusion"],
          ticketTypes: [
            {
              id: "t1",
              name: "Standard",
              price: 45,
              availableQuantity: 800,
              maxPerUser: 4,
              features: ["Accès général"],
            },
            {
              id: "t2",
              name: "VIP",
              price: 85,
              availableQuantity: 200,
              maxPerUser: 2,
              features: ["Accès VIP", "Meet & Greet"],
            },
          ],
        },
      ];
      setEvents(mockEvents);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    // Cette fonction est maintenant principalement utilisée pour le tri côté client
    // La plupart du filtrage est fait côté serveur
    let filtered = [...events];

    // Tri local si nécessaire
    if (filter.sortBy && events.length > 0) {
      filtered.sort((a, b) => {
        let comparison = 0;
        switch (filter.sortBy) {
          case "date":
            comparison =
              new Date(a.date).getTime() - new Date(b.date).getTime();
            break;
          case "price":
            const priceA = a.price?.min || a.ticketPrice || 0;
            const priceB = b.price?.min || b.ticketPrice || 0;
            comparison = priceA - priceB;
            break;
          case "popularity":
            const reviewsA = a.reviewCount || 0;
            const reviewsB = b.reviewCount || 0;
            comparison = reviewsB - reviewsA;
            break;
          case "distance":
            // Simulation de distance (en réalité, on calculerait la distance réelle)
            comparison = Math.random() - 0.5;
            break;
        }
        return filter.sortOrder === "desc" ? -comparison : comparison;
      });
    }

    setFilteredEvents(filtered);
  };

  const getPaginatedEvents = () => {
    // Avec la pagination côté serveur, on retourne directement les événements filtrés
    return filteredEvents;
  };

  const QuickFilters = () => (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button
        variant={!filter.dateRange ? "primary" : "outline"}
        size="sm"
        onClick={() => setFilter({ ...filter, dateRange: undefined })}
      >
        Toutes les dates
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          setFilter({
            ...filter,
            dateRange: {
              start: new Date().toISOString().split("T")[0],
              end: new Date().toISOString().split("T")[0],
            },
          })
        }
      >
        Aujourd'hui
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          const now = new Date();
          const weekend = new Date(now);
          weekend.setDate(now.getDate() + (6 - now.getDay()));
          setFilter({
            ...filter,
            dateRange: {
              start: new Date().toISOString().split("T")[0],
              end: weekend.toISOString().split("T")[0],
            },
          });
        }}
      >
        Ce weekend
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          const now = new Date();
          const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          setFilter({
            ...filter,
            dateRange: {
              start: new Date().toISOString().split("T")[0],
              end: endOfMonth.toISOString().split("T")[0],
            },
          });
        }}
      >
        Ce mois
      </Button>
    </div>
  );

  const AdvancedFilters = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5" />
          Filtres avancés
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Catégorie</label>
            <select
              value={filter.category || ""}
              onChange={(e) =>
                setFilter({
                  ...filter,
                  category: (e.target.value as EventCategory) || undefined,
                })
              }
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Toutes les catégories</option>
              {Object.values(EventCategory).map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Ville</label>
            <input
              type="text"
              placeholder="Ville ou région"
              value={filter.location || ""}
              onChange={(e) =>
                setFilter({ ...filter, location: e.target.value || undefined })
              }
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Prix minimum
            </label>
            <input
              type="number"
              placeholder="0€"
              value={filter.priceRange?.min || ""}
              onChange={(e) =>
                setFilter({
                  ...filter,
                  priceRange: {
                    min: Number(e.target.value) || 0,
                    max: filter.priceRange?.max || 1000,
                  },
                })
              }
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Prix maximum
            </label>
            <input
              type="number"
              placeholder="1000€"
              value={filter.priceRange?.max || ""}
              onChange={(e) =>
                setFilter({
                  ...filter,
                  priceRange: {
                    min: filter.priceRange?.min || 0,
                    max: Number(e.target.value) || 1000,
                  },
                })
              }
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Date de début
            </label>
            <input
              type="date"
              value={filter.dateRange?.start || ""}
              onChange={(e) =>
                setFilter({
                  ...filter,
                  dateRange: {
                    start: e.target.value,
                    end: filter.dateRange?.end || e.target.value,
                  },
                })
              }
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Date de fin
            </label>
            <input
              type="date"
              value={filter.dateRange?.end || ""}
              onChange={(e) =>
                setFilter({
                  ...filter,
                  dateRange: {
                    start: filter.dateRange?.start || e.target.value,
                    end: e.target.value,
                  },
                })
              }
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Places minimum
            </label>
            <input
              type="number"
              placeholder="1"
              value={filter.availableSeats || ""}
              onChange={(e) =>
                setFilter({
                  ...filter,
                  availableSeats: Number(e.target.value) || undefined,
                })
              }
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Trier par</label>
            <select
              value={`${filter.sortBy}-${filter.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split("-");
                setFilter({
                  ...filter,
                  sortBy: sortBy as any,
                  sortOrder: sortOrder as any,
                });
              }}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="date-asc">Date (croissant)</option>
              <option value="date-desc">Date (décroissant)</option>
              <option value="price-asc">Prix (croissant)</option>
              <option value="price-desc">Prix (décroissant)</option>
              <option value="popularity-desc">Popularité</option>
              <option value="distance-asc">Distance</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button
            onClick={() => {
              setFilter({ sortBy: "date", sortOrder: "asc" });
              setSearchQuery("");
              setCurrentPage(1);
            }}
            variant="outline"
          >
            Réinitialiser les filtres
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const EventGridItem: React.FC<{ event: Event }> = ({ event }) => (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onEventSelect(event)}
    >
      <div className="relative">
        <img
          src={event.images?.[0] || event.imageUrl || "/placeholder-event.jpg"}
          alt={event.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        {event.availableSeats < 50 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
            Places limitées
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{event.title}</h3>
        {(event.artist || event.organizer) && (
          <p className="text-indigo-600 font-medium mb-2">
            {event.artist || event.organizer}
          </p>
        )}
        <div className="space-y-1 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            {event.startTime
              ? new Date(`${event.date}T${event.startTime}`).toLocaleDateString(
                  "fr-FR",
                  {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )
              : new Date(event.date).toLocaleDateString("fr-FR", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {event.venue.name}
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            {event.availableSeats} places disponibles
          </div>
        </div>
        <div className="flex justify-between items-center">
          {event.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">{event.rating}</span>
            </div>
          )}
          <div className="text-lg font-bold text-indigo-600">
            À partir de {event.price?.min || event.ticketPrice || 0}€
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const EventListItem: React.FC<{ event: Event }> = ({ event }) => (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onEventSelect(event)}
    >
      <CardContent className="p-4">
        <div className="flex gap-4">
          <img
            src={
              event.images?.[0] || event.imageUrl || "/placeholder-event.jpg"
            }
            alt={event.title}
            className="w-24 h-24 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">{event.title}</h3>
            {(event.artist || event.organizer) && (
              <p className="text-indigo-600 font-medium mb-2">
                {event.artist || event.organizer}
              </p>
            )}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
              <div className="flex items-center gap-1">
                <CalendarIcon className="w-4 h-4" />
                {event.startTime
                  ? new Date(
                      `${event.date}T${event.startTime}`
                    ).toLocaleDateString("fr-FR", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : new Date(event.date).toLocaleDateString("fr-FR", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {event.venue.name}, {event.venue.city}
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {event.availableSeats} places
              </div>
            </div>
            <div className="flex justify-between items-center">
              {event.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{event.rating}</span>
                  {event.reviewCount && (
                    <span className="text-xs text-gray-500">
                      ({event.reviewCount})
                    </span>
                  )}
                </div>
              )}
              <div className="text-lg font-bold text-indigo-600">
                À partir de {event.price?.min || event.ticketPrice || 0}€
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const Pagination = () => (
    <div className="flex justify-center items-center gap-2 mt-8">
      <Button
        variant="outline"
        disabled={currentPage === 1 || loading}
        onClick={() => setCurrentPage(currentPage - 1)}
      >
        Précédent
      </Button>
      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
        let page;
        if (totalPages <= 5) {
          page = i + 1;
        } else {
          // Logique pour afficher les pages autour de la page courante
          const start = Math.max(1, currentPage - 2);
          const end = Math.min(totalPages, start + 4);
          page = start + i;
          if (page > end) return null;
        }
        return (
          <Button
            key={page}
            variant={currentPage === page ? "primary" : "outline"}
            disabled={loading}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </Button>
        );
      }).filter(Boolean)}
      <Button
        variant="outline"
        disabled={currentPage === totalPages || loading}
        onClick={() => setCurrentPage(currentPage + 1)}
      >
        Suivant
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header avec recherche et controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher des événements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filtres
          </Button>

          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === "grid" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "calendar" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("calendar")}
            >
              <CalendarIcon className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "map" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("map")}
            >
              <Map className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filtres rapides */}
      <QuickFilters />

      {/* Filtres avancés */}
      {showFilters && <AdvancedFilters />}

      {/* Messages d'erreur et de chargement */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-red-700">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-gray-600">
            Chargement des événements...
          </span>
        </div>
      )}

      {/* Résultats */}
      {!loading && !error && (
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {filteredEvents.length} événement
            {filteredEvents.length !== 1 ? "s" : ""} trouvé
            {filteredEvents.length !== 1 ? "s" : ""}
          </h2>
        </div>
      )}

      {/* Liste des événements */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {getPaginatedEvents().map((event) => (
            <EventGridItem key={event.id} event={event} />
          ))}
        </div>
      )}

      {viewMode === "list" && (
        <div className="space-y-4">
          {getPaginatedEvents().map((event) => (
            <EventListItem key={event.id} event={event} />
          ))}
        </div>
      )}

      {viewMode === "calendar" && (
        <div className="bg-white rounded-lg p-6 text-center">
          <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Vue Calendrier</h3>
          <p className="text-gray-600">
            La vue calendrier sera bientôt disponible
          </p>
        </div>
      )}

      {viewMode === "map" && (
        <div className="bg-white rounded-lg p-6 text-center">
          <Map className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Vue Carte</h3>
          <p className="text-gray-600">
            La vue carte interactive sera bientôt disponible
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && <Pagination />}
    </div>
  );
};

export default EventsExploration;
