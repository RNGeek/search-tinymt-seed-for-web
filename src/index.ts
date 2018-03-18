import Vue from 'vue'
import App from './App.vue'

// Off the hint which displays when devtool is started.
Vue.config.productionTip = false

// tslint:disable-next-line:no-unused-expression
new Vue({
  el: '#app',
  render: (h) => h(App),
})
