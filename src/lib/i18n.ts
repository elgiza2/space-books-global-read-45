// Multi-language support for Space Books
export type Language = {
  code: string;
  name: string;
  direction: 'ltr' | 'rtl';
};

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'ar', name: 'العربية', direction: 'rtl' },
  { code: 'en', name: 'English', direction: 'ltr' },
  { code: 'es', name: 'Español', direction: 'ltr' },
  { code: 'fr', name: 'Français', direction: 'ltr' },
  { code: 'de', name: 'Deutsch', direction: 'ltr' },
  { code: 'it', name: 'Italiano', direction: 'ltr' },
  { code: 'pt', name: 'Português', direction: 'ltr' },
  { code: 'ru', name: 'Русский', direction: 'ltr' },
  { code: 'zh', name: '中文', direction: 'ltr' },
  { code: 'ja', name: '日本語', direction: 'ltr' },
  { code: 'ko', name: '한국어', direction: 'ltr' },
  { code: 'hi', name: 'हिन्दी', direction: 'ltr' },
  { code: 'tr', name: 'Türkçe', direction: 'ltr' },
  { code: 'pl', name: 'Polski', direction: 'ltr' },
  { code: 'nl', name: 'Nederlands', direction: 'ltr' },
  { code: 'sv', name: 'Svenska', direction: 'ltr' },
  { code: 'da', name: 'Dansk', direction: 'ltr' },
  { code: 'no', name: 'Norsk', direction: 'ltr' },
  { code: 'fi', name: 'Suomi', direction: 'ltr' },
  { code: 'he', name: 'עברית', direction: 'rtl' },
  { code: 'th', name: 'ไทย', direction: 'ltr' },
  { code: 'vi', name: 'Tiếng Việt', direction: 'ltr' },
  { code: 'id', name: 'Bahasa Indonesia', direction: 'ltr' },
  { code: 'ms', name: 'Bahasa Melayu', direction: 'ltr' },
  { code: 'tl', name: 'Filipino', direction: 'ltr' },
  { code: 'uk', name: 'Українська', direction: 'ltr' },
  { code: 'cs', name: 'Čeština', direction: 'ltr' },
  { code: 'sk', name: 'Slovenčina', direction: 'ltr' },
  { code: 'hu', name: 'Magyar', direction: 'ltr' },
  { code: 'ro', name: 'Română', direction: 'ltr' }
];

export type TranslationKeys = {
  // Navigation
  'nav.home': string;
  'nav.profile': string;
  'nav.library': string;
  'nav.settings': string;
  
  // Home page
  'home.title': string;
  'home.subtitle': string;
  'home.featured_books': string;
  'home.all_books': string;
  
  // Book card
  'book.buy_now': string;
  'book.download': string;
  'book.price': string;
  'book.purchased': string;
  'book.download_book': string;
  'book.connect_wallet_purchase': string;
  'book.connect_wallet_to_purchase': string;
  'book.featured': string;
  'book.author': string;
  
  // Profile
  'profile.title': string;
  'profile.my_books': string;
  'profile.no_books': string;
  'profile.purchased_books': string;
  'profile.connect_wallet_message': string;
  'profile.book_singular': string;
  'profile.book_plural': string;
  'profile.no_books_title': string;
  'profile.no_books_message': string;
  
  // Admin
  'admin.title': string;
  'admin.add_book': string;
  'admin.edit_book': string;
  'admin.delete_book': string;
  'admin.book_name': string;
  'admin.book_price': string;
  'admin.book_description': string;
  'admin.upload_cover': string;
  'admin.upload_file': string;
  'admin.access_hint': string;
  
  // Common
  'common.save': string;
  'common.cancel': string;
  'common.delete': string;
  'common.edit': string;
  'common.loading': string;
  'common.error': string;
  'common.success': string;
  'common.connect_wallet': string;
  'common.wallet_connected': string;
  'common.payment_processing': string;
  'common.payment_success': string;
  'common.payment_failed': string;
  'common.language': string;
  'common.wallet': string;
};

