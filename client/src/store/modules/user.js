export default {
  namespaced: true,

  state: {
    user: {
      id: '',
      role: '',
      name: ''
    }
  },

  getters: {
    getUser(state) {
      return state.user
    }
  },

  mutations: {
    setUser(state, payload) {
      state.user = payload
    }
  },

  actions: {
    getUser({ commit }, payload) {
      commit('setUser', payload)
    }
  }
}