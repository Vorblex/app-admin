// import axios from 'axios'
// import Http from './http.init'
// import { ResponseWrapper, ErrorWrapper } from './util'
// import { API_URL } from '../.env'
import $store from '../store'
import $router from '../router'
import api from './api'

export default {
  async signIn (params) {
    const response = await api().post('signin', params)
    _setAuthData(response)
    return Promise.resolve()
  },

  async refreshTokens () {
    try {
      const response = await api().post(`signin/refresh-tokens`, { refreshToken: getRefreshToken() })
      // console.log('Refresh func');
        _setAuthData(response)
        return Promise.resolve(response.data)
      } catch(error) {
        return Promise.reject(error)
        if (error.response.data.badRefreshToken) {
          console.log('http.init.js >> badRefreshToken: true')
          _resetAuthData()
          $router.push({ name: 'index' })
          return Promise.reject(error)
        }
        if (error.response.data.refreshTokenExpiredError) {
          console.log('http.init.js >> refreshTokenExpiredError')
          _resetAuthData()
          $router.push({ name: 'index' })
          return Promise.reject(error)
        }
      }
  }
}


// export function makeLogin ({ email, password }) {
//   return new Promise((resolve, reject) => {
//     axios.post(`signin`, { email, password })
//       .then(response => {
//         _setAuthData(response)
//         return resolve(new ResponseWrapper(response, response.data))
//       }).catch(error => reject(new ErrorWrapper(error)))
//   })
// }

export function makeLogout () {
  return new Promise((resolve, reject) => {
    new Http({ auth: true }).post(`auth/signout`)
      .then(response => {
        _resetAuthData()
        $router.push({ name: 'index' })
        return resolve(new ResponseWrapper(response, response.data))
      }).catch(error => reject(new ErrorWrapper(error)))
  })
}

// export function refreshTokens () {
//   return new Promise((resolve, reject) => {
//     axios.post(`${API_URL}/auth/refresh-tokens`, { refreshToken: getRefreshToken() })
//       .then(response => {
//         _setAuthData(response)
//         return resolve(new ResponseWrapper(response, response.data))
//       })
//       .catch(error => {
//         if (error.response.data.badRefreshToken) {
//           console.log('http.init.js >> badRefreshToken: true')
//           _resetAuthData()
//           $router.push({ name: 'index' })
//           return reject(new ErrorWrapper(error))
//         }
//         if (error.response.data.refreshTokenExpiredError) {
//           console.log('http.init.js >> refreshTokenExpiredError')
//           _resetAuthData()
//           $router.push({ name: 'index' })
//           return reject(new ErrorWrapper(error))
//         }
//       })
//   })
// }

/**
 ******************************
 * @methods
 ******************************
 */

export function isAccessTokenExpired () {
  const accessTokenExpDate = $store.state.base.user.exp - 5
  const nowTime = Math.floor(new Date().getTime() / 1000)
  return accessTokenExpDate <= nowTime
}

export function getRefreshToken () {
  return localStorage.getItem('refreshToken')
}

export function getAccessToken () {
  return localStorage.getItem('accessToken')
}

function _resetAuthData () {
  // reset userData in store
  $store.commit('user/SET_CURRENT_USER', {})
  $store.commit('auth/SET_ATOKEN_EXP_DATE', null)
  // reset tokens in localStorage
  localStorage.setItem('refreshToken', '')
  localStorage.setItem('accessToken', '')
}

function _setAuthData (res) {
  const userData = JSON.parse(atob(res.data.accessToken.split('.')[1]))
  localStorage.setItem('accessToken', res.data.accessToken)
  localStorage.setItem('refreshToken', res.data.refreshToken)
  $store.dispatch('base/setUser', userData)
  // localStorage.setItem('refreshToken', response.data.refreshToken)
  // localStorage.setItem('accessToken', response.data.accessToken)
  // $store.commit('auth/SET_ATOKEN_EXP_DATE', response.data.expires_in)
}