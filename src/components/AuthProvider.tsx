import React, { createContext, useContext } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AuthState } from "@/types/auth";

const AuthContext = createContext<{
  authState: AuthState;
  login: (phone: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
  verifyPhone: (code: string) => Promise<boolean>;
}>({
  authState: { user: null, isAuthenticated: false, isLoading: false },
  login: async () => false,
  register: async () => false,
  logout: () => {},
  verifyPhone: async () => false,
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
