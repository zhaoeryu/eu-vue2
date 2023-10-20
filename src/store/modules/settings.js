import { defaultTheme } from '@/settings'
import { STORAGE_KEY_THEME } from '@/utils/constants'
import { DeviceTypeEnums } from '@/utils/enums'

const storageTheme = JSON.parse(localStorage.getItem(STORAGE_KEY_THEME)) || {}
const state = () => ({
  theme: Object.assign({}, defaultTheme, storageTheme),
  device: 'desktop',
  sidebarCollapsed: false
})
const getters = {
  theme: (state) => state.theme,
  darkMode: (state) => state.theme.darkMode,
  enabledWatermark: (state) => state.theme.enabledWatermark,
  device: (state) => state.device,
  isMobileDevice: (state) => state.device === DeviceTypeEnums.MOBILE,
  sidebarCollapsed: (state) => state.sidebarCollapsed
}
const mutations = {
  SET_THEME: (state, theme) => {
    state.theme = theme
  },
  SET_DEVICE: (state, device) => {
    state.device = device
  },
  SET_COLLAPSED: (state, collapsed) => {
    state.sidebarCollapsed = collapsed
  }
}
const actions = {
  saveTheme({ commit }, theme) {
    localStorage.setItem(STORAGE_KEY_THEME, JSON.stringify(theme))
    commit('SET_THEME', theme)
  },
  toggleDevice({ commit }, device) {
    commit('SET_DEVICE', device)
  },
  toggleCollapsed({ commit }, collapsed) {
    commit('SET_COLLAPSED', collapsed)
  }
}
export default { state, getters, mutations, actions }
