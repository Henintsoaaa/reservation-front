import React from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

interface LoginFormProps {
  loginForm: {
    email: string;
    password: string;
  };
  showPassword: boolean;
  loading: boolean;
  error: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onTogglePassword: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  loginForm,
  showPassword,
  loading,
  error,
  onInputChange,
  onSubmit,
  onTogglePassword,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5" />
        <Input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={loginForm.email}
          onChange={onInputChange}
          required
          className="pl-10 h-12 focus:text-gray-900 placeholder:text-gray-500"
        />
      </div>

      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5" />
        <Input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Enter your password"
          value={loginForm.password}
          onChange={onInputChange}
          required
          className="pl-10 pr-10 h-12 focus:text-gray-900 placeholder:text-gray-500"
        />
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-600"
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <Button
        type="submit"
        isLoading={loading}
        className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        size="lg"
      >
        {loading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
};

export default LoginForm;
