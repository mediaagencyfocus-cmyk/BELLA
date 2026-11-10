-- ==============================================================================
-- 👞 BELLA SHOES - Production Supabase PostgreSQL Database Schema
-- المتجر الإلكتروني الفاخر للأحذية والملابس الرياضية - المغرب
-- ==============================================================================

-- 1. تفعيل الإضافات الضرورية (Extensions)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. الجداول الأساسية (Core Tables)
-- ==============================================================================

-- جدول 1: المنتجات والأحذية (products)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS product_sizes CASCADE;
DROP TABLE IF EXISTS product_colors CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS store_settings CASCADE;
DROP TABLE IF EXISTS customer_profiles CASCADE;

CREATE TABLE products (
    id TEXT PRIMARY KEY, -- مثل: 'prod-w-01' أو UUID
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('womens', 'mens', 'kids', 'wholesale')),
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    old_price NUMERIC(10, 2) CHECK (old_price IS NULL OR old_price >= price),
    rating NUMERIC(3, 2) DEFAULT 5.0 CHECK (rating >= 0 AND rating <= 5),
    reviews_count INTEGER DEFAULT 0 CHECK (reviews_count >= 0),
    is_new BOOLEAN DEFAULT FALSE,
    is_bestseller BOOLEAN DEFAULT FALSE,
    discount VARCHAR(20), -- مثل: '20%-'
    description TEXT NOT NULL,
    features TEXT[] DEFAULT ARRAY[]::TEXT[],
    in_stock BOOLEAN DEFAULT TRUE,
    stock_count INTEGER DEFAULT 0 CHECK (stock_count >= 0),
    wholesale_min_qty INTEGER DEFAULT NULL, -- مخصص لقسم البيع بالجملة
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول 2: ألوان الحذاء والصور المرتبطة بكل لون (product_colors)
-- مهم جداً: النقر على أي لون يغير صورة الحذاء المعروضة فورياً إلى صورة اللون المختار
CREATE TABLE product_colors (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- مثل: 'أسود ملكي فاخر'
    hex VARCHAR(20) NOT NULL,  -- مثل: '#0A0A0A'
    image TEXT NOT NULL,       -- رابط صورة الحذاء بهذا اللون
    in_stock BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول 3: النمر والمقاسات المتوفرة لكل حذاء (product_sizes)
-- نظام النمر: حرية كاملة لإضافة وتعديل وحذف النمر لكل حذاء، دون نمر وهمية ثابتة
CREATE TABLE product_sizes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    size INTEGER NOT NULL CHECK (size >= 20 AND size <= 55),
    in_stock BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(product_id, size)
);

