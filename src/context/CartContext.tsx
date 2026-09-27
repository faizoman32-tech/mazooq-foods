import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../data/products';

export interface CartItem {
  id: string; // `${productId}-${variantSize}`
  productId: string;
  name: string;
  categoryLabel: string;
  variantSize: string;
  price: number;
  quantity: number;
  image: string;
}

export type PageView =
  | 'home'
  | 'our-story'
  | 'shop-all'
  | 'mazooq-tea'
  | 'mazooq-dates'
  | 'retailer-portal'
  | 'global-vision'
  | 'contact';

interface ToastState {
  visible: boolean;
  title: string;
  message: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, variantSize: string, price: number, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, newQuantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  activePage: PageView;
  setActivePage: (page: PageView) => void;
  toast: ToastState;
  showToast: (title: string, message: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initial demo cart items as shown in mockup ("Royal Imperial Assam CTC" and "Premium Dates")
  const [cart, setCart] = useState<CartItem[]>(() => {
    return [
      {
        id: 'mazooq-premium-gold-tea-500g',
        productId: 'mazooq-premium-gold-tea',
        name: 'Mazooq Premium Gold Assam Tea',
        categoryLabel: 'Assam Black Tea',
        variantSize: '500g Heritage Pouch',
        price: 379,
        quantity: 1,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBugD0a5HZU0ju_QMqO8ICEGZ7HNyzz3QDpOD68BFLVhcyZkCc6S9FspUeXz4GFJh4aKjDSjQUzIr9f1WfPrn60jo1tpee9KjVQtKSe7DSq4gnp0eESkdBTs3NEkwqCigEyVvTvEy2CqDdMsEChkMTCNa3JWqgH42TqOVqCrfWe1ukxi-Ju0XJHR2EyQLzg1d-qHwxkFmuqQBQqgRpzvva8p4D5MlJ-MVlK9hfxb8u7Sa8NVLwbLpO_JSmqZiF7agNV6qA',
      },
      {
        id: 'mazooq-medjool-dates-500g',
        productId: 'mazooq-medjool-dates',
        name: 'Mazooq Royal Medjool Dates',
        categoryLabel: 'Desert Harvest',
        variantSize: '500g Vault Cask',
        price: 649,
        quantity: 1,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpVBWCsAdw7Ijvu4BNHSjggsOu4iVxR8Tx3H6rw3au2bF2SpvALnz5F08f-DJSaeJHkMCW2tWIqe4nmolVqN_tQszOKpu6DbGBxrTASqJdzUxY4YBYqtw_Nm7hw7GxYM95Nxc1aXkHRb3KtvlG_KfcLtXftH8fLtHBqC_suwXOf4AQtlFRJCyx6z8IpAVqxnf1Vk5dGGnZL6STr8JrHwD7NcTc1ewnN-d1_voKHWzNOo7dR2SSH4dL4Q',
      },
    ];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [activePage, setActivePage] = useState<PageView>('home');
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    title: '',
    message: '',
  });

  const showToast = (title: string, message: string) => {
    setToast({ visible: true, title, message });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3800);
  };

  const addToCart = (product: Product, variantSize: string, price: number, quantity = 1) => {
    const itemId = `${product.id}-${variantSize}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          productId: product.id,
          name: product.name,
          categoryLabel: product.categoryLabel,
          variantSize,
          price,
          quantity,
          image: product.image,
        },
      ];
    });
    showToast('Added to Cart', `${product.name} (${variantSize}) • ₹${price}`);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
    showToast('Item Removed', 'Updated your bespoke selection.');
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Scroll to top when activePage changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        quickViewProduct,
        setQuickViewProduct,
        activePage,
        setActivePage,
        toast,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
