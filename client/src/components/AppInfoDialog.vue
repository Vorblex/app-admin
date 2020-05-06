<template lang="pug">
  v-dialog(v-model='dialog' @click:outside='$emit("input", false)' max-width='600px')
    v-card
      v-card-title
        span.headline Info
      v-card-text
        v-container
          v-row
            v-col(col)
              v-list(dense)
                template(v-for='(val, key) in data')
                  v-list-item(v-if='isVisibleData(key)' :key='key')
                    v-list-item-subtitle.text-uppercase(v-text='key')
                    v-list-item-title(v-text='formatValue(val)')
      v-card-actions
        app-copy-action(:data='data' :titleProp='titleProp')
        v-spacer
        v-btn(color='blue darken-1' text @click='$emit("input", false)') Close  
</template>

<script>

const hiddenData = [
  'files',
  'wasExpanded',
  'comments',
  'comment',
  'views_id'
  ]

export default {
  props: [ 'data', 'titleProp', 'value'],
  components: {
    AppCopyAction: () => import('@/AppCopyAction')
  },
  data: () => ({
    dialog: false
  }),

  methods: {
    isVisibleData(key) {
      return !hiddenData.some(el => el === key)
    },
    formatValue(val) {
      if(Array.isArray(val)) {
        val = val.join(', ')
      }

      return val
    }
  },

  watch: {
    value(v) {
      if(!v) return this.dialog = false
      this.dialog = true
    }
  }

}
</script>
