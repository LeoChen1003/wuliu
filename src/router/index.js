import Vue from "vue";
import Router from "vue-router";

/* Layout */
import Layout from "@/layout";

Vue.use(Router);

export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
  },
  {
    path: "/",
    name: "home",
    component: () => import("@/views/home/index"),
    hidden: true,
  },
  { path: "*", redirect: "/", hidden: true },
];

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: "/booking",
    component: Layout,
    redirect: "/booking",
    name: "booking",
    meta: {
      title: "booking",
      roles: ["DEMAND"],
    },
    children: [
      {
        path: "priceConsulting",
        component: () => import("@/views/booking/priceConsulting"),
        name: "priceConsulting",
        hidden: true,
        meta: {
          title: "priceConsulting",
          roles: ["DEMAND"],
          permission: "DemandSearchSupply",
        },
      },
      {
        path: "placeOrder",
        component: () => import("@/views/booking/placeOrder"),
        name: "placeOrder",
        hidden: true,
        meta: {
          title: "placeOrder",
          roles: ["DEMAND"],
          permission: "DemandSearchSupply",
        },
      },
      {
        path: "releaseToMarket",
        component: () => import("@/views/booking/releaseToMarket"),
        name: "releaseToMarket",
        hidden: true,
        meta: {
          title: "releaseToMarket",
          roles: ["DEMAND"],
          permission: "DemandSearchSupply",
        },
      },
    ],
  },
  {
    path: "/market",
    component: Layout,
    redirect: "/market",
    name: "market",
    meta: {
      // title: 'market',
      roles: ["SUPPLY"],
    },
    children: [
      {
        path: "index",
        component: () => import("@/views/market/index"),
        meta: {
          title: "market",
          roles: ["SUPPLY"],
          permission: "SupplySearchMarket",
        },
      },
    ],
  },
  {
    path: "/tracking",
    redirect: "/tracking",
    component: Layout,
    name: "tracking",
    meta: {
      title: "tracking",
      roles: ["DEMAND", "SUPPLY", "PLATFORM"],
    },
    children: [
      {
        path: "demandFTL",
        component: () => import("@/views/tracking/demandFTL"),
        meta: { title: "FTLNotHUB", roles: ["DEMAND"], permission: "MyOrders" },
      },
      {
        path: "FTL",
        component: () => import("@/views/tracking/FTL"),
        meta: { title: "FTLNotHUB", roles: ["SUPPLY"], permission: "MyOrders" },
      },
      {
        path: "demandLTL",
        component: () => import("@/views/tracking/demandLTL"),
        meta: { title: "LTLHUB", roles: ["DEMAND"], permission: "MyOrders" },
      },
      {
        path: "platformFTL",
        component: () => import("@/views/tracking/platformFTL"),
        meta: {
          title: "FTLNotHUB",
          roles: ["PLATFORM"],
          permission: "PlatformOrderManage",
        },
      },
      {
        path: "platformLTL",
        component: () => import("@/views/tracking/platformLTL"),
        meta: {
          title: "LTLHUB",
          roles: ["PLATFORM"],
          permission: "PlatformOrderManage",
        },
      },
      {
        path: "supplyLTL",
        component: () => import("@/views/tracking/supplyLTL"),
        meta: { title: "LTLHUB", roles: ["SUPPLY"], permission: "MyOrders" },
      },
    ],
  },
  {
    path: "/resources",
    redirect: "/resources",
    component: Layout,
    name: "resources",
    meta: {
      title: "resources",
      roles: ["SUPPLY"],
    },
    children: [
      {
        path: "truck",
        component: () => import("@/views/resources/truck"),
        meta: {
          title: "truck",
          roles: ["SUPPLY"],
          permission: "SupplyResourceManage",
        },
      },
      {
        path: "driver",
        component: () => import("@/views/resources/driver"),
        meta: {
          title: "driver",
          roles: ["SUPPLY"],
          permission: "SupplyResourceManage",
        },
      },
      {
        path: "routeFTL",
        component: () => import("@/views/resources/routeFTL"),
        meta: {
          title: "routeFTL",
          roles: ["SUPPLY"],
          permission: "SupplyResourceManage",
        },
      },
      {
        path: "routeLTL",
        component: () => import("@/views/resources/routeLTL"),
        meta: {
          title: "routeLTL",
          roles: ["SUPPLY"],
          permission: "SupplyResourceManage",
        },
      },
      // {
      //   path: "planningLTL",
      //   component: () => import("@/views/resources/planningLTL"),
      //   meta: {
      //     title: "planningLTL",
      //     roles: ["SUPPLY"],
      //     permission: "SupplyResourceManage"
      //   }
      // }
    ],
  },
  {
    path: "/inbound",
    component: Layout,
    redirect: "/inbound",
    name: "inbound",
    meta: {
      roles: ["HUB"],
    },
    children: [
      {
        path: "index",
        component: () => import("@/views/inbound/index"),
        meta: {
          title: "inbound",
          roles: ["HUB"],
          permission: "HubInBound",
        },
      },
    ],
  },
  {
    path: "/outbound",
    component: Layout,
    redirect: "/outbound",
    name: "outbound",
    meta: {
      roles: ["HUB"],
    },
    children: [
      {
        path: "index",
        component: () => import("@/views/outbound/index"),
        meta: {
          title: "Outbound",
          roles: ["HUB"],
          permission: "HubOutBound",
        },
      },
    ],
  },
  {
    path: "/billing",
    redirect: "/billing",
    component: Layout,
    name: "billing",
    meta: {
      title: "billing",
      roles: ["DEMAND", "SUPPLY", "HUB", "PLATFORM"],
    },
    children: [
      {
        path: "payableBill",
        component: () => import("@/views/billing/payableBill"),
        meta: {
          title: "payableBill",
          roles: ["DEMAND"],
          permission: "MemberTopUp",
        },
      },
      {
        path: "receivable",
        component: () => import("@/views/billing/receivable"),
        meta: {
          title: "receivable",
          roles: ["SUPPLY"],
          permission: "MemberTopUp",
        },
      },
      {
        path: "topUp",
        component: () => import("@/views/billing/topUp"),
        meta: {
          title: "topUp",
          roles: ["DEMAND", "SUPPLY", "HUB"],
          permission: "MemberTopUp",
        },
      },
      {
        path: "journal",
        component: () => import("@/views/billing/journal"),
        meta: {
          title: "journal",
          roles: ["DEMAND", "SUPPLY", "HUB"],
          permission: "MemberTopUp",
        },
      },
      {
        path: "topUpConfirm",
        component: () => import("@/views/billing/platform"),
        meta: {
          title: "topUpConfirm",
          roles: ["PLATFORM"],
          permission: "PlatformFinanceQuery",
        },
      },
      {
        path: "transferFreight",
        component: () => import("@/views/billing/transferFreight"),
        meta: {
          title: "transferFreight",
          roles: ["PLATFORM"],
          permission: "PlatformFinanceQuery",
        },
      },
    ],
  },
  {
    path: "/member",
    redirect: "/member",
    component: Layout,
    name: "member",
    meta: {
      title: "member",
      roles: ["DEMAND", "SUPPLY", "HUB", "PLATFORM"],
    },
    children: [
      {
        path: "index",
        component: () => import("@/views/member/index"),
        meta: {
          title: "member",
          roles: ["DEMAND", "SUPPLY", "HUB"],
          permission: "MemberInfo",
        },
      },
      {
        path: "toBeVerified",
        component: () => import("@/views/member/toBeVerified"),
        meta: {
          title: "toBeVerified",
          roles: ["PLATFORM"],
          permission: "PlatformMemberView",
        },
      },
      {
        path: "rejected",
        component: () => import("@/views/member/rejected"),
        meta: {
          title: "rejected",
          roles: ["PLATFORM"],
          permission: "PlatformMemberView",
        },
      },
      {
        path: "toBeSignedContract",
        component: () => import("@/views/member/toBeSignedContract"),
        meta: {
          title: "toBeSignedContract",
          roles: ["PLATFORM"],
          permission: "PlatformMemberView",
        },
      },
      {
        path: "activated",
        component: () => import("@/views/member/activated"),
        meta: {
          title: "activated",
          roles: ["PLATFORM"],
          permission: "PlatformMemberView",
        },
      },
      {
        path: "closed",
        component: () => import("@/views/member/closed"),
        meta: {
          title: "closed",
          roles: ["PLATFORM"],
          permission: "PlatformMemberView",
        },
      },
    ],
  },
  {
    path: "/setting",
    redirect: "/setting",
    component: Layout,
    name: "memberSetting",
    meta: {
      title: "setting",
      roles: ["PLATFORM"],
    },
    children: [
      {
        path: "route",
        component: () => import("@views/setting/route"),
        meta: {
          title: "route",
          roles: ["PLATFORM"],
          permission: "PlatformOrderManage",
        },
      },
      {
        path: "user",
        component: () => import("@views/setting/user"),
        meta: {
          title: "user",
          roles: ["PLATFORM"],
          permission: "PlatformOrderManage",
        },
      },
    ],
  },
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

router.$addRoutes = params => {
  router.matcher = new Router().matcher;
  router.addRoutes(params);
};

export default router;
