import Vue from 'vue'

let timeout = null

export default {
  namespaced: true,

  state: {
    user: {role: 'admin'},
    // user: 'teamlead',
    // user: 'manager',
    loading: true,
    isError: false,
    confirmationDialog: false,
    confirmationAgree: false,
    confirmationData: {
      action: '',
      data: ''
    },
    snackbarDefaultMessages: {
      success: 'success',
      error: 'server error'
    }, 
    snackbarTimeout: 3000,
    message: '',
    permissions: []
  },

  getters: {
    user: ({ user }) => user,
    admin: ({ user }) => user === 'admin',
    teamlead: ({ user }) => user === 'teamlead',
    manager: ({ user }) => user === 'manager',
    loading: ({ loading }) => loading,
    isPermissions: ({ permissions }) => !!permissions.length,
    hasPermission: ({ permissions }) => (action) => {
      return permissions.some(el => el === action)
    },
    isError(state) {
      return state.isError
    },
    message(state) {
      return state.message
    },
    snackbarTimeout(state) {
      return state.snackbarTimeout
    },
    confirmationDialog({ confirmationDialog }) {
      return confirmationDialog
    },
    confirmationText({ confirmationData }) {
      const { action, data } = confirmationData
      return `Are you shure want to ${action} ${data}?`
    },
    confirmationAgree({ confirmationAgree }) {
      return confirmationAgree
    },
  },

  mutations: {
    setUser(state, payload) {
      state.user = payload
    },

    setPermissions(state, payload) {
      // state.permissions = payload
      state.permissions = ['get_users', 'get_documents','approve_documents', 'create_comments','get_projects','update_projects']
    },

    changeLoading(state, payload) {
      state.loading = payload
    },

    setError(state, payload) {
      state.isError = payload
    },

    setConfirmationData(state, { action, data }) {
      state.confirmationData.action = action
      state.confirmationData.data = data
    },

    setConfirmationAgree(state, payload) {
      state.confirmationAgree = payload
    },

    showConfirmationDialog(state, payload) {
      state.confirmationDialog = payload
    },
    
    hideConfirmationDialog(state, payload) {
      state.confirmationDialog = payload
    },

    setMessage(state, payload) {
      const { success, error } = state.snackbarDefaultMessages
      state.isError && (payload = payload || error)
      payload = payload || success
      state.message = payload
    },

    resetSnackbar(state) {
      state.message = ''
      state.isError = false
    }
  },

  actions: {
    setUser({ commit }, payload) {
      commit('setUser', payload)
    },

    setPermissions({ commit }, payload) {
      commit('setPermissions', payload)
    },
    
    changeLoading({ commit }, payload) {
      commit('changeLoading', payload)
    },

    setError({ commit }, payload) {
      commit('setError', payload)
    },

    showMessage({ commit, state }, { error, message }) {
      error && commit('setError', error)
      commit('setMessage', message)
      clearTimeout(timeout)
      timeout = setTimeout(() => commit('resetSnackbar'), state.snackbarTimeout + 50)
    },

    showConfirmationDialog({ commit }, payload) {
      commit('setConfirmationData', payload)
      commit('showConfirmationDialog', true)
    },

    hideConfirmationDialog({ commit }) {
      return new Promise(resolve => {
        commit('hideConfirmationDialog')
        resolve()
      })
    },

    async setConfirmationAgree({dispatch, commit }, payload) {
      commit('setConfirmationAgree', payload)
      await dispatch('hideConfirmationDialog')
      commit('setConfirmationAgree', false)
    },
  }
}