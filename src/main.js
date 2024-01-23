import Vue from 'vue'
import App from './App.vue'

// 插件
import './plugins'
// import './mock'

Vue.config.productionTip = false

import router from './router/routers'
import './router'
import store from './store'
import i18n from '@/plugins/i18n'

new Vue({
  render: h => h(App),
  router,
  store,
  i18n
}).$mount('#app')
