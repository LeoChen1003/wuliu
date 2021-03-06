import Vue from "vue";
import VueI18n from "vue-i18n";
import Cookies from "js-cookie";
import elementEnLocale from "element-ui/lib/locale/lang/en"; // element-ui lang
import elementZhLocale from "element-ui/lib/locale/lang/zh-CN"; // element-ui lang
import elementThLocale from "element-ui/lib/locale/lang/th"; // element-ui lang
import enLocale from "./en.json";
import zhLocale from "./zh.json";
import thLocale from "./th.json";

Vue.use(VueI18n);

const messages = {
  en_US: {
    ...enLocale,
    ...elementEnLocale,
  },
  zh_CN: {
    ...zhLocale,
    ...elementZhLocale,
  },
  th_TH: {
    ...thLocale,
    ...elementThLocale,
  },
};
export function getLanguage() {
  const chooseLanguage = Cookies.get("language");
  if (chooseLanguage) return chooseLanguage;

  // if has not choose language
  const language = (navigator.language || navigator.browserLanguage).toLowerCase();
  const locales = Object.keys(messages);
  for (const locale of locales) {
    if (language.indexOf(locale) > -1) {
      return locale;
    }
  }
  return "th_TH";
}
const i18n = new VueI18n({
  // set locale
  // options: en | zh | es
  locale: getLanguage(),
  // set locale messages
  messages,
  silentTranslationWarn: true,
});

export default i18n;
