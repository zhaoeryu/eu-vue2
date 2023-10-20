import { addLeadingSlash } from '@/utils'

const state = {
  visitedViews: []
}

const getters = {
  visitedViews: state => state.visitedViews
}

const mutations = {
  ADD_VISITED_VIEW: (state, view) => {
    if (state.visitedViews.some(v => v.path === view.path)) {
      return
    }
    state.visitedViews.push(view)
  },
  DEL_VISITED_VIEW: (state, view) => {
    const index = state.visitedViews.findIndex(item => item.path === view.path)
    state.visitedViews.splice(index, 1)
  },
  DEL_OTHER_VISITED_VIEW: (state, view) => {
    state.visitedViews = state.visitedViews.filter(item => {
      return item.meta.affix || item.path === view.path
    })
  },
  DEL_ALL_VISITED_VIEWS: state => {
    state.visitedViews = state.visitedViews.filter(item => item.meta.affix)
  },
  DEL_LEFT_VISITED_VIEWS: (state, view) => {
    const index = state.visitedViews.findIndex(item => item.path === view.path)
    if (index > 0) {
      state.visitedViews = state.visitedViews.filter((item, i) => {
        return item.meta.affix || i >= index
      })
    } else {
      state.visitedViews = state.visitedViews.filter(item => item.meta.affix)
    }
  },
  DEL_RIGHT_VISITED_VIEWS: (state, view) => {
    const index = state.visitedViews.findIndex(item => item.path === view.path)
    if (index < state.visitedViews.length - 1) {
      state.visitedViews = state.visitedViews.filter((item, i) => {
        return item.meta.affix || i <= index
      })
    } else if (index === state.visitedViews.length - 1) {
      // 如果只剩当前标签页，则不进行处理
    } else {
      state.visitedViews = state.visitedViews.filter(item => item.meta.affix)
    }
  }
}

const actions = {
  addVisitedView({ commit }, route) {
    commit('ADD_VISITED_VIEW', {
      path: addLeadingSlash(route.path),
      name: route.name,
      meta: { ...route.meta }
    })
  },
  delVisitedView({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_VISITED_VIEW', view)
      resolve([...state.visitedViews])
    })
  },
  delOthersVisitedViews({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_OTHER_VISITED_VIEW', view)
      resolve([...state.visitedViews])
    })
  },
  delAllVisitedViews({ commit, state }) {
    return new Promise(resolve => {
      commit('DEL_ALL_VISITED_VIEWS')
      resolve([...state.visitedViews])
    })
  },
  delLeftVisitedViews({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_LEFT_VISITED_VIEWS', view)
      resolve([...state.visitedViews])
    })
  },
  delRightVisitedViews({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_RIGHT_VISITED_VIEWS', view)
      resolve([...state.visitedViews])
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
