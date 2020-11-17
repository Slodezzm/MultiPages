import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueLazyload from 'vue-lazyload'

import store from "./store"

//全局引用vant
import vant from 'vant'
Vue.use(vant)

//导入axios
import http from "@/common/http"
Vue.prototype.$http = http

//Vue Bus
/*
import VueBus from "@/common/vue.bus"
Vue.use(VueBus)
*/

//定制VueLazyload
Vue.use(VueLazyload, {
  loading: "https://zhibo18.live/public/images/default.png"
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')