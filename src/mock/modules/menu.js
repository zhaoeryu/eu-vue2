const Mock = require('mockjs')
import FlakeId from 'flakeid'

const ID_GEN = new FlakeId({
  mid: 1,
  timeOffset: (2022 - 1970) * 31536000 * 1000
})

//延时200-600毫秒请求到数据
Mock.setup({
  timeout: '200-600'
})

const arr = Mock.mock({
  // 使用mockjs生成菜单数据
  list: [
    {
      menuId: 1,
      menuName: '首页',
      menuIcon: null,
      sortNum: '@integer(0, 100)',
      permission: null,
      path: '/',
      params: null,
      componentName: null,
      component: null,
      status: 1,
      visible: true,
      cache: true,
      iframe: false,
      dot: null,
      badge: null,
      menuType: 1,
      parentId: null
    },
    {
      menuId: 10,
      menuName: '工作台',
      menuIcon: 'workbench',
      sortNum: '@integer(0, 100)',
      permission: 'workbench',
      path: '/workbench',
      params: null,
      componentName: 'Workbench',
      component: 'workbench/index',
      status: 1,
      visible: true,
      cache: true,
      iframe: false,
      affix: true,
      dot: null,
      badge: null,
      menuType: 2,
      parentId: 1
    },
    {
      menuId: 20,
      menuName: '设置',
      menuIcon: 'shezhi',
      sortNum: '@integer(0, 100)',
      permission: 'setting',
      path: '/setting',
      params: null,
      componentName: null,
      component: null,
      status: 1,
      visible: true,
      cache: null,
      iframe: false,
      dot: null,
      badge: null,
      menuType: 1,
      parentId: null
    },
    {
      menuId: 1000,
      menuName: '个人中心',
      menuIcon: null,
      sortNum: '@integer(0, 100)',
      permission: 'setting:personal-center',
      path: '/personal-center',
      params: null,
      componentName: 'PersonalCenter',
      component: 'setting/personal-center',
      status: 1,
      visible: true,
      cache: true,
      iframe: false,
      dot: false,
      badge: null,
      menuType: 2,
      parentId: 20
    },
    {
      menuId: 1010,
      menuName: '用户管理',
      menuIcon: null,
      sortNum: '@integer(0, 100)',
      permission: 'setting:users',
      path: '/users',
      params: null,
      componentName: 'Users',
      component: 'setting/users',
      status: 1,
      visible: true,
      cache: true,
      iframe: false,
      dot: null,
      badge: null,
      menuType: 2,
      parentId: 20
    },
    {
      menuId: 1011,
      menuName: '新增',
      menuIcon: null,
      sortNum: '@integer(0, 100)',
      permission: 'setting:users:add',
      path: null,
      params: null,
      componentName: null,
      component: null,
      status: 1,
      visible: null,
      cache: null,
      iframe: null,
      dot: null,
      badge: null,
      menuType: 3,
      parentId: 1010
    },
    {
      menuId: 1012,
      menuName: '修改',
      menuIcon: null,
      sortNum: '@integer(0, 100)',
      permission: 'setting:users:update',
      path: null,
      params: null,
      componentName: null,
      component: null,
      status: 1,
      visible: null,
      cache: null,
      iframe: null,
      dot: null,
      badge: null,
      menuType: 3,
      parentId: 1010
    },
    {
      menuId: 1013,
      menuName: '删除',
      menuIcon: null,
      sortNum: '@integer(0, 100)',
      permission: 'setting:users:del',
      path: null,
      params: null,
      componentName: null,
      component: null,
      status: 1,
      visible: null,
      cache: null,
      iframe: null,
      dot: null,
      badge: null,
      menuType: 3,
      parentId: 1010
    },
    {
      menuId: 1015,
      menuName: '部门管理',
      menuIcon: null,
      sortNum: '@integer(0, 100)',
      permission: 'setting:depts',
      path: '/depts',
      params: null,
      componentName: 'Depts',
      component: 'setting/depts',
      status: 1,
      visible: true,
      cache: true,
      iframe: false,
      dot: null,
      badge: null,
      menuType: 2,
      parentId: 20
    },
    {
      menuId: 1020,
      menuName: '岗位管理',
      menuIcon: null,
      sortNum: '@integer(0, 100)',
      permission: 'setting:posts',
      path: '/posts',
      params: null,
      componentName: 'Posts',
      component: 'setting/posts',
      status: 1,
      visible: true,
      cache: true,
      iframe: false,
      dot: null,
      badge: null,
      menuType: 2,
      parentId: 20
    },
    {
      menuId: 1030,
      menuName: '角色管理',
      menuIcon: null,
      sortNum: '@integer(0, 100)',
      permission: 'setting:roles',
      path: '/roles',
      params: null,
      componentName: 'Roles',
      component: 'setting/roles',
      status: 1,
      visible: true,
      cache: true,
      iframe: false,
      dot: null,
      badge: null,
      menuType: 2,
      parentId: 20
    },
    {
      menuId: 1031,
      menuName: '分配用户',
      menuIcon: null,
      sortNum: '@integer(0, 100)',
      permission: 'setting:roles:auth-user:list',
      path: '/roles/auth-user/:roleId',
      params: null,
      componentName: 'AuthUser',
      component: 'setting/roles/auth-user',
      status: 1,
      visible: false,
      cache: false,
      iframe: false,
      dot: null,
      badge: null,
      menuType: 2,
      parentId: 20
    },
    {
      menuId: 1040,
      menuName: '菜单管理',
      menuIcon: null,
      sortNum: '@integer(0, 100)',
      permission: 'setting:menus',
      path: '/menus',
      params: null,
      componentName: 'Menus',
      component: 'setting/menus',
      status: 1,
      visible: true,
      cache: true,
      iframe: false,
      dot: null,
      badge: null,
      menuType: 2,
      parentId: 20
    },
    {
      menuId: 1050,
      menuName: '字典管理',
      menuIcon: null,
      sortNum: '@integer(0, 100)',
      permission: 'setting:dicts',
      path: '/dicts',
      params: null,
      componentName: 'Dicts',
      component: 'setting/dicts',
      status: 1,
      visible: true,
      cache: true,
      iframe: false,
      dot: null,
      badge: null,
      menuType: 2,
      parentId: 20
    },
    {
      menuId: 1060,
      menuName: '任务管理',
      menuIcon: null,
      sortNum: '@integer(0, 100)',
      permission: 'setting:jobs',
      path: '/jobs',
      params: null,
      componentName: 'Jobs',
      component: 'setting/jobs',
      status: 1,
      visible: true,
      cache: true,
      iframe: false,
      dot: true,
      badge: null,
      menuType: 2,
      parentId: 20
    },
    {
      menuId: 1070,
      menuName: '操作日志',
      menuIcon: null,
      sortNum: '@integer(0, 100)',
      permission: 'setting:oper-logs',
      path: '/oper-logs',
      params: null,
      componentName: 'OperLogs',
      component: 'setting/oper-logs',
      status: 1,
      visible: true,
      cache: true,
      iframe: false,
      dot: null,
      badge: null,
      menuType: 2,
      parentId: 20
    },
    {
      menuId: 1080,
      menuName: '登录日志',
      menuIcon: null,
      sortNum: '@integer(0, 100)',
      permission: 'setting:login-logs',
      path: '/login-logs',
      params: null,
      componentName: 'LoginLogs',
      component: 'setting/login-logs',
      status: 1,
      visible: true,
      cache: true,
      iframe: false,
      dot: null,
      badge: null,
      menuType: 2,
      parentId: 20
    },
    {
      menuId: 1090,
      menuName: '通知公告',
      menuIcon: null,
      sortNum: '@integer(0, 100)',
      permission: 'setting:notice-announcement',
      path: '/notice-announcement',
      params: null,
      componentName: 'NoticeAnnouncement',
      component: 'setting/notices-announcement',
      status: 1,
      visible: true,
      cache: true,
      iframe: false,
      dot: false,
      badge: null,
      menuType: 2,
      parentId: 20
    },
    {
      menuId: 30,
      menuName: '系统工具',
      menuIcon: 'gongju',
      sortNum: '@integer(0, 100)',
      permission: 'tools',
      path: '/tools',
      params: null,
      componentName: null,
      component: null,
      status: 1,
      visible: true,
      cache: null,
      iframe: null,
      dot: null,
      badge: null,
      menuType: 1,
      parentId: null
    },
    {
      menuId: 2100,
      menuName: '代码生成',
      menuIcon: null,
      sortNum: '@integer(0, 100)',
      permission: 'tools:gen',
      path: '/gen',
      params: null,
      componentName: 'Gen',
      component: 'system/tools/gen',
      status: 1,
      visible: true,
      cache: true,
      iframe: false,
      dot: false,
      badge: null,
      menuType: 2,
      parentId: 30
    },
    {
      menuId: 2110,
      menuName: '系统接口',
      menuIcon: null,
      sortNum: '@integer(0, 100)',
      permission: 'tools:swagger',
      path: '/swagger',
      params: null,
      componentName: null,
      component: 'http://localhost:8080/swagger-ui.html',
      status: 1,
      visible: true,
      cache: true,
      iframe: true,
      dot: false,
      badge: null,
      menuType: 2,
      parentId: 30
    },
    {
      menuId: 40,
      menuName: '工作流',
      menuIcon: 'workflow',
      sortNum: '@integer(0, 100)',
      permission: 'workflow:list',
      path: '/workflow',
      params: null,
      componentName: 'Workflow',
      component: 'workflow',
      status: 1,
      visible: true,
      cache: true,
      iframe: false,
      dot: null,
      badge: null,
      menuType: 2,
      parentId: null
    },
    {
      menuId: 50,
      menuName: '关于',
      menuIcon: 'yingyongkaifazhe',
      sortNum: '@integer(0, 100)',
      permission: 'about',
      path: 'https://gitee.com/zhaoeryu/eu-vue2',
      params: null,
      componentName: null,
      component: null,
      status: 1,
      visible: true,
      cache: null,
      iframe: false,
      dot: null,
      badge: null,
      menuType: 2,
      parentId: null
    }
  ]
})

Mock.mock(/api\/system\/menu\/list/, 'get', () => {
  return {
    code: 0,
    msg: 'success',
    data: {
      total: arr.list.length,
      list: arr.list
    }
  }
})
Mock.mock(/api\/system\/menu/, 'post', options => {
  const body = JSON.parse(options.body)
  body.menuId = ID_GEN.gen()
  arr.list.unshift(body)
  return {
    code: 0,
    msg: 'success'
  }
})

Mock.mock(/api\/system\/menu/, 'put', options => {
  const body = JSON.parse(options.body)
  arr.list = arr.list.map(item => {
    if (item.menuId === body.menuId) {
      return body
    }
    return item
  })
  return {
    code: 0,
    msg: 'success'
  }
})
Mock.mock(/api\/system\/menu\/batch/, 'delete', options => {
  const { ids } = JSON.parse(options.body)
  arr.list = arr.list.filter(item => !ids.includes(item.menuId))
  return {
    code: 0,
    msg: 'success'
  }
})

Mock.mock(/api\/system\/menu\/routers/, 'get', () => {
  return {
    code: 0,
    msg: 'success',
    data: arr.list
  }
})