-- جدول 4: إعدادات المتجر والتواصل (store_settings)
-- متصل بزر واتساب الموحد وأرقام الدعم في المغرب
CREATE TABLE store_settings (
    id INTEGER PRIMARY KEY CHECK (id = 1), -- جدول من صف واحد (Singleton)
    store_name VARCHAR(150) NOT NULL DEFAULT 'BELLA SHOES',
    tagline TEXT NOT NULL DEFAULT 'الأناقة تبدأ من خطواتك · أسلوب حياة وفخامة لا تضاهى',
    phone VARCHAR(50) NOT NULL DEFAULT '+212 600 123 456',
    whatsapp VARCHAR(50) NOT NULL DEFAULT '+212 600 123 456',
    email VARCHAR(150) NOT NULL DEFAULT 'contact@bellashoes.ma',
    address TEXT NOT NULL DEFAULT 'شارع المسيرة الخضراء، المعاريف، الدار البيضاء، المغرب',
    city VARCHAR(100) NOT NULL DEFAULT 'الدار البيضاء',
    delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 35.00,
    free_shipping_pair_threshold INTEGER NOT NULL DEFAULT 2, -- توصيل مجاني عند شراء زوجين أو أكثر
    admin_email VARCHAR(150) NOT NULL DEFAULT 'jarfouribrahim51@gmail.com',
    admin_password_hash TEXT NOT NULL DEFAULT 'BellaAdmin2026!',
    instagram_url TEXT DEFAULT 'https://instagram.com/bellashoes.ma',
    facebook_url TEXT DEFAULT 'https://facebook.com/bellashoes.ma',
    tiktok_url TEXT DEFAULT 'https://tiktok.com/@bellashoes.ma',
    announcement_text TEXT DEFAULT 'التوصيل لجميع أنحاء المغرب خلال 24 ساعة · الدفع عند الاستلام مع إمكانية القياس',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول 5: الزبائن وحسابات المستخدمين (customer_profiles)
-- متصل مع نظام المصادقة Supabase Auth
CREATE TABLE customer_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    city VARCHAR(100),
    address TEXT,
    role VARCHAR(20) NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول 6: الطلبيات (orders)
-- يدعم الدفع عند الاستلام COD في مدن المغرب
CREATE TABLE orders (
    id TEXT PRIMARY KEY, -- مثل: 'ord-1741234567'
    order_number VARCHAR(50) NOT NULL UNIQUE, -- مثل: 'BS-84920'
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
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول 7: تفاصيل عناصر الطلبية (order_items)
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    color_name VARCHAR(100) NOT NULL,
    color_hex VARCHAR(20) NOT NULL,
    size INTEGER NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    image TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. الفهارس لتسريع البحث والأداء (Indexes)
-- ==============================================================================
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_in_stock ON products(in_stock);
CREATE INDEX idx_product_colors_product ON product_colors(product_id);
CREATE INDEX idx_product_sizes_product ON product_sizes(product_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_phone ON orders(phone);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- ==============================================================================
-- 4. الدوال والتحديث التلقائي للتاريخ (Functions & Triggers)
-- ==============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_store_settings_updated_at
BEFORE UPDATE ON store_settings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 5. سياسات الأمان والحماية (Row Level Security - RLS)
-- ==============================================================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 5.1. سياسات المنتجات والألوان والنمر (الجميع يقرأ، المسؤول فقط يعدل)
CREATE POLICY "Public Read Products" ON products
    FOR SELECT USING (true);

CREATE POLICY "Public Read Product Colors" ON product_colors
    FOR SELECT USING (true);

CREATE POLICY "Public Read Product Sizes" ON product_sizes
    FOR SELECT USING (true);

CREATE POLICY "Admin All Products" ON products
    FOR ALL USING (
        auth.role() = 'authenticated' AND (
            auth.jwt() ->> 'email' IN ('jarfouribrahim51@gmail.com', 'mediaagencyfocus@gmail.com')
            OR EXISTS (SELECT 1 FROM customer_profiles WHERE id = auth.uid() AND role = 'admin')
        )
    );

CREATE POLICY "Admin All Colors" ON product_colors
    FOR ALL USING (
        auth.role() = 'authenticated' AND (
            auth.jwt() ->> 'email' IN ('jarfouribrahim51@gmail.com', 'mediaagencyfocus@gmail.com')
            OR EXISTS (SELECT 1 FROM customer_profiles WHERE id = auth.uid() AND role = 'admin')
        )
    );

CREATE POLICY "Admin All Sizes" ON product_sizes
    FOR ALL USING (
        auth.role() = 'authenticated' AND (
            auth.jwt() ->> 'email' IN ('jarfouribrahim51@gmail.com', 'mediaagencyfocus@gmail.com')
            OR EXISTS (SELECT 1 FROM customer_profiles WHERE id = auth.uid() AND role = 'admin')
        )
    );

-- 5.2. سياسات إعدادات المتجر (الجميع يقرأ، المسؤول فقط يعدل)
CREATE POLICY "Public Read Settings" ON store_settings
    FOR SELECT USING (true);

CREATE POLICY "Admin Manage Settings" ON store_settings
    FOR ALL USING (
        auth.role() = 'authenticated' AND (
            auth.jwt() ->> 'email' IN ('jarfouribrahim51@gmail.com', 'mediaagencyfocus@gmail.com')
            OR EXISTS (SELECT 1 FROM customer_profiles WHERE id = auth.uid() AND role = 'admin')
        )
    );

-- 5.3. سياسات الطلبيات (أي زائر يمكنه تقديم طلب COD، والزبون يرى طلباته، والمسؤول يرى الكل)
CREATE POLICY "Public Insert Orders" ON orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Insert Order Items" ON order_items
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Customer Read Own Orders" ON orders
    FOR SELECT USING (
        auth.uid() = user_id OR
        (auth.role() = 'authenticated' AND (
            auth.jwt() ->> 'email' IN ('jarfouribrahim51@gmail.com', 'mediaagencyfocus@gmail.com')
            OR EXISTS (SELECT 1 FROM customer_profiles WHERE id = auth.uid() AND role = 'admin')
        ))
    );

CREATE POLICY "Customer Read Own Order Items" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_items.order_id
            AND (orders.user_id = auth.uid() OR auth.jwt() ->> 'email' IN ('jarfouribrahim51@gmail.com', 'mediaagencyfocus@gmail.com'))
        )
    );

CREATE POLICY "Admin Manage Orders" ON orders
    FOR ALL USING (
        auth.role() = 'authenticated' AND (
            auth.jwt() ->> 'email' IN ('jarfouribrahim51@gmail.com', 'mediaagencyfocus@gmail.com')
            OR EXISTS (SELECT 1 FROM customer_profiles WHERE id = auth.uid() AND role = 'admin')
        )
    );

CREATE POLICY "Admin Manage Order Items" ON order_items
    FOR ALL USING (
        auth.role() = 'authenticated' AND (
            auth.jwt() ->> 'email' IN ('jarfouribrahim51@gmail.com', 'mediaagencyfocus@gmail.com')
            OR EXISTS (SELECT 1 FROM customer_profiles WHERE id = auth.uid() AND role = 'admin')
        )
    );

-- ==============================================================================
-- 6. البيانات الافتراضية الأولية المطابقة 100% للمتجر (Seed Data)
-- ==============================================================================

-- 6.1. إعدادات المتجر
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
) ON CONFLICT (id) DO UPDATE SET
    store_name = EXCLUDED.store_name,
    tagline = EXCLUDED.tagline,
    phone = EXCLUDED.phone,
    whatsapp = EXCLUDED.whatsapp;

