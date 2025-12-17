import { create } from 'zustand';
import axiosClient from './axiosClient'; 

// Store này quản lý số lượng giỏ hàng toàn cục
export const useCartStore = create((set) => ({
  cartCount: 0, // Biến lưu số lượng

  // Hàm gọi API để cập nhật số lượng mới nhất
  fetchCart: async () => {
    try {
      // Thêm ?t=... để chống Cache triệt để
      const response = await axiosClient.get(`/user/get/cart?t=${Date.now()}`);
      
      const dataObj = response.data ? response.data : response;
      const listItems = dataObj.data || [];

      // Cập nhật vào store
      set({ cartCount: listItems.length });
    } catch (error) {
      console.error("Lỗi cập nhật giỏ hàng:", error);
      set({ cartCount: 0 });
    }
  },

  // Hàm reset khi đăng xuất
  resetCart: () => set({ cartCount: 0 }),
}));