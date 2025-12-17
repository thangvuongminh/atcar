// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

const ProtectedRoute = ({
    children,
    requireAuth = true,
    requiredRoles = [], // ví dụ: ["ADMIN"], ["EDITOR"], ["USER"]
}) => {
    const location = useLocation();

    // Lấy trực tiếp user từ store
    const user = useAuthStore((s) => s.user);

    // Đăng nhập hay chưa = có user hay không
    const isAuthenticated = !!user;

    // roleName trả từ backend: "ADMIN" | "USER" | "EDITOR"
    const roleName = String(user?.roleName ?? user?.role ?? "")
        .toUpperCase()
        .trim();

    // =============================
    // 1. Chưa đăng nhập -> /login
    // =============================
    if (requireAuth && !isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // =============================
    // 2. Tự suy ra role cần thiết từ URL nếu bạn không truyền requiredRoles
    //    /admin/...  -> bắt buộc ADMIN
    //    /editor/... -> bắt buộc EDITOR
    // =============================
    let rolesToCheck = requiredRoles.map((r) => r.toUpperCase().trim());

    if (rolesToCheck.length === 0) {
        if (location.pathname.startsWith("/admin")) {
            rolesToCheck = ["ADMIN"];
        } else if (location.pathname.startsWith("/editor")) {
            rolesToCheck = ["EDITOR"];
        }
    }

    // =============================
    // 3. Nếu route yêu cầu role mà role hiện tại không khớp -> /403
    // =============================
    if (rolesToCheck.length > 0) {
        const allowed = rolesToCheck.includes(roleName);
        if (!allowed) {
            return <Navigate to="/403" replace />;
        }
    }

    // =============================
    // 4. Đủ điều kiện -> cho vào
    // =============================
    return children;
};

export default ProtectedRoute;
