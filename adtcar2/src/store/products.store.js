import { create } from "zustand";
import axiosClient from "./axiosClient";

export const useProductsStore = create((set) => ({
    products: [],
    loading: false,
    totalPages: 1,
    currentPage: 1,

    setCurrentPage: (page) => set({ currentPage: page }),

    fetchProducts: async (params) => {
        set({ loading: true });
        try {
            console.log("🚀 CALL API với params:", params);

            const res = await axiosClient.get("/product/home", { params });

            console.log("📦 DATA nhận về:", res.data);

            const data = res.data;
            const pageData = data.data || data;

     
            const items = Array.isArray(pageData)
                ? pageData
                : pageData.content || pageData.items || pageData.list || [];

         
            let totalElements = 0;
            if (typeof pageData.totalElements !== "undefined")
                totalElements = pageData.totalElements;
            else if (typeof pageData.total !== "undefined")
                totalElements = pageData.total;
            else if (typeof pageData.totalItems !== "undefined")
                totalElements = pageData.totalItems;
            else if (typeof data.totalElements !== "undefined")
                totalElements = data.totalElements;

       
            const size = params?.size || 6;
            let calcTotalPages = 1;

            if (totalElements > 0) {
                calcTotalPages = Math.ceil(Number(totalElements) / size);
            } else if (pageData.totalPages) {
                calcTotalPages = pageData.totalPages;
            }

            console.log(
                `🧮 Tính toán: TotalElements=${totalElements}, Size=${size} => TotalPages=${calcTotalPages}`
            );

            
            let backendPageNumber = 0;
            if (typeof pageData.number === "number")
                backendPageNumber = pageData.number;
            else if (typeof data.number === "number")
                backendPageNumber = data.number;
            else if (params?.page !== undefined)
                backendPageNumber = params.page;

            set({
                products: items,
                totalPages: calcTotalPages > 0 ? calcTotalPages : 1,
                currentPage: backendPageNumber + 1,
                loading: false,
            });
        } catch (err) {
            console.error("❌ Lỗi fetchProducts:", err);
            set({
                loading: false,
                products: [],
                totalPages: 1,
                currentPage: 1,
            });
        }
    },
}));
