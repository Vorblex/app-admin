<template lang="pug">
  v-snackbar.text-center.text-uppercase(v-model='snackbar'
                                        :timeout='timeout'
                                        :color='snackbarColor')
    span.mx-auto {{message}}
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      snackbar: false
    }
  },
  computed: {
    ...mapGetters('base', {
      isError: 'isError',
      message: 'message',
      timeout: 'snackbarTimeout'
    }),

    snackbarColor() {
      return this.isError ? 'error' : 'success'
    }
  },
  
  watch: {
    message(v) {
      v && ( this.snackbar = true )
    }
  }
}
</script>