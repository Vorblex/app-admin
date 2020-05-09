<template lang="pug">
  v-layout(align-center justify-center)
    v-flex(xs12 sm8 md4)
      v-card.elevation-12
        v-form(@submit.prevent="signIn")
          v-toolbar(dark flat)
            v-toolbar-title Login form
          v-card-text
              v-text-field(v-model.trim="user.email" label='Email' prepend-icon='person' type='text')
              v-text-field(v-model.trim="user.password" label='Password' prepend-icon='lock' type='password')
          v-card-actions
            v-spacer
            v-btn(type='submit' color='primary') Login
      //- v-alert(type='error') {{answer}}

</template>

<script>
import authService from '~/services/AuthService'
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      answer: '',
      user: {
        email: 'majestyc777@gmail.com',
        password: ''
      }
    }
  },
  methods: {
    ...mapActions('base',{
      setUser: 'setUser'
    }),
    async signIn () {
      if (this.user.email !== '' && this.user.password !== '') {
        try {
          await authService.signIn({
            email: this.user.email,
            password: this.user.password
          })
          this.$router.push({ name: 'Projects' })
        } catch(err) {
          console.log(err.message);
          this.answer = err.message;
        }
      } else {
        alert('Empty fields!')
      }
    },
    goBack () {
      this.$router.push({ name: 'Posts' })
    }
  }
}
</script>
