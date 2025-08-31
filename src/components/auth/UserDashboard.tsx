import React from "react";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Mail, User, Phone, Sparkles } from "lucide-react";

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
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-4xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Welcome, {user?.name}!
          </CardTitle>
          <p className="text-gray-600 text-lg">
            You are successfully authenticated
          </p>
        </CardHeader>
        <CardContent className="text-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl">
              <Mail className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <p className="text-sm text-gray-500 font-medium">EMAIL</p>
              <p className="text-gray-800 font-semibold">{user?.email}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl">
              <User className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <p className="text-sm text-gray-500 font-medium">ROLE</p>
              <p className="text-gray-800 font-semibold capitalize">
                {user?.role}
              </p>
            </div>
            {user?.phone && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl md:col-span-2">
                <Phone className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <p className="text-sm text-gray-500 font-medium">PHONE</p>
                <p className="text-gray-800 font-semibold">{user?.phone}</p>
              </div>
            )}
          </div>
          <Button
            onClick={onLogout}
            variant="outline"
            size="lg"
            className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 hover:from-red-600 hover:to-pink-600 px-8"
          >
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;
