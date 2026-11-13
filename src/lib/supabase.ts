import { createClient } from '@supabase/supabase-js';
import { Product, StoreSettings, Order, OrderStatus, User } from '../types';
import { normalizeWhatsAppNumber } from '../utils/phone';

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
// دوال المزامنة الكاملة مع PostgreSQL / Supabase (CRUD Sync)
// ==============================================================================

export async function fetchProductsFromSupabase(): Promise<Product[] | null> {
  if (!supabase || !isSupabaseConfigured()) return null;

  try {
    const { data: prods, error: prodErr } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (prodErr || !prods) return null;

    const [{ data: colors }, { data: sizes }, { data: images }] = await Promise.all([
      supabase.from('product_colors').select('*'),
      supabase.from('product_sizes').select('*'),
      supabase.from('product_images').select('*').order('sort_order', { ascending: true }),
    ]);

    return prods.map((p) => {
      const prodColors = (colors || [])
        .filter((c) => c.product_id === p.id)
        .map((c) => ({
          id: c.id,
          name: c.name,
          hex: c.hex,
          image: c.image,
          inStock: c.in_stock,
        }));

      const prodSizes = (sizes || [])
        .filter((s) => s.product_id === p.id)
        .map((s) => s.size)
        .sort((a, b) => a - b);

      const prodImages = (images || [])
        .filter((img) => img.product_id === p.id)
        .map((img) => img.image_url as string);

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
        images: prodImages,
        colors:
          prodColors.length > 0
            ? prodColors
            : [
                {
                  id: 'c-default',
                  name: 'أسود',
                  hex: '#0A0A0A',
                  image: '/src/assets/images/bella_womens_heels_1794318693049.jpg',
                  inStock: true,
                },
              ],
        sizes: prodSizes.length > 0 ? prodSizes : [38, 39, 40, 41],
        inStock: p.in_stock,
        stockCount: p.stock_count || 0,
        wholesaleMinQty: p.wholesale_min_qty,
        createdAt: p.created_at,
      };
    });
  } catch (err) {
    console.error('Error fetching products from Supabase:', err);
    return null;
  }
}

export async function createProductInSupabase(product: Product): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;

  try {
    const { error } = await supabase.from('products').insert({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      old_price: product.oldPrice ?? null,
      rating: product.rating ?? 5.0,
      reviews_count: product.reviewsCount ?? 0,
      is_new: Boolean(product.isNew),
      is_bestseller: Boolean(product.isBestseller),
      discount: product.discount ?? null,
      description: product.description,
      features: product.features ?? [],
      in_stock: product.inStock,
      stock_count: product.stockCount,
      wholesale_min_qty: product.wholesaleMinQty ?? null,
    });
    if (error) return false;

    if (product.colors.length > 0) {
      await supabase.from('product_colors').insert(
        product.colors.map((c) => ({
          id: `${product.id}-${c.id}`,
          product_id: product.id,
          name: c.name,
          hex: c.hex,
          image: c.image,
          in_stock: c.inStock,
        }))
      );
    }

    if (product.sizes.length > 0) {
      await supabase.from('product_sizes').insert(
        product.sizes.map((size) => ({
          product_id: product.id,
          size,
          in_stock: true,
        }))
      );
    }

    if (product.images && product.images.length > 0) {
      await supabase.from('product_images').insert(
        product.images.map((url, idx) => ({
          product_id: product.id,
          image_url: url,
          alt_text: product.name,
          is_primary: idx === 0,
          sort_order: idx + 1,
        }))
      );
    }

    return true;
  } catch (err) {
    console.error('Error creating product in Supabase:', err);
    return false;
  }
}

export async function updateProductInSupabase(product: Product): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;

  try {
    const { error } = await supabase
      .from('products')
      .update({
        name: product.name,
        category: product.category,
        price: product.price,
        old_price: product.oldPrice ?? null,
        discount: product.discount ?? null,
        description: product.description,
        features: product.features ?? [],
        in_stock: product.inStock,
        stock_count: product.stockCount,
        wholesale_min_qty: product.wholesaleMinQty ?? null,
      })
      .eq('id', product.id);

    if (error) return false;

    // Resync colors, sizes, and gallery images atomically
    await Promise.all([
      supabase.from('product_colors').delete().eq('product_id', product.id),
      supabase.from('product_sizes').delete().eq('product_id', product.id),
      supabase.from('product_images').delete().eq('product_id', product.id),
    ]);

    if (product.colors.length > 0) {
      await supabase.from('product_colors').insert(
        product.colors.map((c) => ({
          id: `${product.id}-${c.id}`,
          product_id: product.id,
          name: c.name,
          hex: c.hex,
          image: c.image,
          in_stock: c.inStock,
        }))
      );
    }

    if (product.sizes.length > 0) {
      await supabase.from('product_sizes').insert(
        product.sizes.map((size) => ({
          product_id: product.id,
          size,
          in_stock: true,
        }))
      );
    }

    if (product.images && product.images.length > 0) {
      await supabase.from('product_images').insert(
        product.images.map((url, idx) => ({
          product_id: product.id,
          image_url: url,
          alt_text: product.name,
          is_primary: idx === 0,
          sort_order: idx + 1,
        }))
      );
    }

    return true;
  } catch (err) {
    console.error('Error updating product in Supabase:', err);
    return false;
  }
}

