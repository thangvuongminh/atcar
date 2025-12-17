// src/store/admin.products.store.js
import { create } from "zustand";
import axiosClient from "./axiosClient";

export const useAdminProductsStore = create((set, get) => ({
    products: [],
    loading: false,
    editingProduct: null,
    totalPages: 1,
    currentPage: 1,

    // =================== 1. LẤY DANH SÁCH SẢN PHẨM (PHÂN TRANG + FILTER) ===================
    // params có thể chứa: page, size, sort, filter=...
    fetchData: async (params) => {
        set({ loading: true });
        try {
            // nếu không truyền gì (submit() gọi lại) thì mặc định page=0,size=5
            const finalParams = params || { page: 0, size: 5 };

            console.log(
                "🚀 [ADMIN] CALL /product/home với params:",
                finalParams
            );

            const res = await axiosClient.get("/product/home", {
                params: finalParams,
            });

            console.log("📦 [ADMIN] RESPONSE:", res.data);

            const data = res.data;
            const pageData = data.data || data;

            // 1. danh sách sản phẩm
            const items = Array.isArray(pageData)
                ? pageData
                : pageData.content || pageData.items || pageData.list || [];

            // 2. tổng phần tử
            let totalElements = 0;
            if (typeof pageData.totalElements !== "undefined")
                totalElements = pageData.totalElements;
            else if (typeof pageData.total !== "undefined")
                totalElements = pageData.total;
            else if (typeof data.totalElements !== "undefined")
                totalElements = data.totalElements;

            // 3. số trang
            const size = finalParams.size || 5;
            let calcTotalPages = 1;

            if (totalElements > 0) {
                calcTotalPages = Math.ceil(Number(totalElements) / size);
            } else if (pageData.totalPages) {
                calcTotalPages = pageData.totalPages;
            }

            console.log(
                `🧮 [ADMIN] totalElements=${totalElements}, size=${size} => totalPages=${calcTotalPages}`
            );

            // 4. trang hiện tại (0-based -> 1-based)
            let backendPageNumber = 0;
            if (typeof pageData.number === "number")
                backendPageNumber = pageData.number;
            else if (typeof data.number === "number")
                backendPageNumber = data.number;
            else if (typeof finalParams.page !== "undefined")
                backendPageNumber = finalParams.page;

            set({
                products: items,
                totalPages: calcTotalPages > 0 ? calcTotalPages : 1,
                currentPage: backendPageNumber + 1,
                loading: false,
            });
        } catch (error) {
            console.error("❌ [ADMIN] Lỗi fetchData:", error);
            if (error.response?.status === 401) {
                console.error("UN_AUTHORIZED: Token sai hoặc hết hạn.");
            }
            set({
                loading: false,
                products: [],
                totalPages: 1,
                currentPage: 1,
            });
        }
    },

    // =================== 2. TẠO MỚI / UPDATE SẢN PHẨM ===================
    submit: async (payload) => {
        set({ loading: true });

        const { editingProduct, fetchData } = get();

        try {
            const formData = new FormData();
            formData.append("name", payload.name);
            formData.append("description", payload.description || "");
            formData.append("quantity", payload.quantity);
            formData.append("unit", payload.unit || "");
            formData.append("price", payload.price);
            formData.append("priceFake", payload.priceFake || 0);
            formData.append("manufacture", payload.manufacture || "");
            formData.append("brand", payload.brand || "");
            formData.append("productStatus", payload.productStatus);
            formData.append("sold", payload.sold ?? 0);

            if (payload.img instanceof File) {
                formData.append("img", payload.img);
            }

            if (editingProduct) {
                // TODO: gọi API update khi backend có
                console.log("Update chưa có API");
            } else {
                await axiosClient.post("/product/create", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            }

            // gọi lại fetchData không params -> sẽ dùng default {page:0,size:5}
            await fetchData();

            set({ editingProduct: null });
            return { success: true };
        } catch (error) {
            console.error("Lỗi submit:", error);
            const msg = error.response?.data?.message || "Lỗi Server";
            return { success: false, message: msg };
        } finally {
            set({ loading: false });
        }
    },

    // =================== 3. BẮT ĐẦU / DỪNG EDIT ===================
    startEdit: (p) => set({ editingProduct: p }),
    stopEdit: () => set({ editingProduct: null }),

    // =================== 4. XOÁ THEO ID (tạm thời xoá trên UI) ===================
    deleteById: async (id) => {
        const { fetchData } = get();

        try {
            // Sau này có API thật thì:
            // await axiosClient.delete(`/admin/product/delete/${id}`);
            // await fetchData();

            console.log("Xóa ID:", id);
            set((state) => ({
                products: state.products.filter(
                    (p) => p.id !== id && p._id !== id
                ),
            }));
            return { success: true };
        } catch (error) {
            console.error("Lỗi deleteById:", error);
            return { success: false, message: error.message };
        }
    },
}));
