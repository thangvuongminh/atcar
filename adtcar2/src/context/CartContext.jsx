import React, { createContext, useContext, useMemo } from "react";
import { useCartStore } from "../store/cart.store";

const CartContext = createContext(undefined);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
};

const getId = (p) => p?._id ?? p?.id;

export const CartProvider = ({ children }) => {
  const items = useCartStore((s) => s.items);
  const addToCart = useCartStore((s) => s.addToCart);
  const getTotalItems = useCartStore((s) => s.getTotalItems);
  const getItemQuantity = useCartStore((s) => s.getItemQuantity);


  const removeFromCart = (productId) => {
    useCartStore.setState((state) => ({
      items: state.items.filter((x) => getId(x.product) !== productId),
    }));
  };

  const updateQuantity = (productId, quantity) => {
    const q = Number(quantity);
    if (!Number.isFinite(q) || q <= 0) return removeFromCart(productId);

    useCartStore.setState((state) => ({
      items: state.items.map((x) =>
        getId(x.product) === productId ? { ...x, qty: q } : x
      ),
    }));
  };

  const clearCart = () => useCartStore.setState({ items: [] });

  const getTotalPrice = () =>
    items.reduce((sum, x) => sum + (x.product?.price || 0) * (x.qty || 0), 0);

 
  const normalizedItems = useMemo(
    () =>
      items.map((x) => ({
        product: x.product,
        quantity: x.qty ?? 0,
      })),
    [items]
  );

  const value = useMemo(
    () => ({
      items: normalizedItems,
      addToCart: (product, quantity = 1) => addToCart(product, quantity),
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice,
      getItemQuantity,
    }),
    [normalizedItems, addToCart, getTotalItems, getItemQuantity]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
