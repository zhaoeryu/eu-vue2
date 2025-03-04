import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout/index.vue'
Vue.use(Router)

export const constantRouteList = [
  {
    path: '/login',
    name: 'Login',
    component: (resolve) => require(['@/views/login'], resolve),
    hidden: true
  },
  {
    path: '/404',
    name: 'NotFound',
    component: (resolve) => require(['@/views/404'], resolve),
    hidden: true
  },
  {
    path: '/401',
    name: 'Unauthorized',
    component: (resolve) => require(['@/views/401'], resolve),
    hidden: true
  },
  {
    path: '/demo',
    name: 'Demo',
    component: (resolve) => require(['@/views/demo/index'], resolve),
    hidden: true
  }
]

export const layoutRouteList = [
  {
    path: '/',
    name: 'Home',
    component: Layout,
    meta: {
      title: '工作台',
      icon: 'workbench',
      alwaysShow: false,
    },
    redirect: '/workbench',
    children: [
      {
        path: '/workbench',
        name: 'Workbench',
        component: (resolve) => require(['@/views/workbench'], resolve),
        meta: {
          title: '工作台',
          icon: 'workbench',
          affix: true,
          showHeader: false,
          showFooter: true
        }
      }
    ],
    hidden: false,
  },
  {
    path: '/crud',
    name: 'CRUD',
    component: Layout,
    meta: {
      title: 'crud',
      icon: 'workbench',
    },
    redirect: '/crud',
    children: [
      {
        path: '',
        name: 'Table',
        component: (resolve) => require(['@/views/demo'], resolve),
        meta: {
          title: '表格',
          icon: 'workbench',
          affix: false,
          showHeader: true,
          showFooter: true
        }
      },
      {
        path: 'add',
        name: 'Add',
        component: (resolve) => require(['@/views/demo/edit'], resolve),
        meta: {
          title: '新增',
          icon: 'workbench',
          affix: false,
          showHeader: true,
          showFooter: true
        },
        hidden: true,
      },
      {
        path: 'edit/:id',
        name: 'Edit',
        component: (resolve) => require(['@/views/demo/edit'], resolve),
        meta: {
          title: '编辑',
          icon: 'workbench',
          affix: false,
          showHeader: true,
          showFooter: true
        },
        hidden: true,
      }
    ],
    hidden: true,
  }
]

export default new Router({
  mode: 'history',
  // 滚动行为：每次切换路由时，滚动条都会返回到顶部
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouteList
})
