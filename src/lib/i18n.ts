import en from './locales/en.json';
import fr from './locales/fr.json';
import ar from './locales/ar.json';

export type Language = 'en' | 'fr' | 'ar';

export const translations = {
  en,
  fr,
  ar,
};

export type TranslationKey = keyof typeof translations.en;

export const defaultLanguage: Language = 'en';

export function getTranslation(lang: Language, key: string): string {
  const keys = key.split('.');
  let value: any = translations[lang];

  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) break;
  }

  return value || key;
}
