import axios from "axios";
import { AuthResponse, LoginDto, RegisterDto, User } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (credentials: LoginDto): Promise<AuthResponse> => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  register: async (userData: RegisterDto): Promise<AuthResponse> => {
    try {
      console.log(
        "API: Making register request to",
        `${API_BASE_URL}/auth/register`,
        "with data:",
        userData
      );
      const response = await api.post("/auth/register", userData);
      console.log("API: Register response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("API: Register error:", error);
      console.error("API: Error response:", error.response?.data);
      console.error("API: Error status:", error.response?.status);
      console.error("API: Full error details:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
      });
      throw error;
    }
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get("/auth/profile");
    return response.data;
  },

  refreshToken: async (): Promise<AuthResponse> => {
    const response = await api.post("/auth/refresh");
    return response.data;
  },
};

export default api;