-- 6.2. المنتجات الأساسية
INSERT INTO products (
    id, name, category, price, old_price, rating, reviews_count,
    is_new, is_bestseller, discount, description, features, in_stock, stock_count, wholesale_min_qty
) VALUES 
(
    'prod-w-01',
    'حذاء كعب عالي ملكي فاخر - Bella Royale Stiletto',
    'womens',
    480.00,
    599.00,
    4.9,
    38,
    FALSE,
    TRUE,
    '20%-',
    'حذاء كعب عالي كلاسيكي مصنوع من جلد العجل الإيطالي الفاخر مع حزام كاحل أنيق وإبزيم ذهبي مقاوم للصدأ. يوفر وسادة داخلية طبية توفر راحة فائقة حتى مع الكعب المرتفع، مثالي للسهرات والمناسبات الرسمية الفاخرة.',
    ARRAY[
        'جلد طبيعي فاخر 100% مع معالجة إيطالية مقاومة للخدش',
        'ارتفاع الكعب 9.5 سم مع توازن هندسي محكم',
        'نعل داخلي طبي مبطن بطبقة رغوة الذاكرة لتخفيف الضغط',
        'إبزيم ذهبي أنيق قابل للتعديل بحزام كاحل راقي',
        'إمكانية القياس والتأكد من المقاس عند استلام الطلب'
    ],
    TRUE,
    18,
    NULL
),
(
    'prod-w-02',
    'سنيكرز نسائي راقي بلمسات عصرية - Bella Luxe Runner',
    'womens',
    420.00,
    490.00,
    4.8,
    29,
    TRUE,
    FALSE,
    '15%-',
    'سنيكرز نسائي فاخر يجمع بين الطابع الرياضي العصري وأناقة التفاصيل الدقيقة. نعل خفيف ومرن مصمم للاستخدام اليومي المريح دون التنازل عن فخامة المظهر.',
    ARRAY[
        'جلد طبيعي ناعم الملمس وسهل التنظيف',
        'نعل خارجي مضاد للانزلاق ممتص للصدمات',
        'تهوية داخلية ممتازة تحافظ على انتعاش القدم طوال اليوم',
        'تفاصيل وتطريزات متقنة تعكس الجودة العالية'
    ],
    TRUE,
    24,
    NULL
),
(
    'prod-m-01',
    'حذاء أكسفورد كلاسيكي كوجناك - Bella Bespoke Oxford',
    'mens',
    590.00,
    720.00,
    5.0,
    46,
    FALSE,
    TRUE,
    '18%-',
    'تحفة يدوية كلاسيكية للرجل الأنيق، مصنع بأعلى درجات الحرفية من جلد العجل الطبيعي المصبوغ يدوياً بتدرج الكوجناك العميق. خياطة Goodyear متينة تضمن استدامة استثنائية لسنوات طويلة.',
    ARRAY[
        'جلد طبيعي عالي الجودة Full Grain Calfskin',
        'خياطة Goodyear welted يدوية دقيقة',
        'نعل جلدي مسامي مدعم بكعب مطاطي مقاوم للتآكل',
        'قالب مريح يدعم تقوس باطن القدم طوال ساعات العمل',
        'يأتي مع كيس حماية قماشي فاخر خاص بالمتجر'
    ],
    TRUE,
    15,
    NULL
),
(
    'prod-m-02',
    'سنيكرز رجالي كاجوال فخم - Bella Aero Carbon',
    'mens',
    450.00,
    550.00,
    4.9,
    31,
    TRUE,
    FALSE,
    '19%-',
    'سنيكرز مصمم ببراعة يجمع بين اللون الأسود الملكي وتفاصيل الأخضر النيوني المميزة لهوية المتجر. يمنحك خفة حركة لا مثيل لها ومظهراً رياضياً فخماً يناسب الخروجات اليومية والأناقة الكاجوال.',
    ARRAY[
        'تصميم ديناميكي مقاوم لضغط الاستخدام اليومي',
        'نعل هوائي مرن مريح جداً للمشي الطويل والقيادة',
        'تطريزات متينة وجلد ناعم مع لمسات النيون',
        'بطانة داخلية مضادة للروائح ومريحة للكاحل'
    ],
    TRUE,
    22,
    NULL
),
(
    'prod-k-01',
    'حذاء أطفال مريح وعالي الجودة - Bella Junior Comfort',
    'kids',
    290.00,
    360.00,
    4.8,
    22,
    FALSE,
    TRUE,
    '20%-',
    'حذاء أطفال مصمم بعناية فائقة لتوفير الحماية والمرونة للقدمين أثناء الحركة واللعب. خامات آمنة وجلد ناعم مع أربطة مرنة ونعل مطاطي مانع للانزلاق يدعم نمو القدم بشكل سليم.',
    ARRAY[
        'جلد طبيعي مرن وبطانة ناعمة تحمي بشرة الطفل الحساسة',
        'نعل طبي مرن ينحني مع خطوة الطفل لدعم التوازن',
        'سهل الارتداء والخلع مع دعم ممتاز للكعب',
        'ألوان أنيقة تناسب الإطلالات اليومية والمناسبات'
    ],
    TRUE,
    30,
    NULL
),
(
    'prod-wh-01',
    'سلسلة أحذية نسائية ورجالية مشكلة - عرض الجملة للتجار',
    'wholesale',
    2800.00,
    3800.00,
    5.0,
    14,
    FALSE,
    FALSE,
    '26%-',
    'عرض خاص ومميز لأصحاب المحلات التجارية وبائعي التجزئة في المغرب: كرتون سلسلة يحتوي على 10 أزواج من الأحذية الفاخرة المشكلة بمقاسات تجارية مطلوبة (37 إلى 44) وألوان متنوعة الأكثر طلباً في السوق. ربح مضمون وجودة استثنائية.',
    ARRAY[
        'كرتون متكامل يضم 10 أزواج من أفضل موديلات BELLA SHOES',
        'توزيع متوازن للنمر الأكثر طلباً (النمر الأكثر مبيعاً 38-39 نسائي و 41-42-43 رجالي)',
        'علب فردية فاخرة لكل حذاء جاهزة للبيع مباشرة في محلك',
        'شحن مجاني لكافة المحلات والمدن بالمغرب مع إمكانية المعاينة قبل الدفع'
    ],
    TRUE,
    8,
    1
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    price = EXCLUDED.price,
    description = EXCLUDED.description;

-- 6.3. ألوان الأحذية (Product Colors)
INSERT INTO product_colors (id, product_id, name, hex, image, in_stock) VALUES
('c-w01-black', 'prod-w-01', 'أسود ملكي فاخر', '#0A0A0A', '/src/assets/images/bella_womens_heels_1794318693049.jpg', TRUE),
('c-w01-nude',  'prod-w-01', 'بيج نود كلاسيكي', '#D7B49E', '/src/assets/images/bella_womens_heels_1794318693049.jpg', TRUE),

('c-w02-neon',  'prod-w-02', 'أبيض عاجي بلمسة نيون خفيفة', '#00FF66', '/src/assets/images/bella_luxury_sneaker_1794318695413.jpg', TRUE),
('c-w02-black', 'prod-w-02', 'أسود فحمي مطفي', '#171717', '/src/assets/images/bella_luxury_sneaker_1794318695413.jpg', TRUE),

('c-m01-cognac', 'prod-m-01', 'بني كوجناك محروق', '#7A3E1D', '/src/assets/images/bella_mens_oxford_1794318693998.jpg', TRUE),
('c-m01-black',  'prod-m-01', 'أسود كلاسيكي لامع', '#111111', '/src/assets/images/bella_mens_oxford_1794318693998.jpg', TRUE),

('c-m02-neon',   'prod-m-02', 'أسود بلمسات أخضر نيون (#00FF66)', '#00FF66', '/src/assets/images/bella_luxury_sneaker_1794318695413.jpg', TRUE),
('c-m02-black',  'prod-m-02', 'أسود كامل Stealth Black', '#18181B', '/src/assets/images/bella_luxury_sneaker_1794318695413.jpg', TRUE),

('c-k01-tan',    'prod-k-01', 'بيج مع كحلي وبرتقالي متناسق', '#C49A6C', '/src/assets/images/bella_kids_sneaker_1794318694569.jpg', TRUE),
('c-k01-blue',   'prod-k-01', 'أبيض عاجي مع أزرق ملكي', '#2563EB', '/src/assets/images/bella_kids_sneaker_1794318694569.jpg', TRUE),

('c-wh01-mix',   'prod-wh-01', 'تشكيلة ألوان منوعة الأكثر طلباً', '#00FF66', '/src/assets/images/bella_mens_oxford_1794318693998.jpg', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 6.4. مقاسات الأحذية (Product Sizes)
INSERT INTO product_sizes (product_id, size, in_stock) VALUES
-- حذاء نسائي كعب (36 إلى 40)
('prod-w-01', 36, TRUE), ('prod-w-01', 37, TRUE), ('prod-w-01', 38, TRUE), ('prod-w-01', 39, TRUE), ('prod-w-01', 40, TRUE),

-- سنيكرز نسائي (36 إلى 41)
('prod-w-02', 36, TRUE), ('prod-w-02', 37, TRUE), ('prod-w-02', 38, TRUE), ('prod-w-02', 39, TRUE), ('prod-w-02', 40, TRUE), ('prod-w-02', 41, TRUE),

-- حذاء رجالي أكسفورد (40 إلى 45)
('prod-m-01', 40, TRUE), ('prod-m-01', 41, TRUE), ('prod-m-01', 42, TRUE), ('prod-m-01', 43, TRUE), ('prod-m-01', 44, TRUE), ('prod-m-01', 45, TRUE),

-- سنيكرز رجالي كاجوال (39 إلى 45)
('prod-m-02', 39, TRUE), ('prod-m-02', 40, TRUE), ('prod-m-02', 41, TRUE), ('prod-m-02', 42, TRUE), ('prod-m-02', 43, TRUE), ('prod-m-02', 44, TRUE), ('prod-m-02', 45, TRUE),

-- أحذية أطفال (28 إلى 35)
('prod-k-01', 28, TRUE), ('prod-k-01', 29, TRUE), ('prod-k-01', 30, TRUE), ('prod-k-01', 31, TRUE), ('prod-k-01', 32, TRUE), ('prod-k-01', 33, TRUE), ('prod-k-01', 34, TRUE), ('prod-k-01', 35, TRUE),

-- بالجملة (37 إلى 44)
('prod-wh-01', 37, TRUE), ('prod-wh-01', 38, TRUE), ('prod-wh-01', 39, TRUE), ('prod-wh-01', 40, TRUE), ('prod-wh-01', 41, TRUE), ('prod-wh-01', 42, TRUE), ('prod-wh-01', 43, TRUE), ('prod-wh-01', 44, TRUE)
ON CONFLICT (product_id, size) DO NOTHING;
