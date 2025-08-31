"use client";

import React from "react";

interface DashboardHeaderProps {
  userName?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userName }) => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      <p className="text-gray-600">Welcome back, {userName}</p>
    </div>
  );
};

export default DashboardHeader;