export async function deleteProductInSupabase(productId: string): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('products').delete().eq('id', productId);
    return !error;
  } catch (err) {
    console.error('Error deleting product in Supabase:', err);
    return false;
  }
}

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
      notes: order.notes ?? null,
      subtotal: order.subtotal,
      shipping_fee: order.shippingFee,
      total: order.total,
      status: order.status,
      payment_method: order.paymentMethod,
      customer_email: order.customerEmail ?? null,
    });

    if (orderErr) return false;

    const itemsToInsert = order.items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.productName,
      color_name: item.colorName,
      color_hex: item.colorHex,
      size: item.size,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    }));

    await supabase.from('order_items').insert(itemsToInsert);

    await supabase.from('payments').insert({
      id: `pay-${order.id}`,
      order_id: order.id,
      amount: order.total,
      currency: 'MAD',
      method: order.paymentMethod,
      status: 'pending',
    });

    return true;
  } catch (err) {
    console.error('Error saving order to Supabase:', err);
    return false;
  }
}

export async function updateOrderStatusInSupabase(
  orderId: string,
  status: OrderStatus
): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
    if (!error) {
      const payStatus =
        status === 'delivered' ? 'paid' : status === 'cancelled' ? 'failed' : 'pending';
      await supabase
        .from('payments')
        .update({
          status: payStatus,
          ...(payStatus === 'paid' ? { paid_at: new Date().toISOString() } : {}),
        })
        .eq('order_id', orderId);
    }
    return !error;
  } catch (err) {
    console.error('Error updating order status in Supabase:', err);
    return false;
  }
}

export async function deleteOrderInSupabase(orderId: string): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('orders').delete().eq('id', orderId);
    return !error;
  } catch (err) {
    console.error('Error deleting order in Supabase:', err);
    return false;
  }
}

export async function saveUserToSupabase(user: User): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('users').upsert({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone ?? null,
      city: user.city ?? null,
      address: user.address ?? null,
      role: user.role,
    });
    return !error;
  } catch (err) {
    console.error('Error saving user to Supabase:', err);
    return false;
  }
}

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
      announcementText: data.announcement_text,
    };
  } catch (err) {
    console.error('Error fetching settings from Supabase:', err);
    return null;
  }
}

export async function updateSettingsInSupabase(
  newSettings: Partial<StoreSettings>
): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;

  try {
    const payload: Record<string, unknown> = {};
    if (newSettings.phone !== undefined) payload.phone = newSettings.phone;
    if (newSettings.whatsapp !== undefined) payload.whatsapp = newSettings.whatsapp;
    if (newSettings.email !== undefined) payload.email = newSettings.email;
    if (newSettings.address !== undefined) payload.address = newSettings.address;
    if (newSettings.deliveryFee !== undefined) payload.delivery_fee = newSettings.deliveryFee;
    if (newSettings.freeShippingPairThreshold !== undefined) {
      payload.free_shipping_pair_threshold = newSettings.freeShippingPairThreshold;
    }
    if (newSettings.instagramUrl !== undefined) payload.instagram_url = newSettings.instagramUrl;
    if (newSettings.facebookUrl !== undefined) payload.facebook_url = newSettings.facebookUrl;
    if (newSettings.tiktokUrl !== undefined) payload.tiktok_url = newSettings.tiktokUrl;
    if (newSettings.adminPasswordHash !== undefined) {
      payload.admin_password_hash = newSettings.adminPasswordHash;
    }

    const { error } = await supabase.from('store_settings').update(payload).eq('id', 1);

    if (!error && newSettings.whatsapp !== undefined) {
      await supabase
        .from('whatsapp_settings')
        .update({
          raw_number: newSettings.whatsapp,
          normalized_number: normalizeWhatsAppNumber(newSettings.whatsapp),
        })
        .eq('id', 1);
    }

    return !error;
  } catch (err) {
    console.error('Error updating settings in Supabase:', err);
    return false;
  }
}
