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
