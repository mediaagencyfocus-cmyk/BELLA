import { createClient } from '@supabase/supabase-js';
import { Product, StoreSettings, Order } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    !supabaseUrl.includes('your-project-id') &&
    !supabaseAnonKey.includes('your-anon-key')
  );
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ==============================================================================
// دوال المزامنة مع Supabase (Supabase Data Sync Services)
// ==============================================================================

/**
 * جلب جميع المنتجات مع ألوانها ونمرها من Supabase
 */
export async function fetchProductsFromSupabase(): Promise<Product[] | null> {
  if (!supabase || !isSupabaseConfigured()) return null;

  try {
    const { data: prods, error: prodErr } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (prodErr || !prods) {
      console.warn('تعذر جلب المنتجات من Supabase، استخدام البيانات المحلية:', prodErr);
      return null;
    }

    const { data: colors } = await supabase.from('product_colors').select('*');
    const { data: sizes } = await supabase.from('product_sizes').select('*');

    return prods.map((p) => {
      const prodColors = (colors || [])
        .filter((c) => c.product_id === p.id)
        .map((c) => ({
          id: c.id,
          name: c.name,
          hex: c.hex,
          image: c.image,
          inStock: c.in_stock
        }));

      const prodSizes = (sizes || [])
        .filter((s) => s.product_id === p.id)
        .map((s) => s.size)
        .sort((a, b) => a - b);

      return {
        id: p.id,
        name: p.name,
        category: p.category,
        price: Number(p.price),
        oldPrice: p.old_price ? Number(p.old_price) : undefined,
        rating: Number(p.rating || 5.0),
        reviewsCount: p.reviews_count || 0,
        isNew: p.is_new,
        isBestseller: p.is_bestseller,
        discount: p.discount,
        description: p.description,
        features: p.features || [],
        colors: prodColors.length > 0 ? prodColors : [
          {
            id: 'c-default',
            name: 'أسود',
            hex: '#0A0A0A',
            image: '/src/assets/images/bella_womens_heels_1794318693049.jpg',
            inStock: true
          }
        ],
        sizes: prodSizes.length > 0 ? prodSizes : [38, 39, 40, 41],
        inStock: p.in_stock,
        stockCount: p.stock_count || 0,
        wholesaleMinQty: p.wholesale_min_qty,
        createdAt: p.created_at
      };
    });
  } catch (err) {
    console.error('Error fetching from Supabase:', err);
    return null;
  }
}

/**
 * حفظ طلبية جديدة في Supabase
 */
export async function saveOrderToSupabase(order: Order): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;

  try {
    const { error: orderErr } = await supabase.from('orders').insert({
      id: order.id,
      order_number: order.orderNumber,
      customer_name: order.customerName,
      phone: order.phone,
      city: order.city,
      address: order.address,
      notes: order.notes,
      subtotal: order.subtotal,
      shipping_fee: order.shippingFee,
      total: order.total,
      status: order.status,
      payment_method: order.paymentMethod,
      customer_email: order.customerEmail
    });

    if (orderErr) {
      console.error('Failed to insert order to Supabase:', orderErr);
      return false;
    }

    const itemsToInsert = order.items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.productName,
      color_name: item.colorName,
      color_hex: item.colorHex,
      size: item.size,
      price: item.price,
      quantity: item.quantity,
      image: item.image
    }));

    const { error: itemsErr } = await supabase.from('order_items').insert(itemsToInsert);
    if (itemsErr) {
      console.error('Failed to insert order items to Supabase:', itemsErr);
    }

    return true;
  } catch (err) {
    console.error('Error saving order to Supabase:', err);
    return false;
  }
}

/**
 * جلب إعدادات المتجر من Supabase
 */
export async function fetchSettingsFromSupabase(): Promise<Partial<StoreSettings> | null> {
  if (!supabase || !isSupabaseConfigured()) return null;

  try {
    const { data, error } = await supabase
      .from('store_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error || !data) return null;

    return {
      storeName: data.store_name,
      tagline: data.tagline,
      phone: data.phone,
      whatsapp: data.whatsapp,
      email: data.email,
      address: data.address,
      city: data.city,
      deliveryFee: Number(data.delivery_fee),
      freeShippingPairThreshold: data.free_shipping_pair_threshold,
      adminEmail: data.admin_email,
      adminPasswordHash: data.admin_password_hash,
      instagramUrl: data.instagram_url,
      facebookUrl: data.facebook_url,
      tiktokUrl: data.tiktok_url,
      announcementText: data.announcement_text
    };
  } catch (err) {
    console.error('Error fetching settings from Supabase:', err);
    return null;
  }
}

export async function updateSettingsInSupabase(newSettings: Partial<StoreSettings>): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;

  try {
    const payload: Record<string, any> = {};
    if (newSettings.phone !== undefined) payload.phone = newSettings.phone;
    if (newSettings.whatsapp !== undefined) payload.whatsapp = newSettings.whatsapp;
    if (newSettings.email !== undefined) payload.email = newSettings.email;
    if (newSettings.address !== undefined) payload.address = newSettings.address;
    if (newSettings.deliveryFee !== undefined) payload.delivery_fee = newSettings.deliveryFee;
    if (newSettings.freeShippingPairThreshold !== undefined) payload.free_shipping_pair_threshold = newSettings.freeShippingPairThreshold;
    if (newSettings.instagramUrl !== undefined) payload.instagram_url = newSettings.instagramUrl;
    if (newSettings.facebookUrl !== undefined) payload.facebook_url = newSettings.facebookUrl;
    if (newSettings.tiktokUrl !== undefined) payload.tiktok_url = newSettings.tiktokUrl;
    if (newSettings.adminPasswordHash !== undefined) payload.admin_password_hash = newSettings.adminPasswordHash;

    const { error } = await supabase
      .from('store_settings')
      .update(payload)
      .eq('id', 1);

    return !error;
  } catch (err) {
    console.error('Error updating settings in Supabase:', err);
    return false;
  }
}
