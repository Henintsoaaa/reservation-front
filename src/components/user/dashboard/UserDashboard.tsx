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
    { id: "home" as DashboardView, label: "Home", icon: Home },
    { id: "explore" as DashboardView, label: "Explore", icon: Search },
    {
      id: "bookings" as DashboardView,
      label: "My Bookings",
      icon: Calendar,
    },
    {
      id: "notifications" as DashboardView,
      label: "Notifications",
      icon: Bell,
    },
    { id: "profile" as DashboardView, label: "Profile", icon: User },
  ];

  return (
    <div className="fixed top-0 left-0 z-50">
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed top-0 left-0 h-screen w-72 glass-dark z-50 transform transition-all duration-300 ease-in-out flex flex-col
        md:translate-x-0 md:z-50 border-r border-white/10 overflow-y-auto
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">ReservaHub</h2>
                {userName && (
                  <p className="text-gray-400 text-sm">
                    Welcome back, {userName}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      onViewChange(item.id);
                      onClose();
                    }}
                    className={`
                      w-full flex items-center space-x-3 px-4 py-4 rounded-xl text-left transition-all duration-200 group
                      ${
                        isActive
                          ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30 shadow-lg"
                          : "text-gray-900/70 hover:text-white hover:bg-white/10"
                      }
                    `}
                  >
                    <Icon
                      className={`h-5 w-5 transition-all duration-200 ${
                        isActive
                          ? "text-blue-800 scale-110"
                          : "text-blue-400/60 group-hover:text-blue-400 group-hover:scale-110"
                      }`}
                    />
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User section & Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="w-full flex items-center space-x-3 px-4 py-4 rounded-xl text-left transition-all duration-200 text-red-400 hover:text-red-300 hover:bg-red-500/10 group"
          >
            <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
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
          <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Notifications
              </h1>
              <p className="text-gray-600">
                Stay updated with your latest activities
              </p>
            </div>

            <div className="space-y-4">
              {/* Modern notification cards */}
              <div className="card-elevated p-6 animate-fade-in">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Bell className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">
                        New Event Recommendation
                      </h3>
                      <span className="text-xs text-gray-500">2 hours ago</span>
                    </div>
                    <p className="text-gray-600 mb-3">
                      "Jazz Concert Under the Stars" might interest you based on
                      your preferences
                    </p>
                    <div className="flex space-x-2">
                      <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors">
                        View Event
                      </button>
                      <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-elevated p-6 animate-fade-in">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">
                        Event Reminder
                      </h3>
                      <span className="text-xs text-gray-500">5 hours ago</span>
                    </div>
                    <p className="text-gray-600 mb-3">
                      "Vegetarian Cooking Workshop" starts in 2 days
                    </p>
                    <button className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>

              <div className="card-elevated p-6 animate-fade-in">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">
                        Booking Confirmed
                      </h3>
                      <span className="text-xs text-gray-500">Yesterday</span>
                    </div>
                    <p className="text-gray-600">
                      Your booking for "Electronic Music Festival" has been
                      confirmed
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">
                  You're all caught up!
                </p>
                <p className="text-gray-400 text-sm">
                  No more notifications to show
                </p>
              </div>
            </div>
          </div>
        );

      case "profile":
        return (
          <div className="p-6 max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                My Profile
              </h1>
              <p className="text-gray-600">
                Manage your account information and preferences
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Information */}
              <div className="lg:col-span-2 space-y-8">
                <div className="card-elevated p-8">
                  <div className="flex items-center space-x-6 mb-8">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                        <span className="text-white text-3xl font-bold">
                          {user?.name?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {user?.name || "User"}
                      </h2>
                      <p className="text-gray-600 mb-1">{user?.email}</p>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                        {user?.role || "Member"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={user?.name || ""}
                        readOnly
                        className="w-full p-4 border border-gray-300 rounded-xl bg-gray-50 focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={user?.email || ""}
                        readOnly
                        className="w-full p-4 border border-gray-300 rounded-xl bg-gray-50 focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="Add your phone number"
                        className="w-full p-4 border border-gray-300 rounded-xl focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        placeholder="Add your location"
                        className="w-full p-4 border border-gray-300 rounded-xl focus-ring"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <button className="btn-gradient px-6 py-3 text-white font-medium rounded-xl hover-scale">
                      Update Profile
                    </button>
                    <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
                      Change Password
                    </button>
                  </div>
                </div>

                {/* Preferences */}
                <div className="card-elevated p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    Preferences
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Email Notifications
                        </h4>
                        <p className="text-sm text-gray-600">
                          Receive email updates about events
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          defaultChecked
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Push Notifications
                        </h4>
                        <p className="text-sm text-gray-600">
                          Get notified about booking confirmations
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          defaultChecked
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats and Quick Actions */}
              <div className="space-y-6">
                <div className="card-elevated p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">
                    Your Statistics
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Events Booked</span>
                      <span className="font-bold text-2xl gradient-text">
                        12
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Events Attended</span>
                      <span className="font-bold text-2xl gradient-text">
                        8
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Upcoming Events</span>
                      <span className="font-bold text-2xl gradient-text-accent">
                        4
                      </span>
                    </div>
                  </div>
                </div>

                <div className="card-elevated p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => setCurrentView("bookings")}
                      className="w-full flex items-center space-x-3 p-4 rounded-xl hover:bg-gray-50 transition-colors group"
                    >
                      <Calendar className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform" />
                      <span className="font-medium text-gray-800">
                        View Bookings
                      </span>
                    </button>
                    <button
                      onClick={() => setCurrentView("explore")}
                      className="w-full flex items-center space-x-3 p-4 rounded-xl hover:bg-gray-50 transition-colors group"
                    >
                      <Search className="h-5 w-5 text-green-600 group-hover:scale-110 transition-transform" />
                      <span className="font-medium text-gray-800">
                        Explore Events
                      </span>
                    </button>
                    <button className="w-full flex items-center space-x-3 p-4 rounded-xl hover:bg-gray-50 transition-colors group">
                      <Settings className="h-5 w-5 text-purple-600 group-hover:scale-110 transition-transform" />
                      <span className="font-medium text-gray-800">
                        Settings
                      </span>
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
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
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
      <div className="md:ml-72 flex flex-col min-h-screen">
        {/* Modern Top Bar */}
        <header className="glass border-b border-white/20 backdrop-blur-xl sticky top-0 z-30">
          <div className="px-4 py-4 md:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Mobile menu button */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="md:hidden p-3 rounded-xl hover:bg-white/20 transition-colors"
                >
                  <Menu className="h-6 w-6 text-gray-700" />
                </button>

                {/* Page title and breadcrumb */}
                <div className="flex items-center space-x-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {currentView === "home"
                        ? "Dashboard"
                        : currentView === "explore"
                        ? selectedEventId
                          ? "Event Details"
                          : "Explore Events"
                        : currentView === "bookings"
                        ? "My Bookings"
                        : currentView === "notifications"
                        ? "Notifications"
                        : currentView === "profile"
                        ? "Profile Settings"
                        : "Dashboard"}
                    </h1>
                    {currentView === "home" && (
                      <p className="text-gray-600">
                        Welcome back, {user?.name || "User"}! Ready to discover
                        something amazing?
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right side actions */}
              <div className="flex items-center space-x-3">
                {/* Search button */}
                <button
                  onClick={() => setCurrentView("explore")}
                  className="p-3 rounded-xl hover:bg-white/20 transition-colors relative group"
                >
                  <Search className="h-5 w-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    Search
                  </span>
                </button>

                {/* Notifications button */}
                <button
                  onClick={() => setCurrentView("notifications")}
                  className="p-3 rounded-xl hover:bg-white/20 transition-colors relative group"
                >
                  <Bell className="h-5 w-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse"></span>
                  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    Notifications
                  </span>
                </button>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setUserMenuOpen(!userMenuOpen);
                    }}
                    className="flex items-center space-x-3 p-2 rounded-xl hover:bg-white/20 transition-colors"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {user?.name?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs text-gray-600 capitalize">
                        {user?.role || "Member"}
                      </p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </button>

                  {/* Dropdown menu */}
                  {userMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-64 glass rounded-2xl shadow-xl border border-white/20 z-50 animate-fade-in"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="p-4 border-b border-white/10">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold">
                              {user?.name?.charAt(0).toUpperCase() || "U"}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {user?.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {user?.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-2">
                        <button
                          onClick={() => {
                            setCurrentView("profile");
                            setUserMenuOpen(false);
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/20 transition-colors text-left"
                        >
                          <User className="h-4 w-4 text-blue-600" />
                          <span className="text-black">Profile Settings</span>
                        </button>
                        <button
                          onClick={() => {
                            setCurrentView("profile");
                            setUserMenuOpen(false);
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/20 transition-colors text-left"
                        >
                          <Settings className="h-4 w-4 text-gray-600" />
                          <span className="text-gray-700">Preferences</span>
                        </button>
                      </div>

                      <div className="p-2 border-t border-white/10">
                        <button
                          onClick={() => {
                            logout();
                            setUserMenuOpen(false);
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-colors text-left"
                        >
                          <LogOut className="h-4 w-4 text-red-500" />
                          <span className="text-red-600">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto">{renderContent()}</main>
      </div>
    </div>
  );
};

export default UserDashboard;
