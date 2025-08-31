"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  CreateVenueModal,
  EditVenueModal,
  OverviewStats,
  ReservationsTable,
  VenuesGrid,
  TabNavigation,
  LoadingSpinner,
  ErrorMessage,
  DashboardHeader,
} from "@/components/admin";
import { TabType } from "@/components/admin/TabNavigation";
import { useAdminData } from "@/hooks";
import { Venue } from "@/types";

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const {
    reservations,
    venues,
    loading,
    error,
    fetchData,
    updateReservationStatus,
    deleteReservation,
    deleteVenue,
    addVenue,
    updateVenue,
  } = useAdminData();

  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [showCreateVenueModal, setShowCreateVenueModal] = useState(false);
  const [showEditVenueModal, setShowEditVenueModal] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={fetchData} />;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <DashboardHeader userName={user?.name} />

      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "overview" && (
        <OverviewStats reservations={reservations} venues={venues} />
      )}

      {activeTab === "reservations" && (
        <ReservationsTable
          reservations={reservations}
          onUpdateStatus={updateReservationStatus}
          onDelete={deleteReservation}
        />
      )}

      {activeTab === "venues" && (
        <VenuesGrid
          venues={venues}
          onDelete={deleteVenue}
          onCreateVenue={() => setShowCreateVenueModal(true)}
          onEditVenue={(venue) => {
            setSelectedVenue(venue);
            setShowEditVenueModal(true);
          }}
        />
      )}

      <CreateVenueModal
        isOpen={showCreateVenueModal}
        onClose={() => setShowCreateVenueModal(false)}
        onVenueCreated={addVenue}
      />

      <EditVenueModal
        isOpen={showEditVenueModal}
        onClose={() => {
          setShowEditVenueModal(false);
          setSelectedVenue(null);
        }}
        onVenueUpdated={updateVenue}
        venue={selectedVenue}
      />
    </div>
  );
};

export default AdminDashboard;
