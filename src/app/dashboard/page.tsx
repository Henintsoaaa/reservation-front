"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { UserDashboardLayout } from "@/components/user";
import ProtectedRoute from "@/components/ProtectedRoute";

const UserDashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <UserDashboardLayout user={user} onLogout={logout} />
    </ProtectedRoute>
  );
};

export default UserDashboardPage;
