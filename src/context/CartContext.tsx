import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Product, PRODUCTS } from '../data/products';
import { retailerUnitPrice } from '../../shared/retailer-pricing.js';

export interface CartItem {
  id: string; // `${productId}-${variantSize}`
  productId: string;
  name: string;
  categoryLabel: string;
  variantSize: string;
  price: number;            // unit price (regular for customers, retailer tier price for approved retailers)
  isRetailerPrice?: boolean; // true if `price` is a retailer-tier price
  quantity: number;
  image: string;
}

import { PageView, pathFor, routeFromPath } from '../routes';
export type { PageView } from '../routes';

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
  isAccountOpen: boolean;
  setIsAccountOpen: (open: boolean) => void;
  openAccount: () => void;
  /** Account mode: 'login' | 'register' | 'retailer-login' | null (null = closed) */
  accountMode: AccountMode;
  setAccountMode: (m: AccountMode) => void;
  user: any;
  /** True once the first /api/auth/me check has finished (logged in or not). */
  sessionLoaded: boolean;
  refreshSession: () => Promise<void>;
  /** Derived role helpers. */
  isApprovedRetailer: boolean;
  /** Retailer-specific catalog (with pricing tiers). Loaded for approved retailers only. */
  retailerCatalog: Product[] | null;
  refreshRetailerCatalog: () => Promise<void>;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  activePage: PageView;
  setActivePage: (page: PageView) => void;
  /** Like setActivePage, but replaces the current URL (for guards/redirects, so Back doesn't loop). */
  redirectTo: (page: PageView) => void;
  shopCategory: string;
  setShopCategory: (category: string) => void;
  openShopCategory: (category: string) => void;
  toast: ToastState;
  showToast: (title: string, message: string) => void;
}

export type AccountMode = 'login' | 'register' | 'retailer-login' | null;

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Production rule: every new visitor starts with an EMPTY cart (0 items).
  // Items only appear via user "Add to Cart" actions (in-memory state; resets on page reload).
  const [cart, setCart] = useState<CartItem[]>([]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  // The current page comes from the URL (e.g. /shop/tea), so links can be shared
  // and the browser Back/Forward buttons work.
  const initialRoute = routeFromPath(window.location.pathname);
  const [activePage, setActivePage] = useState<PageView>(initialRoute?.page ?? 'home');
  const [shopCategory, setShopCategory] = useState<string>(initialRoute?.shopCategory ?? 'all');

  // Unknown URL → show home and correct the address bar.
  useEffect(() => {
    if (!initialRoute) window.history.replaceState(null, '', '/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Page/category change → push a new URL (skipped when it already matches,
  // e.g. right after Back/Forward).
  const replaceNextUrl = useRef(false);
  const redirectTo = useCallback((page: PageView) => {
    replaceNextUrl.current = true;
    setActivePage(page);
  }, []);
  useEffect(() => {
    const path = pathFor(activePage, shopCategory);
    if (window.location.pathname !== path) {
      if (replaceNextUrl.current) window.history.replaceState(null, '', path);
      else window.history.pushState(null, '', path);
    }
    replaceNextUrl.current = false;
  }, [activePage, shopCategory]);

  // Back/Forward → update the page from the URL.
  useEffect(() => {
    const onPop = () => {
      const route = routeFromPath(window.location.pathname);
      setActivePage(route?.page ?? 'home');
      setShopCategory(route?.shopCategory ?? 'all');
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Opens the Shop with a category preselected (used by Home/Footer "Shop by category" links).
  const openShopCategory = (category: string) => {
    setShopCategory(category);
    setActivePage('shop-all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    title: '',
    message: '',
  });

  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [accountMode, setAccountMode] = useState<AccountMode>('login');
  const [user, setUser] = useState<any>(null);
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const [retailerCatalog, setRetailerCatalog] = useState<Product[] | null>(null);

  const isApprovedRetailer = useMemo(
    () => Boolean(user && user.role === 'RETAILER' && user.status === 'APPROVED'),
    [user]
  );

  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      const d = await res.json();
      setUser(d && d.ok ? d.user : null);
    } catch {
      setUser(null);
    } finally {
      setSessionLoaded(true);
    }
  }, []);

  // Load the retailer-only catalog (with pricing tiers) once an approved retailer logs in.
  const refreshRetailerCatalog = useCallback(async () => {
    if (!isApprovedRetailer) {
      setRetailerCatalog(null);
      return;
    }
    try {
      const res = await fetch('/api/retailer/catalog');
      const d = await res.json();
      if (res.ok && d?.ok) setRetailerCatalog(d.products || []);
      else setRetailerCatalog(null);
    } catch {
      setRetailerCatalog(null);
    }
  }, [isApprovedRetailer]);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  useEffect(() => {
    if (isApprovedRetailer) refreshRetailerCatalog();
    else setRetailerCatalog(null);
  }, [isApprovedRetailer, refreshRetailerCatalog]);

  const openAccount = () => {
    setAccountMode('login');
    setIsAccountOpen(true);
  };

  const showToast = (title: string, message: string) => {
    setToast({ visible: true, title, message });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3800);
  };

  // Unit price for a cart line. Approved retailers get the wholesale price for
  // that pack size + quantity (same shared logic the server charges with).
  const linePrice = (productId: string, variantSize: string, qty: number, fallback: number) => {
    const product =
      (retailerCatalog || []).find((p) => p.id === productId) || PRODUCTS.find((p) => p.id === productId);
    const variant = product?.variants.find((v) => v.size === variantSize);
    if (!product || !variant) return { price: fallback, isRetailerPrice: false };
    if (isApprovedRetailer) {
      const wholesale = retailerUnitPrice(product, variantSize, qty);
      if (wholesale !== null) return { price: wholesale, isRetailerPrice: true };
    }
    return { price: variant.price, isRetailerPrice: false };
  };

  const addToCart = (product: Product, variantSize: string, price: number, quantity = 1) => {
    const itemId = `${product.id}-${variantSize}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        const newQty = existing.quantity + quantity;
        return prev.map((item) =>
          item.id === itemId
            ? { ...item, quantity: newQty, ...linePrice(item.productId, item.variantSize, newQty, item.price) }
            : item
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
          isRetailerPrice: isApprovedRetailer,
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
      prev.map((item) =>
        item.id === itemId
          ? { ...item, quantity: newQuantity, ...linePrice(item.productId, item.variantSize, newQuantity, item.price) }
          : item
      )
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
        isAccountOpen,
        setIsAccountOpen,
        openAccount,
        accountMode,
        setAccountMode,
        user,
        sessionLoaded,
        refreshSession,
        isApprovedRetailer,
        retailerCatalog,
        refreshRetailerCatalog,
        quickViewProduct,
        setQuickViewProduct,
        activePage,
        setActivePage,
        redirectTo,
        shopCategory,
        setShopCategory,
        openShopCategory,
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
