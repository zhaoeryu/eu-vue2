import Vue from 'vue'
import App from './App.vue'

// 插件
import './plugins'
// import './mock'

Vue.config.productionTip = false

import router from './router/routers'
import './router'
import store from './store'

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
