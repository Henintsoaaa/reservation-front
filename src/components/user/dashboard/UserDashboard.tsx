"use client";

import React, { useState } from "react";
import {
  Home,
  Search,
  Calendar,
  User,
  Settings,
  Bell,
  Menu,
  X,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
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
  userName?: string;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  isOpen,
  onClose,
  userName,
  onLogout,
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
        fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out flex flex-col
        md:relative md:translate-x-0 md:z-auto
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">ReservaHub</h2>
              {userName && (
                <p className="text-blue-100 text-sm">Bonjour, {userName}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="md:hidden p-2 rounded-lg hover:bg-blue-600 text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="p-4 flex-1">
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

        {/* Logout Button */}
        <div className="p-4 border-t">
          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Se déconnecter</span>
          </button>
        </div>
      </div>
    </>
  );
};

const UserDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState<DashboardView>("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Centre de notifications en cours de développement...
              </h3>
              <div className="space-y-4">
                {/* Exemple de notifications */}
                <div className="bg-white rounded-lg shadow">
                  <div className="p-4 border-l-4 border-blue-500">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <Bell className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Nouvel événement recommandé
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          &quot;Concert Jazz en plein air&quot; pourrait vous
                          intéresser
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          Il y a 2 heures
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow">
                  <div className="p-4 border-l-4 border-green-500">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <Calendar className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Rappel d&apos;événement
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          &quot;Atelier cuisine végétarienne&quot; commence dans
                          2 jours
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          Il y a 5 heures
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow">
                  <div className="p-4 border-l-4 border-orange-500">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <User className="h-5 w-5 text-orange-500" />
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Réservation confirmée
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Votre réservation pour &quot;Festival de musique
                          électronique&quot; a été confirmée
                        </p>
                        <p className="text-xs text-gray-400 mt-2">Hier</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center py-8">
                  <p className="text-gray-500">
                    Vous êtes à jour avec toutes vos notifications !
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "profile":
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Mon Profil
            </h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Informations du profil */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {user?.name || "Utilisateur"}
                    </h2>
                    <p className="text-gray-600">{user?.email}</p>
                    <p className="text-sm text-blue-600 capitalize">
                      {user?.role || "Utilisateur"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      value={user?.name || ""}
                      readOnly
                      className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      readOnly
                      className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Modifier le profil
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      Changer le mot de passe
                    </button>
                  </div>
                </div>
              </div>

              {/* Statistiques rapides */}
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Mes statistiques
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Événements réservés</span>
                      <span className="font-semibold">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Événements passés</span>
                      <span className="font-semibold">8</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Événements à venir</span>
                      <span className="font-semibold text-blue-600">4</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Actions rapides
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setCurrentView("bookings")}
                      className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                    >
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span>Voir mes réservations</span>
                    </button>
                    <button
                      onClick={() => setCurrentView("explore")}
                      className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                    >
                      <Search className="h-4 w-4 text-green-600" />
                      <span>Explorer les événements</span>
                    </button>
                  </div>
                </div>
              </div>
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
    <div
      className="min-h-screen bg-gray-50 flex"
      onClick={() => setUserMenuOpen(false)}
    >
      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userName={user?.name}
        onLogout={logout}
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

              {/* Titre de la page avec message de bienvenue personnalisé */}
              <div>
                <h1 className="text-lg font-semibold text-gray-900 capitalize">
                  {currentView === "home"
                    ? `Bienvenue, ${user?.name || "Utilisateur"} !`
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
                {currentView === "home" && (
                  <p className="text-sm text-gray-500">
                    Découvrez de nouveaux événements passionnants
                  </p>
                )}
              </div>
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

              {/* Menu utilisateur */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setUserMenuOpen(!userMenuOpen);
                  }}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-700">
                    {user?.name || "Utilisateur"}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>

                {/* Menu déroulant */}
                {userMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="py-1">
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium text-gray-900">
                          {user?.name}
                        </p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          setCurrentView("profile");
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <User className="h-4 w-4" />
                        <span>Mon Profil</span>
                      </button>
                      <button
                        onClick={() => {
                          setCurrentView("profile");
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <Settings className="h-4 w-4" />
                        <span>Paramètres</span>
                      </button>
                      <div className="border-t">
                        <button
                          onClick={() => {
                            logout();
                            setUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Se déconnecter</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
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
