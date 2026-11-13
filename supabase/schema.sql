-- ==============================================================================
-- BELLA SHOES - Complete Relational SQL Database Schema (PostgreSQL / Supabase)
-- 12 Normalized Tables with Primary Keys, Foreign Keys, Indexes, Triggers & RLS
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop tables cleanly in dependency order
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS product_sizes CASCADE;
DROP TABLE IF EXISTS product_colors CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS whatsapp_settings CASCADE;
DROP TABLE IF EXISTS store_settings CASCADE;
DROP TABLE IF EXISTS admins CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ==============================================================================
-- 1. CATEGORIES (الأقسام المعتمدة)
-- ==============================================================================
CREATE TABLE categories (
    id TEXT PRIMARY KEY, -- 'womens' | 'mens' | 'kids' | 'wholesale'
    slug VARCHAR(50) NOT NULL UNIQUE CHECK (slug IN ('womens', 'mens', 'kids', 'wholesale')),
    name_ar VARCHAR(120) NOT NULL,
    description_ar TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 2. PRODUCTS (المنتجات والأحذية)
-- ==============================================================================
CREATE TABLE products (
    id TEXT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL REFERENCES categories(slug) ON UPDATE CASCADE ON DELETE RESTRICT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    old_price NUMERIC(10, 2) CHECK (old_price IS NULL OR old_price >= price),
    rating NUMERIC(3, 2) NOT NULL DEFAULT 5.0 CHECK (rating >= 0 AND rating <= 5),
    reviews_count INTEGER NOT NULL DEFAULT 0 CHECK (reviews_count >= 0),
    is_new BOOLEAN NOT NULL DEFAULT FALSE,
    is_bestseller BOOLEAN NOT NULL DEFAULT FALSE,
    discount VARCHAR(20),
    description TEXT NOT NULL,
    features TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    in_stock BOOLEAN NOT NULL DEFAULT TRUE,
    stock_count INTEGER NOT NULL DEFAULT 0 CHECK (stock_count >= 0),
    wholesale_min_qty INTEGER DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 3. PRODUCT_IMAGES (صور متعددة لكل منتج)
-- ==============================================================================
CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text VARCHAR(255),
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 4. PRODUCT_COLORS (ألوان المنتج وصورها)
-- ==============================================================================
CREATE TABLE product_colors (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    hex VARCHAR(20) NOT NULL,
    image TEXT NOT NULL,
    in_stock BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 5. PRODUCT_SIZES (المقاسات / النمر المتوفرة لكل منتج)
-- ==============================================================================
CREATE TABLE product_sizes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    size INTEGER NOT NULL CHECK (size >= 20 AND size <= 55),
    in_stock BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (product_id, size)
);

-- ==============================================================================
-- 6. USERS (حسابات الزبائن)
-- ==============================================================================
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    city VARCHAR(100),
    address TEXT,
    role VARCHAR(20) NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 7. ADMINS (حسابات الإدارة والصلاحيات)
-- ==============================================================================
CREATE TABLE admins (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role_level VARCHAR(40) NOT NULL DEFAULT 'super_admin',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 8. ORDERS (طلبات الزبائن)
-- ==============================================================================
CREATE TABLE orders (
    id TEXT PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    notes TEXT,
    subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
    shipping_fee NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (shipping_fee >= 0),
    total NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
    status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    payment_method VARCHAR(30) NOT NULL DEFAULT 'cod' CHECK (payment_method IN ('cod', 'card', 'transfer')),
    customer_email VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 9. ORDER_ITEMS (تفاصيل عناصر كل طلبية)
-- ==============================================================================
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    color_name VARCHAR(100) NOT NULL,
    color_hex VARCHAR(20) NOT NULL,
    size INTEGER NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    image TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 10. PAYMENTS (سجل عمليات الدفع)
-- ==============================================================================
CREATE TABLE payments (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
    currency VARCHAR(10) NOT NULL DEFAULT 'MAD',
    method VARCHAR(30) NOT NULL DEFAULT 'cod' CHECK (method IN ('cod', 'card', 'transfer')),
    status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 11. STORE_SETTINGS / SETTINGS (إعدادات المتجر العامة)
-- ==============================================================================
CREATE TABLE store_settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    store_name VARCHAR(150) NOT NULL DEFAULT 'BELLA SHOES',
    tagline TEXT NOT NULL DEFAULT 'الأناقة تبدأ من خطواتك · أسلوب حياة وفخامة لا تضاهى',
    phone VARCHAR(50) NOT NULL DEFAULT '+212 600 123 456',
    whatsapp VARCHAR(50) NOT NULL DEFAULT '+212 600 123 456',
    email VARCHAR(150) NOT NULL DEFAULT 'contact@bellashoes.ma',
    address TEXT NOT NULL DEFAULT 'شارع المسيرة الخضراء، المعاريف، الدار البيضاء، المغرب',
    city VARCHAR(100) NOT NULL DEFAULT 'الدار البيضاء',
    delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 35.00,
    free_shipping_pair_threshold INTEGER NOT NULL DEFAULT 2,
    admin_email VARCHAR(150) NOT NULL DEFAULT 'jarfouribrahim51@gmail.com',
    admin_password_hash TEXT NOT NULL DEFAULT 'BellaAdmin2026!',
    instagram_url TEXT DEFAULT 'https://instagram.com/bellashoes.ma',
    facebook_url TEXT DEFAULT 'https://facebook.com/bellashoes.ma',
    tiktok_url TEXT DEFAULT 'https://tiktok.com/@bellashoes.ma',
    announcement_text TEXT DEFAULT 'التوصيل لجميع أنحاء المغرب خلال 24 ساعة · الدفع عند الاستلام مع إمكانية القياس',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Compatibility View named 'settings'
CREATE OR REPLACE VIEW settings AS SELECT * FROM store_settings;

-- ==============================================================================
-- 12. WHATSAPP_SETTINGS (إعدادات الواتساب الديناميكية)
-- ==============================================================================
CREATE TABLE whatsapp_settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    store_setting_id INTEGER NOT NULL UNIQUE REFERENCES store_settings(id) ON DELETE CASCADE,
    raw_number VARCHAR(50) NOT NULL DEFAULT '+212 600 123 456',
    normalized_number VARCHAR(30) NOT NULL DEFAULT '212600123456',
    default_greeting TEXT NOT NULL DEFAULT 'السلام عليكم، أود الاستفسار عن تشكيلات أحذية BELLA SHOES وخدمة التوصيل.',
    auto_order_redirect BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- PERFORMANCE INDEXES
-- ==============================================================================
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_in_stock ON products(in_stock);
CREATE INDEX idx_product_images_product ON product_images(product_id);
CREATE INDEX idx_product_colors_product ON product_colors(product_id);
CREATE INDEX idx_product_sizes_product ON product_sizes(product_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_phone ON orders(phone);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);
CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_status ON payments(status);

-- ==============================================================================
-- AUTOMATIC TIMESTAMP TRIGGERS
-- ==============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_store_settings_updated_at BEFORE UPDATE ON store_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_whatsapp_settings_updated_at BEFORE UPDATE ON whatsapp_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public Read Products" ON products FOR SELECT USING (true);
CREATE POLICY "Public Read Product Images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Public Read Product Colors" ON product_colors FOR SELECT USING (true);
CREATE POLICY "Public Read Product Sizes" ON product_sizes FOR SELECT USING (true);
CREATE POLICY "Public Read Store Settings" ON store_settings FOR SELECT USING (true);
CREATE POLICY "Public Read WhatsApp Settings" ON whatsapp_settings FOR SELECT USING (true);

CREATE POLICY "Public Insert Orders" ON orders FOR INSERT WITH CHECK (status = 'pending');
CREATE POLICY "Public Insert Order Items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Payments" ON payments FOR INSERT WITH CHECK (status = 'pending');

CREATE POLICY "Admin Full Access Categories" ON categories FOR ALL USING (
    auth.role() = 'authenticated' AND (
        auth.jwt() ->> 'email' IN ('jarfouribrahim51@gmail.com', 'mediaagencyfocus@gmail.com')
        OR EXISTS (SELECT 1 FROM admins WHERE email = auth.jwt() ->> 'email' AND is_active = TRUE)
    )
);
CREATE POLICY "Admin Full Access Products" ON products FOR ALL USING (
    auth.role() = 'authenticated' AND (
        auth.jwt() ->> 'email' IN ('jarfouribrahim51@gmail.com', 'mediaagencyfocus@gmail.com')
        OR EXISTS (SELECT 1 FROM admins WHERE email = auth.jwt() ->> 'email' AND is_active = TRUE)
    )
);
CREATE POLICY "Admin Full Access Product Images" ON product_images FOR ALL USING (
    auth.role() = 'authenticated' AND (
        auth.jwt() ->> 'email' IN ('jarfouribrahim51@gmail.com', 'mediaagencyfocus@gmail.com')
        OR EXISTS (SELECT 1 FROM admins WHERE email = auth.jwt() ->> 'email' AND is_active = TRUE)
    )
);
CREATE POLICY "Admin Full Access Product Colors" ON product_colors FOR ALL USING (
    auth.role() = 'authenticated' AND (
        auth.jwt() ->> 'email' IN ('jarfouribrahim51@gmail.com', 'mediaagencyfocus@gmail.com')
        OR EXISTS (SELECT 1 FROM admins WHERE email = auth.jwt() ->> 'email' AND is_active = TRUE)
    )
);
CREATE POLICY "Admin Full Access Product Sizes" ON product_sizes FOR ALL USING (
    auth.role() = 'authenticated' AND (
        auth.jwt() ->> 'email' IN ('jarfouribrahim51@gmail.com', 'mediaagencyfocus@gmail.com')
        OR EXISTS (SELECT 1 FROM admins WHERE email = auth.jwt() ->> 'email' AND is_active = TRUE)
    )
);
CREATE POLICY "Admin Full Access Orders" ON orders FOR ALL USING (
    auth.role() = 'authenticated' AND (
        auth.jwt() ->> 'email' IN ('jarfouribrahim51@gmail.com', 'mediaagencyfocus@gmail.com')
        OR EXISTS (SELECT 1 FROM admins WHERE email = auth.jwt() ->> 'email' AND is_active = TRUE)
    )
);
CREATE POLICY "Admin Full Access Payments" ON payments FOR ALL USING (
    auth.role() = 'authenticated' AND (
        auth.jwt() ->> 'email' IN ('jarfouribrahim51@gmail.com', 'mediaagencyfocus@gmail.com')
        OR EXISTS (SELECT 1 FROM admins WHERE email = auth.jwt() ->> 'email' AND is_active = TRUE)
    )
);
CREATE POLICY "Admin Full Access Settings" ON store_settings FOR ALL USING (
    auth.role() = 'authenticated' AND (
        auth.jwt() ->> 'email' IN ('jarfouribrahim51@gmail.com', 'mediaagencyfocus@gmail.com')
        OR EXISTS (SELECT 1 FROM admins WHERE email = auth.jwt() ->> 'email' AND is_active = TRUE)
    )
);
CREATE POLICY "Admin Full Access WhatsApp" ON whatsapp_settings FOR ALL USING (
    auth.role() = 'authenticated' AND (
        auth.jwt() ->> 'email' IN ('jarfouribrahim51@gmail.com', 'mediaagencyfocus@gmail.com')
        OR EXISTS (SELECT 1 FROM admins WHERE email = auth.jwt() ->> 'email' AND is_active = TRUE)
    )
);

-- ==============================================================================
-- SEED DATA MATCHING STOREFRONT 100%
-- ==============================================================================
INSERT INTO categories (id, slug, name_ar, description_ar, display_order, is_active) VALUES
('womens', 'womens', 'الأحذية النسائية', 'كعب عالي ملكي، صنادل أنيقة، وسنيكرز نسائي راقي.', 1, TRUE),
('mens', 'mens', 'الأحذية الرجالية', 'أحذية أكسفورد كلاسيكية، لوفر، وسنيكرز كاجوال عصري.', 2, TRUE),
('kids', 'kids', 'أحذية الأطفال', 'تصاميم خفيفة ومريحة تدعم حركة الطفل بكل أمان.', 3, TRUE),
('wholesale', 'wholesale', 'البيع بالجملة', 'سلاسل وكراتين مشكلة بأسعار تفضيلية للتجار بالمغرب.', 4, TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO store_settings (
    id, store_name, tagline, phone, whatsapp, email, address, city,
    delivery_fee, free_shipping_pair_threshold, admin_email, admin_password_hash,
    instagram_url, facebook_url, tiktok_url, announcement_text
) VALUES (
    1,
    'BELLA SHOES',
    'الأناقة تبدأ من خطواتك · أسلوب حياة وفخامة لا تضاهى',
    '+212 600 123 456',
    '+212 600 123 456',
    'contact@bellashoes.ma',
    'شارع المسيرة الخضراء، المعاريف، الدار البيضاء، المغرب',
    'الدار البيضاء',
    35.00,
    2,
    'jarfouribrahim51@gmail.com',
    'BellaAdmin2026!',
    'https://instagram.com/bellashoes.ma',
    'https://facebook.com/bellashoes.ma',
    'https://tiktok.com/@bellashoes.ma',
    'تخفيضات حصرية بمناسبة التشكيلة الجديدة: توصيل مجاني لكافة المدن المغربية عند طلب زوجين فأكثر!'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO whatsapp_settings (id, store_setting_id, raw_number, normalized_number) VALUES
(1, 1, '+212 600 123 456', '212600123456')
ON CONFLICT (id) DO NOTHING;

INSERT INTO admins (id, name, email, role_level, is_active) VALUES
('admin-01', 'إبراهيم المسؤول', 'jarfouribrahim51@gmail.com', 'super_admin', TRUE),
('admin-02', 'الإدارة الرئيسية', 'mediaagencyfocus@gmail.com', 'super_admin', TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name, category, price, old_price, rating, reviews_count,
    is_new, is_bestseller, discount, description, features, in_stock, stock_count, wholesale_min_qty
) VALUES
(
    'prod-w-01',
    'حذاء كعب عالي ملكي فاخر - Bella Royale Stiletto',
    'womens',
    480.00, 599.00, 4.9, 38, FALSE, TRUE, '20%-',
    'حذاء كعب عالي كلاسيكي مصنوع من جلد العجل الإيطالي الفاخر مع حزام كاحل أنيق وإبزيم ذهبي مقاوم للصدأ. يوفر وسادة داخلية طبية توفر راحة فائقة حتى مع الكعب المرتفع، مثالي للسهرات والمناسبات الرسمية الفاخرة.',
    ARRAY['جلد طبيعي فاخر 100%', 'ارتفاع الكعب 9.5 سم', 'نعل داخلي طبي', 'إبزيم ذهبي أنيق', 'إمكانية القياس عند الاستلام'],
    TRUE, 18, NULL
),
(
    'prod-w-02',
    'سنيكرز نسائي راقي بلمسات عصرية - Bella Luxe Runner',
    'womens',
    420.00, 490.00, 4.8, 29, TRUE, FALSE, '15%-',
    'سنيكرز نسائي فاخر يجمع بين الطابع الرياضي العصري وأناقة التفاصيل الدقيقة. نعل خفيف ومرن مصمم للاستخدام اليومي المريح دون التنازل عن فخامة المظهر.',
    ARRAY['جلد طبيعي ناعم الملمس', 'نعل خارجي مضاد للانزلاق', 'تهوية داخلية ممتازة', 'تفاصيل وتطريزات متقنة'],
    TRUE, 24, NULL
),
(
    'prod-m-01',
    'حذاء أكسفورد كلاسيكي كوجناك - Bella Bespoke Oxford',
    'mens',
    590.00, 720.00, 5.0, 46, FALSE, TRUE, '18%-',
    'تحفة يدوية كلاسيكية للرجل الأنيق، مصنع بأعلى درجات الحرفية من جلد العجل الطبيعي المصبوغ يدوياً بتدرج الكوجناك العميق. خياطة Goodyear متينة تضمن استدامة استثنائية لسنوات طويلة.',
    ARRAY['جلد طبيعي Full Grain Calfskin', 'خياطة Goodyear welted', 'نعل جلدي مسامي', 'قالب مريح للقدم', 'كيس حماية فاخر'],
    TRUE, 15, NULL
),
(
    'prod-m-02',
    'سنيكرز رجالي كاجوال فخم - Bella Aero Carbon',
    'mens',
    450.00, 550.00, 4.9, 31, TRUE, FALSE, '19%-',
    'سنيكرز مصمم ببراعة يجمع بين اللون الأسود الملكي وتفاصيل عصرية مميزة لهوية المتجر. يمنحك خفة حركة لا مثيل لها ومظهراً رياضياً فخماً يناسب الخروجات اليومية والأناقة الكاجوال.',
    ARRAY['تصميم ديناميكي متين', 'نعل هوائي مرن', 'جلد ناعم وتطريز متين', 'بطانة مريحة للكاحل'],
    TRUE, 22, NULL
),
(
    'prod-k-01',
    'حذاء أطفال مريح وعالي الجودة - Bella Junior Comfort',
    'kids',
    290.00, 360.00, 4.8, 22, FALSE, TRUE, '20%-',
    'حذاء أطفال مصمم بعناية فائقة لتوفير الحماية والمرونة للقدمين أثناء الحركة واللعب. خامات آمنة وجلد ناعم مع أربطة مرنة ونعل مطاطي مانع للانزلاق يدعم نمو القدم بشكل سليم.',
    ARRAY['جلد طبيعي مرن', 'نعل طبي مرن مانع للانزلاق', 'سهل الارتداء والخلع', 'ألوان أنيقة ومريحة'],
    TRUE, 30, NULL
),
(
    'prod-wh-01',
    'سلسلة أحذية نسائية ورجالية مشكلة - عرض الجملة للتجار',
    'wholesale',
    2800.00, 3800.00, 5.0, 14, FALSE, FALSE, '26%-',
    'عرض خاص ومميز لأصحاب المحلات التجارية وبائعي التجزئة في المغرب: كرتون سلسلة يحتوي على 10 أزواج من الأحذية الفاخرة المشكلة بمقاسات تجارية مطلوبة (37 إلى 44) وألوان متنوعة الأكثر طلباً في السوق.',
    ARRAY['كرتون يضم 10 أزواج مشكلة', 'توزيع متوازن للنمر التجارية', 'علب فردية فاخرة', 'شحن مجاني لكافة المدن'],
    TRUE, 8, 1
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order) VALUES
('prod-w-01', '/src/assets/images/bella_womens_heels_1794318693049.jpg', 'Bella Royale Stiletto', TRUE, 1),
('prod-w-02', '/src/assets/images/bella_luxury_sneaker_1794318695413.jpg', 'Bella Luxe Runner', TRUE, 1),
('prod-m-01', '/src/assets/images/bella_mens_oxford_1794318693998.jpg', 'Bella Bespoke Oxford', TRUE, 1),
('prod-m-02', '/src/assets/images/bella_luxury_sneaker_1794318695413.jpg', 'Bella Aero Carbon', TRUE, 1),
('prod-k-01', '/src/assets/images/bella_kids_sneaker_1794318694569.jpg', 'Bella Junior Comfort', TRUE, 1),
('prod-wh-01', '/src/assets/images/bella_mens_oxford_1794318693998.jpg', 'Wholesale Mix', TRUE, 1);

INSERT INTO product_colors (id, product_id, name, hex, image, in_stock) VALUES
('c-w01-black',  'prod-w-01', 'أسود ملكي فاخر', '#0A0A0A', '/src/assets/images/bella_womens_heels_1794318693049.jpg', TRUE),
('c-w01-nude',   'prod-w-01', 'بيج نود كلاسيكي', '#D7B49E', '/src/assets/images/bella_womens_heels_1794318693049.jpg', TRUE),
('c-w02-blue',   'prod-w-02', 'أبيض عاجي بلمسة زرقاء', '#00C8FF', '/src/assets/images/bella_luxury_sneaker_1794318695413.jpg', TRUE),
('c-w02-black',  'prod-w-02', 'أسود فحمي مطفي', '#171717', '/src/assets/images/bella_luxury_sneaker_1794318695413.jpg', TRUE),
('c-m01-cognac', 'prod-m-01', 'بني كوجناك محروق', '#7A3E1D', '/src/assets/images/bella_mens_oxford_1794318693998.jpg', TRUE),
('c-m01-black',  'prod-m-01', 'أسود كلاسيكي لامع', '#111111', '/src/assets/images/bella_mens_oxford_1794318693998.jpg', TRUE),
('c-m02-blue',   'prod-m-02', 'أسود بلمسات أزرق فاتح', '#00C8FF', '/src/assets/images/bella_luxury_sneaker_1794318695413.jpg', TRUE),
('c-m02-black',  'prod-m-02', 'أسود كامل Stealth Black', '#18181B', '/src/assets/images/bella_luxury_sneaker_1794318695413.jpg', TRUE),
('c-k01-tan',    'prod-k-01', 'بيج مع كحلي وبرتقالي', '#C49A6C', '/src/assets/images/bella_kids_sneaker_1794318694569.jpg', TRUE),
('c-k01-blue',   'prod-k-01', 'أبيض عاجي مع أزرق ملكي', '#2563EB', '/src/assets/images/bella_kids_sneaker_1794318694569.jpg', TRUE),
('c-wh01-mix',   'prod-wh-01', 'تشكيلة ألوان منوعة الأكثر طلباً', '#00C8FF', '/src/assets/images/bella_mens_oxford_1794318693998.jpg', TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO product_sizes (product_id, size, in_stock) VALUES
('prod-w-01', 36, TRUE), ('prod-w-01', 37, TRUE), ('prod-w-01', 38, TRUE), ('prod-w-01', 39, TRUE), ('prod-w-01', 40, TRUE),
('prod-w-02', 36, TRUE), ('prod-w-02', 37, TRUE), ('prod-w-02', 38, TRUE), ('prod-w-02', 39, TRUE), ('prod-w-02', 40, TRUE), ('prod-w-02', 41, TRUE),
('prod-m-01', 40, TRUE), ('prod-m-01', 41, TRUE), ('prod-m-01', 42, TRUE), ('prod-m-01', 43, TRUE), ('prod-m-01', 44, TRUE), ('prod-m-01', 45, TRUE),
('prod-m-02', 39, TRUE), ('prod-m-02', 40, TRUE), ('prod-m-02', 41, TRUE), ('prod-m-02', 42, TRUE), ('prod-m-02', 43, TRUE), ('prod-m-02', 44, TRUE), ('prod-m-02', 45, TRUE),
('prod-k-01', 28, TRUE), ('prod-k-01', 29, TRUE), ('prod-k-01', 30, TRUE), ('prod-k-01', 31, TRUE), ('prod-k-01', 32, TRUE), ('prod-k-01', 33, TRUE), ('prod-k-01', 34, TRUE), ('prod-k-01', 35, TRUE),
('prod-wh-01', 37, TRUE), ('prod-wh-01', 38, TRUE), ('prod-wh-01', 39, TRUE), ('prod-wh-01', 40, TRUE), ('prod-wh-01', 41, TRUE), ('prod-wh-01', 42, TRUE), ('prod-wh-01', 43, TRUE), ('prod-wh-01', 44, TRUE)
ON CONFLICT (product_id, size) DO NOTHING;
