import React from "react";
import { Calendar, Star, Users, Zap, ArrowRight, Sparkles } from "lucide-react";

const WelcomeSection: React.FC = () => {
  return (
    <div className="text-center lg:text-left space-y-10 animate-slide-up">
      {/* Main heading */}
      <div className="space-y-6">
        <div className="flex items-center justify-center lg:justify-start space-x-2 mb-4">
          <Sparkles className="w-6 h-6 text-cyan-400" />
          <span className="text-cyan-400 font-medium tracking-wide uppercase text-sm">
            Welcome to the Future
          </span>
        </div>

        <h1 className="text-6xl lg:text-8xl font-black leading-tight">
          <span className="gradient-text">Reserva</span>
          <span className="text-white">Hub</span>
        </h1>

        <h2 className="text-2xl lg:text-4xl font-bold text-white/90 leading-relaxed">
          Where <span className="gradient-text-accent">experiences</span> come
          alive
        </h2>

        <p className="text-xl text-white/70 max-w-2xl leading-relaxed">
          Discover extraordinary events, book instantly, and create
          unforgettable memories. Your next adventure is just one click away.
        </p>
      </div>

      {/* Feature highlights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
        <div className="flex flex-col items-center lg:items-start space-y-2">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div className="text-center lg:text-left">
            <p className="text-white font-semibold">Instant Booking</p>
            <p className="text-white/60 text-sm">Reserve in seconds</p>
          </div>
        </div>

        <div className="flex flex-col items-center lg:items-start space-y-2">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Star className="w-6 h-6 text-white" />
          </div>
          <div className="text-center lg:text-left">
            <p className="text-white font-semibold">Premium Events</p>
            <p className="text-white/60 text-sm">Curated experiences</p>
          </div>
        </div>

        <div className="flex flex-col items-center lg:items-start space-y-2">
          <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div className="text-center lg:text-left">
            <p className="text-white font-semibold">Community</p>
            <p className="text-white/60 text-sm">Connect & share</p>
          </div>
        </div>

        <div className="flex flex-col items-center lg:items-start space-y-2">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div className="text-center lg:text-left">
            <p className="text-white font-semibold">Real-time</p>
            <p className="text-white/60 text-sm">Live updates</p>
          </div>
        </div>
      </div>

      {/* Call to action hint */}
      <div className="hidden lg:flex items-center space-x-3 text-white/60">
        <span className="text-lg">Get started</span>
        <ArrowRight className="w-5 h-5 animate-pulse" />
        <span className="text-lg">Sign in or create account</span>
      </div>

      {/* Stats showcase */}
      <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/20">
        <div className="text-center lg:text-left">
          <div className="text-3xl font-bold gradient-text-accent">50K+</div>
          <div className="text-white/60 text-sm">Happy Users</div>
        </div>
        <div className="text-center lg:text-left">
          <div className="text-3xl font-bold gradient-text-accent">1000+</div>
          <div className="text-white/60 text-sm">Events Monthly</div>
        </div>
        <div className="text-center lg:text-left">
          <div className="text-3xl font-bold gradient-text-accent">99.9%</div>
          <div className="text-white/60 text-sm">Uptime</div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
