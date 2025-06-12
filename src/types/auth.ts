export interface User {
  id: string;
  phone: string;
  name: string;
  email?: string;
  isVerified: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
