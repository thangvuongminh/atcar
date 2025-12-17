import React, { createContext, useContext, useMemo } from "react";
import { useAuthStore } from "../store/auth.store";

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

const computeIsAdmin = (user) => {
  const role = String(user?.role ?? "").toLowerCase().trim();
  const roleId = String(user?.role_id ?? "").trim();
 
  return role === "admin" || roleId === "1";
};

export const AuthProvider = ({ children }) => {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const setUser = useAuthStore((s) => s.setUser);
  const setLoading = useAuthStore((s) => s.setLoading);
  const logoutStore = useAuthStore((s) => s.logout);

  
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

 
  const login = async () => {
    throw new Error(
      "login() hiện đang là stub. Hãy chuyển LoginPage sang gọi API và dùng useAuthStore.setUser(...)"
    );
  };

  const register = async () => {
    throw new Error(
      "register() hiện đang là stub. Hãy chuyển RegisterPage sang gọi API và dùng useAuthStore.setUser(...)"
    );
  };

  const logout = () => {
    logoutStore();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      setLoading,
      login,
      register,
      logout,
      isAuthenticated: !!user,
      isAdmin: computeIsAdmin(user),
      setUser, 
    }),
    [user, token, loading, setLoading, setUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
