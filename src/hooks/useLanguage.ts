
import { useState, useEffect, createContext, useContext } from 'react';
import { translations, type TranslationKeys, SUPPORTED_LANGUAGES, detectLanguage } from '@/lib/i18n';

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  t: (key: keyof TranslationKeys) => string;
  isRTL: boolean;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export function useLanguageLogic() {
  // Auto-detect language from Telegram or browser
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    // Try localStorage first, then auto-detect
    const saved = localStorage.getItem('space-books-language');
    if (saved && translations[saved]) {
      return saved;
    }
    return detectLanguage();
  });

  useEffect(() => {
    // Update document attributes when language changes
    const language = SUPPORTED_LANGUAGES.find(lang => lang.code === currentLanguage);
    if (language) {
      localStorage.setItem('space-books-language', currentLanguage);
      document.documentElement.setAttribute('lang', currentLanguage);
      document.documentElement.setAttribute('dir', language.direction);
      
      // Update page title based on language
      const title = translations[currentLanguage]?.['home.title'] || 'Space Books';
      const subtitle = translations[currentLanguage]?.['home.subtitle'] || 'Discover Amazing Digital Books';
      document.title = `${title} - ${subtitle}`;
    }
  }, [currentLanguage]);

  const setLanguage = (lang: string) => {
    if (SUPPORTED_LANGUAGES.find(l => l.code === lang)) {
      setCurrentLanguage(lang);
    }
  };

  const t = (key: keyof TranslationKeys): string => {
    return translations[currentLanguage]?.[key] || translations['en'][key] || key;
  };

  const isRTL = SUPPORTED_LANGUAGES.find(lang => lang.code === currentLanguage)?.direction === 'rtl';

  return {
    currentLanguage,
    setLanguage,
    t,
    isRTL
  };
}
