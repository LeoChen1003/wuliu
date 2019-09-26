import Vue from 'vue';
import Router from 'vue-router';
import routes from './router';
Vue.use(Router);

import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
NProgress.configure({ showSpinner: false }) // NProgress Configuration

// 路由配置
const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  }
});

router.beforeEach((to, from, next) => {
  // start progress bar
  NProgress.start()
  next();
});

router.afterEach((to, from, next) => {
  NProgress.done()
  window.scrollTo(0, 0);
});

export default router;
