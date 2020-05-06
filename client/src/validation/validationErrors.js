export default {
  emailErrors () {
    const errors = []
    if (!this.$v.validated.email.$dirty) return errors
    !this.$v.validated.email.email && errors.push('Must be valid e-mail')
    !this.$v.validated.email.required && errors.push('E-mail is required')
    return errors
  },
  firstNameErrors () {
    const errors = []
    if (!this.$v.validated.firstName.$dirty) return errors
    !this.$v.validated.firstName.minLength && errors.push('At least 2 characters')
    !this.$v.validated.firstName.required && errors.push('First name is required')
    return errors
  },
  lastNameErrors () {
    const errors = []
    if (!this.$v.validated.lastName.$dirty) return errors
    !this.$v.validated.lastName.minLength && errors.push('At least 2 characters')
    !this.$v.validated.lastName.required && errors.push('Last name is required')
    return errors
  },
  titleErrors () {
    const errors = []
    if (!this.$v.validated.title.$dirty) return errors
    !this.$v.validated.title.minLength && errors.push('At least 2 characters')
    !this.$v.validated.title.required && errors.push('Title is required')
    return errors
  },
  descriptionErrors () {
    const errors = []
    if (!this.$v.validated.description.$dirty) return errors
    !this.$v.validated.description.minLength && errors.push('At least 2 characters')
    !this.$v.validated.description.required && errors.push('Description is required')
    return errors
  },
  nameErrors () {
    const errors = []
    if (!this.$v.validated.name.$dirty) return errors
    !this.$v.validated.name.minLength && errors.push('At least 2 characters')
    !this.$v.validated.name.required && errors.push('Name is required')
    return errors
  },
  linkErrors () {
    const errors = []
    if (!this.$v.validated.link.$dirty) return errors
    !this.$v.validated.link.minLength && errors.push('At least 4 characters')
    !this.$v.validated.link.required && errors.push('Link is required')
    return errors
  },
  accountErrors () {
    const errors = []
    if (!this.$v.validated.account.$dirty) return errors
    !this.$v.validated.account.required && errors.push('Account type is required')
    return errors
  },
  rolesErrors () {
    const errors = []
    // if (!this.$v.validated.roles.$dirty) return errors
    // !this.$v.validated.roles.required && errors.push('Role is required')
    return errors
  },
  projectsErrors () {
    const errors = []
    return errors
  }
}