import { layoutRouteList } from '@/router/routers'
import { getRouters } from '@/api/system/menu'
import { MenuTypeEnums } from '@/utils/enums'
import { fromArray } from 'tree-lodash'
import _ from 'lodash'
import {
  formatMenuToRoute,
  buildFullPath,
  processDirectoryNode,
  processMenuNode,
} from '@/utils/route-helpers'

const state = () => ({
  routes: [],
})

const getters = {
  routes: (state) => state.routes,
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.routes = routes
  },
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
        const constantRouteList = handleConstantRouteList(layoutRouteList)
        routers.unshift(...constantRouteList)

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
}

/**
 * 处理后台返回的菜单数据，将其转换为vue-router的格式
 * @param {Array} menus 后台返回的菜单数据
 * @returns {Array} vue-router格式的路由数组
 */
function convertMenuToVueRouterFormat(menus) {
  if (!Array.isArray(menus) || menus.length === 0) {
    return []
  }
  
  // 使用 lodash 链式操作优化数据处理流程
  const processedMenus = _(menus)
    .sortBy('sortNum')
    .map(formatMenuToRoute)
    .filter(item => item !== null)
    .value()

  const tree = fromArray(processedMenus, {
    itemKey: 'id',
    parentKey: 'parentId',
    childrenKey: 'children'
  })

  return _.sortBy(tree.map(node => processNode(node, null)), 'meta.sort')
}

/**
 * 处理常量路由列表
 * @param {Array} menus 常量路由菜单
 * @returns {Array} 处理后的路由数组
 */
function handleConstantRouteList(menus) {
  return menus.map(node => processNode(node, null, true))
}

/**
 * 处理节点数据
 * @param {Object} node 节点数据
 * @param {Object} parentNode 父节点数据
 * @param {boolean} isConstant 是否是常量路由
 * @returns {Object} 处理后的节点
 */
function processNode(node, parentNode, isConstant = false) {
  // 计算 fullPath
  const fullPath = getFullPath(parentNode, node);

  // 节点类型处理
  const processed = isConstant ? {...node, fullPath} : handleNodeByType({ ...node, fullPath }, parentNode)
  
  // 统一 children 处理
  const children = Array.isArray(processed.children) ? processed.children : []
  const hasChildren = children.length > 0

  // 递归处理 children
  return {
    ...processed,
    children: hasChildren ? children.map(child => processNode(child, processed, isConstant)) : []
  }
}

/**
 * 获取完整路径
 * @param {Object} parentNode 父节点
 * @param {Object} node 当前节点
 * @returns {string} 完整路径
 */
function getFullPath(parentNode, node) {
  const parentPath = parentNode ? parentNode.fullPath : ''
  return buildFullPath(parentPath, node.path)
}

/**
 * 根据节点类型处理节点
 * @param {Object} node 节点数据
 * @param {Object} parentNode 父节点数据
 * @returns {Object} 处理后的节点
 */
function handleNodeByType(node, parentNode) {
  const { menuType } = node

  switch (menuType) {
    case MenuTypeEnums.DIR.value:
      return processDirectoryNode(node, parentNode)
    case MenuTypeEnums.MENU.value:
      return processMenuNode(node, parentNode)
    default:
      console.warn('未知的节点类型: %s', menuType)
      return node
  }
}

export default { state, getters, mutations, actions }
