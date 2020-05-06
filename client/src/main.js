import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify.js'
import vuelidate from './plugins/vuelidate.js'
import store from './store'
import router  from './router'

Vue.config.productionTip = false

new Vue({
  store,
  router,
  vuetify,
  vuelidate,
  render: h => h(App)
}).$mount('#app')
