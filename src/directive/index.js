import hasRole from './permission/role'
import hasPermissions from './permission/permissions'
const install = function(Vue) {
  Vue.directive('role', hasRole)
  Vue.directive('permissions', hasPermissions)
}

export default install
