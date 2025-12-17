// src/App.jsx
import React from "react";
import { Outlet } from "react-router-dom";

import Header from "./components/header";
import Footer from "./components/footer";
import AIChatWidget from "./components/AIChatWidget";
import { useAuthStore } from "./store/auth.store";

function App() {
    const { user, accessToken } = useAuthStore();

    const tokenFromStorage =
        typeof window !== "undefined"
            ? localStorage.getItem("accessToken")
            : null;

    const isLoggedIn = !!accessToken || !!tokenFromStorage;

    const roleName = String(user?.roleName ?? user?.role ?? user?.Role ?? "")
        .toUpperCase()
        .trim();

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-grow">
                <Outlet />
            </main>

            <Footer />

            {/* Truyền isLoggedIn + roleName xuống widget */}
            <AIChatWidget isLoggedIn={isLoggedIn} roleName={roleName} />
        </div>
    );
}

export default App;
