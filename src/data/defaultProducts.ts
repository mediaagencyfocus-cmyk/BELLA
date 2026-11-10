import { Product, StoreSettings } from '../types';

export const initialSettings: StoreSettings = {
  storeName: 'BELLA SHOES',
  tagline: 'الأناقة تبدأ من خطواتك · أسلوب حياة وفخامة لا تضاهى',
  phone: '+212 600 123 456',
  whatsapp: '+212 600 123 456',
  email: 'contact@bellashoes.ma',
  address: 'شارع المسيرة الخضراء، المعاريف، الدار البيضاء، المغرب',
  city: 'الدار البيضاء',
  deliveryFee: 35,
  freeShippingPairThreshold: 2, // توصيل مجاني عند شراء زوجين أو أكثر
  adminEmail: 'jarfouribrahim51@gmail.com',
  adminPasswordHash: 'BellaAdmin2026!',
  instagramUrl: 'https://instagram.com/bellashoes.ma',
  facebookUrl: 'https://facebook.com/bellashoes.ma',
  tiktokUrl: 'https://tiktok.com/@bellashoes.ma',
  announcementText: 'تخفيضات حصرية بمناسبة التشكيلة الجديدة: توصيل مجاني لكافة المدن المغربية عند طلب زوجين فأكثر!'
};

