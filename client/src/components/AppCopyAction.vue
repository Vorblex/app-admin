<template lang="pug">
  v-tooltip(top)
    template(#activator='{on}')
      div(v-on='on')
        v-btn(icon @click='copyToClipboard(data)' @mouseenter='copiedToClipboard = false')
          v-icon(color="primary") save_alt
    span {{tooltipText}}
</template>

<script>
export default {
  props: ['data', 'titleProp'],
  data: () => ({
    copiedToClipboard: false,
    copiedTitle: ''
  }),

  methods: {
    copyToClipboard(data) {
      const vm = this,
            el = document.createElement('textarea'),
            dialog = document.getElementsByClassName('v-dialog--active')[0]

      let resultString = '',
          container = null

      Object.keys(data).forEach(el => {
          resultString += el.toUpperCase() + ' - ' + data[el] + '\n'
      })

      el.value = resultString
      el.setAttribute('readonly', '')
      el.style.position = 'absolute'
      el.style.left = '-9999px'

      if(dialog) {
        dialog.appendChild(el)
        container = dialog
      } else {
        container = document.body
        container.appendChild(el)
      }

      el.select()
      document.execCommand('copy')
      container.removeChild(el)
      vm.copiedTitle = data[vm.titleProp]
      vm.copiedToClipboard = true
    }
  },

  computed: {
    tooltipText() {
      return this.copiedToClipboard ? `Copied ${this.copiedTitle} data` : 'Copy to clipboard'
    }
  }
}
</script>

<style>

</style>