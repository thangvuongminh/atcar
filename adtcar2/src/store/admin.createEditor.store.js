import { create } from "zustand";
import { toast } from "react-hot-toast";
import axiosClient from "./axiosClient"; // Đảm bảo đúng đường dẫn file axiosClient

export const useAdminCreateEditorStore = create((set, get) => ({
    users: [],
    loading: false,
    canManageEditors: false,

    // --- Pagination ---
    page: 0,
    size: 5,
    totalPages: 0,
    totalElements: 0,

    // --- Filter State ---
    filters: {
        name: "",
        email: "",
        phone: "",
        address: "",
    },

    setFilter: (field, value) =>
        set((state) => ({
            filters: { ...state.filters, [field]: value },
            page: 0, // Reset về trang 0 khi search
        })),

    setPage: (newPage) => {
        set({ page: newPage });
        get().fetchEditors();
    },

    // --- Init ---
    init: async () => {
        // Check quyền UI
        let canManage = false;
        try {
            const raw = localStorage.getItem("auth_v1");
            if (raw) {
                const parsed = JSON.parse(raw);
                const perms = parsed?.state?.user?.permissions || [];
                if (Array.isArray(perms)) {
                    canManage = perms.includes("CREATE_USER");
                }
            }
        } catch (e) {
            console.error("Parse auth error:", e);
        }
        set({ canManageEditors: canManage });

        // Gọi API
        await get().fetchEditors();
    },

    // --- FETCH EDITORS (Chuẩn Turkraft) ---
    fetchEditors: async () => {
        const { page, size, filters } = get();
        try {
            set({ loading: true });

            // 1. Build chuỗi Filter theo cú pháp Turkraft / Spring Filter
            // Cú pháp: field~'*value*' (Like) hoặc field:'value' (Equal)
            const filterConditions = [];

            if (filters.name) filterConditions.push(`name~'*${filters.name}*'`);
            if (filters.email)
                filterConditions.push(`email~'*${filters.email}*'`);
            if (filters.phone)
                filterConditions.push(`phone~'*${filters.phone}*'`);
            if (filters.address)
                filterConditions.push(`address~'*${filters.address}*'`);

            // Nối các điều kiện bằng ' and '
            const filterQuery =
                filterConditions.length > 0
                    ? filterConditions.join(" and ")
                    : null;

            // 2. Tạo params
            const params = {
                page: page,
                size: size,
                // Turkraft thường map query param tên là 'filter' hoặc 'search' (tùy config backend của bạn)
                // Nếu backend mặc định, nó thường đọc param 'filter'
                ...(filterQuery && { filter: filterQuery }),
            };

            console.log("🚀 Params gửi đi:", params);

            const res = await axiosClient.get("/admin/editor/filter", {
                params,
            });

            if (res.data && res.data.data) {
                const { content, totalPages, totalElements } = res.data.data;
                set({
                    users: Array.isArray(content) ? content : [],
                    totalPages: totalPages || 0,
                    totalElements: totalElements || 0,
                    loading: false,
                });
            } else {
                set({ users: [], totalPages: 0, loading: false });
            }
        } catch (error) {
            console.error("Load users error:", error);
            set({ users: [], loading: false });
            if (error.response?.status === 403)
                toast.error("Không có quyền xem danh sách!");
        }
    },

    // --- Create ---
    createEditor: async (formData) => {
        const { fetchEditors } = get();
        try {
            set({ loading: true });
            await axiosClient.post("/admin/create/editor", formData);
            toast.success("Tạo Editor thành công!");
            await fetchEditors();
            set({ loading: false });
            return true;
        } catch (error) {
            set({ loading: false });
            const msg = error.response?.data?.message || "Tạo thất bại!";
            toast.error(msg);
            return false;
        }
    },

    // --- Remove ---
    removeEditor: async (id) => {
        const { fetchEditors } = get();
        try {
            set({ loading: true });
            await axiosClient.patch(`/admin/editor/delete/${id}`);
            toast.success("Đã xóa tài khoản!");
            await fetchEditors();
            set({ loading: false });
            return true;
        } catch (error) {
            set({ loading: false });
            const msg = error.response?.data?.message || "Xóa thất bại!";
            toast.error(msg);
            return false;
        }
    },
}));
