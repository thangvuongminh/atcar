import { create } from 'zustand';
import axiosClient from './axiosClient';

export const useOrderStore = create((set) => ({
  orders: [],
  loading: false,
  error: null,

  // Hàm gọi API lấy danh sách đơn hàng
  fetchMyOrders: async () => {
    set({ loading: true, error: null });
    try {
      // 🔥 SỬA URL NÀY CHO ĐÚNG VỚI BACKEND CỦA BẠN 🔥
      // Ví dụ: /user/order/history hoặc /order/get-by-user
      const response = await axiosClient.get('/user/order/my-orders');
      
      const dataObj = response.data ? response.data : response;
      
      // Giả sử backend trả về: { data: [...] }
      set({ orders: dataObj.data || [], loading: false });
    } catch (error) {
      console.error("Lỗi tải đơn hàng:", error);
      set({ error: "Không thể tải danh sách đơn hàng", loading: false });
    }
  },
}));