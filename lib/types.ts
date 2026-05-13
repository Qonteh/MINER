// Database types
export interface AdminUser {
  id: number;
  username: string;
  password: string;
  email: string;
  created_at: Date;
  updated_at: Date;
}

export interface Session {
  id: number;
  user_id: number;
  token: string;
  expires_at: Date;
  created_at: Date;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  stock_quantity: number;
  created_at: Date;
  updated_at: Date;
}

// Auth types
export interface AuthSession {
  user: {
    id: number;
    username: string;
    email: string;
  };
  sessionId: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  message: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
  token: string;
}

// API Response types
export interface ApiResponse<T = any> {
  status: string;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
