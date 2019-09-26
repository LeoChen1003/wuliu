const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/home/index'),
        meta: {
            title: '首页'
        }
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login/index'),
        meta: {
            title: '登录页'
        }
    },
    {   
        path: '*',
        redirect: {
            path: '/'
        }
    }
];
export default routes;
