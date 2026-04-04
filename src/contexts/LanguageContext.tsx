'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, defaultLanguage } from '@/lib/i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load language from localStorage on mount
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && ['en', 'fr', 'ar'].includes(savedLang)) {
      setLanguageState(savedLang);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    // Update document direction based on language
    if (mounted) {
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      localStorage.setItem('language', language);
    }
  }, [language, mounted]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = language === 'en'
      ? require('@/lib/locales/en.json')
      : language === 'fr'
      ? require('@/lib/locales/fr.json')
      : require('@/lib/locales/ar.json');

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }

    return value || key;
  };

  const isRTL = language === 'ar';

  // Always provide context, even before mounting
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
