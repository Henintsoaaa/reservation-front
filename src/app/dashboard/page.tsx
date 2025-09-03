"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import UserDashboard from "@/components/user/dashboard/UserDashboard";
import ProtectedRoute from "@/components/ProtectedRoute";

const UserDashboardPage: React.FC = () => {
  return (
    <ProtectedRoute>
      <UserDashboard />
    </ProtectedRoute>
  );
};

export default UserDashboardPage;
