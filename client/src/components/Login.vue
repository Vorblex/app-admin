<template lang="pug">
  .container
    .row.justify-content-center
      .col-8
        h1
          | Sign in
        span {{answer}}
        form(@submit.prevent="signIn")
          .form-group
            input.form-control( type="text" placeholder="Email" v-model.trim="user.email" )
          .form-group
            input.form-control( type="password" placeholder="Password" v-model.trim="user.password" )
          .form-group
            button.btn.btn-block.btn-primary(type="submit")
              | Sign in
          section
            button.btn.btn-success.btn-block( type="button" @click="goBack" )
              | go to posts page
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
