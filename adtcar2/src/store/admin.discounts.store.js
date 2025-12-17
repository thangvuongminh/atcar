import { create } from "zustand";
import axiosClient from "./axiosClient";
import { toast } from "react-hot-toast"; 

export const useAdminDiscountsStore = create((set, get) => ({
    discounts: [],
    loading: false,
    loadingSend: false,

    form: {
        code: "",
        percentage: "",
        expiryDate: "",
        desc: "",
    },

    setForm: (field, value) => {
        set((state) => ({
            form: { ...state.form, [field]: value },
        }));
    },

    
    fetchDiscounts: async () => {
        set({ loading: true });
        try {
            const res = await axiosClient.get("/admin/users/get");
            const serverData = res.data?.data || res.data || [];

           
            const finalData = serverData.map((item) => ({
                ...item,
                isPublished: item.expire < 800000000,
            }));

            set({ discounts: finalData });
        } catch (error) {
            console.error("Fetch error:", error);
         
        } finally {
            set({ loading: false });
        }
    },

   
    createDiscount: async () => {
        const { form, fetchDiscounts } = get();

        if (!form.code || !form.percentage || !form.expiryDate) {
            toast.error("Vui lòng điền đủ thông tin!"); 
            return;
        }

        set({ loading: true });
        try {
            const payload = {
                code: form.code,
                discount: parseInt(form.percentage),
                desc: form.desc || "Không có mô tả",
                expire:
                    form.expiryDate.length === 16
                        ? form.expiryDate + ":00"
                        : form.expiryDate,
            };

            const res = await axiosClient.post(
                "/admin/users/discount",
                payload
            );

            if (res && (res.statusCode === 200 || res.status === 200)) {
                toast.success(`Đã tạo mã ${form.code} thành công!`); 
                set({
                    form: {
                        code: "",
                        percentage: "",
                        expiryDate: "",
                        desc: "",
                    },
                });
                fetchDiscounts();
            }
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || "Tạo mã thất bại";
            toast.error(msg); 
        } finally {
            set({ loading: false });
        }
    },

   
    sendDiscountNotification: async (code) => {
        if (!code) return;
        set({ loadingSend: true });
        try {
            const res = await axiosClient.get("/admin/users/send/discounts", {
                params: { code: code },
            });

            if (res.status === 200) {
                toast.success(`Đã gửi mail kích hoạt mã ${code} thành công!`); 

              
                set((state) => ({
                    discounts: state.discounts.map((d) =>
                        d.code === code
                            ? { ...d, expire: 1, isPublished: true }
                            : d
                    ),
                }));
            }
        } catch (error) {
            const msg = error.response?.data?.message || "Lỗi khi gửi mail";
            toast.error(msg); // THÔNG BÁO LỖI API
        } finally {
            set({ loadingSend: false });
        }
    },

   
    deleteDiscount: async (code) => {
        

        try {
           
            const res = await axiosClient.get(
                `/admin/users/delete/discount/${code}`
            );

            if (res.status === 200) {
                toast.success(`Đã xóa mã ${code} thành công!`); 

                
                set((state) => ({
                    discounts: state.discounts.filter((d) => d.code !== code),
                }));
            }
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || "Xóa thất bại";
            toast.error(msg); 
        }
    },
}));
