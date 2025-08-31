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

export interface Location {
  address: string;
  city: string;
}

export interface Venue {
  id: string;
  name: string;
  description: string;
  location: Location;
  capacity: number;
  pricePerHour: number;
  createdAt: string;
  updatedAt: string;
}

export interface Reservation {
  id: string;
  userId: string;
  venueId: string;
  startTime: string;
  endTime: string;
  status: ReservationStatus;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  user?: User;
  venue?: Venue;
}
