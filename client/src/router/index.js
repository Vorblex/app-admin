import Vue from 'vue'
import Store from '~/store'
import Router from 'vue-router'

const { user } = Store.state.base

const admin = [
  {
    path: '/users',
    name: 'Users',
    icon: 'mdi-account-circle',
    component: () => import('@/AppUsers'),
    meta: { adminOnly: true }
  }
]

const teamlead = [
  {
    path: '/projects',
    name: 'Projects',
    icon: 'mdi-webpack',
    component: () => import('@/AppProjects')
  }
]

const manager = [
  {
    path: '/clients',
    name: 'Clients',
    icon: 'mdi-account-multiple',
    component: () => import('@/AppClients')
  }
]

Vue.use(Router)

export const routes = {

  redirect: [
    {
      path: '/',
      redirect: 'Login'
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/Login')
    },
    // {
    //   path: '/',
    //   redirect: 'projects'
    // },
    // {
    //   path: '*',
    //   redirect: '/'
    // }
  ],

  nested: [ 
    {
      path: '/projects/:id',
      name: 'Documents',
      icon: 'mdi-webpack',
      props: true,
      component: () => import('@/AppDocuments')
    }
  ],

  admin: [
    ...admin,
    ...teamlead,
    ...manager
  ],

  teamlead: [
    ...teamlead,
    ...manager
  ],

  manager: [
    ...teamlead,
    ...manager
  ]
}

export const userRoutes = [...routes[user.role]]

export default new Router({
  mode: 'history',
  routes: [
    ...userRoutes,
    ...routes.nested,
    ...routes.redirect
  ]
})


// router.beforeEach(initCurrentUserStateMiddleware)
// router.beforeEach(checkAccessMiddleware)
// router.beforeEach(setPageTitleMiddleware)