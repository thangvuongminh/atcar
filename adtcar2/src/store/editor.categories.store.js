import { create } from "zustand";
// import axios from "axios";

export const useEditorCategoriesStore = create((set, get) => ({
  categories: [],
  name: "",

  setName: (name) => set({ name }),

  fetchCategories: async () => {
    // TODO: nối API thật
    // const res = await axios.get(API_URL);
    // set({ categories: res.data });
    set({ categories: [] }); // placeholder giống file cũ
  },

  addCategory: async () => {
    const name = get().name.trim();
    if (!name) return;

    // TODO: nối API thật
    // await axios.post(API_URL, { name });

    set({ name: "" });
    await get().fetchCategories();
  },

  deleteCategory: async (id) => {
    const ok = window.confirm("Xoá danh mục này?");
    if (!ok) return;

    // TODO: nối API thật
    // await axios.delete(`${API_URL}/${id}`);

    await get().fetchCategories();
  },
}));
