"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  AuthForm,
  BackgroundDecorations,
  UserDashboard,
  WelcomeSection,
} from "@/components/auth";

export default function Home() {
  const { isAuthenticated, user, logout, login, register } = useAuth();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  // Redirect admin users to admin dashboard after authentication
  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      router.push("/admin");
    }
  }, [isAuthenticated, user, router]);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(loginForm);
      // Note: The redirect will happen automatically via useEffect
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await register(registerForm);
      // Note: The redirect will happen automatically via useEffect if user is admin
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated && user?.role !== "admin") {
    return <UserDashboard user={user} onLogout={logout} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Background decorations */}
      <BackgroundDecorations />

      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Branding */}
          <WelcomeSection />

          {/* Right side - Authentication Forms */}
          <AuthForm
            isLogin={isLogin}
            showPassword={showPassword}
            loading={loading}
            error={error}
            loginForm={loginForm}
            registerForm={registerForm}
            onToggleAuthMode={setIsLogin}
            onTogglePassword={() => setShowPassword(!showPassword)}
            onLoginChange={handleLoginChange}
            onRegisterChange={handleRegisterChange}
            onLoginSubmit={handleLoginSubmit}
            onRegisterSubmit={handleRegisterSubmit}
          />
        </div>
      </div>
    </div>
  );
}
