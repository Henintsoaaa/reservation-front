"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Edit, Trash2, X, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { reservationsApi } from "@/lib/api";
import { Reservation, ReservationStatus } from "@/types";
import EditReservationModal from "./EditReservationModal";

const MyReservations: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingReservation, setEditingReservation] =
    useState<Reservation | null>(null);
  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const data = await reservationsApi.getMyReservations();
      setReservations(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch reservations");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (id: string) => {
    try {
      setCancelling(id);
      await reservationsApi.updateStatus(id, ReservationStatus.CANCELLED);
      await fetchReservations(); // Refresh the list
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to cancel reservation");
    } finally {
      setCancelling(null);
    }
  };

  const handleDeleteReservation = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this reservation? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await reservationsApi.delete(id);
      await fetchReservations(); // Refresh the list
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete reservation");
    }
  };

  const getStatusBadge = (status: ReservationStatus) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case ReservationStatus.PENDING:
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case ReservationStatus.CONFIRMED:
        return `${baseClasses} bg-green-100 text-green-800`;
      case ReservationStatus.CANCELLED:
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-MG", {
      style: "currency",
      currency: "MGA",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const isReservationEditable = (reservation: Reservation) => {
    return (
      reservation.status === ReservationStatus.PENDING ||
      reservation.status === ReservationStatus.CONFIRMED
    );
  };

  const isFutureReservation = (reservation: Reservation) => {
    return new Date(reservation.startTime) > new Date();
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading your reservations...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchReservations}>Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            My Reservations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reservations.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                You haven't made any reservations yet.
              </p>
              <p className="text-sm text-gray-500">
                Start by creating your first reservation!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="font-semibold text-lg">
                          {reservation.venue?.name || "Venue"}
                        </h3>
                        <span className={getStatusBadge(reservation.status)}>
                          {reservation.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>
                            {reservation.venue?.location?.address},{" "}
                            {reservation.venue?.location?.city}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{formatDateTime(reservation.startTime)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>
                            End: {formatDateTime(reservation.endTime)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-2">
                        <span className="font-medium text-indigo-600">
                          Total: {formatCurrency(reservation.totalPrice || 0)}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      
                      {isFutureReservation(reservation) &&
                        isReservationEditable(reservation) && (
                          <Button
                            onClick={() => setEditingReservation(reservation)}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </Button>
                        )}

                      
                      {isFutureReservation(reservation) &&
                        reservation.status !== ReservationStatus.CANCELLED && (
                          <Button
                            onClick={() =>
                              handleCancelReservation(reservation.id)
                            }
                            variant="outline"
                            size="sm"
                            disabled={cancelling === reservation.id}
                            className="flex items-center gap-2 text-orange-600 border-orange-600 hover:bg-orange-50"
                          >
                            <X className="w-4 h-4" />
                            {cancelling === reservation.id
                              ? "Cancelling..."
                              : "Cancel"}
                          </Button>
                        )}

                      
                      {reservation.status === ReservationStatus.CANCELLED && (
                        <Button
                          onClick={() =>
                            handleDeleteReservation(reservation.id)
                          }
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2 text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      
      {editingReservation && (
        <EditReservationModal
          reservation={editingReservation}
          onClose={() => setEditingReservation(null)}
          onUpdated={() => {
            fetchReservations();
            setEditingReservation(null);
          }}
        />
      )}
    </>
  );
};

export default MyReservations;
