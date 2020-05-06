import { required, minLength, email } from 'vuelidate/lib/validators'

export default {
  firstName: { required, minLength: minLength(2) },
  title: { required, minLength: minLength(2) },
  name: { required, minLength: minLength(2) },
  link: { required, minLength: minLength(4) },
  description: { required, minLength: minLength(2) },
  lastName: { required, minLength: minLength(2) },
  select: { required },
  email: { required, email },
  account: { required },
  roles: {},
  projects: {}
}