import { create } from "zustand";
// import axios from "axios";

export const useAdminCategoriesStore = create((set, get) => ({
  categories: [],
  name: "",

  setName: (name) => set({ name }),

  fetchCategories: async () => {
    // TODO: Điền API ở đây
    // const res = await axios.get(API_URL);
    // set({ categories: res.data });
    set({ categories: [] }); // placeholder
  },

  addCategory: async () => {
    const name = get().name.trim();
    if (!name) return;

    // TODO: Điền API ở đây
    // await axios.post(API_URL, { name });

    set({ name: "" });
    await get().fetchCategories();
  },

  deleteCategory: async (id) => {
    const ok = window.confirm("Xoá danh mục này?");
    if (!ok) return;

    // TODO: Điền API ở đây
    // await axios.delete(`${API_URL}/${id}`);

    await get().fetchCategories();
  },
}));
