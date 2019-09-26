import Layout from "components/layout/index";
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
        path: '/login',
        name: 'login',
        meta: {
            title: 'booking'
        },
        component: Layout,
        children: [
            {
                path: 'index',
                component: () => import('@/views/login/index'),
                meta: { title: 'priceConsulting' }
            },
            {
                path: '1',
                component: () => import('@/views/login/index'),
                meta: { title: 'placeOrder' }
            },
            {
                path: '2',
                component: () => import('@/views/login/index'),
                meta: { title: 'releaseToMarket' }
            },
        ]
    },
    {
        path: '/2',
        name: 'login',
        component: Layout,
        component: () => import('@/views/login/index'),
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
