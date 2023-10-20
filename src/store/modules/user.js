import { login, getInfo, logout } from '@/api/system/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const state = () => ({
  token: getToken(),
  user: {},
  roles: [],
  permissions: []
})
const getters = {
  token: state => state.token,
  user: state => state.user,
  roles: state => state.roles,
  permissions: state => state.permissions
}
const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USER: (state, user) => {
    state.user = user
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions
  }
}
const actions = {
  // 登录
  Login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo).then(res => {
        if (res.code != 200) {
          reject(res.msg)
          return
        }
        setToken(res.data)
        commit('SET_TOKEN', res.data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 获取用户信息
  GetInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo().then(res => {
        let roles = res.data.roles
        if (!roles || !roles.length) {
          // 如果用户没有任何角色，则默认赋予一个默认角色，避免因为没有角色，导致循环获取用户信息
          roles = ['ROLE_DEFAULT']
        }

        commit('SET_USER', res.data.user || {})
        commit('SET_ROLES', roles)
        commit('SET_PERMISSIONS', res.data.permissions || [])
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 退出
  Logout({ commit }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        resolve()
      }).catch(error => {
        reject(error)
      }).finally(() => {
        commit('SET_USER', {})
        commit('SET_ROLES', [])
        commit('SET_PERMISSIONS', [])
        commit('SET_TOKEN', null)
        removeToken()
      })
    })
  }
}
export default { state, getters, mutations, actions }
