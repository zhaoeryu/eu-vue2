import router from './routers'
import NProgress from 'nprogress'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { defaultSetting } from '@/settings'

NProgress.configure({ showSpinner: false })

router.beforeEach((to, from, next) => {
  if (store.getters['settings/theme'].showProgressBar) {
    NProgress.start()
  }
  if (to.meta && to.meta.title) {
    document.title = to.meta.title
  }

  // 检查是否登录
  if (getToken()) {
    // 如果已登录，访问登录页面，直接跳转到首页
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      // 为了避免重复设置路由
      if (store.getters['user/roles'].length < 1) {
        store.dispatch('user/GetInfo').then(() => {
          store.dispatch('routes/generateRoutes').then(routes => {
            router.addRoutes(routes)
            next({ ...to, replace: true })
          }).catch(err => {
            console.log(err)
            next()
          })
        }).catch(() => {
          store.dispatch('user/Logout').finally(() => {
            next({ path: '/' })
          })
        })
      } else {
        next()
      }
    }
  } else {
    // 未登录，检查访问的路径是否在白名单中，如果是，直接访问，否则跳转到登录页面
    if (defaultSetting.anonymousAccessWhiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`)
    }
  }
})

router.afterEach(() => {
  if (store.getters['settings/theme'].showProgressBar) {
    NProgress.done()
  }
})

/**
 * 路由错误处理
 * 如果路由出现错误，例如路由定义中的组件不存在，将会跳转到 404 页面
 */
router.onError(err => {
  console.error(err)
  router.push('/404')
})
