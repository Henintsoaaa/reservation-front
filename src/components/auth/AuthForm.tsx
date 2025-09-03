import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { LogIn, UserPlus, Sparkles } from "lucide-react";
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
    <div className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto animate-slide-up">
      <div className="glass rounded-3xl overflow-hidden shadow-2xl border border-white/20">
        {/* Header */}
        <div className="text-center p-8 pb-6">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Sparkles className="w-6 h-6 text-cyan-400" />
            <span className="text-lg font-bold gradient-text">Auth Portal</span>
          </div>

          {/* Toggle Buttons */}
          <div className="flex bg-white/10 rounded-2xl p-1 mb-8">
            <button
              onClick={() => onToggleAuthMode(true)}
              className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                isLogin
                  ? "bg-white text-slate-900 shadow-lg"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span className="font-medium">Sign In</span>
            </button>
            <button
              onClick={() => onToggleAuthMode(false)}
              className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                !isLogin
                  ? "bg-white text-slate-900 shadow-lg"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span className="font-medium">Sign Up</span>
            </button>
          </div>

          <div className="text-white">
            <h2 className="text-2xl font-bold mb-2">
              {isLogin ? "Welcome Back!" : "Join ReservaHub"}
            </h2>
            <p className="text-white/70 text-sm">
              {isLogin
                ? "Enter your credentials to access your account"
                : "Create your account and start exploring amazing events"}
            </p>
          </div>
        </div>

        {/* Form Content */}
        <div className="px-8 pb-8">
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
        </div>
      </div>

      {/* Bottom text */}
      <div className="text-center mt-6 text-white/60 text-sm">
        <p>
          By continuing, you agree to our{" "}
          <a href="#" className="text-cyan-400 hover:text-cyan-300 underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-cyan-400 hover:text-cyan-300 underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
