import { create } from 'zustand';
import axiosClient from './axiosClient'; 


export const useCartStore = create((set) => ({
  cartCount: 0, // Biến lưu số lượng


  fetchCart: async () => {
    try {
     
      const response = await axiosClient.get(`/user/get/cart?t=${Date.now()}`);
      
      const dataObj = response.data ? response.data : response;
      const listItems = dataObj.data || [];

  
      set({ cartCount: listItems.length });
    } catch (error) {
      console.error("Lỗi cập nhật giỏ hàng:", error);
      set({ cartCount: 0 });
    }
  },


  resetCart: () => set({ cartCount: 0 }),
}));
