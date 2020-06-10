import axios from 'axios'
import store from '~/store'
import authService, * as authHelpers from './AuthService'
import router  from '~/router'

let flag = false

export default () => {
  const api = axios.create({
    baseURL: 'http://localhost:9999'
  })

  const AUTH_TOKEN = localStorage.getItem('accessToken')

  if(AUTH_TOKEN) {
    api.defaults.headers.common['Authorization'] = 'Bearer ' + AUTH_TOKEN
  }

  api.interceptors.request.use(request => {
    // console.log('IsA Exp', authHelpers.isAccessTokenExpired(), 'flag', flag);
    if(flag) return request
    if (authHelpers.isAccessTokenExpired() && authHelpers.getRefreshToken()) {
      flag = true
      return authService.refreshTokens()
        .then(response => {
          console.log('REFRESH RESPONSE' ,response);
          request.headers['Authorization'] = 'Bearer ' + response.accessToken
          flag = false
          return request
        }).catch(error => Promise.reject(error))
    } else {
      return request
    }
  }, error => {
    return Promise.reject(error)
  })


  api.interceptors.response.use(
    res => res ,
    error => {
      const { status, data } = error.response
      
      store.dispatch('base/showMessage', {message: data.message, error})
  
      if (status === 401 || status === 419 ) {
        router.push('/login')
      }
  
      return Promise.reject(data)
    }
  )

  return api
}
