import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: '/priceConsulting',
    name: '下单',
    meta: {
      title: 'booking'
    },
    children: [
      {
        path: 'priceConsulting',
        component: () => import('@/views/booking/priceConsulting'),
        name: 'priceConsulting',
        meta: { title: 'priceConsulting' }
      },
      {
        path: 'placeOrder',
        component: () => import('@/views/booking/placeOrder'),
        name: 'placeOrder',
        meta: { title: 'placeOrder' }
      },
      {
        path: 'releaseToMarket',
        component: () => import('@/views/booking/releaseToMarket'),
        name: 'releaseToMarket',
        meta: { title: 'releaseToMarket' }
      }
    ]
  },
  {
    path: '/tracking',
    component: Layout,
    redirect: '/tracking/FTL',
    name: '订单跟踪',
    meta: {
      title: 'tracking'
    },
    children: [
      {
        path: 'FTL',
        component: () => import('@/views/tracking/FTL'),
        meta: { title: 'FTLNotHUB' }
      },
      {
        path: 'LTL',
        component: () => import('@/views/tracking/LTL'),
        meta: { title: 'LTLHUB' }
      }
    ]
  },
  {
    path: '/resources',
    component: Layout,
    redirect: '/resources/truck',
    name: '资源管理',
    meta: {
      title: 'resources'
    },
    children: [
      {
        path: 'truck',
        component: () => import('@/views/resources/truck'),
        meta: { title: 'truck' }
      },
      {
        path: 'driver',
        component: () => import('@/views/resources/driver'),
        meta: { title: 'driver' }
      },
      {
        path: 'routeFTL',
        component: () => import('@/views/resources/routeFTL'),
        meta: { title: 'routeFTL' }
      },
      {
        path: 'routeLTL',
        component: () => import('@/views/resources/routeLTL'),
        meta: { title: 'routeFTL' }
      },
      {
        path: 'planningLTL',
        component: () => import('@/views/resources/planningLTL'),
        meta: { title: 'planningLTL' }
      }
    ]
  },
  {
    path: '/billing',
    component: Layout,
    redirect: '/billing/payableBill',
    name: '账单',
    meta: {
      title: 'billing'
    },
    children: [
      {
        path: 'payableBill',
        component: () => import('@/views/billing/payableBill'),
        meta: { title: 'payableBill' }
      },
      {
        path: 'journal',
        component: () => import('@/views/billing/journal'),
        meta: { title: 'journal' }
      },
      {
        path: 'topUp',
        component: () => import('@/views/billing/topUp'),
        meta: { title: 'topUp' }
      }
    ]
  },
  {
    path: '/member',
    component: Layout,
    meta: {
      title: 'member'
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/member/index'),
        meta: { title: 'member' }
      }
    ]
  }

]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [

]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
