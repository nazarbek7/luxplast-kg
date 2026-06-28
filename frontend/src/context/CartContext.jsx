import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext(null);
const WA_NUMBER = '996504502233';
const STORAGE_KEY = 'luxplast_cart';

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product._id === product._id);
      if (existing) {
        return prev.map((i) =>
          i.product._id === product._id ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [...prev, { product, qty }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((productId) => {
    setItems((prev) => prev.filter((i) => i.product._id !== productId));
  }, []);

  const updateQty = useCallback((productId, qty) => {
    if (qty < 1) return;
    setItems((prev) =>
      prev.map((i) => (i.product._id === productId ? { ...i, qty } : i))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((s, i) => s + i.qty, 0);
  const totalPrice = items.reduce(
    (s, i) => s + (i.product.price || 0) * i.qty,
    0
  );

  const sendToWhatsApp = useCallback(() => {
    if (!items.length) return;
    const lines = items.map(
      (i) =>
        `• ${i.product.name} — ${i.qty} шт${i.product.price ? ` (${(i.product.price * i.qty).toLocaleString()} сом)` : ''}`
    );
    const text = [
      'Здравствуйте! Хочу оформить заказ:',
      '',
      ...lines,
      '',
      totalPrice > 0 ? `💰 Итого: ${totalPrice.toLocaleString()} сом` : '',
      '',
      'Прошу связаться для подтверждения.',
    ]
      .filter((l) => l !== undefined)
      .join('\n');
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
  }, [items, totalPrice]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        totalItems,
        totalPrice,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        sendToWhatsApp,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
