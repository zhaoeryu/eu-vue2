import { STORAGE_KEY_LOCALE } from '@/utils/constants'
import { defaultSetting } from '@/settings'

export const LOCALE_OPTIONS = [
  { label: '中文', value: 'zh' },
  { label: 'English', value: 'en' },
]

export const defaultLocale = localStorage.getItem(STORAGE_KEY_LOCALE) || defaultSetting.locale

export const en = importLocale('en-US');
export const zh = importLocale('zh-CN');

function importLocale(lang) {
  return {
    ...require(`@/locale/${lang}/settings`).default,
    ...require(`@/views/login/locale/${lang}`).default,
    ...require(`@/views/monitor/online/locale/${lang}`).default,
    ...require(`@/views/system/depts/locale/${lang}`).default,
    ...require(`@/views/system/dicts/locale/${lang}`).default,
    ...require(`@/views/system/jobs/locale/${lang}`).default,
    ...require(`@/views/system/menus/locale/${lang}`).default,
    ...require(`@/views/system/oper-logs/locale/${lang}`).default,
    ...require(`@/views/system/personal-center/locale/${lang}`).default,
    ...require(`@/views/system/posts/locale/${lang}`).default,
    ...require(`@/views/system/roles/locale/${lang}`).default,
    ...require(`@/views/system/sysNotice/locale/${lang}`).default,
    ...require(`@/views/system/users/locale/${lang}`).default,
    ...require(`@/views/system/usual-menus/locale/${lang}`).default
  };
}
