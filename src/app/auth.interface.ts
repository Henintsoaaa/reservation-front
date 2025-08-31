export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  username?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  username?: string;
  roles?: string[];
}

export interface AuthResponse {
  access_token: string;
  user: AuthUser;
}
