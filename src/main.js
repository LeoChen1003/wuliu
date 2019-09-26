import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Cookies from 'js-cookie'
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import i18n from './lang' // internationalization
// import { Message } from 'element-ui'
// Vue.component(Message)
Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})
// Vue.prototype.$message = Message
Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
