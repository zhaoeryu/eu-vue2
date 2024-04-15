<script>
import { mapGetters } from 'vuex'
import SidebarItem from '@/layout/components/Sidebar/vertical/SidebarItem.vue'

export default {
  name: 'SidebarVertical',
  components: { SidebarItem },
  data() {
    return {}
  },
  computed: {
    ...mapGetters({
      routes: 'routes/routes',
      usualMenus: 'routes/usualMenus',
      theme: 'settings/theme',
      sidebarCollapsed: 'settings/sidebarCollapsed'
    }),
    menuList() {
      const menus = this.routes.filter(route => !route.hidden)
      if (this.theme.useUsualMenu && this.shortcutMenu.children.length) {
        return [this.shortcutMenu, ...menus]
      }
      return menus
    },
    shortcutMenu() {
      return {
        path: '/usual',
        meta: { title: '快捷', icon: 'pushpin', shortcut: true },
        children: this.usualMenus || []
      }
    },
    menuUniqueOpened() {
      return this.theme.uniqueOpened
    },
    activeMenu() {
      const route = this.$route
      const { path } = route
      return path
    },
  },
}
</script>

<template>
  <el-scrollbar wrap-class="eu-scrollbar-wrapper">
    <el-menu
      :default-active="activeMenu"
      :collapse="sidebarCollapsed"
      :unique-opened="menuUniqueOpened"
      :collapse-transition="false"
      mode="vertical"
      class="eu-menu"
    >
      <sidebar-item
        v-for="item in menuList"
        :key="item.path"
        :item="item"
      />
    </el-menu>
  </el-scrollbar>
</template>

<style scoped lang="scss">
.el-scrollbar {
  background-color: var(--theme-nav-first-bg);
  color: var(--theme-nav-first-color);
  width: 100%;
  height: calc(100vh - 50px);
  --eu-menu-level: 0;
  --eu-menu-base-level-padding: calc(1.3em + 8px);
}
::v-deep .el-menu {
  background-color: var(--theme-nav-first-bg);
}
::v-deep .eu-menu {
  height: 100%;
  padding: 12px 0;
  border-right-color: var(--color-border);

  // 折叠状态下
  &.el-menu--collapse {
    .el-submenu__title,.el-menu-item {
      >:not(.svg-icon) {
        display: none;
      }
      .svg-icon {
        margin-right: unset;
      }
    }

    .el-submenu__title,.el-menu-item {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .el-submenu {
      &.is-active>.el-submenu__title {
        background-color: var(--theme-nav-first-active-bg);
        color: var(--theme-nav-first-active-color);
      }
    }
  }

  // 菜单项
  .el-submenu .el-submenu__title,.el-menu-item {
    margin: 0 8px 4px;
    border-radius: 2px;
    height: 40px;
    line-height: 40px;
    padding: 0 8px !important;
    display: flex;
    align-items: center;
    transition: unset;
    color: var(--theme-nav-first-color);
    &:not(.is-active):hover {
      background-color: var(--theme-nav-first-active-bg);
      color: var(--theme-nav-first-active-color);
    }
  }

  .el-submenu__icon-arrow {
    font-size: 14px;
    color: inherit;
    right: 8px;
  }

  // 有子菜单
  .el-submenu {
    &.is-active>.el-submenu__title {
      color: var(--color-primary);
    }
    .el-menu-item,.el-submenu .el-submenu__title {
      min-width: unset;
      padding-left: calc(8px + var(--eu-menu-base-level-padding) * var(--eu-menu-level)) !important;
    }
  }

  // 无子菜单的选中
  .el-menu-item.is-active {
    background-color: var(--theme-nav-first-active-bg);
    color: var(--theme-nav-first-active-color);
  }
}

</style>
<style lang="scss">
.eu-scrollbar-wrapper {
  margin-right: unset !important;
  overflow-x: hidden !important;
  overflow-y: auto !important;

  &::-webkit-scrollbar {
    width: 0;
  }
}
</style>
