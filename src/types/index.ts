export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: string;
}

export enum ReservationStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
}

export enum BookingStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
  COMPLETED = "completed",
}

export enum EventCategory {
  CONCERT = "concert",
  THEATER = "theater",
  SPORTS = "sports",
  CONFERENCE = "conference",
  EXHIBITION = "exhibition",
  FESTIVAL = "festival",
  WORKSHOP = "workshop",
  OTHER = "other",
}

export interface EventVenue {
  name: string;
  address: string;
  city: string;
  description?: string;
  location?: {
    address: string;
    city: string;
    coordinates?: { lat: number; lng: number };
  };
  capacity?: number;
  pricePerHour?: number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  date: string;
  duration: number;
  venue: EventVenue;
  totalSeats: number;
  availableSeats: number;
  ticketPrice: number;
  organizer: string;
  status: "active" | "cancelled" | "completed";
  imageUrl?: string;
  // Frontend additions for compatibility
  startDateTime?: string;
  endDateTime?: string;
  startTime?: string;
  endTime?: string;
  basePrice?: number;
  maxPrice?: number;
  images?: string[];
  isFeatured?: boolean;
  isActive?: boolean;
  tags?: string[];
  metadata?: any;
  createdAt?: string;
  updatedAt?: string;
  // Additional frontend properties
  artist?: string;
  rating?: number;
  reviewCount?: number;
  isPopular?: boolean;
  isTrending?: boolean;
  price?: { min: number; max: number };
  ticketTypes?: Array<{
    id: string;
    name: string;
    price: number;
    availableQuantity: number;
    maxPerUser: number;
    features: string[];
  }>;
}

export interface Booking {
  id: string;
  userId: string;
  user?: User;
  eventId: string;
  event?: Event;
  numberOfTickets: number;
  ticketType?: string;
  totalPrice: number;
  status: BookingStatus;
  paymentStatus?: string;
  bookingReference: string;
  qrCode?: string;
  seatNumbers?: string[];
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  userId: string;
  user?: User;
  eventId: string;
  event?: Event;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Reservation {
  id: string;
  userId: string;
  startTime: string;
  endTime: string;
  status: ReservationStatus;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface EventFilter {
  category?: EventCategory;
  dateRange?: {
    start: string;
    end: string;
  };
  location?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  availableSeats?: number;
  searchQuery?: string;
  sortBy?: "date" | "price" | "popularity" | "distance";
  sortOrder?: "asc" | "desc";
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
