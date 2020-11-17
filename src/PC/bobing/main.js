import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from "axios"
import util from '@/common/util.js'
import VueLazyload from 'vue-lazyload'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.config.productionTip = false
Vue.prototype.axios = axios

window.util = util;
window.ajax = util.ajax.bind(util);

Vue.use(VueLazyload, {
  preLoad: 1.3,
  // error: require('@/assets/PC/default.png'), // 图片加载失败时显示的图片
  // loading: require('@/assets/PC/default.png'), // 图片加载状态下显示的图片
  attempt: 1, // 	加载错误后最大尝试次数
  adapter: {
    loading(listender, options) {
      // 图片加载错误时触发
      listender.el.style.cssText = `background: url(${require('@/assets/default.png')}) center center no-repeat;background-size: cover;`
    },
    loaded(listender, options) {
      listender.el.style.cssText = ''
    },
    error(listender, options) {
      // 图片加载错误时触发
      listender.el.style.cssText = listender.el.getAttribute('data-avatar') == '1' ? `background: url(${require('@/assets/default.png')}) center center no-repeat;background-size: cover;` : `background: url(${require('@/assets/default.png')}) center center no-repeat;background-size: cover;`
    }
  },
  observer: true, // 优化加载性能
  listenEvents: ['scroll']
})
Vue.use(ElementUI);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')