import Vue from 'vue'
import App from './App.vue'
import MomentumScroll from './lib/index'

Vue.use(MomentumScroll)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
