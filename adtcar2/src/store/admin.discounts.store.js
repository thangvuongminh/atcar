import { create } from "zustand";
import axiosClient from "./axiosClient";
import { toast } from "react-hot-toast"; // Đảm bảo bạn đã cài: npm install react-hot-toast

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

    // 1. Lấy danh sách
    fetchDiscounts: async () => {
        set({ loading: true });
        try {
            const res = await axiosClient.get("/admin/users/get");
            const serverData = res.data?.data || res.data || [];

            // Logic tính toán trạng thái: expire < 800000000 là Đã Đăng Tải
            const finalData = serverData.map((item) => ({
                ...item,
                isPublished: item.expire < 800000000,
            }));

            set({ discounts: finalData });
        } catch (error) {
            console.error("Fetch error:", error);
            // toast.error("Không thể tải danh sách mã giảm giá");
        } finally {
            set({ loading: false });
        }
    },

    // 2. Tạo mã (CÓ THÔNG BÁO)
    createDiscount: async () => {
        const { form, fetchDiscounts } = get();

        if (!form.code || !form.percentage || !form.expiryDate) {
            toast.error("Vui lòng điền đủ thông tin!"); // Thông báo lỗi nhập liệu
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
                toast.success(`Đã tạo mã ${form.code} thành công!`); // THÔNG BÁO THÀNH CÔNG
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
            toast.error(msg); // THÔNG BÁO LỖI API
        } finally {
            set({ loading: false });
        }
    },

    // 3. Gửi Mail (CÓ THÔNG BÁO)
    sendDiscountNotification: async (code) => {
        if (!code) return;
        set({ loadingSend: true });
        try {
            const res = await axiosClient.get("/admin/users/send/discounts", {
                params: { code: code },
            });

            if (res.status === 200) {
                toast.success(`Đã gửi mail kích hoạt mã ${code} thành công!`); // THÔNG BÁO THÀNH CÔNG

                // Cập nhật trạng thái local ngay lập tức
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

    // 4. Xóa mã (CÓ THÔNG BÁO - KHÔNG DÙNG ALERT)
    deleteDiscount: async (code) => {
        // Lưu ý: Đã bỏ window.confirm theo yêu cầu "không dùng alert"
        // Nếu muốn an toàn hơn thì nên dùng Modal UI, nhưng ở đây tôi gọi API luôn.

        try {
            // Gọi đúng đường dẫn backend của bạn: /delele/ (lỗi chính tả của BE)
            const res = await axiosClient.get(
                `/admin/users/delete/discount/${code}`
            );

            if (res.status === 200) {
                toast.success(`Đã xóa mã ${code} thành công!`); // THÔNG BÁO THÀNH CÔNG

                // Cập nhật giao diện: Xóa dòng đó khỏi bảng
                set((state) => ({
                    discounts: state.discounts.filter((d) => d.code !== code),
                }));
            }
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || "Xóa thất bại";
            toast.error(msg); // THÔNG BÁO LỖI API
        }
    },
}));
