<template lang="pug">
  v-layout(column)
    h1.title Clients Page

    v-card
      v-container(fluid)
        v-row(justify='space-between')
          v-col(cols='12' sm='5')
            v-select(v-model='options.searchBy' :items='searchSelectItems' label='Search by')
          v-col(cols='12' sm='5')
            v-text-field(v-model='options.search' append-icon='mdi-magnify' label='Search' single-line hide-details)


    v-data-table.elevation-1(:headers='headers'
                             :items='clients'
                             :loading='loading'
                             :options.sync="options"
                             :server-items-length="totalClients")

      template(#item.copy='{item}')
        app-copy-action(:data='item' titleProp='login')

      template(#item.account='{ item: { account } }')
        v-chip.d-block.text-center(:color='getAccountColor(account)' text-color='#000' small) {{ account }}

      template(#item.actions='{item}')
        v-btn.mr-2(@click.stop='getClientInfo(item)' icon)
          v-icon(md color='cyan') info
        v-btn.mr-2(@click.stop='startEditClient(item)' icon)
          v-icon(md color='primary') edit
        v-btn(@click='runClientProcess(`remove`, item)' icon)
          v-icon(md color='red') delete
          
    app-update-dialog(v-model='updateDialog'
                      v-if='updatedClientData'
                      :items='updatedClientData'
                      @save='runClientProcess(`update`, selectedClientData, $event)'
                      title='Client Profile')

    app-info-dialog(v-model='infoDialog'
                    :data='selectedClientData'
                    titleProp='login')

</template>

<script>
import ClientsService from '~/services/ClientsService'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    AppUpdateDialog: () => import('@/AppUpdateDialog'),
    AppInfoDialog: () => import('@/AppInfoDialog'),
    AppCopyAction: () => import('@/AppCopyAction')
  },
  data() {
    return {
      loading: true,
      infoDialog: false,
      updateDialog: false,
      clientAction: '',
      totalClients: 0,
      selectedClientData: {},
      updatedClientData: [],
      searchSelectItems: [ 
        {text: 'Id', value: 'id'},
        {text: 'Email', value: 'email'}
      ],
      options: {
        search: '',
        searchBy: 'email',
        itemsPerPage: 5
      },
      headers: [
        { text: '', value: 'copy', sortable: false},
        { text: 'Id', value: 'id'},
        { text: 'Email', value: 'email'},
        { text: 'Login', value: 'login'},
        { text: 'Account', value: 'account', align: 'center'},
        { text: 'First name', value: 'firstName', align: 'center',},
        { text: 'Last name', value: 'lastName', align: 'center',},
        { text: 'Actions', value: 'actions', align: 'center', sortable: false}
      ],
      accountTypes: ['bronze', 'silver', 'gold', 'platinum' , 'vip'],
      clients: []
    }
  },

  methods: {
    ...mapActions('base', {
      showConfirmationDialog: 'showConfirmationDialog',
      showMessage: 'showMessage'
    }),
    async getClients() {
      this.loading = true

      const { items, total } = await ClientsService.getData(this.options)
      this.clients = items
      this.totalClients = total
      this.loading = false
    },

    getClientInfo(item) {
      this.selectedClientData = item
      this.infoDialog = true 
    },

    startEditClient(item) {
      const {firstName, lastName, email, account} = item
      this.selectedClientData = item
      this.updatedClientData = [
        {key: 'firstName', value: firstName, label: 'First name', type: 'text'},
        {key: 'lastName', value: lastName, label: 'Last name', type: 'text'},
        {key: 'email', value: email, label: 'Email', type: 'text'},
        {key: 'account', value: account, options: this.accountTypes, label: 'Account type', type: 'select'}
      ]
      // this.updatedClientData = [
      //   {key: 'firstName', value: '', label: 'First name', type: 'text'},
      //   {key: 'lastName', value: '', label: 'Last name', type: 'text'},
      //   {key: 'email', value: '', label: 'Email', type: 'text'},
      //   { key: 'account', value: null, options: this.accountTypes, label: 'Account type', type: 'select' }
      // ]
      this.updateDialog = true
    },

    runClientProcess(action, data, updatedFields = {}) {
      this.selectedClientData = { ...data, ...updatedFields }
      this.clientAction = action
      this.showConfirmationDialog({action, data: data.login})
    },

    async runClientAction() {

      if(this[`${this.clientAction}Dialog`]) {
        this[`${this.clientAction}Dialog`] = false
      }

      try {
        await this[`${this.clientAction}ClientData`]()
        this.showMessage({})
        this.getClients()

      } catch({ message }) {
        this.showMessage({ message, error: true })
      }

    },

    async updateClientData() {
      await ClientsService.update(this.selectedClientData)
    },

    async removeClientData() {
      await ClientsService.remove(this.selectedClientData.id)
    },

    getAccountColor(account) {
      switch(account) {
        case 'bronze':
          return '#CC6F3C'
        case 'silver':
          return '#B7B8B8'
        case 'gold':
          return '#FECD05'
        case 'platinum':
          return '#EABE72'
        case 'vip':
          return '#0A9B44'
      }
    }
  },

  computed: {
    ...mapGetters('base', {
      confirmationAgree: 'confirmationAgree'
    })
  },

  watch: {
    confirmationAgree(v) {
      v && this.runClientAction()
    },
    options: {
      handler (e) {
        this.getClients()
      },
      deep: true,
    }
  },

  mounted () {
    this.getClients()
  }
}
</script>

<style lang="scss" scoped>

</style>