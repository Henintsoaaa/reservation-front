"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, AuthResponse, LoginDto, RegisterDto } from "@/types";
import { authApi } from "@/lib/api";
import {
  getToken,
  setToken,
  removeToken,
  getStoredUser,
  setStoredUser,
} from "@/lib/utils";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginDto) => Promise<void>;
  register: (userData: RegisterDto) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user && !!getToken();

  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      const storedUser = getStoredUser();

      if (token && storedUser) {
        setUser(storedUser);
        try {
          // Verify token is still valid by fetching profile
          const profile = await authApi.getProfile();
          setUser(profile);
          setStoredUser(profile);
        } catch (error) {
          // Token is invalid, clear storage
          removeToken();
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginDto) => {
    try {
      const response: AuthResponse = await authApi.login(credentials);
      setToken(response.access_token);
      setUser(response.user);
      setStoredUser(response.user);

      // Redirect admin users to admin dashboard
      if (response.user.role === "admin") {
        router.push("/admin");
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: RegisterDto) => {
    try {
      console.log("Starting registration with data:", userData);
      const response: AuthResponse = await authApi.register(userData);
      console.log("Registration successful:", response);
      setToken(response.access_token);
      setUser(response.user);
      setStoredUser(response.user);

      // Redirect admin users to admin dashboard
      if (response.user.role === "admin") {
        router.push("/admin");
      }
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
    router.push("/");
  };

  const refreshUser = async () => {
    try {
      if (getToken()) {
        const profile = await authApi.getProfile();
        setUser(profile);
        setStoredUser(profile);
      }
    } catch (error) {
      logout();
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
