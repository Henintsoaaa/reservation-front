"use client";

import React from "react";
import Navbar from "./Navbar";
import { AuthProvider } from "@/contexts/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-1">{children}</main>
      </div>
    </AuthProvider>
  );
};

export default Layout;
