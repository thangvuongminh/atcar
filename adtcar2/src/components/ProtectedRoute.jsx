
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

const ProtectedRoute = ({
    children,
    requireAuth = true,
    requiredRoles = [], // ví dụ: ["ADMIN"], ["EDITOR"], ["USER"]
}) => {
    const location = useLocation();

    
    const user = useAuthStore((s) => s.user);

    
    const isAuthenticated = !!user;

    
    const roleName = String(user?.roleName ?? user?.role ?? "")
        .toUpperCase()
        .trim();

   
    if (requireAuth && !isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    
    let rolesToCheck = requiredRoles.map((r) => r.toUpperCase().trim());

    if (rolesToCheck.length === 0) {
        if (location.pathname.startsWith("/admin")) {
            rolesToCheck = ["ADMIN"];
        } else if (location.pathname.startsWith("/editor")) {
            rolesToCheck = ["EDITOR"];
        }
    }

   
    if (rolesToCheck.length > 0) {
        const allowed = rolesToCheck.includes(roleName);
        if (!allowed) {
            return <Navigate to="/403" replace />;
        }
    }

    
    return children;
};

export default ProtectedRoute;
