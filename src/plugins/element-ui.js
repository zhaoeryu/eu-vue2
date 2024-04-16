import Vue from 'vue'

// ElementUI样式
import '@/theme/index.css'
import '@/theme/dark_color.css'
// import 'element-ui/lib/theme-chalk/index.css';

import i18n from './i18n'

// ElementUI
import ElementUI from 'element-ui'
// Vue.use(ElementUI)
Vue.use(ElementUI, {
  size: 'small',
  i18n: (key, value) => i18n.t(key, value)
})

// 图片预览
import ElImageViewer from 'element-ui/packages/image/src/image-viewer.vue'
Vue.component('ElImageViewer', ElImageViewer)
