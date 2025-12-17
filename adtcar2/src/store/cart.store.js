import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const getId = (p) => p?._id ?? p?.id;

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [], // [{ product, qty }]

      addToCart: (product, qty = 1) => {
        const id = getId(product);
        if (!id) return;

        set((state) => {
          const idx = state.items.findIndex((x) => getId(x.product) === id);
          if (idx === -1) {
            return { items: [...state.items, { product, qty }] };
          }
          const next = [...state.items];
          next[idx] = { ...next[idx], qty: next[idx].qty + qty };
          return { items: next };
        });
      },

      getItemQuantity: (productId) => {
        const found = get().items.find((x) => getId(x.product) === productId);
        return found?.qty ?? 0;
      },

      getTotalItems: () => get().items.reduce((sum, x) => sum + (x.qty || 0), 0),

      clear: () => set({ items: [] }),
    }),
    {
      name: "cart_v1",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
