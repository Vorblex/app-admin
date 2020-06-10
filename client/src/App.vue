<template lang='pug'>
  v-app#app
    template(v-if='isNotLoginPage')
      app-navigation-drawer(:routes='routes', :drawer='drawer', @input='drawer = !drawer')
      v-app-bar(app clipped-left)
        v-app-bar-nav-icon(@click.stop='drawer = !drawer')
        v-tooltip(left)
          template(v-slot:activator='{ on }')
            v-btn(color='warning' v-on='on' absolute right fab small dark)
              v-icon mdi-account-arrow-right
          span Logout
    v-content
      //- v-container(v-if='hasPagePermission || !isNotLoginPage' fluid fill-height )
      v-container(fluid fill-height )
        router-view
    app-confirmation-dialog
    app-snackbar
</template>

<script>
import router, { userRoutes as routes } from './router'
import { mapGetters, mapActions } from 'vuex'
import UsersService from '~/services/UsersService'

export default {
  components: {
    AppNavigationDrawer: () => import('@/AppNavigationDrawer'),
    AppSettings: () => import('@/AppSettings.vue'),
    AppSnackbar: () => import('@/AppSnackbar'),
    AppConfirmationDialog: () => import('@/AppConfirmationDialog')
  },
   data: () => ({
    drawer: null
  }),
  methods: {
    ...mapActions('base', {
      changeLoading: 'changeLoading',
      setPermissions: 'setPermissions',
      setUser: 'setUser'
    })
  },
  computed: {
    ...mapGetters('base', {
      user: 'user',
      loading: 'loading',
      isPermissions: 'isPermissions',
      hasPermission: 'hasPermission'
    }),
    routes() {
      return routes.filter(route => this.hasPermission(route.meta.permission))
    },
    hasPagePermission() {
      return this.hasPermission(this.$route.meta.pagePermission)
    },
    isNotLoginPage() {
      return this.$route.name !== 'Login'
    }
  },
  watch: {
    async user(v) {
      console.log('Set User',v)
      const { data } = await UsersService.getPermissions()
      this.setPermissions(data)
    },
    isPermissions(v) {
      if(!v) return
      router.beforeEach((to, from, next) => {
        if (to.matched.some(record => record.meta.permission)) {
          if (!this.hasPermission(to.meta.permission) && to.name !== 'Projects') {
            next({ path: '/projects' })
          } else {
            next()
          }
        } else {
          next()
        }
      })
      this.changeLoading(false)
    },
    // loading(v) {
    //   if(v) return
    //   const overLayer = document.getElementById('overLayer')
    //   overLayer.addEventListener('transitionend', () => overLayer.style.display = 'none')
    //     setTimeout(() => {
    //         overLayer.style.cssText = `opacity: 0;transition: .4s;`
    //     }, 1000)
    // }
  },
  created() {
    console.log(this.$route);
    if(localStorage.getItem('accessToken')) {
      const userData = JSON.parse(atob(localStorage.getItem('accessToken').split('.')[1]))
      this.setUser(userData)
    }
    this.$vuetify.theme.dark = true
  }
}
</script>
