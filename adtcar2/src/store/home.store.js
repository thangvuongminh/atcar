import { create } from "zustand";
import axios from "axios";


const api = axios.create({
    baseURL: "http://localhost:8080", 
});

export const useHomeStore = create((set) => ({
    featuredProducts: [],
    categories: [],
    loading: false,

    fetchData: async () => {
        set({ loading: true });
        try {
           
            const resProducts = await api.get(
                "/product/home?page=0&size=6&sort=-sold"
            );

            
            if (resProducts.data && resProducts.data.data) {
                set({ featuredProducts: resProducts.data.data });
            }

        
        } catch (error) {
            console.error("Lỗi fetch data trang chủ:", error);
        } finally {
            set({ loading: false });
        }
    },
}));
