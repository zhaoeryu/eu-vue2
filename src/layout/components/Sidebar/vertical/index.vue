<script>
import { mapGetters } from 'vuex'
import SidebarItem from '@/layout/components/Sidebar/vertical/SidebarItem.vue'
import { getMaxMatchedMenu } from '@/utils/route-helpers'

export default {
  name: 'SidebarVertical',
  components: { SidebarItem },
  data() {
    return {
      activeMenu: null,
    }
  },
  computed: {
    ...mapGetters({
      routes: 'routes/routes',
      theme: 'settings/theme',
      sidebarCollapsed: 'settings/sidebarCollapsed'
    }),
    menuList() {
      return this.routes.filter(route => !route.hidden)
    },
    menuUniqueOpened() {
      return this.theme.uniqueOpened
    },
    activeRoute() {
      return this.$route
    },
  },
  mounted() {
    this.activeMenu = this.$route.path
    this.tryHighlightMenu()
  },
  watch: {
    $route: {
      handler(){
        this.activeMenu = this.$route.path
        this.tryHighlightMenu()
      },
      // 深度观察监听
      deep: true
    },
  },
  methods: {
    tryHighlightMenu() {
      this.$nextTick(() => {
        const isNotAcitve = this.$refs.menu.activeIndex === null
        if (isNotAcitve) {
          // 首页特殊处理
          const foundHomeMenu = this.menuList.find(item => item.path === '/' && item.redirect === this.$route.path)
          if (foundHomeMenu) {
            this.activeMenu = foundHomeMenu.path
            return
          }

          if (this.$route.meta.hidden === true) {
            // 支持模糊匹配
            const matched = getMaxMatchedMenu(this.activeMenu, this.menuList)
            if (matched) {
              this.activeMenu = matched
            }
          }
        }
      })
    },
  }
}
</script>

<template>
  <el-scrollbar wrap-class="eu-scrollbar-wrapper">
    <el-menu
      ref="menu"
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
  flex: 1;
  background-color: var(--theme-nav-first-bg);
  color: var(--theme-nav-first-color);
  width: 100%;
  height: calc(100vh - var(--layout-header-nav-height));
  --eu-menu-level: 0;
  --eu-menu-base-level-padding: calc(1.3em + 8px);
}
::v-deep .el-menu {
  background-color: var(--theme-nav-first-bg);
  border-right: unset !important;
}
::v-deep .eu-menu {
  height: 100%;
  padding: 12px 0;
  border-right-color: var(--color-border);
  user-select: none;

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
    border-radius: 6px;
    height: 40px;
    line-height: 40px;
    padding: 0 8px !important;
    display: flex;
    align-items: center;
    transition: unset;
    color: var(--theme-nav-first-color);
    //&:not(.is-active):hover {
    //  background-color: var(--theme-nav-first-active-bg);
    //  color: var(--theme-nav-first-active-color);
    //}
  }

  .el-menu-item:focus, .el-menu-item:hover, .el-submenu__title:hover {
    background-color: var(--theme-nav-first-hover-bg);
    color: var(--theme-nav-first-hover-color);
    font-weight: 500;
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
::v-deep {
  .eu-scrollbar-wrapper {
    margin-right: unset !important;
    overflow-x: hidden !important;

    &::-webkit-scrollbar {
      width: 0;
    }
  }
}
</style>