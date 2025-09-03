"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
} from "lucide-react";

interface PromotionalBanner {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  discount?: string;
  featured?: boolean;
  gradient: string;
  endDate?: string;
}

export const PromotionalBanners: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const banners: PromotionalBanner[] = [
    {
      id: "1",
      title: "Festival d'été 2025",
      subtitle: "🎵 3 jours de musique exceptionnelle",
      description:
        "Découvrez les plus grands artistes internationaux dans un cadre magique. Offre spéciale early bird !",
      image: "/api/placeholder/800/400",
      ctaText: "Réserver maintenant",
      ctaLink: "/events/summer-festival",
      discount: "-30%",
      featured: true,
      gradient: "from-purple-600 to-pink-600",
      endDate: "2025-09-15",
    },
    {
      id: "2",
      title: "Soirée Théâtre Premium",
      subtitle: "🎭 Collection exclusive",
      description:
        "Une sélection des meilleures pièces de théâtre contemporain avec les plus grands comédiens.",
      image: "/api/placeholder/800/400",
      ctaText: "Voir la programmation",
      ctaLink: "/events/theater-collection",
      discount: "Gratuit",
      gradient: "from-red-600 to-orange-600",
    },
    {
      id: "3",
      title: "Conférences Tech 2025",
      subtitle: "💼 Innovation & Leadership",
      description:
        "Rencontrez les leaders de l'industrie tech et découvrez les dernières innovations.",
      image: "/api/placeholder/800/400",
      ctaText: "S'inscrire",
      ctaLink: "/events/tech-conference",
      gradient: "from-blue-600 to-indigo-600",
      endDate: "2025-09-20",
    },
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, banners.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume auto-play after 10 seconds
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const calculateTimeRemaining = (endDate: string) => {
    const now = new Date().getTime();
    const end = new Date(endDate).getTime();
    const difference = end - now;

    if (difference <= 0) return null;

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );

    return { days, hours };
  };

  return (
    <section className="mb-12">
      <div className="relative overflow-hidden rounded-2xl shadow-2xl">
        {/* Main Banner Carousel */}
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {banners.map((banner, index) => (
            <div key={banner.id} className="w-full flex-shrink-0 relative">
              <div
                className={`relative h-64 md:h-80 lg:h-96 bg-gradient-to-r ${banner.gradient} overflow-hidden`}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full object-cover opacity-30 mix-blend-overlay"
                  />
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex items-center">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                      {/* Text Content */}
                      <div className="text-white">
                        {banner.featured && (
                          <div className="flex items-center gap-2 mb-4">
                            <Star className="h-5 w-5 text-yellow-400 fill-current" />
                            <span className="text-yellow-400 font-medium text-sm uppercase tracking-wide">
                              Événement vedette
                            </span>
                          </div>
                        )}

                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
                          {banner.title}
                        </h2>

                        <p className="text-xl md:text-2xl mb-4 opacity-90">
                          {banner.subtitle}
                        </p>

                        <p className="text-base md:text-lg mb-6 opacity-80 max-w-md">
                          {banner.description}
                        </p>

                        {/* Countdown Timer */}
                        {banner.endDate && (
                          <div className="mb-6">
                            {(() => {
                              const timeRemaining = calculateTimeRemaining(
                                banner.endDate
                              );
                              return timeRemaining ? (
                                <div className="inline-flex items-center gap-4 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                                  <Clock className="h-5 w-5" />
                                  <span className="font-medium">
                                    Offre se termine dans : {timeRemaining.days}
                                    j {timeRemaining.hours}h
                                  </span>
                                </div>
                              ) : null;
                            })()}
                          </div>
                        )}

                        {/* CTA Button */}
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() =>
                              (window.location.href = banner.ctaLink)
                            }
                            className="group bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                          >
                            {banner.ctaText}
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </button>

                          {banner.discount && (
                            <div className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-bold shadow-lg">
                              {banner.discount}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Visual Elements */}
                      <div className="hidden lg:block">
                        <div className="relative">
                          {/* Floating Cards */}
                          <div className="absolute -top-4 -right-4 bg-white/20 backdrop-blur-sm rounded-lg p-4 transform rotate-3 hover:rotate-0 transition-transform">
                            <Calendar className="h-6 w-6 text-white mb-2" />
                            <div className="text-white text-sm font-medium">
                              Événements
                              <br />à venir
                            </div>
                          </div>

                          <div className="absolute top-16 -left-8 bg-white/20 backdrop-blur-sm rounded-lg p-4 transform -rotate-3 hover:rotate-0 transition-transform">
                            <MapPin className="h-6 w-6 text-white mb-2" />
                            <div className="text-white text-sm font-medium">
                              Partout en
                              <br />
                              France
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-all duration-300 group"
        >
          <ChevronLeft className="h-6 w-6 group-hover:scale-110 transition-transform" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-all duration-300 group"
        >
          <ChevronRight className="h-6 w-6 group-hover:scale-110 transition-transform" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
          <div
            className="h-full bg-white transition-all duration-300"
            style={{
              width: `${((currentSlide + 1) / banners.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Quick Promo Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <PromoCard
          icon="🎫"
          title="Billets dernière minute"
          description="Jusqu'à -50% sur une sélection d'événements"
          color="bg-green-500"
        />

        <PromoCard
          icon="🎁"
          title="Offre parrainage"
          description="Invitez un ami et recevez 20€ de crédit"
          color="bg-purple-500"
        />

        <PromoCard
          icon="⭐"
          title="Programme fidélité"
          description="Cumulez des points à chaque réservation"
          color="bg-blue-500"
        />
      </div>
    </section>
  );
};

interface PromoCardProps {
  icon: string;
  title: string;
  description: string;
  color: string;
}

const PromoCard: React.FC<PromoCardProps> = ({
  icon,
  title,
  description,
  color,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-300 cursor-pointer group">
      <div className="flex items-center gap-3">
        <div
          className={`${color} text-white p-3 rounded-lg text-xl group-hover:scale-110 transition-transform`}
        >
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default PromotionalBanners;
