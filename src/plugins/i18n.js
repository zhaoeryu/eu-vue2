import Vue from 'vue'
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)

import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import { defaultLocale, zh, en } from '@/locale'

export default new VueI18n({
  // 语言标识
  locale: defaultLocale,
  // this.$i18n.locale 通过切换locale的值来实现语言切换
  fallbackLocale: defaultLocale,
  messages: {
    zh: {
      ...zh,
      ...zhLocale
    },
    en: {
      ...en,
      ...enLocale
    }
  }
})