export const defaultProducts: Product[] = [
  // --- أحذية نسائية ---
  {
    id: 'prod-w-01',
    name: 'حذاء كعب عالي ملكي فاخر - Bella Royale Stiletto',
    category: 'womens',
    price: 480,
    oldPrice: 599,
    rating: 4.9,
    reviewsCount: 38,
    isBestseller: true,
    discount: '20%-',
    description: 'حذاء كعب عالي كلاسيكي مصنوع من جلد العجل الإيطالي الفاخر مع حزام كاحل أنيق وإبزيم ذهبي مقاوم للصدأ. يوفر وسادة داخلية طبية توفر راحة فائقة حتى مع الكعب المرتفع، مثالي للسهرات والمناسبات الرسمية الفاخرة.',
    features: [
      'جلد طبيعي فاخر 100% مع معالجة إيطالية مقاومة للخدش',
      'ارتفاع الكعب 9.5 سم مع توازن هندسي محكم',
      'نعل داخلي طبي مبطن بطبقة رغوة الذاكرة لتخفيف الضغط',
      'إبزيم ذهبي أنيق قابل للتعديل بحزام كاحل راقي',
      'إمكانية القياس والتأكد من المقاس عند استلام الطلب'
    ],
    colors: [
      {
        id: 'c-black',
        name: 'أسود ملكي فاخر',
        hex: '#0A0A0A',
        image: '/src/assets/images/bella_womens_heels_1794318693049.jpg',
        inStock: true
      },
      {
        id: 'c-nude',
        name: 'بيج نود كلاسيكي',
        hex: '#D7B49E',
        image: '/src/assets/images/bella_womens_heels_1794318693049.jpg',
        inStock: true
      }
    ],
    sizes: [36, 37, 38, 39, 40],
    inStock: true,
    stockCount: 18,
    createdAt: '2026-03-01'
  },
  {
    id: 'prod-w-02',
    name: 'سنيكرز نسائي راقي بلمسات عصرية - Bella Luxe Runner',
    category: 'womens',
    price: 420,
    oldPrice: 490,
    rating: 4.8,
    reviewsCount: 29,
    isNew: true,
    discount: '15%-',
    description: 'سنيكرز نسائي فاخر يجمع بين الطابع الرياضي العصري وأناقة التفاصيل الدقيقة. نعل خفيف ومرن مصمم للاستخدام اليومي المريح دون التنازل عن فخامة المظهر.',
    features: [
      'جلد طبيعي ناعم الملمس وسهل التنظيف',
      'نعل خارجي مضاد للانزلاق ممتص للصدمات',
      'تهوية داخلية ممتازة تحافظ على انتعاش القدم طوال اليوم',
      'تفاصيل وتطريزات متقنة تعكس الجودة العالية'
    ],
    colors: [
      {
        id: 'c-white-gold',
        name: 'أبيض عاجي بلمسة نيون خفيفة',
        hex: '#00FF66',
        image: '/src/assets/images/bella_luxury_sneaker_1794318695413.jpg',
        inStock: true
      },
      {
        id: 'c-black-onyx',
        name: 'أسود فحمي مطفي',
        hex: '#171717',
        image: '/src/assets/images/bella_luxury_sneaker_1794318695413.jpg',
        inStock: true
      }
    ],
    sizes: [36, 37, 38, 39, 40, 41],
    inStock: true,
    stockCount: 24,
    createdAt: '2026-03-05'
  },

  // --- أحذية رجالية ---
  {
    id: 'prod-m-01',
    name: 'حذاء أكسفورد كلاسيكي كوجناك - Bella Bespoke Oxford',
    category: 'mens',
    price: 590,
    oldPrice: 720,
    rating: 5.0,
    reviewsCount: 46,
    isBestseller: true,
    discount: '18%-',
    description: 'تحفة يدوية كلاسيكية للرجل الأنيق، مصنع بأعلى درجات الحرفية من جلد العجل الطبيعي المصبوغ يدوياً بتدرج الكوجناك العميق. خياطة Goodyear متينة تضمن استدامة استثنائية لسنوات طويلة.',
    features: [
      'جلد طبيعي عالي الجودة Full Grain Calfskin',
      'خياطة Goodyear welted يدوية دقيقة',
      'نعل جلدي مسامي مدعم بكعب مطاطي مقاوم للتآكل',
      'قالب مريح يدعم تقوس باطن القدم طوال ساعات العمل',
      'يأتي مع كيس حماية قماشي فاخر خاص بالمتجر'
    ],
    colors: [
      {
        id: 'c-cognac',
        name: 'بني كوجناك محروق',
        hex: '#7A3E1D',
        image: '/src/assets/images/bella_mens_oxford_1794318693998.jpg',
        inStock: true
      },
      {
        id: 'c-black-classic',
        name: 'أسود كلاسيكي لامع',
        hex: '#111111',
        image: '/src/assets/images/bella_mens_oxford_1794318693998.jpg',
        inStock: true
      }
    ],
    sizes: [40, 41, 42, 43, 44, 45],
    inStock: true,
    stockCount: 15,
    createdAt: '2026-02-28'
  },
  {
    id: 'prod-m-02',
    name: 'سنيكرز رجالي كاجوال فخم - Bella Aero Carbon',
    category: 'mens',
    price: 450,
    oldPrice: 550,
    rating: 4.9,
    reviewsCount: 31,
    isNew: true,
    discount: '19%-',
    description: 'سنيكرز مصمم ببراعة يجمع بين اللون الأسود الملكي وتفاصيل الأخضر النيوني المميزة لهوية المتجر. يمنحك خفة حركة لا مثيل لها ومظهراً رياضياً فخماً يناسب الخروجات اليومية والأناقة الكاجوال.',
    features: [
      'تصميم ديناميكي مقاوم لضغط الاستخدام اليومي',
      'نعل هوائي مرن مريح جداً للمشي الطويل والقيادة',
      'تطريزات متينة وجلد ناعم مع لمسات النيون',
      'بطانة داخلية مضادة للروائح ومريحة للكاحل'
    ],
    colors: [
      {
        id: 'c-black-neon',
        name: 'أسود بلمسات أخضر نيون (#00FF66)',
        hex: '#00FF66',
        image: '/src/assets/images/bella_luxury_sneaker_1794318695413.jpg',
        inStock: true
      },
      {
        id: 'c-pure-black',
        name: 'أسود كامل Stealth Black',
        hex: '#18181B',
        image: '/src/assets/images/bella_luxury_sneaker_1794318695413.jpg',
        inStock: true
      }
    ],
    sizes: [39, 40, 41, 42, 43, 44, 45],
    inStock: true,
    stockCount: 22,
    createdAt: '2026-03-02'
  },

  // --- أحذية الأطفال ---
  {
    id: 'prod-k-01',
    name: 'حذاء أطفال مريح وعالي الجودة - Bella Junior Comfort',
    category: 'kids',
    price: 290,
    oldPrice: 360,
    rating: 4.8,
    reviewsCount: 22,
    isBestseller: true,
    discount: '20%-',
    description: 'حذاء أطفال مصمم بعناية فائقة لتوفير الحماية والمرونة للقدمين أثناء الحركة واللعب. خامات آمنة وجلد ناعم مع أربطة مرنة ونعل مطاطي مانع للانزلاق يدعم نمو القدم بشكل سليم.',
    features: [
      'جلد طبيعي مرن وبطانة ناعمة تحمي بشرة الطفل الحساسة',
      'نعل طبي مرن ينحني مع خطوة الطفل لدعم التوازن',
      'سهل الارتداء والخلع مع دعم ممتاز للكعب',
      'ألوان أنيقة تناسب الإطلالات اليومية والمناسبات'
    ],
    colors: [
      {
        id: 'c-tan-navy',
        name: 'بيج مع كحلي وبرتقالي متناسق',
        hex: '#C49A6C',
        image: '/src/assets/images/bella_kids_sneaker_1794318694569.jpg',
        inStock: true
      },
      {
        id: 'c-white-blue',
        name: 'أبيض عاجي مع أزرق ملكي',
        hex: '#2563EB',
        image: '/src/assets/images/bella_kids_sneaker_1794318694569.jpg',
        inStock: true
      }
    ],
    sizes: [28, 29, 30, 31, 32, 33, 34, 35],
    inStock: true,
    stockCount: 30,
    createdAt: '2026-03-04'
  },

  // --- البيع بالجملة ---
  {
    id: 'prod-wh-01',
    name: 'سلسلة أحذية نسائية ورجالية مشكلة - عرض الجملة للتجار',
    category: 'wholesale',
    price: 2800,
    oldPrice: 3800,
    rating: 5.0,
    reviewsCount: 14,
    discount: '26%-',
    wholesaleMinQty: 1, // عبوة واحدة = سلسلة 10-12 زوج
    description: 'عرض خاص ومميز لأصحاب المحلات التجارية وبائعي التجزئة في المغرب: كرتون سلسلة يحتوي على 10 أزواج من الأحذية الفاخرة المشكلة بمقاسات تجارية مطلوبة (37 إلى 44) وألوان متنوعة الأكثر طلباً في السوق. ربح مضمون وجودة استثنائية.',
    features: [
      'كرتون متكامل يضم 10 أزواج من أفضل موديلات BELLA SHOES',
      'توزيع متوازن للنمر الأكثر طلباً (النمر الأكثر مبيعاً 38-39 نسائي و 41-42-43 رجالي)',
      'علب فردية فاخرة لكل حذاء جاهزة للبيع مباشرة في محلك',
      'شحن مجاني لكافة المحلات والمدن بالمغرب مع إمكانية المعاينة قبل الدفع',
      'تخفيض إضافي للكميات الكبيرة عند الطلب عبر واتساب الإدارة'
    ],
    colors: [
      {
        id: 'c-series-mixed',
        name: 'تشكيلة ألوان منوعة الأكثر طلباً',
        hex: '#00FF66',
        image: '/src/assets/images/bella_mens_oxford_1794318693998.jpg',
        inStock: true
      }
    ],
    sizes: [37, 38, 39, 40, 41, 42, 43, 44],
    inStock: true,
    stockCount: 8,
    createdAt: '2026-03-06'
  }
];
