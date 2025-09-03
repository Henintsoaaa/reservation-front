"use client";

import React from "react";
import { EventCategory } from "@/types";

interface EventCategoriesProps {
  onCategorySelect: (category: EventCategory) => void;
}

export const EventCategories: React.FC<EventCategoriesProps> = ({
  onCategorySelect,
}) => {
  const categories = [
    {
      id: EventCategory.CONCERT,
      name: "Concerts",
      icon: "🎵",
      description: "Musique live et spectacles",
      gradient: "from-purple-500 to-pink-500",
      count: 25,
    },
    {
      id: EventCategory.THEATER,
      name: "Théâtre",
      icon: "🎭",
      description: "Pièces et représentations",
      gradient: "from-red-500 to-orange-500",
      count: 15,
    },
    {
      id: EventCategory.SPORTS,
      name: "Sports",
      icon: "⚽",
      description: "Événements sportifs",
      gradient: "from-green-500 to-teal-500",
      count: 18,
    },
    {
      id: EventCategory.CONFERENCE,
      name: "Conférences",
      icon: "💼",
      description: "Business et networking",
      gradient: "from-blue-500 to-indigo-500",
      count: 12,
    },
    {
      id: EventCategory.EXHIBITION,
      name: "Expositions",
      icon: "🎨",
      description: "Art et culture",
      gradient: "from-yellow-500 to-orange-500",
      count: 8,
    },
    {
      id: EventCategory.FESTIVAL,
      name: "Festivals",
      icon: "🎪",
      description: "Événements multi-jours",
      gradient: "from-pink-500 to-rose-500",
      count: 6,
    },
    {
      id: EventCategory.WORKSHOP,
      name: "Ateliers",
      icon: "🛠️",
      description: "Formation et apprentissage",
      gradient: "from-indigo-500 to-purple-500",
      count: 22,
    },
    {
      id: EventCategory.OTHER,
      name: "Autres",
      icon: "📝",
      description: "Événements divers",
      gradient: "from-gray-500 to-gray-600",
      count: 11,
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

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onClick={() => onCategorySelect(category.id)}
          />
        ))}
      </div>

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
      {/* Background Gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
      />

      {/* Content */}
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

      {/* Hover Effect Border */}
      <div
        className={`absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-gradient-to-r group-hover:${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      />
    </button>
  );
};

export default EventCategories;
