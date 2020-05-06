<template lang="pug">
  v-dialog(ref='dialog' v-model='dialog' @click:outside='$emit("input", false)' max-width='600px')
  
    v-card
      v-card-title
        span.headline Comments
      v-divider.mx-4
      v-card-text

        v-card.mt-4(v-for='comment in comments' :key='comment.cratedAt' elevation='24')
          .grey--text.ml-4.pt-4 {{comment.createdAt}}
          v-card-title
            .subtitle-2
              //- span.mr-4 {{comment.user_name}}
              //- span.grey--text {{comment.user_email}}
          v-card-text
            div {{comment.comment}}


      v-card-actions
        v-spacer
        v-btn(color='blue darken-1' text @click='$emit("input", false)') Close
</template>

<script>

export default {
  props: {
    value: { type: Boolean },
    comments: {
      type: Array,
      default: () => ([Object])
    }
  },
  data: () => ({
    dialog: false
  }),

  methods: {
    scrollToLastComment() {
      const vm = this

      // vm.$nextTick(() => {
      //   const container = vm.$refs.dialog.$refs.dialog
      //   const height = container.scrollHeight

      //   container.scrollTop = height
      // })
    }
  },

  watch: {
    comments() {
      this.scrollToLastComment()
    },
    value(v) {
      const vm = this

      if(!v) return vm.dialog = false
      vm.dialog = true
      vm.scrollToLastComment()
    }
  }
}
</script>
