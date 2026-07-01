import { useState, useMemo, useCallback } from 'react';

const TAX_RATE = 0.14; // 14% Tax

export function usePOSCart() {
  const [items, setItems] = useState([]);

  // Memoize total calculations to avoid unnecessary recalculations
  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  }, [items]);

  const tax = useMemo(() => {
    return subtotal * TAX_RATE;
  }, [subtotal]);

  const grandTotal = useMemo(() => {
    return subtotal + tax;
  }, [subtotal, tax]);

  const addToCart = useCallback((product) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, change) => {
    setItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.product.id === productId) {
          const newQuantity = item.quantity + change;
          // Prevent setting quantity below 1. If 0, it should be removed via removeFromCart instead.
          return { ...item, quantity: Math.max(1, newQuantity) };
        }
        return item;
      });
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  return {
    items,
    subtotal,
    tax,
    grandTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };
}
