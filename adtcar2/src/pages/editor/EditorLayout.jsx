import React from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";

import { LayoutDashboard, FileText, Layers, LogOut, Image } from "lucide-react";
import { useEditorLayoutStore } from "../../store/editor.layout.store";
import { useAuthStore } from "../../store/auth.store";

const EditorLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

  
    const sidebarOpen = useEditorLayoutStore((s) => s.sidebarOpen);
    const setSidebarOpen = useEditorLayoutStore((s) => s.setSidebarOpen);

    const logoutStore = useAuthStore((s) => s.logout);

    const handleLogout = () => {
        logoutStore?.();
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const navItems = [
        { name: "Dashboard", path: "/editor/dashboard", icon: LayoutDashboard },
        { name: "Bài viết", path: "/editor/posts", icon: FileText },


        { name: "Kho tài sản", path: "/editor/media", icon: Image },
    ];

    return (
        <div className="flex min-h-screen bg-gray-100">
        
            <aside className="w-64 bg-white shadow-md p-4">
                <h2 className="text-xl font-bold text-blue-600 mb-6">
                    Biên tập viên
                </h2>

          
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="hidden"
                    aria-hidden="true"
                />

                <nav className="space-y-2">
                    {navItems.map(({ name, path, icon: Icon }) => (
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

export default EditorLayout;
