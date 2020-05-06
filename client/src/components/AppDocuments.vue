<template lang="pug">
  v-layout(column)
    h1.title {{projectName}} documents
    v-card
      v-btn(@click='createDocument' color='primary' fab dark small absolute left bottom)
        v-icon mdi-plus
      v-container(fluid)
        v-row(justify='space-between')
          v-col(cols='12' sm='6')
            v-select(v-model='options.searchBy' :items='searchSelectItems' label='Search by')
          v-col(cols='12' sm='6')
            v-text-field(v-model='options.search' append-icon='mdi-magnify' label='Search' single-line hide-details)
        v-row(justify='end')
          v-col(cols='12' sm='4')
            v-select(@change='setFilter' :value='filterValue' :items='filterSelectItems' label='Filter')
          //- v-switch.mr-4(v-model='options.unread' :true-value='1' :false-value='0' color='success' label='Unread')
          //- v-switch.mr-4(v-model='options.approved' :true-value='1' :false-value='0' color='success' label='Approved')


    v-data-table( :headers='headers'
                  :items='documents'
                  :loading='loading'
                  :options.sync="options"
                  :server-items-length="totalDocuments"
                  :single-expand="true"
                  :expanded.sync="expanded"
                  @update:expanded='updateExpanded'
                  @item-expanded='onItemExpanded'
                  class='elevation-1 docs-table'
                  show-expand )

      template(#item='{item, expand, isExpanded, wasExpanded}')
        tr(:class='{viewed: item.viewed || item.wasExpanded}')
          td
            v-btn(@click='setExpanded(item, expand, isExpanded)' icon)
              v-icon(color="primary") mdi-arrow-up-down
          td {{item.id}}
          td {{item.description}}
          td(class='text-center') {{item.files.length}}
          td(class='text-center')
          td(class='text-center') {{item.createdAt}}
          td(class='text-center') {{item.updatedAt}}
          td
            v-switch(v-if='admin' v-model='item.approved' @change='approveDocument(item.id, $event)' color='success' class='my-switch')
            div(v-else :class='{ "approved-indicator": true, "approved": item.approved }')
          td(class='text-right')
            v-tooltip(top)
              template(#activator='{on}')
                v-btn(v-on='on' :href='`files/${item.id}/all`' :disabled='!item.files.length' icon download)
                  v-icon(color="primary") mdi-folder-download
              span Download Files
            v-btn(@click.stop='getInfo(item)' icon)
              v-icon(md color='cyan') info
            v-btn(@click.stop='startEdit(item)' icon)
              v-icon(md color='primary') edit
            v-btn(@click='runProcess(`remove`, item)' icon)
              v-icon(md color='red') delete

      template(#expanded-item='{ headers, item }')
        td(:colspan='headers.length')
          v-row
            v-col(cols='12' sm='6')
              template(v-if='expanded[0]')
                app-upload-files(@upload='getData()' :id='expanded[0].id')
                v-textarea(v-model='comment' :readonly='manager' label='Comments' prepend-icon='comment' filled class='mt-2')
                v-btn.mr-4(v-if='!manager' color='blue darken-1' @click='addComment') Add comment
                v-btn(v-if='expanded[0].comments.length' @click='commentsDialog = true' color='blue darken-1') Show comments

            v-col(cols='12' sm='6')
              app-expansion-panel(@delete='runProcess(`remove`, $event)' :data='expanded[0]' class='my-2')

          
    app-update-dialog(v-model='updateDialog'
                      v-if='updatedData'
                      :items='updatedData'
                      @save='runProcess(`update`, selectedData, $event)'
                      title='Document')

    app-create-dialog(v-model='createDialog'
                      v-if='createdData'
                      :items='createdData'
                      @save='runProcess(`create`, $event)'
                      title='New Document')

    app-info-dialog(v-model='infoDialog'
                    :data='selectedData'
                    titleProp='description')

    app-comments-dialog(v-model='commentsDialog'
                        v-if='expanded[0]'
                        :comments='expanded[0].comments')

</template>

<script>
import DocumentsService from '~/services/DocumentsService'
import FilesService from '~/services/FilesService'
import { mapActions, mapGetters } from 'vuex'

export default {
  props: ['projectName'],
  components: {
    AppUpdateDialog: () => import('@/AppUpdateDialog'),
    AppCreateDialog: () => import('@/AppCreateDialog'),
    AppInfoDialog: () => import('@/AppInfoDialog'),
    AppCopyAction: () => import('@/AppCopyAction'),
    AppExpansionPanel: () => import('@/AppExpansionPanel'),
    AppUploadFiles: () => import('@/AppUploadFiles'),
    AppCommentsDialog: () => import('@/AppCommentsDialog')
  },
  data() {
    return {
      flag: false,
      loading: true,
      infoDialog: false,
      updateDialog: false,
      createDialog: false,
      commentsDialog: false,
      comment: '',
      action: '',
      dataType: 'Document',
      totalDocuments: 0,
      expanded: [],
      selectedData: {},
      updatedData: [],
      createdData: [],
      filterValue: 'all',
      searchSelectItems: [ 
        {text: 'Description', value: 'description'},
        {text: 'Id', value: 'id'}
      ],
      filterSelectItems: [
        {text: 'All', value: 'all'},
        {text: 'Unread', value: 'unread'},
        {text: 'Approved', value: 'approved'},
        {text: 'Not approved', value: 'unapproved'}
      ],
      options: {
        approved: 0,
        unapproved: 0,
        unread: 0,
        search: '',
        searchBy: 'description',
        itemsPerPage: -1
      },
      headers: [
        { text: 'Id', value: 'id'},
        { text: 'Description', value: 'description'},
        { text: 'Files Amount', value: 'filesAmount', align: 'center', sortable: false},
        { text: 'Created', value: 'created_at', align: 'center',},
        { text: 'Updated', value: 'updated_at', align: 'center',},
        { text: 'Approved', value: 'approved', sortable: false},
        { text: 'Actions', value: 'actions', align: 'center', sortable: false}
      ],
      documents: []
    }
  },

  methods: {
    ...mapActions('base', {
      showConfirmationDialog: 'showConfirmationDialog',
      showMessage: 'showMessage'
    }),
    async getData() {
      this.loading = true

      const { data } = await DocumentsService.getData({project_id: this.id, ...this.options})
      this.documents = data.data.map(el => {el.wasExpanded = false; return el})
      this.totalDocuments = data.total
      this.updateExpanded()

      this.loading = false
    },

    getInfo(item) {
      this.selectedData = item
      this.infoDialog = true 
    },

    startEdit(item) {
      const { title, description } = item
      this.selectedData = item
      this.updatedData = [
        {key: 'description', value: description, label: 'Description', type: 'text'}
      ]
 
      this.updateDialog = true
    },
    createDocument() {
      this.createdData = [
        {key: 'description', value: '', label: 'Description', type: 'text'}
      ],
      this.createDialog = true
    },

    runProcess(action, data, updatedFields = {}) {
      this.selectedData = { ...data, ...updatedFields }
      this.action = action

      let title = ''
      this.dataType = 'Document'
      
      if('type' in this.selectedData) {
        title = data.name
        this.dataType = 'File'
      } else {
        title = data.description
      }

      this.showConfirmationDialog({action, data: title})
    },

    onItemExpanded({ item: { id, viewed, wasExpanded }, value }) {
      if(viewed || wasExpanded || !value) return
      DocumentsService.viewed(id)
    },

    setExpanded(item, expand, isExpanded) {
      expand(!isExpanded)
      item.wasExpanded = true
    },

    updateExpanded() {
      if(this.expanded[0]) {
        const expandedData = this.documents.find(el => el.id === this.expanded[0].id)
        this.expanded = [{...expandedData}]
      }
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

    createDocumentData() {
      return DocumentsService.create({project_id: this.id, ...this.selectedData})
    },

    approveDocument(id, val) {
      return DocumentsService.approve(id, val)
    },

    updateDocumentData() {
      return DocumentsService.update(this.selectedData)
    },

    removeDocumentData() {
      return DocumentsService.remove(this.selectedData.id)
    },

    removeFileData() {
      return FilesService.removeFile(this.selectedData.id)
    },

    async addComment() {
      if(!this.comment) return

      try {
        await DocumentsService.addComment({id: this.expanded[0].id, comment: this.comment})
        this.comment = ''
        this.commentsDialog = true
        this.showMessage({})
        this.getData()

      } catch({ message }) {
        this.showMessage({ message, error: true })
      }
      
    },

    setFilter(value) {
      this.options.unread = 0
      this.options.approved = 0
      this.options.unapproved = 0

      switch(value) {
        case 'unread':
          return this.options.unread = 1
        case 'approved':
          return this.options.approved = 1
        case 'unapproved':
          return this.options.unapproved = 1
      }
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
      confirmationAgree: 'confirmationAgree',
      admin: 'admin',
      teamlead: 'teamlead',
      manager: 'manager'
    }),
    id () {
      return this.$route.params.id
    }
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

<style lang="scss">

  .v-data-table.docs-table {

    .v-input--switch__track {
      &:not(.success--text) {
        background-color: #f44336;
      }
    }
  }

  .approved-indicator {
   width: 20px;
   height: 20px;
   margin-left: 17px;
   background: #f44336;
   border-radius: 50%;

    &.approved {
      background: #4caf50;
    }
  }

  tr.viewed {
    // background: rgb(68, 68, 68);
    background: #121212;
  }

</style>