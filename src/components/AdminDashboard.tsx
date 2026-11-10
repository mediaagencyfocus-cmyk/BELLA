import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Settings as SettingsIcon, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  ArrowLeft, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  ShieldAlert, 
  Phone, 
  Instagram, 
  Facebook, 
  Lock,
  Tag,
  AlertTriangle,
  Database,
  Key,
  Copy,
  ExternalLink,
  Check
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, ShoeCategory, ColorVariant, OrderStatus } from '../types';

export const AdminDashboard: React.FC = () => {
  const {
    isSupabaseActive,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    deleteOrder,
    users,
    settings,
    updateSettings,
    setIsAdminView,
    logout
  } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'customers' | 'settings' | 'database'>('overview');
  const [copiedSql, setCopiedSql] = useState(false);

  // Product Editing / Adding State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  // Form states for Product
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<ShoeCategory>('womens');
  const [formPrice, setFormPrice] = useState<number>(450);
  const [formOldPrice, setFormOldPrice] = useState<number | undefined>(550);
  const [formDescription, setFormDescription] = useState('');
  const [formStock, setFormStock] = useState<number>(20);
  const [formSizesInput, setFormSizesInput] = useState<string>('37, 38, 39, 40');
  const [formColors, setFormColors] = useState<ColorVariant[]>([
    {
      id: 'c-1',
      name: 'أسود ملكي',
      hex: '#0A0A0A',
      image: '/src/assets/images/bella_womens_heels_1794318693049.jpg',
      inStock: true
    }
  ]);
  const [formWholesaleQty, setFormWholesaleQty] = useState<number | undefined>(undefined);

  // Store Settings Form States
  const [settingsPhone, setSettingsPhone] = useState(settings.phone);
  const [settingsWhatsapp, setSettingsWhatsapp] = useState(settings.whatsapp);
  const [settingsEmail, setSettingsEmail] = useState(settings.email);
  const [settingsAddress, setSettingsAddress] = useState(settings.address);
  const [settingsDeliveryFee, setSettingsDeliveryFee] = useState(settings.deliveryFee);
  const [settingsFreeThreshold, setSettingsFreeThreshold] = useState(settings.freeShippingPairThreshold);
  const [settingsInstagram, setSettingsInstagram] = useState(settings.instagramUrl);
  const [settingsFacebook, setSettingsFacebook] = useState(settings.facebookUrl);
  const [settingsTiktok, setSettingsTiktok] = useState(settings.tiktokUrl);
  const [adminPass, setAdminPass] = useState(settings.adminPasswordHash);
  const [settingsSavedAlert, setSettingsSavedAlert] = useState(false);

  // Stats calculation
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const deliveredOrders = orders.filter(o => o.status === 'delivered');

  const startEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormCategory(prod.category);
    setFormPrice(prod.price);
    setFormOldPrice(prod.oldPrice);
    setFormDescription(prod.description);
    setFormStock(prod.stockCount);
    setFormSizesInput(prod.sizes.join(', '));
    setFormColors(prod.colors);
    setFormWholesaleQty(prod.wholesaleMinQty);
    setIsAddingProduct(false);
  };

  const startAddNewProduct = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory('womens');
    setFormPrice(450);
    setFormOldPrice(550);
    setFormDescription('حذاء فاخر مصنوع يدوياً من خامات راقية توفر راحة تامة طوال اليوم.');
    setFormStock(20);
    setFormSizesInput('37, 38, 39, 40');
    setFormColors([
      {
        id: `c-${Date.now()}`,
        name: 'أسود ملكي',
        hex: '#000000',
        image: '/src/assets/images/bella_womens_heels_1794318693049.jpg',
        inStock: true
      }
    ]);
    setFormWholesaleQty(undefined);
    setIsAddingProduct(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    // Parse sizes
    const parsedSizes = formSizesInput
      .split(',')
      .map(s => parseInt(s.trim(), 10))
      .filter(n => !isNaN(n) && n > 0);

    const productPayload = {
      name: formName.trim(),
      category: formCategory,
      price: Number(formPrice),
      oldPrice: formOldPrice ? Number(formOldPrice) : undefined,
      rating: 5.0,
      reviewsCount: 12,
      discount: formOldPrice && formOldPrice > formPrice ? `${Math.round(((formOldPrice - formPrice) / formOldPrice) * 100)}%-` : undefined,
      description: formDescription.trim(),
      features: [
        'مصنوع من خامات فاخرة عالية الجودة',
        'مريح ومناسب للاستخدام اليومي والمناسبات',
        'خدمة المعاينة والقياس عند التوصيل'
      ],
      colors: formColors,
      sizes: parsedSizes.length > 0 ? parsedSizes : [38, 39, 40, 41],
      inStock: formStock > 0,
      stockCount: Number(formStock),
      wholesaleMinQty: formCategory === 'wholesale' ? Number(formWholesaleQty || 1) : undefined
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productPayload);
      setEditingProduct(null);
    } else {
      addProduct(productPayload);
      setIsAddingProduct(false);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      phone: settingsPhone,
      whatsapp: settingsWhatsapp,
      email: settingsEmail,
      address: settingsAddress,
      deliveryFee: Number(settingsDeliveryFee),
      freeShippingPairThreshold: Number(settingsFreeThreshold),
      instagramUrl: settingsInstagram,
      facebookUrl: settingsFacebook,
      tiktokUrl: settingsTiktok,
      adminPasswordHash: adminPass
    });
    setSettingsSavedAlert(true);
    setTimeout(() => setSettingsSavedAlert(false), 3000);
  };

  const addColorVariant = () => {
    setFormColors([
      ...formColors,
      {
        id: `c-${Date.now()}`,
        name: 'لون جديد',
        hex: '#00C8FF',
        image: '/src/assets/images/bella_luxury_sneaker_1794318695413.jpg',
        inStock: true
      }
    ]);
  };

  const updateColorVariant = (idx: number, updates: Partial<ColorVariant>) => {
    const updated = [...formColors];
    updated[idx] = { ...updated[idx], ...updates };
    setFormColors(updated);
  };

  const removeColorVariant = (idx: number) => {
    if (formColors.length <= 1) return;
    setFormColors(formColors.filter((_, i) => i !== idx));
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0A0B0D] text-slate-900 dark:text-slate-100 py-6 sm:py-8 transition-colors text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header of Admin */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-black dark:bg-[#12141C] border border-[#00C8FF]/50 flex items-center justify-center text-[#00C8FF] font-black text-2xl shadow-[0_0_20px_rgba(0,255,102,0.3)]">
              B
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  لوحة تحكم الإدارة · BELLA SHOES
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#00C8FF] text-black">
                  ADMIN
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                إدارة كاملة للمنتجات، النمر والمقاسات، الألوان، الطلبات وإعدادات واتساب
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAdminView(false)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-[#161922] border border-slate-200 dark:border-slate-800 text-xs font-bold hover:border-[#00C8FF] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-[#00C8FF]" />
              <span>العودة إلى واجهة المتجر</span>
            </button>
            <button
              onClick={logout}
              className="px-3 py-2 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/30 text-xs font-bold hover:bg-rose-500 hover:text-white transition-colors"
            >
              خروج
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto py-4 border-b border-slate-200 dark:border-slate-800 mb-6 no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#00C8FF] text-black shadow-[0_0_12px_rgba(0,255,102,0.3)]'
                : 'bg-white dark:bg-[#12141C] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>نظرة عامة وإحصائيات</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'products'
                ? 'bg-[#00C8FF] text-black shadow-[0_0_12px_rgba(0,255,102,0.3)]'
                : 'bg-white dark:bg-[#12141C] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>إدارة الأحذية والمنتجات ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#00C8FF] text-black shadow-[0_0_12px_rgba(0,255,102,0.3)]'
                : 'bg-white dark:bg-[#12141C] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>الطلبيات الواردة ({orders.length})</span>
            {pendingOrders.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'customers'
                ? 'bg-[#00C8FF] text-black shadow-[0_0_12px_rgba(0,255,102,0.3)]'
                : 'bg-white dark:bg-[#12141C] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>قائمة الزبائن ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#00C8FF] text-black shadow-[0_0_12px_rgba(0,255,102,0.3)]'
                : 'bg-white dark:bg-[#12141C] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            <span>إعدادات المتجر وواتساب</span>
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'database'
                ? 'bg-[#00C8FF] text-black shadow-[0_0_12px_rgba(0,255,102,0.3)]'
                : 'bg-white dark:bg-[#12141C] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>قاعدة بيانات Supabase SQL</span>
            {isSupabaseActive ? (
              <span className="w-2 h-2 rounded-full bg-[#00C8FF]" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            )}
          </button>
        </div>

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-[#12141C] border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold">إجمالي المبيعات المؤكدة</span>
                  <TrendingUp className="w-4 h-4 text-[#00C8FF]" />
                </div>
                <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                  {totalRevenue} <span className="text-xs font-sans text-[#00C8FF]">MAD</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#12141C] border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold">إجمالي الطلبات</span>
                  <ShoppingBag className="w-4 h-4 text-sky-400" />
                </div>
                <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                  {orders.length}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#12141C] border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold">طلبات قيد المعالجة</span>
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-black font-mono text-amber-500">
                  {pendingOrders.length}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#12141C] border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold">الأحذية في المتجر</span>
                  <Package className="w-4 h-4 text-[#00C8FF]" />
                </div>
                <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                  {products.length}
                </div>
              </div>
            </div>

            {/* Recent Orders quick table */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#12141C] border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  أحدث الطلبيات الواردة
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-[#00C8FF] font-bold hover:underline"
                >
                  مشاهدة كافة الطلبات ({orders.length})
                </button>
              </div>

              {orders.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">
                  لا توجد طلبيات بعد، ستظهر هنا فور إرسال الزبائن طلباتهم عبر سلة المتجر.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-right">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 pb-2">
                        <th className="py-2">رقم الطلب</th>
                        <th>الزبون</th>
                        <th>الهاتف</th>
                        <th>المدينة</th>
                        <th>الأحذية</th>
                        <th>المجموع</th>
                        <th>الحالة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {orders.slice(0, 5).map((ord) => (
                        <tr key={ord.id} className="py-2.5">
                          <td className="py-2.5 font-mono font-bold text-[#00C8FF]">{ord.orderNumber}</td>
                          <td className="font-semibold text-slate-800 dark:text-slate-200">{ord.customerName}</td>
                          <td className="font-mono">{ord.phone}</td>
                          <td>{ord.city}</td>
                          <td>{ord.items.length} حذاء</td>
                          <td className="font-mono font-bold">{ord.total} MAD</td>
                          <td>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-500">
                              {ord.status === 'pending' ? 'قيد المراجعة' : ord.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. PRODUCTS TAB (CRUD) */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  إدارة تشكيلات الأحذية
                </h3>
                <p className="text-xs text-slate-500">
                  يمكنك إضافة، تعديل النمر، الألوان، الأسعار، وحذف أي منتج
                </p>
              </div>
              <button
                onClick={startAddNewProduct}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#00C8FF] text-black font-bold text-xs shadow-md hover:bg-[#00B4E6] transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة حذاء جديد</span>
              </button>
            </div>

            {/* Product Edit / Add Form (Modal or Expandable) */}
            {(isAddingProduct || editingProduct) && (
              <div className="p-6 rounded-3xl bg-white dark:bg-[#141720] border-2 border-[#00C8FF]/50 shadow-2xl">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
                  <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <Tag className="w-4 h-4 text-[#00C8FF]" />
                    <span>{editingProduct ? 'تعديل بيانات الحذاء' : 'إضافة حذاء جديد للمتجر'}</span>
                  </h4>
                  <button
                    onClick={() => {
                      setIsAddingProduct(false);
                      setEditingProduct(null);
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveProduct} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        اسم الحذاء <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="مثال: حذاء كعب عالي ملكي فاخر"
                        className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-100 dark:bg-[#1A1E29] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-[#00C8FF] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        القسم الرئيسي <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value as ShoeCategory)}
                        className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-100 dark:bg-[#1A1E29] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-[#00C8FF] focus:outline-none"
                      >
                        <option value="womens">الأحذية النسائية</option>
                        <option value="mens">الأحذية الرجالية</option>
                        <option value="kids">أحذية الأطفال</option>
                        <option value="wholesale">البيع بالجملة</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        السعر بالدرهم (MAD) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        required
                        value={formPrice}
                        onChange={(e) => setFormPrice(Number(e.target.value))}
                        className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-100 dark:bg-[#1A1E29] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-[#00C8FF] focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        السعر القديم قبل الخصم (اختياري)
                      </label>
                      <input
                        type="number"
                        value={formOldPrice || ''}
                        onChange={(e) => setFormOldPrice(e.target.value ? Number(e.target.value) : undefined)}
                        placeholder="مثال: 599"
                        className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-100 dark:bg-[#1A1E29] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-[#00C8FF] focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        الكمية في المخزون
                      </label>
                      <input
                        type="number"
                        value={formStock}
                        onChange={(e) => setFormStock(Number(e.target.value))}
                        className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-100 dark:bg-[#1A1E29] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-[#00C8FF] focus:outline-none font-mono"
                      />
                    </div>

                    {/* SIZES MANAGEMENT (إدارة النمر) */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        النمر والمقاسات المتوفرة (مفصولة بفاصلة) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formSizesInput}
                        onChange={(e) => setFormSizesInput(e.target.value)}
                        placeholder="مثال: 37, 38, 39, 40, 41"
                        className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-100 dark:bg-[#1A1E29] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-[#00C8FF] focus:outline-none font-mono"
                      />
                      <span className="text-[10px] text-slate-400 mt-0.5 block">
                        يمكنك إضافة أو حذف أي مقاس للمنتج بكل حرية بدون مقاسات افتراضية.
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      وصف الحذاء وتفاصيل الجلود
                    </label>
                    <textarea
                      rows={3}
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-100 dark:bg-[#1A1E29] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-[#00C8FF] focus:outline-none"
                    />
                  </div>

                  {/* COLORS & IMAGES MANAGEMENT (إدارة الألوان والصور) */}
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        الألوان المتوفرة والصور المرتبطة بكل لون:
                      </label>
                      <button
                        type="button"
                        onClick={addColorVariant}
                        className="text-xs text-[#00C8FF] font-bold hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>إضافة لون آخر</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {formColors.map((color, idx) => (
                        <div
                          key={color.id || idx}
                          className="p-3 rounded-2xl bg-slate-50 dark:bg-[#1A1E29] border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                        >
                          <div className="sm:col-span-3">
                            <label className="text-[10px] text-slate-400 block mb-0.5">اسم اللون</label>
                            <input
                              type="text"
                              value={color.name}
                              onChange={(e) => updateColorVariant(idx, { name: e.target.value })}
                              placeholder="مثال: أسود ملكي"
                              className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-white dark:bg-black/50 border border-slate-200 dark:border-slate-700"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="text-[10px] text-slate-400 block mb-0.5">كود اللون</label>
                            <div className="flex items-center gap-1.5">
                              <input
                                type="color"
                                value={color.hex}
                                onChange={(e) => updateColorVariant(idx, { hex: e.target.value })}
                                className="w-7 h-7 rounded-md cursor-pointer border border-slate-300 dark:border-slate-700 bg-transparent"
                              />
                              <input
                                type="text"
                                value={color.hex}
                                onChange={(e) => updateColorVariant(idx, { hex: e.target.value })}
                                className="w-full px-2 py-1 rounded-lg text-xs font-mono bg-white dark:bg-black/50 border border-slate-200 dark:border-slate-700"
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-6">
                            <label className="text-[10px] text-slate-400 block mb-0.5">رابط صورة هذا اللون</label>
                            <input
                              type="text"
                              value={color.image}
                              onChange={(e) => updateColorVariant(idx, { image: e.target.value })}
                              placeholder="/src/assets/images/... أو رابط"
                              className="w-full px-2.5 py-1.5 rounded-lg text-xs font-mono bg-white dark:bg-black/50 border border-slate-200 dark:border-slate-700"
                            />
                          </div>

                          <div className="sm:col-span-1 text-center">
                            <button
                              type="button"
                              onClick={() => removeColorVariant(idx)}
                              disabled={formColors.length <= 1}
                              className="p-1.5 text-slate-400 hover:text-rose-500 disabled:opacity-30"
                              title="حذف هذا اللون"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-[#00C8FF] text-black font-extrabold text-xs shadow-md hover:bg-[#00B4E6] transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingProduct ? 'حفظ التعديلات' : 'إضافة الحذاء للمتجر'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingProduct(false);
                        setEditingProduct(null);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold"
                    >
                      إلغاء
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Products Table */}
            <div className="rounded-2xl bg-white dark:bg-[#12141C] border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-right">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-[#161922] border-b border-slate-200 dark:border-slate-800 text-slate-400">
                      <th className="py-3 px-4">الصورة</th>
                      <th className="px-4">اسم الحذاء</th>
                      <th className="px-4">القسم</th>
                      <th className="px-4">السعر</th>
                      <th className="px-4">النمر المتوفرة</th>
                      <th className="px-4">الألوان</th>
                      <th className="px-4">المخزون</th>
                      <th className="px-4 text-center">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {products.map((prod) => (
                      <tr key={prod.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="py-2.5 px-4">
                          <img
                            src={prod.colors[0]?.image}
                            alt={prod.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-800"
                          />
                        </td>
                        <td className="px-4 font-bold text-slate-900 dark:text-white max-w-[200px] truncate">
                          {prod.name}
                        </td>
                        <td className="px-4 text-slate-500">
                          {prod.category === 'womens' && 'نسائي'}
                          {prod.category === 'mens' && 'رجالي'}
                          {prod.category === 'kids' && 'أطفال'}
                          {prod.category === 'wholesale' && 'جملة'}
                        </td>
                        <td className="px-4 font-mono font-bold text-[#00C8FF]">
                          {prod.price} MAD
                        </td>
                        <td className="px-4 font-mono">
                          {prod.sizes.join(', ')}
                        </td>
                        <td className="px-4">
                          <div className="flex items-center gap-1">
                            {prod.colors.map((c) => (
                              <span
                                key={c.id}
                                className="w-3.5 h-3.5 rounded-full border border-black/20"
                                style={{ backgroundColor: c.hex }}
                                title={c.name}
                              />
                            ))}
                          </div>
                        </td>
                        <td className="px-4 font-mono">
                          {prod.stockCount} زوج
                        </td>
                        <td className="px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => startEditProduct(prod)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-[#00C8FF] hover:bg-slate-100 dark:hover:bg-slate-800"
                              title="تعديل الحذاء"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setProductToDelete(prod)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                              title="حذف الحذاء"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              إدارة طلبيات الزبائن وتأكيد الشحن
            </h3>

            {orders.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#12141C] border border-slate-200 dark:border-slate-800">
                <ShoppingBag className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  لا توجد طلبات واردة في الوقت الحالي
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-5 rounded-2xl bg-white dark:bg-[#12141C] border border-slate-200 dark:border-slate-800 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#00C8FF] text-sm">
                            {ord.orderNumber}
                          </span>
                          <span className="text-xs text-slate-400">
                            {new Date(ord.createdAt).toLocaleDateString('ar-MA')}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                          الزبون: {ord.customerName} · هاتف: {ord.phone}
                        </h4>
                        <p className="text-xs text-slate-500">
                          العنوان: {ord.city}، {ord.address} {ord.notes && `(${ord.notes})`}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={ord.status}
                          onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-[#1A1E29] border border-slate-200 dark:border-slate-700 focus:outline-none"
                        >
                          <option value="pending">قيد المراجعة</option>
                          <option value="processing">جاري التجهيز</option>
                          <option value="shipped">تم الشحن للتوصيل</option>
                          <option value="delivered">تم التوصيل بنجاح</option>
                          <option value="cancelled">ملغى</option>
                        </select>

                        <button
                          onClick={() => setOrderToDelete(ord.id)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                          title="حذف الطلب"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Order items */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {ord.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#161922] border border-slate-200 dark:border-slate-800 flex items-center gap-2.5"
                        >
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-xs truncate text-slate-800 dark:text-slate-200">
                              {item.productName}
                            </p>
                            <p className="text-[11px] text-slate-400 font-mono">
                              نمرة {item.size} · {item.colorName} · الكمية: {item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2">
                      <span className="text-slate-500">
                        طريقة الدفع: الدفع عند الاستلام بعد المعاينة والقياس
                      </span>
                      <span className="font-mono font-bold text-sm text-[#00C8FF]">
                        المجموع: {ord.total} MAD
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4. CUSTOMERS TAB */}
        {activeTab === 'customers' && (
          <div className="space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              قائمة الزبائن المسجلين
            </h3>

            {users.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#12141C] border border-slate-200 dark:border-slate-800 text-xs text-slate-400">
                لا يوجد زبائن مسجلين حالياً.
              </div>
            ) : (
              <div className="rounded-2xl bg-white dark:bg-[#12141C] border border-slate-200 dark:border-slate-800 overflow-hidden">
                <table className="w-full text-xs text-right">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-[#161922] border-b border-slate-200 dark:border-slate-800 text-slate-400">
                      <th className="py-3 px-4">اسم الزبون</th>
                      <th className="px-4">البريد الإلكتروني</th>
                      <th className="px-4">الهاتف</th>
                      <th className="px-4">تاريخ التسجيل</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{u.name}</td>
                        <td className="px-4 font-mono">{u.email}</td>
                        <td className="px-4 font-mono">{u.phone || 'غير محدد'}</td>
                        <td className="px-4 text-slate-400">
                          {new Date(u.createdAt).toLocaleDateString('ar-MA')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 5. SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl space-y-6">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              إعدادات المتجر، أرقام التواصل وروابط المنصات
            </h3>

            {settingsSavedAlert && (
              <div className="p-3 rounded-xl bg-[#00C8FF]/15 border border-[#00C8FF]/40 text-[#00C8FF] text-xs font-bold flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>تم حفظ وتحديث إعدادات المتجر بنجاح!</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="p-6 rounded-2xl bg-white dark:bg-[#12141C] border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    رقم واتساب الإدارة (الزر العائم) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={settingsWhatsapp}
                      onChange={(e) => setSettingsWhatsapp(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-100 dark:bg-[#181B24] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    يتم ربط زر واتساب العائم بهذا الرقم مباشرة.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    رقم هاتف الاتصال المباشر
                  </label>
                  <input
                    type="text"
                    value={settingsPhone}
                    onChange={(e) => setSettingsPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-100 dark:bg-[#181B24] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    البريد الإلكتروني الرسمي
                  </label>
                  <input
                    type="email"
                    value={settingsEmail}
                    onChange={(e) => setSettingsEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-100 dark:bg-[#181B24] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    مقر المتجر / العنوان في المغرب
                  </label>
                  <input
                    type="text"
                    value={settingsAddress}
                    onChange={(e) => setSettingsAddress(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-100 dark:bg-[#181B24] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    مصاريف التوصيل العادية (درهم)
                  </label>
                  <input
                    type="number"
                    value={settingsDeliveryFee}
                    onChange={(e) => setSettingsDeliveryFee(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-100 dark:bg-[#181B24] border border-slate-200 dark:border-slate-700 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    حد الأحذية للتوصيل المجاني
                  </label>
                  <input
                    type="number"
                    value={settingsFreeThreshold}
                    onChange={(e) => setSettingsFreeThreshold(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-100 dark:bg-[#181B24] border border-slate-200 dark:border-slate-700 font-mono"
                  />
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  روابط شبكات التواصل الاجتماعي
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Instagram</label>
                    <div className="relative">
                      <input
                        type="url"
                        value={settingsInstagram}
                        onChange={(e) => setSettingsInstagram(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-black/50 border border-slate-200 dark:border-slate-700 font-mono"
                      />
                      <Instagram className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Facebook</label>
                    <div className="relative">
                      <input
                        type="url"
                        value={settingsFacebook}
                        onChange={(e) => setSettingsFacebook(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-black/50 border border-slate-200 dark:border-slate-700 font-mono"
                      />
                      <Facebook className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">TikTok</label>
                    <input
                      type="url"
                      value={settingsTiktok}
                      onChange={(e) => setSettingsTiktok(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-black/50 border border-slate-200 dark:border-slate-700 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Admin Security */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                  تغيير كلمة مرور المسؤول ADMIN
                </label>
                <div className="max-w-xs relative">
                  <input
                    type="text"
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-100 dark:bg-black/50 border border-slate-200 dark:border-slate-700 font-mono"
                  />
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#00C8FF] text-black font-extrabold text-xs shadow-md hover:bg-[#00B4E6] transition-all cursor-pointer"
                >
                  حفظ كافة الإعدادات
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 6. DATABASE (SUPABASE) TAB */}
        {activeTab === 'database' && (
          <div className="max-w-4xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-[#00C8FF]" />
                  <span>إعدادات قاعدة بيانات Supabase SQL الاحترافية</span>
                </h3>
                <p className="text-xs text-slate-500">
                  قاعدة بيانات سحابية متوافقة 100% مع بنية المتجر، الأحذية، النمر، الألوان، والطلبيات
                </p>
              </div>

              {/* Status Badge */}
              <div className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-2 ${
                isSupabaseActive
                  ? 'bg-[#00C8FF]/15 border-[#00C8FF]/40 text-[#00C8FF]'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-500'
              }`}>
                <span className={`w-2.5 h-2.5 rounded-full ${isSupabaseActive ? 'bg-[#00C8FF] animate-pulse' : 'bg-amber-400'}`} />
                <span>{isSupabaseActive ? 'قاعدة بيانات Supabase: متصلة بنجاح ✅' : 'وضع التخزين السريع (في انتظار المفاتيح)'}</span>
              </div>
            </div>

            {/* Keys Guide Box (المفاتيح المطلوبة من Supabase) */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#12141C] border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <Key className="w-5 h-5 text-[#00C8FF]" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  المفتاحان المطلوب نسخهما من حسابك على Supabase:
                </h4>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                بعد إنشاء مشروعك المجاني على <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-[#00C8FF] font-bold underline">Supabase</a>، توجه إلى:
                <strong className="text-slate-900 dark:text-white"> Project Settings ➔ API </strong> وانسخ المتغيرين التاليين:
              </p>

              <div className="space-y-3 font-mono text-xs">
                {/* 1. Project URL */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#181B24] border border-slate-200 dark:border-slate-700/80">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-700 dark:text-slate-200">1. Project URL (رابط المشروع)</span>
                    <span className="text-[10px] text-slate-400 font-sans">اسم المتغير في .env: VITE_SUPABASE_URL</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-black/60 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 truncate">
                    https://[your-project-id].supabase.co
                  </div>
                </div>

                {/* 2. Anon Key */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#181B24] border border-slate-200 dark:border-slate-700/80">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-700 dark:text-slate-200">2. Project API Keys (anon public)</span>
                    <span className="text-[10px] text-slate-400 font-sans">اسم المتغير في .env: VITE_SUPABASE_ANON_KEY</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-black/60 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 truncate">
                    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS...
                  </div>
                </div>
              </div>
            </div>

            {/* Steps & SQL Schema execution */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#12141C] border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#00C8FF]" />
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    خطوات إنشاء الجداول وتشغيل سكربت SQL في Supabase:
                  </h4>
                </div>

                <a
                  href="/supabase/schema.sql"
                  target="_blank"
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold hover:text-[#00C8FF] flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>فتح ملف schema.sql</span>
                </a>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#00C8FF]/20 text-[#00C8FF] flex items-center justify-center font-bold shrink-0 mt-0.5">1</span>
                  <span>ادخل إلى لوحة تحكم مشروعك في Supabase، ثم اضغط على قائمة <strong>SQL Editor</strong> في الشريط الجانبي.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#00C8FF]/20 text-[#00C8FF] flex items-center justify-center font-bold shrink-0 mt-0.5">2</span>
                  <span>اضغط على <strong>+ New Query</strong> لفتح نافذة استعلام جديدة.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#00C8FF]/20 text-[#00C8FF] flex items-center justify-center font-bold shrink-0 mt-0.5">3</span>
                  <span>انسخ كود SQL الكامل الموجود في الأسفل، والصقه داخل الـ SQL Editor ثم اضغط زر <strong>Run</strong> الأخضر.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#00C8FF]/20 text-[#00C8FF] flex items-center justify-center font-bold shrink-0 mt-0.5">4</span>
                  <span>سيتم فوراً بناء جميع الجداول (المنتجات، الألوان، النمر، الطلبيات، الإعدادات) مع تعبئة البيانات الأولية وحماية RLS.</span>
                </div>
              </div>

              {/* SQL Preview Box with Copy Button */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    معاينة سكربت SQL الكامل (PostgreSQL for Supabase):
                  </span>
                  <button
                    onClick={() => {
                      fetch('/supabase/schema.sql')
                        .then(r => r.text())
                        .then(txt => {
                          navigator.clipboard.writeText(txt);
                          setCopiedSql(true);
                          setTimeout(() => setCopiedSql(false), 2500);
                        });
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-[#00C8FF] text-black font-extrabold text-xs flex items-center gap-1.5 shadow-xs hover:bg-[#00B4E6] transition-all cursor-pointer"
                  >
                    {copiedSql ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>تم نسخ الكود بنجاح!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>نسخ كود SQL بالكامل</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-black text-slate-300 font-mono text-[11px] max-h-56 overflow-y-auto border border-slate-800" dir="ltr">
                  <pre className="whitespace-pre-wrap">{`-- BELLA SHOES Supabase Schema
CREATE TABLE products (
    id TEXT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('womens', 'mens', 'kids', 'wholesale')),
    price NUMERIC(10, 2) NOT NULL,
    old_price NUMERIC(10, 2),
    rating NUMERIC(3, 2) DEFAULT 5.0,
    reviews_count INTEGER DEFAULT 0,
    is_new BOOLEAN DEFAULT FALSE,
    is_bestseller BOOLEAN DEFAULT FALSE,
    discount VARCHAR(20),
    description TEXT NOT NULL,
    features TEXT[] DEFAULT ARRAY[]::TEXT[],
    in_stock BOOLEAN DEFAULT TRUE,
    stock_count INTEGER DEFAULT 0,
    wholesale_min_qty INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE product_colors (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    hex VARCHAR(20) NOT NULL,
    image TEXT NOT NULL,
    in_stock BOOLEAN DEFAULT TRUE
);

CREATE TABLE product_sizes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    size INTEGER NOT NULL,
    in_stock BOOLEAN DEFAULT TRUE,
    UNIQUE(product_id, size)
);

CREATE TABLE store_settings ( ... );
CREATE TABLE orders ( ... );
CREATE TABLE order_items ( ... );
-- + Row Level Security (RLS) + Initial Seed Data`}</pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom Confirmation Modal for Deleting Product */}
      {productToDelete && (
        <div className="fixed inset-0 z-70 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#12141C] border border-slate-200 dark:border-slate-800 p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-slate-900 dark:text-white mb-1">
              تأكيد حذف الحذاء
            </h4>
            <p className="text-xs text-slate-500 mb-6">
              هل أنت متأكد من حذف الحذاء "{productToDelete.name}" نهائياً من قاعدة البيانات والمتجر؟
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  deleteProduct(productToDelete.id);
                  setProductToDelete(null);
                }}
                className="py-2.5 rounded-xl bg-rose-500 text-white font-bold text-xs hover:bg-rose-600 transition-colors"
              >
                نعم، احذف نهائياً
              </button>
              <button
                onClick={() => setProductToDelete(null)}
                className="py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Confirmation Modal for Deleting Order */}
      {orderToDelete && (
        <div className="fixed inset-0 z-70 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#12141C] border border-slate-200 dark:border-slate-800 p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-slate-900 dark:text-white mb-1">
              تأكيد حذف الطلبية
            </h4>
            <p className="text-xs text-slate-500 mb-6">
              هل أنت متأكد من حذف هذه الطلبية نهائياً من سجلات المتجر؟
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  deleteOrder(orderToDelete);
                  setOrderToDelete(null);
                }}
                className="py-2.5 rounded-xl bg-rose-500 text-white font-bold text-xs hover:bg-rose-600 transition-colors"
              >
                تأكيد الحذف
              </button>
              <button
                onClick={() => setOrderToDelete(null)}
                className="py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
