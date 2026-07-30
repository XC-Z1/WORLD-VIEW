import translationsData from './translations.json';

export type LanguageCode = 'en' | 'bn' | 'es' | 'fr' | 'de' | 'ja' | 'zh';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'bn', label: 'বাংলা', flag: '🇧🇩' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
];

export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = (translationsData.ui as any) || {};

export const DESTINATION_TRANSLATIONS: Record<string, any> = (translationsData.destinations as any) || {};

export function getTranslation(lang: LanguageCode, key: string, fallback?: string): string {
  const langDict = TRANSLATIONS[lang];
  if (langDict && langDict[key]) {
    return langDict[key];
  }
  const enDict = TRANSLATIONS['en'];
  if (enDict && enDict[key]) {
    return enDict[key];
  }
  return fallback || key;
}

export function getTranslatedDestination(dest: any, lang: LanguageCode): any {
  if (!dest) return dest;
  if (lang === 'en') return dest;

  const baseNameKey = dest.name || "";
  let override = DESTINATION_TRANSLATIONS[baseNameKey]?.[lang];

  if (!override) {
    if (dest.id === 1 || baseNameKey.toLowerCase().includes('everest')) override = DESTINATION_TRANSLATIONS["Everest"]?.[lang];
    else if (dest.id === 2 || baseNameKey.toLowerCase().includes('k2')) override = DESTINATION_TRANSLATIONS["K2"]?.[lang];
    else if (dest.id === 3 || baseNameKey.toLowerCase().includes('fuji')) override = DESTINATION_TRANSLATIONS["Mt. Fuji"]?.[lang];
    else if (dest.id === 4 || baseNameKey.toLowerCase().includes('sundarban')) override = DESTINATION_TRANSLATIONS["Sundarbans"]?.[lang];
    else if (dest.id === 5 || baseNameKey.toLowerCase().includes('sajek')) override = DESTINATION_TRANSLATIONS["Sajek Valley"]?.[lang];
    else if (dest.id === 6 || baseNameKey.toLowerCase().includes('cox')) override = DESTINATION_TRANSLATIONS["Cox's Bazar"]?.[lang];
  }

  if (!override) {
    return dest;
  }

  const cloned = { ...dest };
  if (override.name) cloned.name = override.name;
  if (override.subtitle) cloned.subtitle = override.subtitle;
  if (override.desc) cloned.desc = override.desc;
  if (override.location) cloned.location = override.location;
  if (override.zoneTitle) cloned.zoneTitle = override.zoneTitle;
  if (override.elevationMeters) cloned.elevationMeters = override.elevationMeters;
  if (override.introTitle) cloned.introTitle = override.introTitle;
  if (override.introText) cloned.introText = override.introText;
  if (override.historySub) cloned.historySub = override.historySub;
  if (override.historyTitle) cloned.historyTitle = override.historyTitle;
  if (override.historyText1) cloned.historyText1 = override.historyText1;
  if (override.historyText2) cloned.historyText2 = override.historyText2;
  if (override.historyCalloutLabel) cloned.historyCalloutLabel = override.historyCalloutLabel;

  if (override.facts && Array.isArray(cloned.facts)) {
    cloned.facts = cloned.facts.map((fact: any, index: number) => {
      const factOverride = override.facts[index];
      if (factOverride) {
        return {
          ...fact,
          title: factOverride.title || fact.title,
          desc: factOverride.desc || fact.desc,
        };
      }
      return fact;
    });
  }

  return cloned;
}
