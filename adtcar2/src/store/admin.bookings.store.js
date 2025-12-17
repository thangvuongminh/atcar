import { create } from "zustand";

const STORAGE_KEY = "adtcar_booking_v2";

const STATUS_LABEL = {
  pending: "Chờ duyệt",
  confirmed: "Đã duyệt",
  rejected: "Từ chối",
  canceled: "Hủy",
  done: "Hoàn thành",
};

function loadBookings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persist(bookings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

export const useAdminBookingsStore = create((set, get) => ({
  bookings: [],
  q: "",
  statusFilter: "pending",
  toast: null,

  init: () => {
    set({ bookings: loadBookings() });
  },

  syncFromStorageEvent: (e) => {
    if (e?.key === STORAGE_KEY) set({ bookings: loadBookings() });
  },

  setQ: (q) => set({ q }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),

  showToast: (msg) => {
    set({ toast: msg });
    setTimeout(() => set({ toast: null }), 2200);
  },

  badgeClass: (status) => {
    const base = "text-xs font-medium px-2 py-1 rounded-full border";
    if (status === "pending") return `${base} border-amber-200 bg-amber-50 text-amber-700`;
    if (status === "confirmed") return `${base} border-blue-200 bg-blue-50 text-blue-700`;
    if (status === "rejected") return `${base} border-red-200 bg-red-50 text-red-700`;
    if (status === "done") return `${base} border-green-200 bg-green-50 text-green-700`;
    if (status === "canceled") return `${base} border-gray-200 bg-gray-50 text-gray-600`;
    return `${base} border-gray-200 bg-gray-50 text-gray-600`;
  },

  filtered: () => {
    const { bookings, q, statusFilter } = get();
    const query = q.trim().toLowerCase();

    return bookings
      .slice()
      .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""))
      .filter((b) => {
        const text = `${b.customerName || ""} ${b.email || ""} ${b.phone || ""} ${b.note || ""} ${b.carBrand || ""}`.toLowerCase();
        const qOk = !query || text.includes(query);
        const sOk = statusFilter === "all" || b.status === statusFilter;
        return qOk && sOk;
      });
  },

  setStatus: (id, status, reason = "") => {
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === id
          ? {
              ...b,
              status,
              adminReason: reason || b.adminReason || "",
              reviewedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : b
      ),
    }));

    persist(get().bookings);
    get().showToast(`Cập nhật: ${STATUS_LABEL[status] || status}`);
  },

  rejectWithReason: (id) => {
    const reason = prompt("Nhập lý do từ chối (tuỳ chọn):") || "";
    get().setStatus(id, "rejected", reason.trim());
  },
}));
