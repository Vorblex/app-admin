<template lang="pug">
  v-navigation-drawer(:value="drawer"
                      @input="localDrawer = !localDrawer"
                      app
                      clipped
                      src="")
    v-list(nav)
      v-list-item(v-for="route in routes"
                  :to="{name: route.name}"
                  :key="route.path"
                  color="primary")
        v-list-item-action
          v-icon {{route.icon}}
        v-list-item-content
          v-list-item-title {{route.name}}

</template>

<script>

export default {
  props: ['drawer', 'routes'],
  data() {
    return {
      localDrawer: null
    }
  },
  watch: {
    localDrawer(v) {
      const vm = this

      if(v === vm.drawer) return

      vm.$emit('input')
    }
  },
  created() {
  }
}
</script>

<style scoped lang="scss">

  .v-list-item {
    text-decoration: none;
  }

</style>
