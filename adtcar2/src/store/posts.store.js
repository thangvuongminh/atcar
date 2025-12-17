import { create } from "zustand";
import axios from "axios";

export const usePostsStore = create((set, get) => ({
    posts: [],
    categories: [],
    loading: false,
    loadingCategories: false,
    searchTerm: "",
    selectedCategory: "All",

    

  
    fetchPosts: async (categoryName = "All") => {
        set({ loading: true });
        try {
            let url = "http://localhost:8080/post/all";

         
            if (categoryName && categoryName !== "All") {
                
                url += `?filter=category.name:'${categoryName}'`;
            }

            console.log("Calling API:", url); 

            const response = await axios.get(url);

       
            const postsData = response.data.data.content || [];

            set({ posts: postsData, loading: false });
        } catch (error) {
            console.error("Error fetching posts:", error);
            set({ posts: [], loading: false });
        }
    },

    
    fetchCategories: async () => {
        set({ loadingCategories: true });
        try {
            const response = await axios.get("http://localhost:8080/category/all");
            const apiData = response.data.data; // Dựa vào hình Postman category/all

            const mappedCategories = apiData.map((item) => ({
                id: item.id,
                name: item.name, 
               
                label: item.name.charAt(0).toUpperCase() + item.name.slice(1), 
            }));

            const allCategories = [
                { name: "All", label: "Tất cả", id: 0 },
                ...mappedCategories,
            ];

            set({ categories: allCategories, loadingCategories: false });
        } catch (error) {
            console.error("Error fetching categories:", error);
            
            set({ 
                categories: [{ name: "All", label: "Tất cả", id: 0 }], 
                loadingCategories: false 
            });
        }
    },

    setSearchTerm: (term) => set({ searchTerm: term }),
    setSelectedCategory: (categoryName) => set({ selectedCategory: categoryName }),
}));
