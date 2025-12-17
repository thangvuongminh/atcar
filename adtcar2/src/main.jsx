import React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

import "./index.css";
import App from "./App.jsx";
import ProtectedRoute from "./components/ProtectedRoute";

import ForbiddenPage from "./pages/ForbiddenPage";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CartPage from "./pages/CartPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import PostsPage from "./pages/PostsPage";
import MediaManager from "./pages/MediaManager";
import SchedulePage from "./pages/SchedulePage";
import ProfilePage from "./pages/ProfilePage.jsx";
import OrdersPage from "./pages/OrdersPage";

// Admin
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ProductsAdmin from "./pages/admin/ProductsAdmin";
import OrdersAdmin from "./pages/admin/OrdersAdmin";
import BookingsAdmin from "./pages/admin/BookingsAdmin";
import CreateEditorAccount from "./pages/admin/CreateEditorAccount";
import PostApprovalsAdmin from "./pages/admin/PostApprovalsAdmin";
import DiscountAdmin from "./pages/admin/DiscountAdmin";

// Editor
import EditorLayout from "./pages/editor/EditorLayout";
import EditorDashboard from "./pages/editor/EditorDashboard";
import PostsEditor from "./pages/editor/PostsEditor";
import CategoriesEditor from "./pages/editor/CategoriesEditor";
import PostEditor from "./pages/editor/PostsEditor.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "403", element: <ForbiddenPage /> },
      { index: true, element: <HomePage /> },
      { path: "products", element: <ProductsPage /> },
      { path: "posts", element: <PostsPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "cart", element: <CartPage /> },
      { path: "schedule", element: <SchedulePage /> },
      { path: "forgot-password", element: <ForgotPasswordPage /> },

      // --- USER ---
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "orders", // Route duy nhất cho đơn hàng
        element: (
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        ),
      },

      // --- ADMIN ---
      {
        path: "admin",
        element: (
          <ProtectedRoute requiredPermissions="ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="products" replace />,
          },
          { path: "dashboard", element: <Dashboard /> },
          { path: "products", element: <ProductsAdmin /> },
          { path: "discount", element: <DiscountAdmin /> },
          { path: "orders", element: <OrdersAdmin /> },
          { path: "bookings", element: <BookingsAdmin /> },
          {
            path: "create-editor",
            element: (
              <ProtectedRoute requiredPermissions="CREATE_USER">
                <CreateEditorAccount />
              </ProtectedRoute>
            ),
          },
          { path: "post-approvals", element: <PostApprovalsAdmin /> },
        ],
      },

      // --- EDITOR ---
      {
        path: "editor",
        element: (
          <ProtectedRoute requiredPermissions="EDITOR_ACCESS">
            <EditorLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="dashboard" replace />,
          },
          { path: "dashboard", element: <EditorDashboard /> },
          { path: "posts", element: <PostsEditor /> },
          { path: "categories", element: <CategoriesEditor /> },
          { path: "media", element: <MediaManager /> },
          { path: "posts/create", element: <PostEditor /> },
          { path: "posts/edit/:id", element: <PostEditor /> },
        ],
      },

      { path: "*", element: <div>404 Not Found</div> },
    ],
  },
]);

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Toaster position="top-right" />
    <RouterProvider router={router} />
  </React.StrictMode>
);
