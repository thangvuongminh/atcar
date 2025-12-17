import { create } from "zustand";

const BOOKINGS_KEY = "adtcar_booking_v2";
const POSTS_KEY = "adtcar_posts_v1";
const PRODUCTS_KEY = "products";
const ORDERS_KEY = "orders";

function safeParse(raw, fallback) {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function loadList(key) {
  return safeParse(localStorage.getItem(key), []);
}

export const useAdminDashboardStore = create((set, get) => ({
  tick: 0,
  reload: () => set((s) => ({ tick: s.tick + 1 })),
  bump: () => set((s) => ({ tick: s.tick + 1 })),

  keys: [BOOKINGS_KEY, POSTS_KEY, PRODUCTS_KEY, ORDERS_KEY],

  data: () => {
    const { tick } = get(); // just to depend
    void tick;

    const bookings = loadList(BOOKINGS_KEY);
    const posts = loadList(POSTS_KEY);
    const products = loadList(PRODUCTS_KEY);
    const orders = loadList(ORDERS_KEY);

    const pendingBooking = bookings.filter((b) => b.status === "pending").length;
    const confirmedBooking = bookings.filter((b) => b.status === "confirmed").length;
    const rejectedBooking = bookings.filter((b) => b.status === "rejected").length;

    const today = new Date().toISOString().slice(0, 10);
    const todayBookings = bookings
      .filter((b) => b.date === today && ["pending", "confirmed"].includes(b.status))
      .sort((a, b) => (a.timeSlot || "").localeCompare(b.timeSlot || ""));

    const latestBookings = bookings
      .slice()
      .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""))
      .slice(0, 5);

    const pendingPosts = posts.filter((p) => p.status === "pending").length;
    const latestPendingPosts = posts
      .filter((p) => p.status === "pending")
      .slice()
      .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""))
      .slice(0, 5);

    const orderCount = orders.length;
    const revenue = orders.reduce((sum, o) => sum + Number(o?.totalPrice || o?.total || 0), 0);

    return {
      bookings,
      posts,
      products,
      orders,
      pendingBooking,
      confirmedBooking,
      rejectedBooking,
      today,
      todayBookings,
      latestBookings,
      pendingPosts,
      latestPendingPosts,
      orderCount,
      revenue,
    };
  },
}));
