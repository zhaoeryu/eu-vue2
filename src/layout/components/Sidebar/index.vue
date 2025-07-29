<template>
  <aside id="eu-nav-sidebar">

    <sidebar-vertical v-if="theme.layout === 'vertical'" />
    <sidebar-column v-else />

    <!-- 收缩 -->
    <menu-collapse-button />
  </aside>
</template>

<script>
import { mapGetters } from 'vuex'
import MenuCollapseButton from '@/layout/components/Sidebar/MenuCollapseButton.vue'
import SidebarColumn from '@/layout/components/Sidebar/column/index.vue'
import SidebarVertical from '@/layout/components/Sidebar/vertical/index.vue'
export default {
  name: 'Sidebar',
  components: { SidebarVertical, SidebarColumn, MenuCollapseButton },
  data() {
    return {}
  },
  computed: {
    ...mapGetters({
      theme: 'settings/theme'
    })
  }
}
</script>

<style lang='scss' scoped>
#eu-nav-sidebar {
  width: var(--sidebar-width, 264px);
  height: calc(100vh - var(--layout-header-nav-height));
  position: fixed;
  top: var(--layout-header-nav-height);
  left: 0;
  display: flex;
  z-index: 100;
  transition: width .15s linear;
  flex-direction: column;

  &:before {
    content: '';
    position: absolute;
    right: -1px;
    width: 1px;
    height: 100%;
    background-color: var(--color-border);
  }
}
</style>
