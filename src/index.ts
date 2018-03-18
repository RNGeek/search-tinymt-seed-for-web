import Vue from 'vue'
import App from './App.vue'

// Off the hint which displays when devtool is started.
Vue.config.productionTip = false

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  render: (h) => h(App),
})
