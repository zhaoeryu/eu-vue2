import Vue from 'vue'
import DomZIndex from 'dom-zindex'

// ElementUI样式
import '@/theme/index.css'
import '@/theme/dark_color.css'
// import 'element-ui/lib/theme-chalk/index.css';

import i18n from './i18n'

// ElementUI
import ElementUI from 'element-ui'
// Vue.use(ElementUI)
Vue.use(ElementUI, {
  size: 'mini',
  i18n: (key, value) => i18n.t(key, value)
})

// element-ui 和 vxe-table使用统一z-index管理方案
const PopupManager = require('element-ui/lib/utils/popup/popup-manager').default;
PopupManager.nextZIndex = () => {
  const zIndex = DomZIndex.getNext()
  PopupManager.zIndex = zIndex
  return zIndex
}

// 图片预览
import ElImageViewer from 'element-ui/packages/image/src/image-viewer.vue'
Vue.component('ElImageViewer', ElImageViewer)
