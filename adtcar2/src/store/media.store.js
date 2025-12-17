import { create } from "zustand";

// Giả lập dữ liệu mẫu (Xoá đi khi nối API thật)
const MOCK_FILES = [
    {
        id: 1,
        url: "https://via.placeholder.com/300",
        name: "demo-image-1.jpg",
        type: "image/jpeg",
    },
    {
        id: 2,
        url: "https://via.placeholder.com/300/0000FF/808080",
        name: "banner-quang-cao.png",
        type: "image/png",
    },
];

export const useMediaStore = create((set, get) => ({
    files: [],
    isLoading: false,

    // 1. Khởi tạo: Load danh sách file từ server
    init: async () => {
        set({ isLoading: true });
        try {
            // const res = await axios.get('/api/media');
            // set({ files: res.data });

            // Giả lập delay
            setTimeout(() => set({ files: MOCK_FILES, isLoading: false }), 500);
        } catch (error) {
            console.error("Lỗi load media:", error);
            set({ isLoading: false });
        }
    },

    // 2. Upload file (Hỗ trợ nhiều file cùng lúc)
    uploadFiles: async (fileList) => {
        set({ isLoading: true });
        try {
            const formData = new FormData();
            Array.from(fileList).forEach((file) => {
                formData.append("files", file); // Key 'files' phải khớp với MultipartFile[] backend
            });

            // const res = await axios.post('/api/media/upload', formData, {
            //   headers: { 'Content-Type': 'multipart/form-data' }
            // });

            // Giả lập upload thành công
            const newFiles = Array.from(fileList).map((f, index) => ({
                id: Date.now() + index,
                url: URL.createObjectURL(f), // Demo hiển thị tạm
                name: f.name,
                type: f.type,
            }));

            set((state) => ({
                files: [...newFiles, ...state.files],
                isLoading: false,
            }));
        } catch (error) {
            console.error("Lỗi upload:", error);
            set({ isLoading: false });
        }
    },

    // 3. Xoá file
    deleteFile: async (id) => {
        if (!window.confirm("Bạn có chắc muốn xoá file này không?")) return;
        try {
            // await axios.delete(`/api/media/${id}`);
            set((state) => ({
                files: state.files.filter((f) => f.id !== id),
            }));
        } catch (error) {
            console.error("Lỗi xoá file:", error);
        }
    },
}));
