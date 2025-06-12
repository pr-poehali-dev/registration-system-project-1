import { useState, useEffect } from "react";
import { User, AuthState } from "@/types/auth";

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setAuthState({ user, isAuthenticated: true, isLoading: false });
    } else {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (phone: string, password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(
      (u: any) => u.phone === phone && u.password === password && u.isVerified,
    );

    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      setAuthState({
        user: userWithoutPassword,
        isAuthenticated: true,
        isLoading: false,
      });
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const register = async (userData: any): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      isVerified: false,
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("pendingUser", JSON.stringify(newUser));
    return true;
  };

  const verifyPhone = async (code: string): Promise<boolean> => {
    const pendingUser = JSON.parse(
      localStorage.getItem("pendingUser") || "null",
    );
    if (pendingUser && code === "1234") {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const userIndex = users.findIndex((u: any) => u.id === pendingUser.id);
      if (userIndex !== -1) {
        users[userIndex].isVerified = true;
        localStorage.setItem("users", JSON.stringify(users));
        localStorage.removeItem("pendingUser");
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("user");
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return {
    authState,
    login,
    register,
    logout,
    verifyPhone,
  };
};
