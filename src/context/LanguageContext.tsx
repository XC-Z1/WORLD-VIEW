import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageCode, LanguageOption, SUPPORTED_LANGUAGES, getTranslation, getTranslatedDestination } from '../translations';

interface LanguageContextType {
  currentLang: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, fallback?: string) => string;
  translateDestination: (dest: any) => any;
  supportedLanguages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLang, setCurrentLangState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('app_lang') as LanguageCode;
    return (saved && SUPPORTED_LANGUAGES.some(l => l.code === saved)) ? saved : 'en';
  });

  const setLanguage = (lang: LanguageCode) => {
    setCurrentLangState(lang);
    localStorage.setItem('app_lang', lang);
    window.dispatchEvent(new Event('languageChange'));
  };

  useEffect(() => {
    const handleLangEvent = () => {
      const saved = localStorage.getItem('app_lang') as LanguageCode;
      if (saved && saved !== currentLang) {
        setCurrentLangState(saved);
      }
    };
    window.addEventListener('languageChange', handleLangEvent);
    window.addEventListener('storage', handleLangEvent);
    return () => {
      window.removeEventListener('languageChange', handleLangEvent);
      window.removeEventListener('storage', handleLangEvent);
    };
  }, [currentLang]);

  const t = (key: string, fallback?: string) => {
    return getTranslation(currentLang, key, fallback);
  };

  const translateDestination = (dest: any) => {
    return getTranslatedDestination(dest, currentLang);
  };

  return (
    <LanguageContext.Provider value={{ currentLang, setLanguage, t, translateDestination, supportedLanguages: SUPPORTED_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
