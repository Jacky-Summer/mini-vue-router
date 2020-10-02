<template>
  <div id="app">
    <router-link to="/">Page</router-link> |
    <router-link to="/page1">Page1</router-link> |
    <router-link to="/page2">Page2</router-link>

    <router-view />
  </div>
</template>


<script>
export default {
  name: 'App',
  created() {
    console.log('App组件', this.$router)
  },
}
</script>

<style></style>
