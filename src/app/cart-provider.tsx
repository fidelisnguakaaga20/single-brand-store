"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CartItem = {
  id: string;
  productId: number;
  variantId?: number | null;
  name: string;
  slug: string;
  price: number;
  currency: string;
  quantity: number;
  maxQuantity?: number;
  size?: string | null;
  color?: string | null;
};

type CartContextValue = {
  items: CartItem[];
  totalQuantity: number;
  totalAmount: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "single-brand-store/cart";

function loadInitialCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on first mount
  useEffect(() => {
    setItems(loadInitialCart());
  }, []);

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    function addItem(newItem: CartItem) {
      setItems((prev) => {
        const existingIndex = prev.findIndex((i) => i.id === newItem.id);

        if (existingIndex === -1) {
          const quantity =
            newItem.maxQuantity != null
              ? Math.min(newItem.quantity, newItem.maxQuantity)
              : newItem.quantity;
          return [...prev, { ...newItem, quantity }];
        }

        const updated = [...prev];
        const existing = updated[existingIndex];

        let nextQuantity = existing.quantity + newItem.quantity;
        if (newItem.maxQuantity != null) {
          nextQuantity = Math.min(nextQuantity, newItem.maxQuantity);
        }

        updated[existingIndex] = { ...existing, quantity: nextQuantity };
        return updated;
      });
    }

    function removeItem(id: string) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }

    function updateQuantity(id: string, quantity: number) {
      setItems((prev) =>
        prev.map((item) => {
          if (item.id !== id) return item;

          let next = quantity;
          if (next < 1) next = 1;
          if (item.maxQuantity != null) {
            next = Math.min(next, item.maxQuantity);
          }
          return { ...item, quantity: next };
        })
      );
    }

    function clearCart() {
      setItems([]);
    }

    return {
      items,
      totalQuantity,
      totalAmount,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return ctx;
}
