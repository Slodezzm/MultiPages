import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './views/Home.vue'
import intercept from '@/common/intercept'

Vue.use(VueRouter)

const routes = [{
    path: '/',//首页（游戏）
    name: 'Home',
    component: Home,
    meta: {
      keepAlive: true
    },
  },
  {
    path: '/prize',//奖品
    name: 'Prize',
    component: () => import('./views/Prize.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/rank',//排行榜
    name: 'Rank',
    component: () => import('./views/Rank.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/charge',//充值
    name: 'Charge',
    component: () => import('./views/Charge.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/rule',//规则
    name: 'Rule',
    component: () => import('./views/Explain.vue'),
    props: true
  },
]

const router = new VueRouter({
  routes
})

router.beforeEach(function(to, from, next){
  intercept(to, from, next)
})

export default router