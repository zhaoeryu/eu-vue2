import Vue from 'vue'
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)

import enUSLocale from 'element-ui/lib/locale/lang/en'
import zhCNLocale from 'element-ui/lib/locale/lang/zh-CN'
import { defaultLocale, zh_CN, en_US } from '@/locale'

export default new VueI18n({
  // 语言标识
  locale: defaultLocale,
  // this.$i18n.locale 通过切换locale的值来实现语言切换
  fallbackLocale: defaultLocale,
  messages: {
    zh_CN: {
      ...zh_CN,
      ...zhCNLocale
    },
    en_US: {
      ...en_US,
      ...enUSLocale
    }
  }
})

/**
 * i18n _转-
 * @param {string} locale 语言标识
 * @returns {string}
 */
export function i18nConvertConnector(locale) {
  return locale.replace('_', '-')
}
