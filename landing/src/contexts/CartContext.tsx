'use client';

// ============================================================================
// CartContext — Global Shopping Cart State
// Built per react-crm-lifecycle:
// - State used by multiple components (Navbar, ProductList, Cart, Checkout) → Context
// - Mount → fetch once with [] deps + cleanup flag (active = false)
// - Immutable state updates (setItems(prev => [...prev, item]), filter, map)
// ============================================================================

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useUser } from '@/contexts/UserContext';

export interface CartItem {
  _id?: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  date?: string | Date;
  tag?: string;
  imageUrl?: string;
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  totalAmount: number;
  loading: boolean;
  error: string | null;
  addToCart: (product: { _id: string; name: string; price: number; date?: any; tag?: string; imageUrl?: string }, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => void;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);
const LOCAL_STORAGE_KEY = 'gt_shopping_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const userId = user ? (user as any)._id || (user as any).id || user.email : 'guest-user-default';

  // Mount → fetch once with cleanup flag per react-crm-lifecycle
  useEffect(() => {
    let active = true;
    setLoading(true);

    // First load from localStorage for instant UI response
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (active) setItems(parsed);
        } catch {}
      }
    }

    // Sync with MongoDB Cart API
    fetch(`/api/cart?user_id=${encodeURIComponent(userId)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch cart');
        return res.json();
      })
      .then((data) => {
        if (active && data.success && Array.isArray(data.items)) {
          setItems(data.items);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.items));
          setLoading(false);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [userId]);

  const saveLocal = (newItems: CartItem[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newItems));
    }
  };

  // Add to cart: POST /api/cart with immutable update
  const addToCart = async (
    product: { _id: string; name: string; price: number; date?: any; tag?: string; imageUrl?: string },
    quantity = 1
  ) => {
    setError(null);
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product._id,
          quantity,
          user_id: userId
        })
      });

      if (!res.ok) throw new Error('Failed to add item to cart');
      const json = await res.json();

      if (json.success && Array.isArray(json.items)) {
        setItems(json.items);
        saveLocal(json.items);
      } else {
        // Fallback optimistic immutable update
        setItems((prev) => {
          const exists = prev.findIndex((i) => i.productId === product._id);
          let next: CartItem[];
          if (exists > -1) {
            next = prev.map((item, idx) =>
              idx === exists ? { ...item, quantity: item.quantity + quantity } : item
            );
          } else {
            next = [
              ...prev,
              {
                productId: product._id,
                name: product.name,
                price: product.price,
                quantity,
                date: product.date,
                tag: product.tag,
                imageUrl: product.imageUrl
              }
            ];
          }
          saveLocal(next);
          return next;
        });
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // Update quantity: PUT /api/cart/[id] with immutable update
  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    setError(null);

    // Optimistic update
    setItems((prev) => {
      const next = prev.map((item) =>
        item._id === itemId || item.productId === itemId ? { ...item, quantity } : item
      );
      saveLocal(next);
      return next;
    });

    try {
      await fetch(`/api/cart/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity, user_id: userId })
      });
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Remove from cart: DELETE /api/cart/[id] with immutable filter
  const removeFromCart = async (itemId: string) => {
    setError(null);

    // Optimistic immutable filter
    setItems((prev) => {
      const next = prev.filter((item) => item._id !== itemId && item.productId !== itemId);
      saveLocal(next);
      return next;
    });

    try {
      await fetch(`/api/cart/${itemId}?user_id=${encodeURIComponent(userId)}`, {
        method: 'DELETE'
      });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const clearCart = () => {
    setItems([]);
    saveLocal([]);
  };

  const refreshCart = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/cart?user_id=${encodeURIComponent(userId)}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.items)) {
        setItems(json.items);
        saveLocal(json.items);
      }
    } finally {
      setLoading(false);
    }
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        totalAmount,
        loading,
        error,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
