import store from '@/store'
import { ALL_PERMISSION, ALL_ROLE } from '@/utils/constants'

/**
 * 检查当前用户是否拥有指定的权限
 * @param {Array} permissions 需要检查的权限列表
 * @returns {boolean} 是否拥有指定的权限
 */
export function hasPermission(permissions) {
  if (!Array.isArray(permissions)) {
    return false
  }
  const havePermissions = store.getters && store.getters['user/permissions'] || []
  return havePermissions.some(permission => permission === ALL_PERMISSION || permissions.includes(permission))
}

/**
 * 检查当前用户是否拥有指定的角色
 * @param {Array} roles 需要检查的角色列表
 * @returns {boolean} 是否拥有指定的角色
 */
export function hasRole(roles) {
  if (!Array.isArray(roles)) {
    return false
  }
  const haveRoles = store.getters && store.getters['user/roles'] || []
  return haveRoles.some(role => role === ALL_ROLE || roles.includes(role))
}
