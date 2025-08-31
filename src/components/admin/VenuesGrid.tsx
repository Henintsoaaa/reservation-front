"use client";

import React from "react";
import { Venue } from "@/types";

interface VenuesGridProps {
  venues: Venue[];
  onDelete: (id: string) => Promise<void>;
  onCreateVenue: () => void;
  onEditVenue: (venue: Venue) => void;
}

const VenuesGrid: React.FC<VenuesGridProps> = ({
  venues,
  onDelete,
  onCreateVenue,
  onEditVenue,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            All Venues
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Manage all available venues
          </p>
        </div>
        <button
          onClick={onCreateVenue}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add New Venue
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {venues.map((venue) => (
          <div
            key={venue.id}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <div className="p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                {venue.name}
              </h4>
              <p className="text-gray-600 mb-4">{venue.description}</p>
              <div className="space-y-2 text-sm text-gray-500">
                <div>
                  <span className="font-medium">Location:</span>{" "}
                  {venue.location.address}, {venue.location.city}
                </div>
                <div>
                  <span className="font-medium">Capacity:</span>{" "}
                  {venue.capacity} people
                </div>
                <div>
                  <span className="font-medium">Price:</span>{" "}
                  {formatCurrency(venue.pricePerHour)}/hour
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <button
                  className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                  onClick={() => onEditVenue(venue)}
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(venue.id)}
                  className="text-red-600 hover:text-red-900 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VenuesGrid;
