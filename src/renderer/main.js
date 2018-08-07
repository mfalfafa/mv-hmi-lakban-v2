import Vue from 'vue'
import axios from 'axios'
import BootstrapVue from 'bootstrap-vue'

import App from './App'
import router from './router'
import store from './store'
// import VueSocketio from 'vue-socket.io'

import '@/assets/css/bootstrap.min.css'
import '@/assets/css/style.css'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

// Vue.use(VueSocketio, 'http://192.168.10.250:5000');
Vue.use(BootstrapVue);

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
