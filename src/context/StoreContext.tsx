import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ShoeCategory, ColorVariant, CartItem, Order, OrderStatus, User, StoreSettings } from '../types';
import { defaultProducts, initialSettings } from '../data/defaultProducts';
import { isSupabaseConfigured, fetchProductsFromSupabase, fetchSettingsFromSupabase, saveOrderToSupabase, updateSettingsInSupabase } from '../lib/supabase';

interface StoreContextType {
  isSupabaseActive: boolean;
  theme: 'dark' | 'light';
  themeMode: 'auto' | 'manual';
  toggleTheme: () => void;
  resetToAutoTheme: () => void;
  products: Product[];
  addProduct: (productData: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  activeCategory: ShoeCategory | 'all';
  setActiveCategory: (cat: ShoeCategory | 'all') => void;
  activeTab: 'all' | 'bestseller' | 'new' | 'offers' | 'recommended';
  setActiveTab: (tab: 'all' | 'bestseller' | 'new' | 'offers' | 'recommended') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showWishlistOnly: boolean;
  setShowWishlistOnly: (val: boolean) => void;
  cart: CartItem[];
  addToCart: (product: Product, color: ColorVariant, size: number, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  orders: Order[];
  placeOrder: (orderData: {
    customerName: string;
    phone: string;
    city: string;
    address: string;
    notes?: string;
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  deleteOrder: (orderId: string) => void;
  user: User | null;
  users: User[];
  login: (email: string, pass: string) => { success: boolean; role?: 'admin' | 'customer'; error?: string };
  signup: (name: string, email: string, pass: string, phone?: string) => { success: boolean; error?: string };
  logout: () => void;
  isAdminView: boolean;
  setIsAdminView: (val: boolean) => void;
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  selectedProductForModal: Product | null;
  openProductModal: (prod: Product) => void;
  closeProductModal: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'signup';
  setAuthModalMode: (mode: 'login' | 'signup') => void;
  lastPlacedOrder: Order | null;
  setLastPlacedOrder: (order: Order | null) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Helper to determine day vs night automatically based on the current hour (6 AM - 6 PM is day)
const getTimeBasedTheme = (): 'dark' | 'light' => {
  const currentHour = new Date().getHours();
  return (currentHour >= 6 && currentHour < 18) ? 'light' : 'dark';
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state: automatic by time of day, with manual override capability
  const [themeMode, setThemeMode] = useState<'auto' | 'manual'>(() => {
    return (localStorage.getItem('bella_theme_mode') as 'auto' | 'manual') || 'auto';
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const savedMode = localStorage.getItem('bella_theme_mode');
    if (savedMode === 'manual') {
      const savedTheme = localStorage.getItem('bella_theme');
      if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    }
    return getTimeBasedTheme();
  });

  // Apply class to HTML root element and save
  useEffect(() => {
    localStorage.setItem('bella_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Periodic check: automatically flip if in auto mode when day turns into night
  useEffect(() => {
    const checkTimeTheme = () => {
      const mode = localStorage.getItem('bella_theme_mode') || 'auto';
      if (mode === 'auto') {
        const expectedTheme = getTimeBasedTheme();
        setTheme(expectedTheme);
      }
    };

    const interval = setInterval(checkTimeTheme, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => {
      const nextTheme = prev === 'dark' ? 'light' : 'dark';
      setThemeMode('manual');
      localStorage.setItem('bella_theme_mode', 'manual');
      localStorage.setItem('bella_theme', nextTheme);
      return nextTheme;
    });
  };

  const resetToAutoTheme = () => {
    setThemeMode('auto');
    localStorage.setItem('bella_theme_mode', 'auto');
    const autoTheme = getTimeBasedTheme();
    setTheme(autoTheme);
    localStorage.setItem('bella_theme', autoTheme);
  };

  // Settings
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('bella_settings');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return initialSettings;
  });

  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('bella_settings', JSON.stringify(updated));
      return updated;
    });
    if (isSupabaseConfigured()) {
      updateSettingsInSupabase(newSettings);
    }
  };

  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('bella_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return defaultProducts;
  });

  // Supabase sync on mount if configured
  useEffect(() => {
    if (isSupabaseConfigured()) {
      fetchProductsFromSupabase().then((remoteProducts) => {
        if (remoteProducts && remoteProducts.length > 0) {
          setProducts(remoteProducts);
          localStorage.setItem('bella_products', JSON.stringify(remoteProducts));
        }
      });
      fetchSettingsFromSupabase().then((remoteSettings) => {
        if (remoteSettings) {
          setSettings((prev) => {
            const merged = { ...prev, ...remoteSettings };
            localStorage.setItem('bella_settings', JSON.stringify(merged));
            return merged;
          });
        }
      });
    }
  }, []);

  const saveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem('bella_products', JSON.stringify(newProducts));
  };

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProd: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    saveProducts([newProd, ...products]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const updated = products.map(p => (p.id === id ? { ...p, ...updates } : p));
    saveProducts(updated);
  };

  const deleteProduct = (id: string) => {
    const filtered = products.filter(p => p.id !== id);
    saveProducts(filtered);
  };

  // Filtering & Navigation
  const [activeCategory, setActiveCategory] = useState<ShoeCategory | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'bestseller' | 'new' | 'offers' | 'recommended'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('bella_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('bella_cart', JSON.stringify(cart));
  }, [cart]);

  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product: Product, color: ColorVariant, size: number, quantity: number = 1) => {
    setCart(prev => {
      const itemKey = `${product.id}-${color.id}-${size}`;
      const existing = prev.find(item => item.id === itemKey);
      if (existing) {
        return prev.map(item =>
          item.id === itemKey ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: itemKey,
          product,
          selectedColor: color,
          selectedSize: size,
          quantity
        }
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(i => i.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev =>
      prev.map(i => (i.id === cartItemId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('bella_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const next = prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId];
      localStorage.setItem('bella_wishlist', JSON.stringify(next));
      return next;
    });
  };

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('bella_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const saveOrders = (newOrders: Order[]) => {
    setOrders(newOrders);
    localStorage.setItem('bella_orders', JSON.stringify(newOrders));
  };

  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  const placeOrder = (orderData: {
    customerName: string;
    phone: string;
    city: string;
    address: string;
    notes?: string;
  }): Order => {
    const isFreeShipping = cartCount >= settings.freeShippingPairThreshold;
    const shippingFee = isFreeShipping ? 0 : settings.deliveryFee;
    const total = cartTotal + shippingFee;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `BS-${Math.floor(10000 + Math.random() * 90000)}`,
      customerName: orderData.customerName,
      phone: orderData.phone,
      city: orderData.city,
      address: orderData.address,
      notes: orderData.notes,
      items: cart.map(c => ({
        productId: c.product.id,
        productName: c.product.name,
        colorName: c.selectedColor.name,
        colorHex: c.selectedColor.hex,
        size: c.selectedSize,
        price: c.product.price,
        quantity: c.quantity,
        image: c.selectedColor.image || c.product.colors[0]?.image || ''
      })),
      subtotal: cartTotal,
      shippingFee,
      total,
      status: 'pending',
      createdAt: new Date().toISOString(),
      paymentMethod: 'cod',
      customerEmail: user?.email
    };

    saveOrders([newOrder, ...orders]);
    
    // Save to Supabase in background if configured
    if (isSupabaseConfigured()) {
      saveOrderToSupabase(newOrder);
    }

    clearCart();
    setIsCartOpen(false);
    setLastPlacedOrder(newOrder);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    const updated = orders.map(o => (o.id === orderId ? { ...o, status } : o));
    saveOrders(updated);
  };

  const deleteOrder = (orderId: string) => {
    const filtered = orders.filter(o => o.id !== orderId);
    saveOrders(filtered);
  };

  // Authentication
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('bella_users');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('bella_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAdminView, setIsAdminView] = useState(false);

  const login = (email: string, pass: string): { success: boolean; role?: 'admin' | 'customer'; error?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    // Check if matching Admin credentials (primary: jarfouribrahim51@gmail.com or configured adminEmail)
    const isAdminMatch =
      (cleanEmail === settings.adminEmail.toLowerCase() ||
        cleanEmail === 'jarfouribrahim51@gmail.com' ||
        cleanEmail === 'mediaagencyfocus@gmail.com') &&
      cleanPass === settings.adminPasswordHash;

    if (isAdminMatch) {
      const adminUser: User = {
        id: 'admin-01',
        name: 'إبراهيم المسؤول',
        email: settings.adminEmail,
        role: 'admin',
        createdAt: new Date().toISOString()
      };
      setUser(adminUser);
      localStorage.setItem('bella_user', JSON.stringify(adminUser));
      setIsAdminView(true);
      return { success: true, role: 'admin' };
    }

    // Check customer login
    const found = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (found) {
      setUser(found);
      localStorage.setItem('bella_user', JSON.stringify(found));
      setIsAdminView(false);
      return { success: true, role: 'customer' };
    }

    // Direct password-less login for non-existent customer on clean form
    // Create new customer account seamlessly
    if (cleanEmail && cleanPass.length >= 4) {
      const newCustomer: User = {
        id: `usr-${Date.now()}`,
        name: cleanEmail.split('@')[0],
        email: cleanEmail,
        role: 'customer',
        createdAt: new Date().toISOString()
      };
      const newUsers = [...users, newCustomer];
      setUsers(newUsers);
      localStorage.setItem('bella_users', JSON.stringify(newUsers));
      setUser(newCustomer);
      localStorage.setItem('bella_user', JSON.stringify(newCustomer));
      setIsAdminView(false);
      return { success: true, role: 'customer' };
    }

    return { success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
  };

  const signup = (name: string, email: string, pass: string, phone?: string): { success: boolean; error?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    if (!name.trim() || !cleanEmail || !pass) {
      return { success: false, error: 'يرجى ملء جميع الحقول المطلوبة' };
    }

    // Prevent customer from taking admin email
    if (cleanEmail === settings.adminEmail.toLowerCase() || cleanEmail === 'jarfouribrahim51@gmail.com') {
      return { success: false, error: 'هذا البريد مخصص لإدارة المتجر، يرجى تسجيل الدخول مباشرة' };
    }

    const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, error: 'هذا البريد الإلكتروني مسجل بالفعل' };
    }

    const newCustomer: User = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      phone: phone?.trim(),
      role: 'customer',
      createdAt: new Date().toISOString()
    };

    const newUsers = [...users, newCustomer];
    setUsers(newUsers);
    localStorage.setItem('bella_users', JSON.stringify(newUsers));
    setUser(newCustomer);
    localStorage.setItem('bella_user', JSON.stringify(newCustomer));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bella_user');
    setIsAdminView(false);
  };

  // Modals
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const openProductModal = (prod: Product) => setSelectedProductForModal(prod);
  const closeProductModal = () => setSelectedProductForModal(null);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  return (
    <StoreContext.Provider
      value={{
        isSupabaseActive: isSupabaseConfigured(),
        theme,
        themeMode,
        toggleTheme,
        resetToAutoTheme,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        activeCategory,
        setActiveCategory,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        showWishlistOnly,
        setShowWishlistOnly,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        orders,
        placeOrder,
        updateOrderStatus,
        deleteOrder,
        user,
        users,
        login,
        signup,
        logout,
        isAdminView,
        setIsAdminView,
        settings,
        updateSettings,
        selectedProductForModal,
        openProductModal,
        closeProductModal,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        lastPlacedOrder,
        setLastPlacedOrder
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
};
