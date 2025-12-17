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
  // giữ tương thích ProtectedRoute cũ: role_id 1=admin, 2=editor
  return role === "admin" || roleId === "1";
};

export const AuthProvider = ({ children }) => {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const setUser = useAuthStore((s) => s.setUser);
  const setLoading = useAuthStore((s) => s.setLoading);
  const logoutStore = useAuthStore((s) => s.logout);

  // token vẫn lấy từ localStorage để không phá code cũ
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Nếu LoginPage/RegisterPage của bạn đang dùng login/register từ context
  // mà bạn chưa chuyển sang gọi API trực tiếp trong page,
  // thì giữ 2 hàm này như "stubs" (không phá build) và bạn sẽ triển khai sau.
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
      setUser, // nếu chỗ nào đang dùng setUser từ context
    }),
    [user, token, loading, setLoading, setUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
