import axios from "axios";
import {
  AuthResponse,
  LoginDto,
  RegisterDto,
  User,
  Reservation,
  Venue,
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false, // Set to false since we're using JWT tokens
  timeout: 10000, // 10 second timeout
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
    console.error("API Response Error:", error);

    if (error.response?.status === 401) {
      console.log("401 Unauthorized - clearing tokens and redirecting");
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      // Only redirect if we're not already on the login page
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/auth")
      ) {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (credentials: LoginDto): Promise<AuthResponse> => {
    try {
      console.log("API: Making login request to", `${API_BASE_URL}/auth/login`);
      console.log("API: Login credentials:", {
        email: credentials.email,
        password: "[HIDDEN]",
      });

      const response = await api.post("/auth/login", credentials);
      console.log("API: Login response received:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("API: Login error:", error);
      console.error("API: Error response:", error.response?.data);
      console.error("API: Error status:", error.response?.status);
      console.error("API: Full error details:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
        },
      });
      throw error;
    }
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

export const reservationsApi = {
  getAll: async (): Promise<Reservation[]> => {
    const response = await api.get("/reservations");
    return response.data;
  },

  getMyReservations: async (): Promise<Reservation[]> => {
    const response = await api.get("/reservations/my-reservations");
    return response.data;
  },

  getById: async (id: string): Promise<Reservation> => {
    const response = await api.get(`/reservations/${id}`);
    return response.data;
  },

  create: async (reservationData: any): Promise<Reservation> => {
    const response = await api.post("/reservations", reservationData);
    return response.data;
  },

  update: async (id: string, reservationData: any): Promise<Reservation> => {
    const response = await api.put(`/reservations/${id}`, reservationData);
    return response.data;
  },

  updateStatus: async (id: string, status: string): Promise<Reservation> => {
    const response = await api.put(`/reservations/${id}/status`, { status });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/reservations/${id}`);
  },

  checkAvailability: async (
    venueId: string,
    startTime: string,
    endTime: string
  ): Promise<any> => {
    const response = await api.get(
      `/reservations/check-availability/${venueId}`,
      {
        params: { startTime, endTime },
      }
    );
    return response.data;
  },

  getVenueAvailability: async (venueId: string, date: string): Promise<any> => {
    const response = await api.get(
      `/reservations/venue-availability/${venueId}`,
      {
        params: { date },
      }
    );
    return response.data;
  },
};

export const venuesApi = {
  getAll: async (): Promise<Venue[]> => {
    const response = await api.get("/venues");
    return response.data;
  },

  getById: async (id: string): Promise<Venue> => {
    const response = await api.get(`/venues/${id}`);
    return response.data;
  },

  getAvailable: async (
    startTime: string,
    endTime: string
  ): Promise<Venue[]> => {
    const response = await api.get("/venues/available", {
      params: { startTime, endTime },
    });
    return response.data;
  },

  create: async (venueData: any): Promise<Venue> => {
    const response = await api.post("/venues", venueData);
    return response.data;
  },

  update: async (id: string, venueData: any): Promise<Venue> => {
    const response = await api.put(`/venues/${id}`, venueData);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/venues/${id}`);
  },
};

export default api;
