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
    path: '/',
    name: 'home',
    component: () => import('@/views/home/index'),
    hidden: true
  },
  { path: '*', redirect: '/', hidden: true }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/booking',
    component: Layout,
    redirect: '/booking',
    name: 'booking',
    meta: {
      title: 'booking',
      roles: ['DEMAND']
    },
    children: [
      {
        path: 'priceConsulting',
        component: () => import('@/views/booking/priceConsulting'),
        name: 'priceConsulting',
        meta: { title: 'priceConsulting', roles: ['DEMAND'] }
      },
      {
        path: 'placeOrder',
        component: () => import('@/views/booking/placeOrder'),
        name: 'placeOrder',
        hidden: true,
        meta: { title: 'placeOrder', roles: ['DEMAND'] }
      },
      {
        path: 'releaseToMarket',
        component: () => import('@/views/booking/releaseToMarket'),
        name: 'releaseToMarket',
        meta: { title: 'releaseToMarket', roles: ['DEMAND'] }
      }
    ]
  },
  {
    path: '/market',
    component: Layout,
    redirect: '/market',
    name: 'market',
    meta: {
      title: 'tracking',
      roles: ['SUPPLY']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/market/index'),
        meta: { title: 'market', roles: ['SUPPLY'] }
      }
    ]
  },
  {
    path: '/tracking',
    redirect: '/tracking',
    component: Layout,
    name: 'tracking',
    meta: {
      title: 'tracking',
      roles: ['DEMAND', 'SUPPLY', 'PLATFORM']
    },
    children: [
      {
        path: 'FTL',
        component: () => import('@/views/tracking/FTL'),
        meta: { title: 'FTLNotHUB', roles: ['DEMAND', 'SUPPLY', 'PLATFORM'] }
      },
      {
        path: 'LTL',
        component: () => import('@/views/tracking/LTL'),
        meta: { title: 'LTLHUB', roles: ['DEMAND', 'SUPPLY', 'PLATFORM'] }
      }
    ]
  },
  {
    path: '/resources',
    redirect: '/resources',
    component: Layout,
    name: 'resources',
    meta: {
      title: 'resources',
      roles: ['SUPPLY']
    },
    children: [
      {
        path: 'truck',
        component: () => import('@/views/resources/truck'),
        meta: { title: 'truck', roles: ['SUPPLY'] }
      },
      {
        path: 'driver',
        component: () => import('@/views/resources/driver'),
        meta: { title: 'driver', roles: ['SUPPLY'] }
      },
      {
        path: 'routeFTL',
        component: () => import('@/views/resources/routeFTL'),
        meta: { title: 'routeFTL', roles: ['SUPPLY'] }
      },
      {
        path: 'routeLTL',
        component: () => import('@/views/resources/routeLTL'),
        meta: { title: 'routeFTL', roles: ['SUPPLY'] }
      },
      {
        path: 'planningLTL',
        component: () => import('@/views/resources/planningLTL'),
        meta: { title: 'planningLTL', roles: ['SUPPLY'] }
      }
    ]
  },
  {
    path: '/billing',
    redirect: '/billing',
    component: Layout,
    name: 'billing',
    meta: {
      title: 'billing',
      roles: ['DEMAND', 'SUPPLY', 'HUB', 'PLATFORM']
    },
    children: [
      {
        path: 'payableBill',
        component: () => import('@/views/billing/payableBill'),
        meta: { title: 'payableBill', roles: ['DEMAND', 'SUPPLY', 'HUB'] }
      },
      {
        path: 'topUp',
        component: () => import('@/views/billing/topUp'),
        meta: { title: 'topUp', roles: ['DEMAND', 'SUPPLY', 'HUB'] }
      },
      {
        path: 'journal',
        component: () => import('@/views/billing/journal'),
        meta: { title: 'journal', roles: ['DEMAND', 'SUPPLY', 'HUB'] }
      },
      {
        path: 'platform',
        component: () => import('@/views/billing/platform'),
        meta: { title: 'billing', roles: ['PLATFORM'] }
      }
    ]
  },
  {
    path: '/member',
    redirect: '/member',
    component: Layout,
    name: 'member',
    meta: {
      title: 'member',
      roles: ['DEMAND', 'SUPPLY', 'HUB', 'PLATFORM']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/member/index'),
        meta: { title: 'member', roles: ['DEMAND', 'SUPPLY', 'HUB'] }
      },
      {
        path: 'toBeVerified',
        component: () => import('@/views/member/toBeVerified'),
        meta: { title: 'toBeVerified', roles: ['PLATFORM'] }
      },
      {
        path: 'rejected',
        component: () => import('@/views/member/rejected'),
        meta: { title: 'rejected', roles: ['PLATFORM'] }
      },
      {
        path: 'toBeSignedContract',
        component: () => import('@/views/member/toBeSignedContract'),
        meta: { title: 'toBeSignedContract', roles: ['PLATFORM'] }
      },
      {
        path: 'activated',
        component: () => import('@/views/member/activated'),
        meta: { title: 'activated', roles: ['PLATFORM'] }
      },
      {
        path: 'closed',
        component: () => import('@/views/member/closed'),
        meta: { title: 'closed', roles: ['PLATFORM'] }
      }
    ]
  }
]

const createRouter = () =>
  new Router({
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

router.$addRoutes = params => {
  router.matcher = new Router().matcher
  router.addRoutes(params)
}

export default router
