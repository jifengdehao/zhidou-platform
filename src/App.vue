<template>
  <div id="app">
    <keep-alive>
      <router-view name="blank"/>
    </keep-alive>
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>
<style scoped lang="stylus">
  #app
    position absolute
    left 0
    right 0
    top 0
    bottom 0
    overflow hidden
    min-width 1200px
</style>
