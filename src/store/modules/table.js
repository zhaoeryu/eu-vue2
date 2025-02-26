import { STORAGE_KEY_TABLE_CONFIG } from '@/utils/constants'

function getCachedConfig() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY_TABLE_CONFIG)) || {}
}
function saveCachedConfig(fingerprint, config) {
  console.log('saveCachedConfig', fingerprint, config)
  localStorage.setItem(STORAGE_KEY_TABLE_CONFIG, JSON.stringify(Object.assign({}, getCachedConfig(), {
    [fingerprint]: config
  })))
}
function removeCachedConfig(fingerprint) {
  const config = getCachedConfig()
  delete config[fingerprint]
  localStorage.setItem(STORAGE_KEY_TABLE_CONFIG, JSON.stringify(config))
}

const state = () => ({
  tableConfig: getCachedConfig()
})
const getters = {
  tableConfig: state => fingerprint => state.tableConfig[fingerprint] || {}
}
const mutations = {
  SET_TABLE_CONFIG: (state, { fingerprint, config }) => {
    state.tableConfig[fingerprint] = config || {}
  }
}
const actions = {
  saveTableConfig({ commit }, params) {
    const { fingerprint, config } = params
    return new Promise((resolve, reject) => {
      if (!fingerprint || !config) {
        reject()
      }
      commit('SET_TABLE_CONFIG', params)
      saveCachedConfig(fingerprint, config)
      resolve()
    })
  },
  resetTableConfig({ commit }, fingerprint) {
    return new Promise((resolve, reject) => {
      if (!fingerprint) {
        reject()
      }
      commit('SET_TABLE_CONFIG', { fingerprint, config: {} })
      removeCachedConfig(fingerprint)
      resolve()
    })
  }
}

export default { state, getters, mutations, actions }
