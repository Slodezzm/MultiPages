import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './views/Home.vue'
import intercept from '@/common/intercept'


Vue.use(VueRouter)

  const routes = [
  {
    path: '/',//首页（游戏）
    name: 'Home',
    component: Home,
    meta: {
      keepAlive: true,
      index: 0,
      bottomNav: true
    }
  },
  {
    path: '/prize',//奖品
    name: 'Prize',
    component: () => import('./views/Prize.vue'),
    meta: {
      keepAlive: true,
      index: 1,
      bottomNav: true
    }
  },
  {
    path: '/rank',//排行榜
    name: 'Rank',
    component: () => import('./views/Rank.vue'),
    meta: {
      keepAlive: true,
      index: 2,
      bottomNav: true
    }
  },
  {
    path: '/charge',//充值
    name: 'Charge',
    component: () => import('./views/Charge.vue'),
    meta: {
      keepAlive: true,
      index: 3,
      bottomNav: true
    }
  },
  {
    path: '/detail',
    name: 'Detail',
    component: () => import('./views/Detail.vue')
  },
  {
    path: '/exchange/:id',//兑换
    name: 'Exchange',
    component: () => import('./views/Exchange.vue'),
    props: true
  },
  {
    path: '/editadd/:id',//编辑地址
    name: 'Editadd',
    component: () => import('./views/Editadd.vue'),
    props: true
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