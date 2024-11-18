import { STORAGE_KEY_LOCALE } from '@/utils/constants'
import { defaultSetting } from '@/settings'

export const LOCALE_OPTIONS = [
  { label: '中文', value: 'zh_CN' },
  { label: 'English', value: 'en_US' },
]

export const defaultLocale = localStorage.getItem(STORAGE_KEY_LOCALE) || defaultSetting.locale

export const en_US = importLocale('en_US');
export const zh_CN = importLocale('zh_CN');

function importLocale(lang) {
  const files = require.context('@/views', true, /\.js/)
  const locales = files.keys()
    .filter(key => key.endsWith(`/locale/${lang}.js`))
    .map(key => files(key).default)
    .reduce((acc, cur) => {
      return { ...acc, ...cur }
    }, {})
  return {
    ...require(`@/locale/${lang}/settings`).default,
    ...locales
  };
}
