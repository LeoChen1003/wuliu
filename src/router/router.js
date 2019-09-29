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
        path: '/billing',
        name: 'billing',
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
                redirect: '/topUp',
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
