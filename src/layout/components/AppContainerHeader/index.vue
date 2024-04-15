<template>
  <header id="app-container__header">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item v-for="(item, index) in activeMenus" :key="index">{{ item.meta.title }}</el-breadcrumb-item>
    </el-breadcrumb>
  </header>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'AppContainerHeader',
  computed: {
    ...mapGetters({
      routes: 'routes/routes'
    }),
    activeMenus() {
      const activeMenus = this.$route.matched.filter(item => !['', '/'].includes(item.path))
      if (activeMenus.length === 2) {
        // 如果是两级菜单，且first.redirect === first.path === second.path
        // 这种情况是一级菜单的类型为菜单，创建router的时候包装了一层Layout，故这里只需要显示一级菜单即可
        const [first, second] = activeMenus
        if (first.redirect === first.path && first.redirect === second.path) {
          return [first]
        }
      }
      return activeMenus
    }
  }
}
</script>

<style lang='scss' scoped>
#app-container__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 21px 21px 16px;
}
</style>
