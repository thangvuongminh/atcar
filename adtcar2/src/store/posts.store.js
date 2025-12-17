import { create } from "zustand";
import axios from "axios";

export const usePostsStore = create((set, get) => ({
    // State
    posts: [],
    categories: [],
    loading: false,
    loadingCategories: false,
    searchTerm: "",
    selectedCategory: "All",

    // --- Actions ---

    // 1. Fetch Posts
    fetchPosts: async (categoryName = "All") => {
        set({ loading: true });
        try {
            let url = "http://localhost:8080/post/all";

            // Nếu không phải "All", thêm query param filter theo chuẩn Turkraft
            if (categoryName && categoryName !== "All") {
                // SỬA LẠI Ở ĐÂY: Dùng 'category.name' thay vì 'categoryName'
                // Cú pháp: ?filter=category.name:'Marketing'
                // Lưu ý: encodeURIComponent để đảm bảo an toàn URL nếu có ký tự đặc biệt
                url += `?filter=category.name:'${categoryName}'`;
            }

            console.log("Calling API:", url); // Log ra để debug xem URL đúng chưa

            const response = await axios.get(url);

            // Map data từ API
            const postsData = response.data.data.content || [];

            set({ posts: postsData, loading: false });
        } catch (error) {
            console.error("Error fetching posts:", error);
            set({ posts: [], loading: false });
        }
    },

    // 2. Fetch Categories
    fetchCategories: async () => {
        set({ loadingCategories: true });
        try {
            const response = await axios.get("http://localhost:8080/category/all");
            const apiData = response.data.data; // Dựa vào hình Postman category/all

            const mappedCategories = apiData.map((item) => ({
                id: item.id,
                name: item.name, 
                // Format label: marketing -> Marketing
                label: item.name.charAt(0).toUpperCase() + item.name.slice(1), 
            }));

            const allCategories = [
                { name: "All", label: "Tất cả", id: 0 },
                ...mappedCategories,
            ];

            set({ categories: allCategories, loadingCategories: false });
        } catch (error) {
            console.error("Error fetching categories:", error);
            // Fallback để UI không vỡ
            set({ 
                categories: [{ name: "All", label: "Tất cả", id: 0 }], 
                loadingCategories: false 
            });
        }
    },

    setSearchTerm: (term) => set({ searchTerm: term }),
    setSelectedCategory: (categoryName) => set({ selectedCategory: categoryName }),
}));