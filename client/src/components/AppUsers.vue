<template lang="pug">
  v-layout(v-if='admin' column)
    h1.title Users Page

    v-card
      v-btn(@click='createUser' color='primary' fab dark small absolute left bottom)
        v-icon mdi-plus
      v-container(fluid)
        v-row(justify='space-between')
          v-col(cols='12' sm='6')
            v-select(v-model='options.searchBy' :items='searchSelectItems' label='Search by')
          v-col(cols='12' sm='6')
            v-text-field(v-model='options.search' append-icon='mdi-magnify' label='Search' single-line hide-details)


    v-data-table.elevation-1(:headers='headers'
                             :items='users'
                             :loading='loading'
                             :options.sync="options"
                             :server-items-length="totalUsers")

      template(#item.role='{item}')
        span {{item.role}}

      template(#item.actions='{item}')
        v-btn.mr-2(@click.stop='getInfo(item)' icon)
          v-icon(md color='cyan') info
        v-btn.mr-2(@click.stop='startEdit(item)' icon)
          v-icon(md color='primary') edit
        v-btn(@click='runProcess(`remove`, item)' icon)
          v-icon(md color='red') delete
          
    app-update-dialog(v-model='updateDialog'
                      v-if='updatedData'
                      :items='updatedData'
                      @save='runProcess(`update`, selectedData, $event)'
                      title='User')

    app-create-dialog(v-model='createDialog'
                      v-if='createdData'
                      :items='createdData'
                      @save='runProcess(`create`, $event)'
                      title='New User')

    app-info-dialog(v-model='infoDialog'
                    :data='selectedData'
                    titleProp='name')
</template>

<script>
import UsersService from '~/services/UsersService'
import ProjectsService from '~/services/ProjectsService'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    AppUpdateDialog: () => import('@/AppUpdateDialog'),
    AppCreateDialog: () => import('@/AppCreateDialog'),
    AppInfoDialog: () => import('@/AppInfoDialog'),
    AppCopyAction: () => import('@/AppCopyAction')
  },
  data() {
    return {
      flag: false,
      loading: true,
      infoDialog: false,
      updateDialog: false,
      createDialog: false,
      action: '',
      dataType: 'User',
      totalUsers: 0,
      selectedData: {},
      updatedData: [],
      createdData: [],
      searchSelectItems: [ 
        {text: 'Name', value: 'name'},
        {text: 'Email', value: 'email'},
        {text: 'Id', value: 'id'}
      ],
      options: {
        search: '',
        searchBy: 'name',
        itemsPerPage: -1
      },
      headers: [
        { text: 'Id', value: 'id'},
        { text: 'Name', value: 'name'},
        { text: 'Email', value: 'email'},
        { text: 'Role', value: 'role.name'},
        { text: 'Actions', value: 'actions', align: 'center', sortable: false}
      ],
      users: [],
      projects: [],
      roles: ['admin', 'teamlead', 'manager']
    }
  },
  methods: {
    ...mapActions('base', {
      showConfirmationDialog: 'showConfirmationDialog',
      showMessage: 'showMessage'
    }),
    async getData() {
      this.loading = true

      const { data } = await UsersService.getData(this.options)
      this.users = data.data
      this.totalUsers = data.total
      this.loading = false

      const { data : projectsData } = await ProjectsService.getData(this.options)
      const projects =  projectsData.data.map(el => ({text: el.name, value: el.id }))
      this.projects = projects
    },
    getInfo(item) {
      this.selectedData = item
      this.infoDialog = true 
    },

    async startEdit(item) {
      const {id, name, email, role} = item
      const itemRole = role
      // const { data } = await UsersService.getUserProjects(id)
      const userProjects = []

      this.selectedData = item

      // data.forEach(el => {
      //   if(!el.users.length) return
      //   userProjects.push({text: el.name, value: el.id})
      // })

      this.updatedData = [
        {key: 'name', value: name, label: 'Name', type: 'text'},
        {key: 'email', value: email, label: 'Email', type: 'text'},
        {key: 'roles', value: itemRole, options: this.roles, label: 'Roles', type: 'combobox', multiple: false},
        {key: 'projects', value: userProjects, options: this.projects, label: 'Projects', type: 'combobox', multiple: true}
      ],
      this.updateDialog = true
    },
    createUser() {
      this.createdData = [
        {key: 'name', value: '', label: 'Name', type: 'text'},
        {key: 'email', value: '', label: 'Email', type: 'text'},
        {key: 'roles', value: '', options: this.roles, label: 'Roles', type: 'combobox', multiple: false},
        {key: 'projects', value: [], options: this.projects, label: 'Projects', type: 'combobox', multiple: true}
      ],
      this.createDialog = true
    },

    runProcess(action, data, updatedFields = {}) {
      this.selectedData = { ...data, ...updatedFields }
      this.action = action
      this.showConfirmationDialog({action, data: data.name})
    },
    async runAction() {

      if(this[`${this.action}Dialog`]) {
        this[`${this.action}Dialog`] = false
      }

      try {
        await this[`${this.action}${this.dataType}Data`]()
        this.showMessage({})
        await this.getData()
        // console.log('try');

      } catch({ message }) {
        // console.log('catch');
        this.showMessage({ message, error: true })
      }

    },

    createUserData() {
      return UsersService.create({...this.selectedData})
    },

    updateUserData() {
      return UsersService.update(this.selectedData)
    },

    removeUserData() {
      return UsersService.remove(this.selectedData.id)
    }
  },
  computed: {
    ...mapGetters('base', {
      confirmationAgree: 'confirmationAgree',
      admin: 'admin'
    })
  },
  watch: {
    confirmationAgree(v) {
      v && this.runAction()
    },
    options: {
      handler () {
        if(!this.flag) return
        this.getData()
      },
      deep: true,
    }
  },
  async mounted () {
    await this.getData()
    this.flag = true
  }

}
</script>