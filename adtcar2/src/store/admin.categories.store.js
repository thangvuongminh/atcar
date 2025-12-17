import { create } from "zustand";


export const useAdminCategoriesStore = create((set, get) => ({
  categories: [],
  name: "",

  setName: (name) => set({ name }),

  fetchCategories: async () => {
   
    set({ categories: [] }); // placeholder
  },

  addCategory: async () => {
    const name = get().name.trim();
    if (!name) return;

    

    set({ name: "" });
    await get().fetchCategories();
  },

  deleteCategory: async (id) => {
    const ok = window.confirm("Xoá danh mục này?");
    if (!ok) return;

   

    await get().fetchCategories();
  },
}));
