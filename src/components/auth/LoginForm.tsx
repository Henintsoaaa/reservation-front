import React from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

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
      <div className="space-y-4">
        <div className="relative group">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 group-focus-within:text-cyan-400 transition-colors">
            <Mail className="w-5 h-5" />
          </div>
          <Input
            type="email"
            name="email"
            placeholder="Email address"
            value={loginForm.email}
            onChange={onInputChange}
            required
            className="pl-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-cyan-400 focus:bg-white/20 rounded-xl focus-ring"
          />
        </div>

        <div className="relative group">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 group-focus-within:text-cyan-400 transition-colors">
            <Lock className="w-5 h-5" />
          </div>
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={loginForm.password}
            onChange={onInputChange}
            required
            className="pl-12 pr-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-cyan-400 focus:bg-white/20 rounded-xl focus-ring"
          />
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-cyan-400 transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Forgot password link */}
      <div className="text-right">
        <a
          href="#"
          className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
        >
          Forgot password?
        </a>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl text-sm backdrop-blur-sm">
          {error}
        </div>
      )}

      <Button
        type="submit"
        isLoading={loading}
        className="w-full h-14 btn-gradient text-white font-semibold rounded-xl flex items-center justify-center space-x-2 hover-scale"
        size="lg"
      >
        {loading ? (
          <div className="loading-dots">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        ) : (
          <>
            <span>Sign In</span>
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </Button>

      {/* Social login hint */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/20"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-transparent text-white/60">
            Quick and secure login
          </span>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
