
import { create } from "zustand";
import axiosClient from "./axiosClient";

export const useAdminProductsStore = create((set, get) => ({
    products: [],
    loading: false,
    editingProduct: null,
    totalPages: 1,
    currentPage: 1,

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

    
            const items = Array.isArray(pageData)
                ? pageData
                : pageData.content || pageData.items || pageData.list || [];

       
            let totalElements = 0;
            if (typeof pageData.totalElements !== "undefined")
                totalElements = pageData.totalElements;
            else if (typeof pageData.total !== "undefined")
                totalElements = pageData.total;
            else if (typeof data.totalElements !== "undefined")
                totalElements = data.totalElements;

    
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

    startEdit: (p) => set({ editingProduct: p }),
    stopEdit: () => set({ editingProduct: null }),

  
    deleteById: async (id) => {
        const { fetchData } = get();

        try {
           
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
