import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/ja'
import App from './App.vue'

// Off the hint which displays when devtool is started.
Vue.config.productionTip = false

Vue.use(ElementUI, { locale })

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  render: (h) => h(App),
})
