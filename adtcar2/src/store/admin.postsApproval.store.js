import { create } from "zustand";
import axiosClient from "./axiosClient";

export const useAdminPostApprovalsStore = create((set, get) => ({
  posts: [],
  loading: false,
  page: 0,
  size: 5,
  totalPages: 0,
  totalElements: 0,
  statusFilter: "ALL",
  q: "",
  toast: null,
  toastType: "success",

 

  fetchPosts: async () => {
    const { page, size, statusFilter, q } = get();
    set({ loading: true });
    try {
      let url = `/admin/post/handle?page=${page}&size=${size}`;
      
      let filterParts = [];
      if (statusFilter !== "ALL") filterParts.push(`postStatus:'${statusFilter}'`);
      if (q.trim()) filterParts.push(`(title~~'${q}' or create_by~~'${q}')`);

      if (filterParts.length > 0) {
        url += `&filter=${encodeURIComponent(filterParts.join(" and "))}`;
      }

      const res = await axiosClient.get(url);
      const pageData = res.data?.data;
      
      set({ 
        posts: pageData?.content || [],
        totalPages: pageData?.totalPages || 0,
        totalElements: pageData?.totalElements || 0,
        loading: false 
      });
    } catch (error) {
      console.error(error);
      set({ posts: [], loading: false });
    }
  },

  showToast: (msg, type = "success") => {
    set({ toast: msg, toastType: type });
    setTimeout(() => set({ toast: null }), 3000);
  },

 
  changeStatus: async (id, newStatus) => {
    try {
      await axiosClient.get(`/admin/post/change/${id}`, {
        params: { status: newStatus },
      });
      get().fetchPosts(); 
      get().showToast(`Cập nhật thành công: ${newStatus}`, "success");
    } catch (error) {
      console.error("Lỗi đổi trạng thái:", error);
      get().showToast("Lỗi hệ thống!", "error");
    }
  },

 
  deletePost: async (id) => {
    try {
     
      await axiosClient.get(`/admin/post/delete/${id}`);
      
      get().fetchPosts(); 
      get().showToast(`Đã xóa bài viết ${id} thành công`, "success");
    } catch (error) {
      console.error("Lỗi xóa bài:", error);
      get().showToast("Xóa thất bại!", "error");
    }
  },

  setPage: (newPage) => { set({ page: newPage }); get().fetchPosts(); },
  setStatusFilter: (newStatus) => { set({ statusFilter: newStatus, page: 0 }); get().fetchPosts(); },
  setQ: (val) => set({ q: val }),
  performSearch: () => { set({ page: 0 }); get().fetchPosts(); },
}));
