"use client";

import React, { useState } from "react";
import {
  Home,
  Search,
  Calendar,
  MapPin,
  User,
  Settings,
  Bell,
  Menu,
  X,
} from "lucide-react";
import HomePage from "./HomePage";
import EventExploration from "./EventExploration";
import EventDetails from "./EventDetails";
import MyBookings from "./MyBookings";

type DashboardView =
  | "home"
  | "explore"
  | "bookings"
  | "profile"
  | "notifications";

interface SidebarProps {
  currentView: DashboardView;
  onViewChange: (view: DashboardView) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  isOpen,
  onClose,
}) => {
  const menuItems = [
    { id: "home" as DashboardView, label: "Accueil", icon: Home },
    { id: "explore" as DashboardView, label: "Explorer", icon: Search },
    {
      id: "bookings" as DashboardView,
      label: "Mes Réservations",
      icon: Calendar,
    },
    {
      id: "notifications" as DashboardView,
      label: "Notifications",
      icon: Bell,
    },
    { id: "profile" as DashboardView, label: "Profil", icon: User },
  ];

  return (
    <>
      {/* Overlay pour mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:z-auto
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>
          <button
            onClick={onClose}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      onViewChange(item.id);
                      onClose(); // Fermer le sidebar sur mobile
                    }}
                    className={`
                      w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors
                      ${
                        isActive
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "text-gray-700 hover:bg-gray-50"
                      }
                    `}
                  >
                    <Icon
                      className={`h-5 w-5 ${
                        isActive ? "text-blue-700" : "text-gray-500"
                      }`}
                    />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
};

const UserDashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<DashboardView>("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const renderContent = () => {
    switch (currentView) {
      case "home":
        return (
          <HomePage
            onEventSelect={(event) => {
              setSelectedEventId(event.id);
              setCurrentView("explore");
            }}
          />
        );

      case "explore":
        if (selectedEventId) {
          return (
            <EventDetails
              eventId={selectedEventId}
              onBack={() => {
                setSelectedEventId(null);
                setCurrentView("explore");
              }}
              onBookingSuccess={() => setCurrentView("bookings")}
            />
          );
        }
        return (
          <EventExploration
            onEventSelect={(event) => {
              setSelectedEventId(event.id);
            }}
          />
        );

      case "bookings":
        return (
          <MyBookings
            onEventSelect={(eventId) => {
              setSelectedEventId(eventId);
              setCurrentView("explore");
            }}
          />
        );

      case "notifications":
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Notifications
            </h1>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">
                Centre de notifications en cours de développement...
              </p>
            </div>
          </div>
        );

      case "profile":
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Mon Profil
            </h1>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">
                Page de profil en cours de développement...
              </p>
            </div>
          </div>
        );

      default:
        return (
          <HomePage
            onEventSelect={(event) => {
              setSelectedEventId(event.id);
              setCurrentView("explore");
            }}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b px-4 py-3 md:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Bouton menu mobile */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>

              {/* Titre de la page */}
              <h1 className="text-lg font-semibold text-gray-900 capitalize">
                {currentView === "home"
                  ? "Accueil"
                  : currentView === "explore"
                  ? selectedEventId
                    ? "Détails de l'événement"
                    : "Explorer les événements"
                  : currentView === "bookings"
                  ? "Mes Réservations"
                  : currentView === "notifications"
                  ? "Notifications"
                  : currentView === "profile"
                  ? "Mon Profil"
                  : "Dashboard"}
              </h1>
            </div>

            {/* Actions à droite */}
            <div className="flex items-center space-x-4">
              {/* Bouton notifications */}
              <button
                onClick={() => setCurrentView("notifications")}
                className="p-2 rounded-lg hover:bg-gray-100 relative"
              >
                <Bell className="h-5 w-5 text-gray-600" />
                {/* Badge de notification (exemple) */}
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </button>

              {/* Bouton profil */}
              <button
                onClick={() => setCurrentView("profile")}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <User className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </header>

        {/* Contenu principal */}
        <main className="flex-1 overflow-auto">{renderContent()}</main>
      </div>
    </div>
  );
};

export default UserDashboard;
