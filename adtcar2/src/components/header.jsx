import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

import { useCartStore } from "../store/useCartStore";

import {
  ShoppingCart,
  User,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  Home,
  Package,
  LogIn,
  UserPlus,
  FileText,
} from "lucide-react";

const Header = () => {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const loading = useAuthStore((s) => s.loading);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());

  
  const cartCount = useCartStore((state) => state.cartCount);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const resetCart = useCartStore((state) => state.resetCart);

  const roleName = String(user?.roleName ?? user?.role ?? user?.Role ?? "")
    .toUpperCase()
    .trim();
  const isUser = isAuthenticated && roleName === "USER";
  const isAdmin = isAuthenticated && roleName === "ADMIN";
  const isManager = isAuthenticated && roleName === "MANAGER";
  const isEditor = isAuthenticated && roleName === "EDITOR";
  const canSeeAdminMenu = isAdmin || isManager || isEditor;
  let adminPath = isEditor ? "/editor" : "/admin";
  const isStaffNoSchedule = isAdmin || isManager || isEditor;

  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  
  useEffect(() => {
    if (isUser) {
      fetchCart();
    }
  }, [isUser, fetchCart]);

  const handleLogout = () => {
    logout();
    resetCart(); // Reset số về 0
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="bg-gradient-to-r from-gray-900 to-gray-800 text-gray-200 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="bg-indigo-500 text-white px-2 py-1 rounded-lg font-bold text-lg">
              🚙
            </span>
            <h1 className="text-xl font-semibold text-white tracking-wide">
              ADTcar
            </h1>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="flex items-center gap-1 hover:text-indigo-400 transition"
            >
              <Home className="w-4 h-4" /> Trang chủ
            </Link>
            <Link
              to="/products"
              className="flex items-center gap-1 hover:text-indigo-400 transition"
            >
              <Package className="w-4 h-4" /> Sản phẩm
            </Link>
            <Link
              to="/posts"
              className="flex items-center gap-1 hover:text-indigo-400 transition"
            >
              <FileText className="w-4 h-4" /> Bài viết
            </Link>
            {!isStaffNoSchedule && (
              <Link to="/schedule" className="hover:text-indigo-400 transition">
                Lịch hẹn
              </Link>
            )}
            {canSeeAdminMenu && (
              <Link
                to={adminPath}
                className="flex items-center gap-1 hover:text-indigo-400 transition"
              >
                <LayoutDashboard className="w-4 h-4" /> Quản trị
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {isUser && (
              <Link
                to="/cart"
                className="relative p-2 hover:text-indigo-400 transition"
              >
                <ShoppingCart className="w-6 h-6" />
               
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[11px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-gray-900 shadow-sm">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {isAuthenticated ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setIsUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 hover:text-indigo-400 transition"
                  disabled={loading}
                >
                  <User className="w-5 h-5" />
                  <span>{user?.name || "Tài khoản"}</span>
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-2 z-50">
                    <Link
                      to="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm hover:bg-gray-700 transition"
                    >
                      Thông tin cá nhân
                    </Link>
                    {isUser && (
                      <Link
                        to="/orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-4 py-2 text-sm hover:bg-gray-700 transition"
                      >
                        Đơn hàng của tôi
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition"
                    >
                      <LogOut className="w-4 h-4" /> Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  to="/login"
                  className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium hover:text-indigo-400 transition"
                >
                  <LogIn className="w-4 h-4" /> Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1 bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  <UserPlus className="w-4 h-4" /> Đăng ký
                </Link>
              </div>
            )}
            <button
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              className="md:hidden p-2 hover:text-indigo-400 transition"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-700 bg-gray-900">
            <nav className="px-4 py-3 space-y-2">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block hover:text-indigo-400 transition"
              >
                Trang chủ
              </Link>
              <Link
                to="/products"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block hover:text-indigo-400 transition"
              >
                Sản phẩm
              </Link>
              <Link
                to="/posts"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block hover:text-indigo-400 transition"
              >
                Bài viết
              </Link>
              {!isStaffNoSchedule && (
                <Link
                  to="/schedule"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block hover:text-indigo-400 transition"
                >
                  Lịch hẹn
                </Link>
              )}
              {canSeeAdminMenu && (
                <Link
                  to={adminPath}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block hover:text-indigo-400 transition"
                >
                  Quản trị
                </Link>
              )}
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block hover:text-indigo-400 transition"
                  >
                    Thông tin cá nhân
                  </Link>
                  {isUser && (
                    <Link
                      to="/orders"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block hover:text-indigo-400 transition"
                    >
                      Đơn hàng của tôi
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block text-left w-full hover:text-red-400 transition"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block hover:text-indigo-400 transition"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block hover:text-indigo-400 transition"
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
