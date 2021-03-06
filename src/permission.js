import router from "./router";
import store from "./store";
import { resetRouter } from "@/router";
import { Message } from "element-ui";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { getToken } from "@/utils/auth"; // get token from cookie
import getPageTitle from "@/utils/get-page-title";

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ["/login"]; // no redirect whitelist
router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start();
  // set page title
  document.title = getPageTitle(to.meta.title);

  // determine whether the user has logged in
  const hasToken = getToken();

  if (hasToken) {
    if (to.path === "/login") {
      // if is logged in, redirect to the home page
      next({ path: "/" });
      NProgress.done();
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      const hasRoles = store.getters.curRole && store.getters.curRole.length > 0;
      if (hasRoles) {
        if (from.path === "/login") {
          await store.dispatch("user/getInfo").then(res => {
            if (res.roles.length != 0) {
              localStorage.curRole = res.roles[0].name.toUpperCase();
            } else {
              const arr = res.chosenRoles.split(",");
              localStorage.curRole = arr[0];
            }
          });
          const accessRoutes = await store.dispatch("permission/generateRoutes", [localStorage.curRole]);
          resetRouter();
          router.addRoutes(accessRoutes);
          router.options.routes = store.getters.permission_routes;
          next();
          NProgress.done();
        } else {
          next();
          NProgress.done();
        }
      } else {
        try {
          if (store.getters.permission_routes.length === 0) {
            await store.dispatch("user/getInfo");
            const accessRoutes = await store.dispatch("permission/generateRoutes", [localStorage.curRole]);
            resetRouter();
            router.addRoutes(accessRoutes);
            router.options.routes = store.getters.permission_routes;
            next({ path: to.redirectedFrom });
          } else {
            next();
          }
          NProgress.done();
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch("user/resetToken");
          Message.error(error || "Has Error");
          next(`/login?redirect=${to.path}`);
          NProgress.done();
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next();
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
