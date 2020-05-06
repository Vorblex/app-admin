<template>
  <v-app id="app">
    <app-navigation-drawer :routes="routes" :drawer="drawer" @input="drawer = !drawer"></app-navigation-drawer>

    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <v-tooltip left>
        <template v-slot:activator="{ on }">
          <v-btn color="warning" v-on="on" absolute right fab small dark>
            <v-icon>mdi-account-arrow-right</v-icon>
          </v-btn>
        </template>
        <span>Logout</span>
      </v-tooltip>

    </v-app-bar>

    <v-content>
      <v-container fluid>
        <router-view></router-view> 
      </v-container>
    </v-content>

    <app-confirmation-dialog></app-confirmation-dialog>
    <app-snackbar></app-snackbar>
  </v-app>
</template>

<script>
import { routes } from './router'
import { mapGetters, mapActions } from 'vuex'
import api from './services/api'

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
      setUser: 'setUser'
    })
  },
  computed: {
    ...mapGetters('base', {
      user: 'user',
      loading: 'loading'
    }),
    routes() {
      return routes[this.user.role] || []
    }
  },
  watch: {
    user(v) {
      console.log('VV',v);
    }
  },
  created() {
    if(localStorage.getItem('accessToken')) {
      const userData = JSON.parse(atob(localStorage.getItem('accessToken').split('.')[1]))
      this.setUser(userData)
    }
    this.$vuetify.theme.dark = true
  }
}
</script>
