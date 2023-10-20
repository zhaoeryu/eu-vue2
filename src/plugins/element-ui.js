import Vue from 'vue'

// ElementUI样式
import '@/theme/index.css'
// import 'element-ui/lib/theme-chalk/index.css';

// ElementUI
import ElementUI from 'element-ui'
// Vue.use(ElementUI)
Vue.use(ElementUI, {
  size: 'small'
})

// 图片预览
import ElImageViewer from 'element-ui/packages/image/src/image-viewer.vue'
Vue.component('ElImageViewer', ElImageViewer)
