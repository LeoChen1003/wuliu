const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/home/index'),
        hidden: true,
        meta: {
            title: '首页'
        }
    },
    {
        path: '/login',
        name: 'login',
        hidden: true,
        component: () => import('@/views/login/index'),
        meta: {
            title: '登录页'
        }
    },
    {
        path: '/booking',
        name: '订单跟踪',
        meta: {
            title: 'booking'
        },
        children: [
            {
                path: 'priceConsulting',
                redirect: '/priceConsulting',
                meta: { title: 'priceConsulting' }
            },
            {
                path: 'placeOrder',
                redirect: '/placeOrder',
                meta: { title: 'placeOrder' }
            },
            {
                path: 'releaseToMarket',
                redirect: '/releaseToMarket',
                meta: { title: 'releaseToMarket' }
            },

        ]
    },
    {
        path: '/placeOrder',
        name: 'placeOrder',
        hidden: true,
        component: () => import('@/views/booking/placeOrder'),
        meta: {
            title: 'placeOrder'
        }
    },
    {
        path: '/priceConsulting',
        name: 'priceConsulting',
        hidden: true,
        component: () => import('@/views/booking/priceConsulting'),
        meta: {
            title: 'priceConsulting'
        }
    },
    {
        path: '/releaseToMarket',
        name: 'releaseToMarket',
        hidden: true,
        component: () => import('@/views/booking/releaseToMarket'),
        meta: {
            title: 'releaseToMarket'
        }
    },
    {
        path: '/tracking',
        name: '订单跟踪',
        meta: {
            title: 'tracking'
        },
        children: [
            {
                path: 'FTL',
                redirect: '/FTL',
                meta: { title: 'FTLNotHUB' }
            },
            // {
            //     path: 'LTL',
            //     redirect: '/LTL',
            //     meta: { title: 'LTLHUB' }
            // }
        ]
    },
    {
        path: '/FTL',
        name: 'FTL',
        hidden: true,
        component: () => import('@/views/tracking/FTL'),
        meta: {
            title: 'FTLNotHUB'
        }
    },
    {
        path: '/LTL',
        name: 'LTL',
        hidden: true,
        component: () => import('@/views/tracking/LTL'),
        meta: {
            title: 'LTLHUB'
        }
    },
    {
        path: '/billing',
        name: '账单',
        meta: {
            title: 'billing'
        },
        children: [
            {
                path: 'payableBill',
                redirect: '/payableBill',
                meta: { title: 'payableBill' }
            },
            {
                path: 'topUp',
                redirect: '/topUp',
                meta: { title: 'topUp' }
            },
            {
                path: 'journal',
                redirect: '/journal',
                meta: { title: 'journal' }
            }
        ]
    },
    {
        path: '/payableBill',
        name: '应付账单',
        hidden: true,
        component: () => import('@/views/billing/payableBill'),
        meta: {
            title: 'payableBill'
        }
    },
    {
        path: '/topUp',
        name: '充值',
        hidden: true,
        component: () => import('@/views/billing/topUp'),
        meta: {
            title: 'topUp'
        }
    },
    {
        path: '/journal',
        name: '流水账',
        hidden: true,
        component: () => import('@/views/billing/journal'),
        meta: {
            title: 'journal'
        }
    },
    {
        path: '/member',
        name: 'member',
        component: () => import('@/views/member/index'),
        meta: {
            title: 'member'
        }
    },
    {
        path: '*',
        redirect: {
            path: '/'
        },
        hidden: true,
        meta: {
            title: ''
        }
    }
]
export default routes
