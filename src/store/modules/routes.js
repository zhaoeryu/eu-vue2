import { layoutRouteList } from '@/router/routers'
import { getRouters } from '@/api/system/menu'
import Layout from '@/layout/index.vue'
import { STORAGE_KEY_USUAL_MENUS } from '@/utils/constants'
import {
  addLeadingSlash,
  getFirstChildrenFields,
  handleTreeData,
  isExternal,
  pathTrim,
  removeLeadingSlash
} from '@/utils'
import { MenuTypeEnums } from '@/utils/enums'
import MiddleDirectory from '@/layout/components/MiddleDirectory.vue'

const state = () => ({
  routes: [],
  // 快捷菜单
  usualMenus: JSON.parse(localStorage.getItem(STORAGE_KEY_USUAL_MENUS)) || []
})
const getters = {
  routes: (state) => state.routes,
  sidebarRoutes: (state) => state.sidebarRoutes,
  usualMenus: (state) => state.usualMenus
}
const mutations = {
  SET_ROUTES: (state, routes) => {
    state.routes = routes
  },
  SET_USUAL_MENUS: (state, usualMenus) => {
    state.usualMenus = usualMenus
    localStorage.setItem(STORAGE_KEY_USUAL_MENUS, JSON.stringify(usualMenus))
  }
}
const actions = {
  setRoutes({ commit }, routes) {
    commit('SET_ROUTES', routes)
  },
  generateRoutes({ commit }) {
    return new Promise((resolve) => {
      getRouters().then(res => {
        const menus = res.data || []

        // 将后台返回的菜单数据转换为vue-router的格式
        const routers = convertMenuToVueRouterFormat(menus)

        routers.unshift(...layoutRouteList)

        // 兜底方案（放到最后）：当用户访问的路由不存在时，跳转到404页面
        routers.push({
          path: '*',
          redirect: '/404',
          hidden: true
        })

        const routes = routers
        commit('SET_ROUTES', routes)
        resolve(routes)
      })
    })
  },
  setUsualMenus({ commit }, usualMenus) {
    commit('SET_USUAL_MENUS', usualMenus)
  }
}

/**
 * 处理后台返回的菜单数据，将其转换为vue-router的格式
 * @param {Array} menus 后台返回的菜单数据
 * @returns {[]} vue-router的格式
 */
function convertMenuToVueRouterFormat(menus) {
  // 对arr进行处理，返回vue-router的格式

  // 对arr进行深拷贝
  const newMenus = JSON.parse(JSON.stringify(menus))
  const newRouters = newMenus.map(item => {
    return {
      // 以下是自己需要的数据
      id: item.id,
      parentId: item.parentId,
      menuType: item.menuType,
      componentPath: item.component,
      // 以下是router需要的数据
      path: item.path,
      name: item.componentName,
      meta: {
        title: item.menuName,
        icon: item.menuIcon,
        affix: item.affix,
        // 是否使用子菜单的meta属性
        isChildMeta: false,
        permission: item.permission,
        keepAlive: item.keepAlive,
        dot: item.dot,
        badge: item.badge,
        showHeader: item.showHeader,
        showFooter: item.showFooter,
        alwaysShow: item.alwaysShow,
        sort: item.sortNum,
        embed: item.embed,
        embedUrl: item.embedUrl
      },
      // children: null,
      // component: loadComponent(item),
      hidden: !item.visible,
    }
  })

  // 转换成树形结构
  const tree = handleTreeData(newRouters)

  for (let node of tree) {
    recursionTree(node, null)
  }

  // 菜单排序
  tree.sort((a, b) => a.meta.sort - b.meta.sort)

  return tree
}

/**
 * 加载Vue组件
 * @param {Object} menu 菜单
 * @returns {(function(): Promise<*>)|null}
 */
function loadComponent(menu) {
  // 内嵌iframe
  if (menu.meta.embed === true) {
    return () => import('@/layout/components/InnerIframe/index.vue')
  }
  // 是否有组件路径
  if (!menu.componentPath) {
    return null
  }
  // 是否是外链
  if (isExternal(menu.path)) {
    return null
  }
  return () => import(`@/views/${removeLeadingSlash(menu.componentPath)}`)
}

/**
 * 递归处理树形菜单
 * @param {Object} node 当前节点
 * @param {Object} parentNode 父节点
 */
function recursionTree(node, parentNode) {
  const hasChildrenNode = Array.isArray(node.children) && node.children.length
  if (!hasChildrenNode) {
    node.children = []
  }
  // 是否有多个子节点
  const isMultiChildren = hasChildrenNode && node.children.length > 1

  if (!parentNode) {
    // 第一层节点
    if (hasChildrenNode) {
      // 有子节点
      node.component = Layout
      // 重定向到第一个可访问的子菜单
      node.redirect = pathTrim(addLeadingSlash(getFirstChildrenFields(node, { fieldKey: 'path' }).join('/')))
      if (!isMultiChildren) {
        // 只有一个子节点
        const child = node.children[0]
        if (!node.meta.alwaysShow) {
          node.meta = { ...child.meta }
          node.meta.isChildMeta = true
        }
      }
    } else {
      // 没有子节点
      if (node.menuType === MenuTypeEnums.MENU.value) {
        // 菜单
        if (isExternal(node.path)) {
          // 如果是外链
          node.path = removeLeadingSlash(node.path, true)
        } else {
          // 非外链
          // 给该菜单包装一个Layout组件,并且重定向到该菜单
          const childNode = JSON.parse(JSON.stringify(node))
          delete node.name

          node.path = addLeadingSlash(node.path)
          node.redirect = node.path
          node.component = Layout

          childNode.path = node.path
          childNode.component = loadComponent(node)

          node.children = [ childNode ]
        }
      } else {
        console.warn('[%s][%s]第一层节点如果没有子节点，需要是菜单类型', node.meta && node.meta.title || node.id, node.menuType)
      }
    }
  } else if (hasChildrenNode) {
    // 中间节点
    node.path = removeLeadingSlash(node.path)
    node.component = MiddleDirectory
  } else {
    // 最后一层节点
    if (node.menuType === MenuTypeEnums.MENU.value) {
      node.path = removeLeadingSlash(node.path)
      node.component = loadComponent(node)
    } else {
      console.warn('[%s]最后一层节点的类型应该是菜单', node.meta && node.meta.title || node.id)
    }
  }

  // 遍历子节点
  if (hasChildrenNode) {
    node.children.forEach(childNode => {
      recursionTree(childNode, node)
    })
  }
}

export default { state, getters, mutations, actions }
