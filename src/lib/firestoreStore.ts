import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  query,
  where,
  orderBy,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db, auth, OperationType, handleFirestoreError } from './firebase';
import {
  Product,
  CategoryRecord,
  Order,
  PaymentRecord,
  StoreSettings,
  User,
} from '../types';
import { normalizeWhatsAppNumber } from '../utils/phone';

const BOOTSTRAPPED_ADMINS = new Set([
  'jarfouribrahim51@gmail.com',
  'mediaagencyfocus@gmail.com',
]);

export function isFirebaseAdminUser(): boolean {
  const cu = auth.currentUser;
  if (!cu || !cu.emailVerified || !cu.email) return false;
  return BOOTSTRAPPED_ADMINS.has(cu.email.toLowerCase());
}

/**
 * Strip undefined keys so Firestore rules with keys().hasOnly(...) never fail on undefined props.
 */
function cleanProductPayload(p: Product): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    id: p.id,
    name: p.name,
    category: p.category,
    price: Number(p.price),
    rating: Number(p.rating ?? 5.0),
    reviewsCount: Number(p.reviewsCount ?? 0),
    description: p.description,
    features: Array.isArray(p.features) ? p.features.slice(0, 15) : [],
    images: Array.isArray(p.images) ? p.images.slice(0, 12) : [],
    colors: p.colors.slice(0, 15),
    sizes: p.sizes.slice(0, 25),
    inStock: Boolean(p.inStock),
    stockCount: Number(p.stockCount ?? 0),
    createdAt: p.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (p.oldPrice !== undefined && p.oldPrice !== null) payload.oldPrice = Number(p.oldPrice);
  if (p.isNew !== undefined) payload.isNew = Boolean(p.isNew);
  if (p.isBestseller !== undefined) payload.isBestseller = Boolean(p.isBestseller);
  if (p.discount) payload.discount = String(p.discount);
  if (p.wholesaleMinQty !== undefined && p.wholesaleMinQty !== null) {
    payload.wholesaleMinQty = Number(p.wholesaleMinQty);
  }
  return payload;
}

export function subscribeProductsFromFirestore(
  onUpdate: (products: Product[]) => void
): Unsubscribe {
  const path = 'products';
  const q = query(collection(db, path), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs.map((d) => d.data() as Product);
      if (list.length > 0) {
        onUpdate(list);
      }
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch {
        // Handled cleanly in logger
      }
    }
  );
}

export async function seedInitialCatalogIfEmpty(
  defaultProducts: Product[],
  initialSettings: StoreSettings
): Promise<void> {
  if (!isFirebaseAdminUser()) return;
  try {
    const snap = await getDocs(collection(db, 'products'));
    if (snap.empty) {
      const batch = writeBatch(db);
      const categories: CategoryRecord[] = [
        { id: 'womens', slug: 'womens', nameAr: 'الأحذية النسائية', descriptionAr: 'كعب عالي، صنادل، وسنيكرز نسائي فاخر', displayOrder: 1, isActive: true },
        { id: 'mens', slug: 'mens', nameAr: 'الأحذية الرجالية', descriptionAr: 'أحذية أكسفورد كلاسيكية وسنيكرز كاجوال', displayOrder: 2, isActive: true },
        { id: 'kids', slug: 'kids', nameAr: 'أحذية الأطفال', descriptionAr: 'تصاميم خفيفة ومريحة للصغار', displayOrder: 3, isActive: true },
        { id: 'wholesale', slug: 'wholesale', nameAr: 'البيع بالجملة', descriptionAr: 'سلاسل وكراتين مشكلة للتجار', displayOrder: 4, isActive: true },
      ];
      for (const cat of categories) {
        batch.set(doc(db, 'categories', cat.id), cat);
      }
      for (const prod of defaultProducts) {
        batch.set(doc(db, 'products', prod.id), cleanProductPayload(prod));
      }
      await batch.commit();
    }

    const settingsSnap = await getDoc(doc(db, 'settings', 'store'));
    if (!settingsSnap.exists()) {
      await saveSettingsToFirestore(initialSettings);
    }
  } catch (error) {
    console.warn('Firestore seed check skipped:', error);
  }
}

