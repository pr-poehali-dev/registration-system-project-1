export interface User {
  id: string;
  fullName: string;
  company: string;
  position: string;
  inn?: string;
  phone: string;
  email?: string;
  isVerified: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
