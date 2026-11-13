/**
 * Red Team Security Specification & Payload Contract Tests for BELLA SHOES Firestore Rules.
 * Verifies that all 12 Dirty Dozen adversarial payloads violate rule invariants.
 */

export const dirtyDozenPayloads = [
  {
    name: '1. Shadow Field Injection on Product Create',
    collection: 'products/prod-shadow-1',
    payload: {
      id: 'prod-shadow-1',
      name: 'Test Shoe',
      category: 'womens',
      price: 450,
      description: 'Valid desc',
      colors: [{ id: 'c1', name: 'Black', hex: '#000', image: '/img.jpg', inStock: true }],
      sizes: [38],
      inStock: true,
      stockCount: 10,
      createdAt: '2026-11-13T00:00:00Z',
      ghostAdminFlag: true
    },
    expectedOutcome: 'PERMISSION_DENIED'
  },
  {
    name: '2. Unverified Email Admin Spoof',
    auth: { uid: 'spoof-uid', email: 'mediaagencyfocus@gmail.com', email_verified: false },
    collection: 'products/prod-spoof',
    expectedOutcome: 'PERMISSION_DENIED'
  },
  {
    name: '3. Privilege Escalation on User Profile',
    collection: 'users/usr-1',
    payload: { uid: 'usr-1', displayName: 'Attacker', role: 'admin', createdAt: '2026-11-13T00:00:00Z' },
    expectedOutcome: 'PERMISSION_DENIED'
  },
  {
    name: '4. Order Status Bypass on Create',
    collection: 'orders/ord-bypass',
    payload: {
      id: 'ord-bypass',
      orderNumber: 'BS-99999',
      customerName: 'Bypass',
      phone: '0612345678',
      city: 'الدار البيضاء',
      address: 'المعاريف',
      items: [{ productId: 'p1', size: 40, quantity: 1, price: 450 }],
      subtotal: 450,
      shippingFee: 0,
      total: 450,
      status: 'delivered',
      paymentMethod: 'cod',
      createdAt: '2026-11-13T00:00:00Z'
    },
    expectedOutcome: 'PERMISSION_DENIED'
  },
  {
    name: '5. Cross-User Order Read (PII Scrape)',
    auth: { uid: 'usr-attacker', email_verified: true },
    collection: 'orders/ord-victim',
    expectedOutcome: 'PERMISSION_DENIED'
  },
  {
    name: '6. Unauthorized Orders List Without Customer Filter',
    auth: { uid: 'usr-attacker', email_verified: true },
    collection: 'orders',
    expectedOutcome: 'PERMISSION_DENIED'
  },
  {
    name: '7. Unauthorized Private User Info Read',
    auth: { uid: 'usr-attacker', email_verified: true },
    collection: 'users/usr-victim/private/info',
    expectedOutcome: 'PERMISSION_DENIED'
  },
  {
    name: '8. Resource ID Poisoning (>128 chars)',
    collection: `products/${'a'.repeat(250)}`,
    expectedOutcome: 'PERMISSION_DENIED'
  },
  {
    name: '9. Value Poisoning on Product Price',
    collection: 'products/prod-w-01',
    payload: { price: 'free' },
    expectedOutcome: 'PERMISSION_DENIED'
  },
  {
    name: '10. Negative Price / Stock Attack',
    collection: 'products/prod-neg',
    payload: { price: -100, stockCount: -5 },
    expectedOutcome: 'PERMISSION_DENIED'
  },
  {
    name: '11. Orphaned Payment Without Valid Order',
    collection: 'payments/pay-orphan',
    payload: {
      id: 'pay-orphan',
      orderId: 'ord-non-existent',
      orderNumber: 'BS-00001',
      amount: 450,
      currency: 'MAD',
      method: 'cod',
      status: 'pending',
      createdAt: '2026-11-13T00:00:00Z'
    },
    expectedOutcome: 'PERMISSION_DENIED'
  },
  {
    name: '12. Non-Admin Updating WhatsApp Settings',
    auth: { uid: 'usr-customer', email: 'customer@example.com', email_verified: true },
    collection: 'settings/whatsapp',
    payload: { whatsapp: '+212699999999', normalizedNumber: '212699999999' },
    expectedOutcome: 'PERMISSION_DENIED'
  }
];
