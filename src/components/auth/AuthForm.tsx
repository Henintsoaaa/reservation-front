import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { LogIn, UserPlus } from "lucide-react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

interface AuthFormProps {
  isLogin: boolean;
  showPassword: boolean;
  loading: boolean;
  error: string;
  loginForm: {
    email: string;
    password: string;
  };
  registerForm: {
    name: string;
    email: string;
    password: string;
    phone: string;
  };
  onToggleAuthMode: (isLogin: boolean) => void;
  onTogglePassword: () => void;
  onLoginChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRegisterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLoginSubmit: (e: React.FormEvent) => void;
  onRegisterSubmit: (e: React.FormEvent) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({
  isLogin,
  showPassword,
  loading,
  error,
  loginForm,
  registerForm,
  onToggleAuthMode,
  onTogglePassword,
  onLoginChange,
  onRegisterChange,
  onLoginSubmit,
  onRegisterSubmit,
}) => {
  return (
    <div className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
      <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center space-x-1 mb-6">
            <button
              onClick={() => onToggleAuthMode(true)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 ${
                isLogin
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span className="font-medium">Sign In</span>
            </button>
            <button
              onClick={() => onToggleAuthMode(false)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 ${
                !isLogin
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span className="font-medium">Sign Up</span>
            </button>
          </div>
          <CardTitle
            className={`text-2xl ${
              isLogin ? "text-blue-600" : "text-emerald-600"
            }`}
          >
            {isLogin ? "Welcome Back" : "Create Account"}
          </CardTitle>
          <p className="text-gray-600">
            {isLogin
              ? "Sign in to your account"
              : "Join us today and get started"}
          </p>
        </CardHeader>

        <CardContent>
          {isLogin ? (
            <LoginForm
              loginForm={loginForm}
              showPassword={showPassword}
              loading={loading}
              error={error}
              onInputChange={onLoginChange}
              onSubmit={onLoginSubmit}
              onTogglePassword={onTogglePassword}
            />
          ) : (
            <RegisterForm
              registerForm={registerForm}
              showPassword={showPassword}
              loading={loading}
              error={error}
              onInputChange={onRegisterChange}
              onSubmit={onRegisterSubmit}
              onTogglePassword={onTogglePassword}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;
