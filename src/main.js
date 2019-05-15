import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'

import '@fortawesome/fontawesome-free/css/all.min.css'
import 'highlight.js/styles/github.css'
import '@/assets/style/markdown.less'
import '@/assets/style/reset.less'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
