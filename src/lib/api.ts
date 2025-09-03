import axios from "axios";
import {
  AuthResponse,
  LoginDto,
  RegisterDto,
  User,
  Reservation,
  Event,
  Booking,
  Review,
  EventFilter,
  PaginationParams,
  PaginatedResponse,
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
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
      const response = await api.post("/auth/login", credentials);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  register: async (userData: RegisterDto): Promise<AuthResponse> => {
    try {
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (error: any) {
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

export const eventsApi = {
  getAll: async (
    params?: EventFilter & PaginationParams
  ): Promise<PaginatedResponse<Event>> => {
    const response = await api.get("/events", { params });
    return response.data;
  },

  getFeatured: async (): Promise<Event[]> => {
    const response = await api.get("/events?featured=true");
    return response.data;
  },

  getAvailable: async (): Promise<Event[]> => {
    const response = await api.get("/events/available");
    return response.data;
  },

  getById: async (id: string): Promise<Event> => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  getByCategory: async (category: string): Promise<Event[]> => {
    const response = await api.get(`/events?category=${category}`);
    return response.data;
  },

  searchEvents: async (
    query: string,
    filters?: EventFilter
  ): Promise<Event[]> => {
    const response = await api.get("/events", {
      params: { search: query, ...filters },
    });
    return response.data;
  },

  getNearby: async (
    lat: number,
    lng: number,
    radius?: number
  ): Promise<Event[]> => {
    const response = await api.get("/events/nearby", {
      params: { lat, lng, radius: radius || 50 },
    });
    return response.data;
  },

  create: async (eventData: any): Promise<Event> => {
    const response = await api.post("/events", eventData);
    return response.data;
  },

  update: async (id: string, eventData: any): Promise<Event> => {
    const response = await api.patch(`/events/${id}`, eventData);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/events/${id}`);
  },
};

export const bookingsApi = {
  getAll: async (): Promise<Booking[]> => {
    const response = await api.get("/bookings");
    return response.data;
  },

  getMyBookings: async (): Promise<Booking[]> => {
    const response = await api.get("/bookings/my-bookings");
    return response.data;
  },

  getById: async (id: string): Promise<Booking> => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  create: async (bookingData: any): Promise<Booking> => {
    const response = await api.post("/bookings", bookingData);
    return response.data;
  },

  update: async (id: string, bookingData: any): Promise<Booking> => {
    const response = await api.patch(`/bookings/${id}`, bookingData);
    return response.data;
  },

  cancel: async (id: string): Promise<Booking> => {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  },

  getEventStats: async (eventId: string): Promise<any> => {
    const response = await api.get(`/bookings/stats/${eventId}`);
    return response.data;
  },

  getAvailableSeats: async (eventId: string): Promise<any> => {
    const response = await api.get(`/bookings/available-seats/${eventId}`);
    return response.data;
  },
};

export const reviewsApi = {
  getByEvent: async (eventId: string): Promise<Review[]> => {
    const response = await api.get(`/reviews/event/${eventId}`);
    return response.data;
  },

  getByUser: async (userId: string): Promise<Review[]> => {
    const response = await api.get(`/reviews/user/${userId}`);
    return response.data;
  },

  create: async (reviewData: any): Promise<Review> => {
    const response = await api.post("/reviews", reviewData);
    return response.data;
  },

  update: async (id: string, reviewData: any): Promise<Review> => {
    const response = await api.patch(`/reviews/${id}`, reviewData);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/reviews/${id}`);
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
};

export default api;
