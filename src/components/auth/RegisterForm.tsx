import React from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Mail, Lock, User, Phone, Eye, EyeOff, UserPlus } from "lucide-react";

interface RegisterFormProps {
  registerForm: {
    name: string;
    email: string;
    password: string;
    phone: string;
  };
  showPassword: boolean;
  loading: boolean;
  error: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onTogglePassword: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  registerForm,
  showPassword,
  loading,
  error,
  onInputChange,
  onSubmit,
  onTogglePassword,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-4">
        <div className="relative group">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 group-focus-within:text-cyan-400 transition-colors">
            <User className="w-5 h-5" />
          </div>
          <Input
            type="text"
            name="name"
            placeholder="Full name"
            value={registerForm.name}
            onChange={onInputChange}
            required
            className="pl-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-cyan-400 focus:bg-white/20 rounded-xl focus-ring"
          />
        </div>

        <div className="relative group">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 group-focus-within:text-cyan-400 transition-colors">
            <Mail className="w-5 h-5" />
          </div>
          <Input
            type="email"
            name="email"
            placeholder="Email address"
            value={registerForm.email}
            onChange={onInputChange}
            required
            className="pl-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-cyan-400 focus:bg-white/20 rounded-xl focus-ring"
          />
        </div>

        <div className="relative group">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 group-focus-within:text-cyan-400 transition-colors">
            <Phone className="w-5 h-5" />
          </div>
          <Input
            type="tel"
            name="phone"
            placeholder="Phone number"
            value={registerForm.phone}
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
            placeholder="Create password (min. 6 characters)"
            value={registerForm.password}
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

      {/* Password strength indicator */}
      <div className="space-y-2">
        <div className="flex space-x-1">
          <div
            className={`h-1 w-full rounded-full ${
              registerForm.password.length >= 6 ? "bg-green-400" : "bg-white/20"
            }`}
          ></div>
          <div
            className={`h-1 w-full rounded-full ${
              registerForm.password.length >= 8 ? "bg-green-400" : "bg-white/20"
            }`}
          ></div>
          <div
            className={`h-1 w-full rounded-full ${
              /(?=.*[a-z])(?=.*[A-Z])/.test(registerForm.password)
                ? "bg-green-400"
                : "bg-white/20"
            }`}
          ></div>
          <div
            className={`h-1 w-full rounded-full ${
              /(?=.*\d)/.test(registerForm.password)
                ? "bg-green-400"
                : "bg-white/20"
            }`}
          ></div>
        </div>
        <p className="text-xs text-white/60">
          Password strength:{" "}
          {registerForm.password.length >= 8 &&
          /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(registerForm.password)
            ? "Strong"
            : registerForm.password.length >= 6
            ? "Good"
            : "Weak"}
        </p>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl text-sm backdrop-blur-sm">
          {error}
        </div>
      )}

      <Button
        type="submit"
        isLoading={loading}
        className="w-full h-14 btn-gradient-secondary text-white font-semibold rounded-xl flex items-center justify-center space-x-2 hover-scale"
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
            <UserPlus className="w-5 h-5" />
            <span>Create Account</span>
          </>
        )}
      </Button>

      {/* Terms and conditions */}
      <div className="text-center text-xs text-white/60">
        By creating an account, you agree to our{" "}
        <a href="#" className="text-cyan-400 hover:text-cyan-300 underline">
          Terms & Conditions
        </a>
      </div>
    </form>
  );
};

export default RegisterForm;
