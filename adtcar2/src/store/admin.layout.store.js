import { create } from "zustand";

export const useAdminLayoutStore = create((set) => ({
  sidebarOpen: false,
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
}));
