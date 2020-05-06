<template lang="pug">
  v-dialog(v-model='dialog' @click:outside='$emit("input", false)' max-width='600px')
    form(@submit.prevent='submit')
      v-card
        v-card-title
          span.headline {{title}}

        v-card-text
          v-container
            v-row
              v-col(v-for='(item, i) in items' cols='12' sm='6' :key='i')
                v-text-field( :error-messages='getErrorMessage(item.key)'
                              @input='$v.validated[item.key].$touch()'
                              @blur='$v.validated[item.key].$touch()'
                              v-model='validated[item.key]'
                              v-if='item.type === `text` || item.type === `password`'
                              :label='item.label')

                v-select(v-if='item.type === `select`' v-model='validated[item.key]'
                         :error-messages='getErrorMessage(item.key)'
                         @input='$v.validated[item.key].$touch()'
                         @blur='$v.validated[item.key].$touch()'
                         :items='item.options'
                         :label='item.label')

                v-combobox(v-if='item.type === `combobox`' v-model='validated[item.key]'
                         :error-messages='getErrorMessage(item.key)'
                         @input='$v.validated[item.key].$touch()'
                         @blur='$v.validated[item.key].$touch()'
                         :items='item.options'
                         :label='item.label'
                         :multiple='item.multiple')

        v-card-actions
          v-spacer
          v-btn(color='blue darken-1' text @click='$emit(`input`, false)') Close
          v-btn(color='red darken-1' text type='submit') Save
</template>

<script>
import { validations, validationErrors } from '~/validation'
import { required, minLength, email } from 'vuelidate/lib/validators'
export default {

  validations() {
    const validators = {validated:{}}
    
    this.items.forEach(el => {
      validators.validated[el.key] = validations[el.key]
    })

    return validators
  },
  props: {
    title: String,
    items: {
      type: Array,
      default: () => ([Object])
    },
    value: {
      type: Boolean
    }
  },
  data: () => ({
    dialog: false,
    validated: {}
  }),

  methods: {
    submit() {
      this.$v.$touch()
      !this.$v.$invalid && this.save()
    },

    save() {
      this.$emit('save', this.validated)
      this.$emit('input', false)
    },

    resetFormData() {
      this.$v.$reset()
    },

    getErrorMessage(item) {
      return this[item+"Errors"]
    }
  },

  computed: {
    ...validationErrors
  },

  watch: {
    items(v) {
      if(!v) return
      const vm = this
      vm.items.forEach(({ key, value }) => {
        vm.$set(vm.validated, key, value)
      })
    },

    value(v) {
      if(!v) return this.dialog = false
      this.dialog = true
    },

    dialog(v) {
      !v && this.resetFormData()
    }
  }
}
</script>