import { create } from "zustand";
// import axios from "axios";

export const useAdminOrdersStore = create((set, get) => ({
  orders: [],

  fetchOrders: async () => {
    // TODO: Điền API ở đây
    // const res = await axios.get(API_URL);
    // set({ orders: res.data.data || res.data });

    set({ orders: [] }); // placeholder
  },

  updateStatus: async (id, status) => {
    // TODO: Điền API ở đây
    // await axios.put(`${API_URL}/${id}`, { status });
    await get().fetchOrders();
  },
}));
