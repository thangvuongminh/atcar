import React from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingCart,
  LogOut,
  CalendarCheck,
  UserPlus,
  FileCheck,
} from "lucide-react";
import { useAdminLayoutStore } from "../../store/admin.layout.store";
import { useAuthStore } from "../../store/auth.store";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarOpen = useAdminLayoutStore((s) => s.sidebarOpen);
  const setSidebarOpen = useAdminLayoutStore((s) => s.setSidebarOpen);


  const user = useAuthStore((s) => s.user);
  const logoutStore = useAuthStore((s) => s.logout);

  const roleName = String(user?.roleName ?? user?.role ?? user?.Role ?? "")
    .toUpperCase()
    .trim();
  const isAdmin = roleName === "ADMIN";

  const handleLogout = () => {
    logoutStore?.();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Products", path: "/admin/products", icon: Package },
    { name: "Discount", path: "/admin/discount", icon: Layers },
    { name: "Orders", path: "/admin/orders", icon: ShoppingCart },
    { name: "Bookings", path: "/admin/bookings", icon: CalendarCheck },
    { name: "Create Editor", path: "/admin/create-editor", icon: UserPlus },
    { name: "Post Approvals", path: "/admin/post-approvals", icon: FileCheck },
  ];

  
  const visibleNavItems = navItems.filter((item) => {
    if (isAdmin && item.name === "Dashboard") {
      return false; 
    }
    return true; 
  });

  return (
    <div className="flex min-h-screen bg-gray-100">
   
      <aside className="w-64 bg-white shadow-md p-4">
        <h2 className="text-xl font-bold text-blue-600 mb-6">Admin</h2>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden"
          aria-hidden="true"
        />

        <nav className="space-y-2">
         
          {visibleNavItems.map(({ name, path, icon: Icon }) => (
            <Link
              key={name}
              to={path}
              className={`flex items-center gap-3 px-3 py-2 rounded-md ${
                location.pathname === path
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
              }`}
            >
              <Icon size={20} />
              {name}
            </Link>
          ))}

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 mt-4 text-red-600 hover:bg-red-50 rounded-md"
          >
            <LogOut size={20} />
            Đăng xuất
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
