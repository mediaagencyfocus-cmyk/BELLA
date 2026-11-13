# BELLA SHOES Security Specification & Data Invariants

## 1. Core Data Invariants
1. **Catalog Integrity**: Only verified admins (`isAdmin()`) may create, update, or delete documents in `/categories/{categoryId}`, `/products/{productId}`, `/settings/store`, and `/settings/whatsapp`.
2. **Order Immutability & Initial State**: When creating an order in `/orders/{orderId}`, `status` MUST be `'pending'` and `paymentMethod` MUST be `'cod'`. Guests or signed-in users cannot create pre-approved (`delivered`) orders or alter existing orders.
3. **Order & Payment PII Protection**: Only `isAdmin()` or the authenticated order owner (`resource.data.customerUid == request.auth.uid`) may read (`get` / `list`) `/orders/{orderId}` or `/payments/{paymentId}`.
4. **PII Split Isolation**: Customer emails, phone numbers, and street addresses in `/users/{userId}/private/info` are strictly readable and writable only by `isOwner(userId)` or `isAdmin()`.
5. **Privilege Escalation Guard**: Users can never write to `/admins/{adminId}` or set any `role` claim inside `/users/{userId}` documents.
6. **Temporal & Volumetric Guards**: All IDs match `^[a-zA-Z0-9_-]+$` (`<= 128` chars). Every string field enforces strict `.size()` bounds. Array fields (`features`, `images`, `colors`, `sizes`, `items`) enforce bounded lengths.

## 2. Dirty Dozen Adversarial Payloads
1. **Shadow Field Injection on Product Create**: `{ id: "p1", name: "Test", ..., ghostField: true }` -> `PERMISSION_DENIED` (`hasOnly` check).
2. **Unverified Email Admin Spoof**: Admin email claim with `email_verified: false` attempting product write -> `PERMISSION_DENIED`.
3. **Privilege Escalation on User Profile**: Authenticated user adding `role: "admin"` to `/users/{uid}` -> `PERMISSION_DENIED`.
4. **Order Status Bypass on Create**: Creating `/orders/{orderId}` with `status: "delivered"` -> `PERMISSION_DENIED`.
5. **Cross-User Order Read (PII Scrape)**: Authenticated non-admin reading another customer's order -> `PERMISSION_DENIED`.
6. **Unauthorized List Scrape on Orders**: Authenticated customer calling `list` on `/orders` without `where('customerUid', '==', uid)` -> `PERMISSION_DENIED`.
7. **Unauthorized Private User Info Read**: Non-owner reading `/users/{otherUid}/private/info` -> `PERMISSION_DENIED`.
8. **ID Poisoning**: Creating `/products/{1500_char_id}` -> `PERMISSION_DENIED` (`isValidId`).
9. **Value Poisoning on Update**: Updating `price` with a string `"free"` -> `PERMISSION_DENIED`.
10. **Negative Price / Stock Attack**: Creating a product with `price: -50` or `stockCount: -1` -> `PERMISSION_DENIED`.
11. **Unbounded Array Bomb**: Uploading 500 items inside `orders.items` -> `PERMISSION_DENIED`.
12. **Customer Modifying WhatsApp Settings**: Non-admin attempting to update `/settings/whatsapp` -> `PERMISSION_DENIED`.
