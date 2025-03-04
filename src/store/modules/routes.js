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
  const sortedMenus = sortMenus(menus)
  const formattedRouters = formatMenusToRouters(sortedMenus)
  const tree = handleTreeData(formattedRouters)

  const processedTree = processTreeNodes(tree)
  return sortTree(processedTree)
}

/**
 * 对菜单数组按 sortNum 排序
 * @param {Array} menus 菜单数组
 * @returns {Array} 排序后的菜单数组
 */
function sortMenus(menus) {
  return [...menus].sort((a, b) => a.sortNum - b.sortNum)
}

/**
 * 将菜单数据格式化为路由数据
 * @param {Array} menus 菜单数组
 * @returns {Array} 路由数组
 */
function formatMenusToRouters(menus) {
  return menus.map(item => ({
    // 自定义数据
    id: item.id,
    parentId: item.parentId,
    menuType: item.menuType,
    componentPath: item.component,
    // 路由所需数据
    path: item.path,
    name: item.componentName,
    meta: {
      title: item.menuName,
      icon: item.menuIcon,
      affix: item.affix,
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
    hidden: !item.visible,
    children: []
  }))
}

/**
 * 递归处理树形节点
 * @param {Array} tree 树形节点数组
 * @returns {Array} 处理后的树形节点数组
 */
function processTreeNodes(tree) {
  return tree.map(node => {
    processNode(node, null)
    return node
  })
}

/**
 * 处理单个节点
 * @param {Object} node 当前节点
 * @param {Object|null} parentNode 父节点
 */
function processNode(node, parentNode) {
  let hasChildren = Array.isArray(node.children) && node.children.length

  if (!parentNode) {
    // 根节点
    hasChildren = handleRootNode(node, hasChildren)
  } else if (hasChildren) {
    // 中间节点
    handleMiddleNode(node)
  } else {
    // 叶子节点
    handleLeafNode(node)
  }

  // 遍历子节点
  if (hasChildren) {
    node.children.forEach(childNode => {
      processNode(childNode, node)
    })
  }
}

/**
 * 处理根节点
 * @param {Object} node 当前节点
 * @param {boolean} hasChildren 是否有子节点
 * @returns {boolean} 是否有子节点
 */
function handleRootNode(node, hasChildren) {
  if (hasChildren) {
    // 有子节点
    // 判断当前节点是目录还是菜单
    if (node.menuType === MenuTypeEnums.DIR.value) {
      // 目录
      node.component = Layout
      // 重定向到第一个可访问的子菜单
      const condition = (n) => n.menuType !== MenuTypeEnums.MENU.value
      node.redirect = pathTrim(addLeadingSlash(getFirstChildrenFields(node, { fieldKey: 'path', condition }).join('/')))

      // 是否有多个子节点
      const isMultiChildren = node.children.length > 1
      if (!isMultiChildren && !node.meta.alwaysShow) {
        const child = node.children[0]
        node.meta = { ...child.meta }
        node.meta.isChildMeta = true
      }
    } else {
      // 菜单
      wrapMenuWithLayout(node)

      hasChildren = false
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
        wrapMenuWithLayout(node)
      }
    } else {
      console.warn('[%s][%s]第一层节点如果没有子节点，需要是菜单类型', node.meta && node.meta.title || node.id, node.menuType)
    }
  }
  return hasChildren
}

/**
 * 处理中间节点
 * @param {Object} node 当前节点
 */
function handleMiddleNode(node) {
  if (node.menuType === MenuTypeEnums.DIR.value) {
    node.path = removeLeadingSlash(node.path)
    node.component = MiddleDirectory
  } else if (node.menuType === MenuTypeEnums.MENU.value) {
    node.path = removeLeadingSlash(node.path)
    node.component = loadComponent(node)
  } else {
    console.warn('[%s]不受支持的中间节点类型', node.meta && node.meta.title || node.id)
  }
}

/**
 * 处理叶子节点
 * @param {Object} node 当前节点
 */
function handleLeafNode(node) {
  if (node.menuType === MenuTypeEnums.MENU.value) {
    node.path = removeLeadingSlash(node.path)
    node.component = loadComponent(node)
  } else {
    console.warn('[%s]最后一层节点的类型应该是菜单', node.meta && node.meta.title || node.id)
  }
}

/**
 * 包装菜单组件
 * @param {Object} node 当前节点
 */
function wrapMenuWithLayout(node) {
  const childNode = { ...node }
  delete node.name
  node.path = addLeadingSlash(node.path)
  node.redirect = node.path
  node.component = Layout
  childNode.path = ''
  node.children = [childNode, ...(childNode.children || [])]
  childNode.children = []
  node.children.forEach(item => {
    item.component = loadComponent(item)
  })
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
 * 对树形节点按 sort 排序
 * @param {Array} tree 树形节点数组
 * @returns {Array} 排序后的树形节点数组
 */
function sortTree(tree) {
  return tree.sort((a, b) => a.meta.sort - b.meta.sort)
}

export default { state, getters, mutations, actions }