// Complete translations for all supported languages
export const translations: Record<string, TranslationKeys> = {
  ar: {
    'nav.home': 'الرئيسية',
    'nav.profile': 'الملف الشخصي',
    'nav.library': 'مكتبتي',
    'nav.settings': 'الإعدادات',
    'home.title': 'كتب الفضاء',
    'home.subtitle': 'اكتشف مجموعة رائعة من الكتب الرقمية',
    'home.featured_books': 'الكتب المميزة',
    'home.all_books': 'جميع الكتب',
    'book.buy_now': 'اشتري الآن',
    'book.download': 'تحميل',
    'book.price': 'السعر',
    'book.purchased': 'تم الشراء',
    'book.download_book': 'تحميل الكتاب',
    'book.connect_wallet_purchase': 'ربط المحفظة للشراء',
    'book.connect_wallet_to_purchase': 'اربط محفظة TON لشراء الكتب',
    'book.featured': 'مميز',
    'book.author': 'المؤلف',
    'profile.title': 'الملف الشخصي',
    'profile.my_books': 'كتبي',
    'profile.no_books': 'لم تشتر أي كتب بعد',
    'profile.purchased_books': 'الكتب المشتراة',
    'profile.connect_wallet_message': 'يرجى ربط محفظتك لعرض ملفك الشخصي',
    'profile.book_singular': 'كتاب',
    'profile.book_plural': 'كتب',
    'profile.no_books_title': 'لا توجد كتب بعد',
    'profile.no_books_message': 'تصفح مجموعتنا وابدأ ببناء مكتبتك الفضائية!',
    'admin.title': 'لوحة الإدارة',
    'admin.add_book': 'إضافة كتاب',
    'admin.edit_book': 'تعديل الكتاب',
    'admin.delete_book': 'حذف الكتاب',
    'admin.book_name': 'اسم الكتاب',
    'admin.book_price': 'السعر',
    'admin.book_description': 'الوصف',
    'admin.upload_cover': 'رفع الغلاف',
    'admin.upload_file': 'رفع الملف',
    'admin.access_hint': 'وصول الإدارة: {count}/5 نقرات',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.delete': 'حذف',
    'common.edit': 'تعديل',
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجح',
    'common.connect_wallet': 'ربط المحفظة',
    'common.wallet_connected': 'تم ربط المحفظة',
    'common.payment_processing': 'جاري المعالجة...',
    'common.payment_success': 'تم الدفع بنجاح',
    'common.payment_failed': 'فشل الدفع',
    'common.language': 'اللغة',
    'common.wallet': 'المحفظة',
  },
  en: {
    'nav.home': 'Home',
    'nav.profile': 'Profile',
    'nav.library': 'My Library',
    'nav.settings': 'Settings',
    'home.title': 'Space Books',
    'home.subtitle': 'Discover an amazing collection of digital books',
    'home.featured_books': 'Featured Books',
    'home.all_books': 'All Books',
    'book.buy_now': 'Buy Now',
    'book.download': 'Download',
    'book.price': 'Price',
    'book.purchased': 'Purchased',
    'book.download_book': 'Download Book',
    'book.connect_wallet_purchase': 'Connect Wallet to Purchase',
    'book.connect_wallet_to_purchase': 'Connect your TON wallet to purchase books',
    'book.featured': 'Featured',
    'book.author': 'Author',
    'profile.title': 'Profile',
    'profile.my_books': 'My Books',
    'profile.no_books': 'You haven\'t purchased any books yet',
    'profile.purchased_books': 'Purchased Books',
    'profile.connect_wallet_message': 'Please connect your wallet to view your profile',
    'profile.book_singular': 'book',
    'profile.book_plural': 'books',
    'profile.no_books_title': 'No Books Yet',
    'profile.no_books_message': 'Browse our collection and start building your space library!',
    'admin.title': 'Admin Panel',
    'admin.add_book': 'Add Book',
    'admin.edit_book': 'Edit Book',
    'admin.delete_book': 'Delete Book',
    'admin.book_name': 'Book Name',
    'admin.book_price': 'Price',
    'admin.book_description': 'Description',
    'admin.upload_cover': 'Upload Cover',
    'admin.upload_file': 'Upload File',
    'admin.access_hint': 'Admin access: {count}/5 clicks',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.connect_wallet': 'Connect Wallet',
    'common.wallet_connected': 'Wallet Connected',
    'common.payment_processing': 'Processing...',
    'common.payment_success': 'Payment Successful',
    'common.payment_failed': 'Payment Failed',
    'common.language': 'Language',
    'common.wallet': 'Wallet',
  }
};

// Generate basic translations for remaining languages using English as fallback
const baseTranslations: TranslationKeys = translations.en;

SUPPORTED_LANGUAGES.forEach(lang => {
  if (!translations[lang.code] && lang.code !== 'en') {
    translations[lang.code] = { ...baseTranslations };
  }
});

// Auto-detect language from browser or Telegram
export function detectLanguage(): string {
  // Try to get language from Telegram WebApp if available
  if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.initDataUnsafe?.user?.language_code) {
    const telegramLang = (window as any).Telegram.WebApp.initDataUnsafe.user.language_code;
    if (SUPPORTED_LANGUAGES.find(lang => lang.code === telegramLang)) {
      return telegramLang;
    }
  }
  
  // Fallback to browser language
  if (typeof window !== 'undefined') {
    const browserLang = navigator.language.split('-')[0];
    if (SUPPORTED_LANGUAGES.find(lang => lang.code === browserLang)) {
      return browserLang;
    }
  }
  
  // Default to English
  return 'en';
}