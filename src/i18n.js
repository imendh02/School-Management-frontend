import { createI18n } from 'vue-i18n';
import enTranslations from './locales/en.json';
import frTranslations from './locales/fr.json';

const messages = {
    en: enTranslations,
    fr: frTranslations
};

const i18n = createI18n({
  locale: 'en',
  messages,
  legacy: false, 
});

export default i18n;