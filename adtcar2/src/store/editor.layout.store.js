import { create } from "zustand";

export const useEditorLayoutStore = create((set) => ({
  sidebarOpen: false,
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
}));
