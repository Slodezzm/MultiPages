import Vue from 'vue'
import App from './App.vue'

//导入axios
// import http from "@/common/http"
// Vue.prototype.$http = http

//Vue Bus
/*
import VueBus from "@/common/vue.bus"
Vue.use(VueBus)
*/

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')