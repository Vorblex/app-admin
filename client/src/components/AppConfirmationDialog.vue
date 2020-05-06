<template lang="pug">
  v-dialog(v-model='dialog' persistent max-width='700px')
    v-card
      v-card-title
        span.headline.red--text {{confirmationText}}
      v-card-actions
        v-spacer
        v-btn(color='red darken-1' text @click='agree(true)') Yes
        v-btn(color='blue darken-1' text @click='agree(false)') No
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data:() => ({
    dialog: false
  }),

  methods: {
    ...mapActions('base', {
      agree: 'setConfirmationAgree'
    })
  },

  computed: {
    ...mapGetters('base', {
      confirmationDialog: 'confirmationDialog',
      confirmationText: 'confirmationText'
    })
  },

  watch: {
    confirmationDialog(v) {
      this.dialog = v
    }
  }
  
}
</script>