export async function saveProductToFirestore(product: Product): Promise<void> {
  if (!isFirebaseAdminUser()) return;
  const path = `products/${product.id}`;
  try {
    await setDoc(doc(db, 'products', product.id), cleanProductPayload(product));
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteProductFromFirestore(productId: string): Promise<void> {
  if (!isFirebaseAdminUser()) return;
  const path = `products/${productId}`;
  try {
    await deleteDoc(doc(db, 'products', productId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeSettingsFromFirestore(
  onUpdate: (settings: Partial<StoreSettings>) => void
): Unsubscribe {
  const path = 'settings/store';
  return onSnapshot(
    doc(db, 'settings', 'store'),
    (snap) => {
      if (snap.exists()) {
        onUpdate(snap.data() as Partial<StoreSettings>);
      }
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.GET, path);
      } catch {
        // Logged via handleFirestoreError
      }
    }
  );
}

export async function saveSettingsToFirestore(settings: Partial<StoreSettings>): Promise<void> {
  if (!isFirebaseAdminUser()) return;
  const path = 'settings/store';
  const now = new Date().toISOString();
  try {
    const storePayload: Record<string, unknown> = {
      storeName: settings.storeName || 'BELLA SHOES',
      tagline: settings.tagline || 'الأناقة تبدأ من خطواتك · أسلوب حياة وفخامة لا تضاهى',
      phone: settings.phone || '+212 600 123 456',
      whatsapp: settings.whatsapp || '+212 600 123 456',
      email: settings.email || 'contact@bellashoes.ma',
      address: settings.address || '',
      city: settings.city || 'الدار البيضاء',
      deliveryFee: Number(settings.deliveryFee ?? 35),
      freeShippingPairThreshold: Number(settings.freeShippingPairThreshold ?? 2),
      instagramUrl: settings.instagramUrl || '',
      facebookUrl: settings.facebookUrl || '',
      tiktokUrl: settings.tiktokUrl || '',
      announcementText: settings.announcementText || '',
      updatedAt: now,
    };

    const batch = writeBatch(db);
    batch.set(doc(db, 'settings', 'store'), storePayload, { merge: true });
    if (settings.whatsapp) {
      batch.set(
        doc(db, 'settings', 'whatsapp'),
        {
          whatsapp: settings.whatsapp,
          normalizedNumber: normalizeWhatsAppNumber(settings.whatsapp),
          defaultGreeting: 'السلام عليكم، أود الاستفسار عن تشكيلات أحذية BELLA SHOES وخدمة التوصيل.',
          updatedAt: now,
        },
        { merge: true }
      );
    }
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveOrderAndPaymentToFirestore(order: Order): Promise<void> {
  const path = `orders/${order.id}`;
  const cu = auth.currentUser;
  const orderPayload: Record<string, unknown> = {
    id: order.id,
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    phone: order.phone,
    city: order.city,
    address: order.address,
    items: order.items,
    subtotal: Number(order.subtotal),
    shippingFee: Number(order.shippingFee),
    total: Number(order.total),
    status: 'pending',
    paymentMethod: 'cod',
    createdAt: order.createdAt,
  };
  if (order.notes) orderPayload.notes = order.notes;
  if (order.customerEmail) orderPayload.customerEmail = order.customerEmail;
  if (cu?.uid && cu.emailVerified) orderPayload.customerUid = cu.uid;

  const paymentId = `pay-${order.id}`;
  const paymentPayload: PaymentRecord = {
    id: paymentId,
    orderId: order.id,
    orderNumber: order.orderNumber,
    amount: Number(order.total),
    currency: 'MAD',
    method: 'cod',
    status: 'pending',
    createdAt: order.createdAt,
  };
  if (cu?.uid && cu.emailVerified) paymentPayload.customerUid = cu.uid;

  try {
    const batch = writeBatch(db);
    batch.set(doc(db, 'orders', order.id), orderPayload);
    batch.set(doc(db, 'payments', paymentId), paymentPayload);
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export function subscribeOrdersFromFirestore(
  onUpdate: (orders: Order[]) => void
): Unsubscribe {
  const cu = auth.currentUser;
  if (!cu || !cu.emailVerified) {
    return () => {};
  }

  const path = 'orders';
  const q = isFirebaseAdminUser()
    ? query(collection(db, path), orderBy('createdAt', 'desc'))
    : query(
        collection(db, path),
        where('customerUid', '==', cu.uid),
        orderBy('createdAt', 'desc')
      );

  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs.map((d) => d.data() as Order);
      onUpdate(list);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch {
        // Logged via handleFirestoreError
      }
    }
  );
}

export async function updateOrderStatusInFirestore(
  orderId: string,
  status: Order['status']
): Promise<void> {
  if (!isFirebaseAdminUser()) return;
  const path = `orders/${orderId}`;
  const now = new Date().toISOString();
  try {
    const batch = writeBatch(db);
    batch.update(doc(db, 'orders', orderId), { status, updatedAt: now });
    const payStatus = status === 'delivered' ? 'paid' : status === 'cancelled' ? 'failed' : 'pending';
    batch.update(doc(db, 'payments', `pay-${orderId}`), {
      status: payStatus,
      ...(payStatus === 'paid' ? { paidAt: now } : {}),
    });
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteOrderFromFirestore(orderId: string): Promise<void> {
  if (!isFirebaseAdminUser()) return;
  const path = `orders/${orderId}`;
  try {
    const batch = writeBatch(db);
    batch.delete(doc(db, 'orders', orderId));
    batch.delete(doc(db, 'payments', `pay-${orderId}`));
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function syncFirebaseUserProfile(user: User): Promise<void> {
  const cu = auth.currentUser;
  if (!cu || !cu.emailVerified) return;
  const path = `users/${cu.uid}`;
  const createdAt = user.createdAt || new Date().toISOString();
  try {
    const batch = writeBatch(db);
    batch.set(
      doc(db, 'users', cu.uid),
      {
        uid: cu.uid,
        displayName: user.name || cu.displayName || user.email.split('@')[0],
        createdAt,
      },
      { merge: true }
    );
    batch.set(
      doc(db, 'users', cu.uid, 'private', 'info'),
      {
        uid: cu.uid,
        name: user.name || cu.displayName || user.email.split('@')[0],
        email: user.email,
        ...(user.phone ? { phone: user.phone } : {}),
        ...(user.city ? { city: user.city } : {}),
        ...(user.address ? { address: user.address } : {}),
        createdAt,
      },
      { merge: true }
    );
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
