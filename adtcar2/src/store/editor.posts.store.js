import { create } from "zustand";
import axiosClient from "./axiosClient";

const initialForm = {
    title: "",
    categoryName: "",
    description: "",
    url: [],
    files: [],
};

export const useEditorPostsStore = create((set, get) => ({
    form: initialForm,
    editingId: null,
    isLoading: false,

    onChange: (name, value) =>
        set((s) => ({ form: { ...s.form, [name]: value } })),
    reset: () => set({ form: initialForm, editingId: null }),

    // 1. LẤY CHI TIẾT BÀI VIẾT (ĐỂ ĐỔ VÀO FORM SỬA)
    getPostDetail: async (id) => {
        set({ isLoading: true });
        try {
            // Gọi API danh sách rồi tìm item theo ID
            const res = await axiosClient.get("/get/post");
            const posts = res.data?.data || [];
            const post = posts.find((p) => p.id == id);

            if (post) {
                set({
                    editingId: id,
                    form: {
                        title: post.title || "",
                        categoryName: post.categoryName || "",
                        description: post.description || "",
                        url: Array.isArray(post.urlImg)
                            ? post.urlImg
                            : post.urlImg
                            ? [post.urlImg]
                            : [],
                        files: [],
                    },
                });
            }
        } catch (error) {
            console.error(error);
        } finally {
            set({ isLoading: false });
        }
    },

    // 2. SUBMIT (UPDATE HOẶC CREATE)
    submit: async () => {
        const { form, editingId } = get();
        if (!form.title?.trim())
            return { success: false, message: "Thiếu tiêu đề!" };
        if (!form.categoryName)
            return { success: false, message: "Chưa chọn danh mục!" };

        set({ isLoading: true });
        try {
            const formData = new FormData();
            formData.append("title", form.title);
            formData.append("description", form.description || "");
            formData.append("categoryName", form.categoryName);
            if (form.url) {
                if (Array.isArray(form.url))
                    form.url.forEach((u) => formData.append("url", u));
                else formData.append("url", form.url);
            }
            if (form.files && Array.isArray(form.files)) {
                form.files.forEach((f) => formData.append("files", f));
            }

            // --- UPDATE (PUT) ---
            if (editingId) {
                console.log("Update ID:", editingId);
                // - @PutMapping("/upload/post/update/{id}")
                await axiosClient.put(
                    `/upload/post/update/${editingId}`,
                    formData,
                    {
                        headers: { "Content-Type": "multipart/form-data" },
                    }
                );
            }
            // --- CREATE (POST) ---
            else {
                console.log("Create New");
                // - POST /upload/post
                await axiosClient.post("/upload/post", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }

            set({ isLoading: false, form: initialForm, editingId: null });
            return {
                success: true,
                message: editingId
                    ? "Cập nhật thành công!"
                    : "Thêm mới thành công!",
            };
        } catch (error) {
            set({ isLoading: false });
            return {
                success: false,
                message: error.response?.data?.message || "Lỗi server!",
            };
        }
    },

    // 3. DELETE (PATCH)
    deletePost: async (id) => {
        if (!confirm("Bạn có chắc muốn xóa bài này?")) return;
        set({ isLoading: true });
        try {
            // - @PatchMapping("/upload/delete/post/{id}")
            await axiosClient.delete(`/upload/delete/post/${id}`);
            return { success: true, message: "Đã xóa thành công!" };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Lỗi xóa!",
            };
        } finally {
            set({ isLoading: false });
        }
    },
}));
