import { create } from "zustand";
import axios from "axios";

// Tạo instance axios nếu chưa có (để cấu hình base URL tiện hơn)
// Hoặc bạn import instance có sẵn của dự án
const api = axios.create({
    baseURL: "http://localhost:8080", // URL Backend của bạn
});

export const useHomeStore = create((set) => ({
    featuredProducts: [],
    categories: [],
    loading: false,

    fetchData: async () => {
        set({ loading: true });
        try {
            // 1. Gọi API Featured Products (đúng như Postman)
            const resProducts = await api.get(
                "/product/home?page=0&size=6&sort=-sold"
            );

            // 2. Gọi API Categories (giả định)
            // const resCategories = await api.get('/category');

            // 3. Cập nhật state
            // Lưu ý: Postman trả về { status: 200, message: "...", data: [...] }
            // Nên ta lấy resProducts.data.data
            if (resProducts.data && resProducts.data.data) {
                set({ featuredProducts: resProducts.data.data });
            }

            // set({ categories: resCategories.data.data || [] }); // Mở comment nếu có API category
        } catch (error) {
            console.error("Lỗi fetch data trang chủ:", error);
        } finally {
            set({ loading: false });
        }
    },
}));
