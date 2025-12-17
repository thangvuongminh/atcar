import { create } from "zustand";


export const useAdminOrdersStore = create((set, get) => ({
  orders: [],

  fetchOrders: async () => {
  

    set({ orders: [] }); // placeholder
  },

  updateStatus: async (id, status) => {
    
    await get().fetchOrders();
  },
}));
