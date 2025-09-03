"use client";

import React, { useState, useEffect } from "react";
import { EventCategory } from "@/types";
import { eventsApi } from "@/lib/api";

interface EventCategoriesProps {
  onCategorySelect: (category: EventCategory) => void;
}

export const EventCategories: React.FC<EventCategoriesProps> = ({
  onCategorySelect,
}) => {
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>(
    {}
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategoryCounts();
  }, []);

  const loadCategoryCounts = async () => {
    try {
      setLoading(true);

      // Charger les événements pour calculer les comptes par catégorie
      const response = await eventsApi.getAll({ page: 1, limit: 1000 });
      const events = response.data;

      // Calculer les comptes par catégorie
      const counts: Record<string, number> = {};
      events.forEach((event: any) => {
        const category = event.category;
        counts[category] = (counts[category] || 0) + 1;
      });

      setCategoryCounts(counts);
    } catch (error) {
      console.error("Erreur lors du chargement des catégories:", error);
      // Valeurs par défaut en cas d'erreur
      setCategoryCounts({
        concert: 25,
        theater: 15,
        sports: 18,
        conference: 12,
        exhibition: 8,
        festival: 6,
        workshop: 22,
        other: 11,
      });
    } finally {
      setLoading(false);
    }
  };
  const categories = [
    {
      id: EventCategory.CONCERT,
      name: "Concerts",
      icon: "🎵",
      description: "Musique live et spectacles",
      gradient: "from-purple-500 to-pink-500",
      count: categoryCounts["concert"] || 0,
    },
    {
      id: EventCategory.THEATER,
      name: "Théâtre",
      icon: "🎭",
      description: "Pièces et représentations",
      gradient: "from-red-500 to-orange-500",
      count: categoryCounts["theater"] || 0,
    },
    {
      id: EventCategory.SPORTS,
      name: "Sports",
      icon: "⚽",
      description: "Événements sportifs",
      gradient: "from-green-500 to-teal-500",
      count: categoryCounts["sports"] || 0,
    },
    {
      id: EventCategory.CONFERENCE,
      name: "Conférences",
      icon: "💼",
      description: "Business et networking",
      gradient: "from-blue-500 to-indigo-500",
      count: categoryCounts["conference"] || 0,
    },
    {
      id: EventCategory.EXHIBITION,
      name: "Expositions",
      icon: "🎨",
      description: "Art et culture",
      gradient: "from-yellow-500 to-orange-500",
      count: categoryCounts["exhibition"] || 0,
    },
    {
      id: EventCategory.FESTIVAL,
      name: "Festivals",
      icon: "🎪",
      description: "Événements multi-jours",
      gradient: "from-pink-500 to-rose-500",
      count: categoryCounts["festival"] || 0,
    },
    {
      id: EventCategory.WORKSHOP,
      name: "Ateliers",
      icon: "🛠️",
      description: "Formation et apprentissage",
      gradient: "from-indigo-500 to-purple-500",
      count: categoryCounts["workshop"] || 0,
    },
    {
      id: EventCategory.OTHER,
      name: "Autres",
      icon: "📝",
      description: "Événements divers",
      gradient: "from-gray-500 to-gray-600",
      count: categoryCounts["other"] || 0,
    },
  ];

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Explorez par catégorie
        </h2>
        <p className="text-gray-600">
          Trouvez l'événement parfait pour vos intérêts
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-xl shadow-md animate-pulse"
            >
              <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onClick={() => onCategorySelect(category.id)}
            />
          ))}
        </div>
      )}

      {/* Popular Categories Section */}
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          🔥 Catégories populaires cette semaine
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {categories
            .sort((a, b) => b.count - a.count)
            .slice(0, 6)
            .map((category) => (
              <button
                key={`popular-${category.id}`}
                onClick={() => onCategorySelect(category.id)}
                className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all hover:scale-105 group"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">
                  {category.icon}
                </span>
                <div className="text-left">
                  <div className="font-medium text-gray-900">
                    {category.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {category.count} événements
                  </div>
                </div>
              </button>
            ))}
        </div>
      </div>
    </section>
  );
};

interface CategoryCardProps {
  category: {
    id: EventCategory;
    name: string;
    icon: string;
    description: string;
    gradient: string;
    count: number;
  };
  onClick: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-xl p-6 bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
      />

      <div className="relative z-10 text-center">
        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
          {category.icon}
        </div>

        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-gray-800">
          {category.name}
        </h3>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {category.description}
        </p>

        <div className="flex items-center justify-center gap-2">
          <span
            className={`inline-block w-2 h-2 rounded-full bg-gradient-to-r ${category.gradient}`}
          />
          <span className="text-xs font-medium text-gray-500">
            {category.count} événements
          </span>
        </div>
      </div>

      <div
        className={`absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-gradient-to-r group-hover:${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      />
    </button>
  );
};

export default EventCategories;
