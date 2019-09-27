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
                component: () => import('@/views/billing/payableBill'),
                meta: { title: 'payableBill' }
            },
            {
                path: 'topUp',
                component: () => import('@/views/billing/topUp'),
                meta: { title: 'topUp' }
            },
            {
                path: 'journal',
                component: () => import('@/views/billing/journal'),
                meta: { title: 'journal' }
            },
        ]
    },
    {
        path: '/payableBill',
        name: 'login',
        component: () => import('@/views/billing/payableBill'),
        meta: {
            title: 'tracking'
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
];
export default routes;
