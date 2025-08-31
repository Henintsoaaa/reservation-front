import React from "react";
import { UserDashboardLayout } from "@/components/user";

interface User {
  name?: string;
  email?: string;
  role?: string;
  phone?: string;
}

interface UserDashboardProps {
  user: User | null;
  onLogout: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user, onLogout }) => {
  return <UserDashboardLayout user={user} onLogout={onLogout} />;
};

export default UserDashboard;
