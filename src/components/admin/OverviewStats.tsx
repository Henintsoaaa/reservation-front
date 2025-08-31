"use client";

import React from "react";
import { Reservation, Venue, ReservationStatus } from "@/types";

interface OverviewStatsProps {
  reservations: Reservation[];
  venues: Venue[];
}

const OverviewStats: React.FC<OverviewStatsProps> = ({
  reservations,
  venues,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const totalRevenue = reservations
    .filter((r) => r.status === ReservationStatus.CONFIRMED)
    .reduce((sum, r) => sum + (r.totalPrice || 0), 0);

  const pendingReservations = reservations.filter(
    (r) => r.status === ReservationStatus.PENDING
  ).length;

  const stats = [
    {
      id: "reservations",
      name: "Total Reservations",
      value: reservations.length,
      icon: "R",
      bgColor: "bg-blue-500",
    },
    {
      id: "venues",
      name: "Total Venues",
      value: venues.length,
      icon: "V",
      bgColor: "bg-green-500",
    },
    {
      id: "pending",
      name: "Pending Reservations",
      value: pendingReservations,
      icon: "P",
      bgColor: "bg-yellow-500",
    },
    {
      id: "revenue",
      name: "Total Revenue",
      value: formatCurrency(totalRevenue),
      icon: "$",
      bgColor: "bg-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className="bg-white overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div
                  className={`w-8 h-8 ${stat.bgColor} rounded-md flex items-center justify-center`}
                >
                  <span className="text-white font-bold">{stat.icon}</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stat.value}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OverviewStats;
