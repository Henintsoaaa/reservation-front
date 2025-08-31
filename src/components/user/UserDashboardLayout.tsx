"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Calendar,
  Home,
  MapPin,
  User,
  LogOut,
  Plus,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import MyReservations from "./MyReservations";
import CreateReservation from "./CreateReservation";
import AvailableVenues from "./AvailableVenues";

type TabType = "reservations" | "create" | "venues" | "profile";

interface UserDashboardLayoutProps {
  user: any;
  onLogout: () => void;
}

const UserDashboardLayout: React.FC<UserDashboardLayoutProps> = ({
  user,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("reservations");
  const [selectedVenue, setSelectedVenue] = useState<any>(null);

  const handleVenueSelect = (venue: any) => {
    setSelectedVenue(venue);
    setActiveTab("create");
  };

  const tabs = [
    {
      id: "reservations" as TabType,
      label: "My Reservations",
      icon: Calendar,
    },
    {
      id: "create" as TabType,
      label: "New Reservation",
      icon: Plus,
    },
    {
      id: "venues" as TabType,
      label: "Available Venues",
      icon: MapPin,
    },
    {
      id: "profile" as TabType,
      label: "Profile",
      icon: User,
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "reservations":
        return <MyReservations />;
      case "create":
        return (
          <CreateReservation
            onReservationCreated={() => setActiveTab("reservations")}
            preselectedVenue={selectedVenue}
            onVenueChange={() => setSelectedVenue(null)}
          />
        );
      case "venues":
        return <AvailableVenues onVenueSelect={handleVenueSelect} />;
      case "profile":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Name
                  </label>
                  <p className="text-lg font-semibold">{user?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Email
                  </label>
                  <p className="text-lg">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Phone
                  </label>
                  <p className="text-lg">{user?.phone || "Not provided"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Role
                  </label>
                  <p className="text-lg capitalize">{user?.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return <MyReservations />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Home className="w-8 h-8 text-indigo-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">
                Reservation Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.name}
              </span>
              <Button
                onClick={onLogout}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          <div className="lg:w-64">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          activeTab === tab.id
                            ? "bg-indigo-100 text-indigo-700 font-medium"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          
          <div className="flex-1">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardLayout;
