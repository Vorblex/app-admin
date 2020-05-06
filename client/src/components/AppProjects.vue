<template lang="pug">
  v-layout(column)
    h1.title Projects Page

    v-card
      v-btn(@click='createProject' color='primary' fab dark small absolute left bottom)
        v-icon mdi-plus
      v-container(fluid)
        v-row(justify='space-between')
          v-col(cols='12' sm='6')
            v-select(v-model='options.searchBy' :items='searchSelectItems' label='Search by')
          v-col(cols='12' sm='6')
            v-text-field(v-model='options.search' append-icon='mdi-magnify' label='Search' single-line hide-details)


    v-data-table.elevation-1(:headers='headers'
                             :items='projects'
                             :loading='loading'
                             :options.sync="options"
                             :server-items-length="totalProjects")

      template(#item.actions='{item}')
        v-btn.mr-2(@click.stop='$router.push({ name: `Documents`, params: {id: item.id, projectName: item.name}})') Show documents
        v-btn.mr-2(@click.stop='getInfo(item)' icon)
          v-icon(md color='cyan') info
        template(v-if='!manager')
          v-btn.mr-2(@click.stop='startEdit(item)' icon)
            v-icon(md color='primary') edit
          v-btn(@click='runProcess(`remove`, item)' icon)
            v-icon(md color='red') delete
          
    app-update-dialog(v-model='updateDialog'
                      v-if='updatedData'
                      :items='updatedData'
                      @save='runProcess(`update`, selectedData, $event)'
                      title='Project')

    app-create-dialog(v-model='createDialog'
                      v-if='createdData'
                      :items='createdData'
                      @save='runProcess(`create`, $event)'
                      title='New Project')

    app-info-dialog(v-model='infoDialog'
                    :data='selectedData'
                    titleProp='name')
</template>

<script>
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
      dataType: 'Project',
      totalProjects: 0,
      selectedData: {},
      updatedData: [],
      createdData: [],
      searchSelectItems: [ 
        {text: 'Name', value: 'name'},
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
        { text: 'Link', value: 'link'},
        { text: 'Unread Docs', value: 'unread', align: 'center'},
        { text: 'Actions', value: 'actions', align: 'center', sortable: false}
      ],
      projects: [],
      roles: ['teamlead', 'manager']
    }
  },
  methods: {
    ...mapActions('base', {
      showConfirmationDialog: 'showConfirmationDialog',
      showMessage: 'showMessage'
    }),
    async getData() {
      this.loading = true

      const { data } = await ProjectsService.getData(this.options)
      this.projects = data.data
      this.totalProjects = data.total
      this.loading = false
      return Promise.resolve()
    },
    getInfo(item) {
      this.selectedData = item
      this.infoDialog = true 
    },

    startEdit(item) {
      const {name, link, roles} = item
      this.selectedData = item
      const itemRoles = roles.map(el => el)
      this.updatedData = [
        {key: 'name', value: name, label: 'Name', type: 'text'},
        {key: 'link', value: link, label: 'Link', type: 'text'},
        {key: 'roles', value: itemRoles, options: this.roles, label: 'Roles', type: 'combobox', multiple: true}
      ],
      this.updateDialog = true
    },
    createProject() {
      this.createdData = [
        {key: 'name', value: '', label: 'Name', type: 'text'},
        {key: 'link', value: '', label: 'Link', type: 'text'},
        {key: 'roles', value: '', options: this.roles, label: 'Roles', type: 'combobox', multiple: true}
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

      } catch({ message }) {
        this.showMessage({ message, error: true })
      }

    },

    createProjectData() {
      return ProjectsService.create({...this.selectedData})
    },

    updateProjectData() {
      return ProjectsService.update(this.selectedData)
    },

    removeProjectData() {
      return ProjectsService.remove(this.selectedData.id)
    }
  },
  computed: {
    ...mapGetters('base', {
      confirmationAgree: 'confirmationAgree',
      admin: 'admin',
      teamlead: 'teamlead',
      manager: 'manager'
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