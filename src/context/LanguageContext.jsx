import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import translations from '../i18n/translations';

const LanguageContext = createContext(null);

const RTL_LANGUAGES = ['ar'];
const STORAGE_KEY = 'soundfarm_lang';

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || 'fr';
  });

  const isRTL = RTL_LANGUAGES.includes(lang);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    localStorage.setItem(STORAGE_KEY, lang);
  }, [lang, isRTL]);

  const changeLang = useCallback((newLang) => {
    if (translations[newLang]) {
      setLang(newLang);
    }
  }, []);

  // t('cle') -> texte traduit ; t('cle', { n: 3 }) -> remplace {n} dans le texte
  const t = useCallback(
    (key, vars) => {
      let text = translations[lang]?.[key] ?? translations.fr[key] ?? key;
      if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
          text = text.replace(`{${k}}`, v);
        });
      }
      return text;
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, isRTL, changeLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
