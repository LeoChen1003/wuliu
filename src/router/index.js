import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login1/index'),
    hidden: true
  },
  // {
  //   path: '/dashboard',
  //   component: Layout,
  //   redirect: 'dashboard',
  //   children: [
  //     {
  //       path: 'dashboard',
  //       component: () => import('@/views/dashboard/index'),
  //       name: 'Dashboard',
  //       meta: { title: 'dashboard', icon: 'dashboard' }
  //     }
  //   ]
  // },
  {
    path: '',
    component: Layout,
    name: '订单跟踪',
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
