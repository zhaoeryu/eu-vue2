<script>
import { mapGetters } from 'vuex'
import SecondSidebar from '@/layout/components/Sidebar/column/SecondSidebar.vue'
import FirstSidebarItem from '@/layout/components/Sidebar/column/FirstSidebarItem.vue'
export default {
  name: 'SidebarColumn',
  components: { SecondSidebar, FirstSidebarItem },
  data() {
    return {
      // 为了解决鼠标移入pop层的二级菜单，一级菜单不高亮的问题
      firstMenuHover: []
    }
  },
  computed: {
    ...mapGetters({
      routes: 'routes/sidebarRoutes',
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
    activeFirstMenu() {
      return this.$route.matched.find(item => item.parent === undefined)
    },
    activeFirstMenuPath() {
      const route = this.activeFirstMenu
      return route.path === '' ? '/' : route.path
    },
    secondNavList() {
      return (this.routes.find(item => item.path === this.activeFirstMenuPath)?.children || []).filter(item => !item.hidden)
    },
    isSecondNavHidden() {
      const isNotMultiChildren = this.secondNavList.length < 2
      const route = this.$route.matched.find(item => item.parent === undefined)
      const isAlwaysShow = route?.meta?.alwaysShow
      return isNotMultiChildren && !isAlwaysShow
    }
  },
  methods: {
    disabledFirstNav(item) {
      if (!Array.isArray(item.children) || item.children.length < 2) {
        // 如果没有二级菜单，或者二级菜单只有一个，则禁用
        return true
      }
      if (this.sidebarCollapsed) {
        // 收缩状态下，不需要禁用
        return false
      }
      // 只有当前router被选中时才禁用
      return item.path === this.activeFirstMenuPath
    },
    onNavPopperShow(index) {
      // pop层显示时，检查内容是否需要滚动，如果需要滚动，则显示滚动指示器
      this.$nextTick(() => {
        this.$refs.popSecondSidebar[index].onSelfNavScroll()
      })
    },
    onItemClick(index, item) {
      if (item.children && item.children.length) {
        // 如果有子菜单，不处理
        return
      }
      this.$refs.firstNavPopover[index].doClose()
    }
  }
}
</script>

<template>
  <div class="eu-nav__column">
    <!-- 一级菜单 -->
    <nav class="eu-nav-sidebar__first">
      <ul class="eu-nav-sidebar__first-list">
        <el-popover
          v-for="(item, index) in menuList"
          :key="index"
          ref="firstNavPopover"
          placement="right-start"
          width="140"
          :open-delay="100"
          :close-delay="100"
          :disabled="disabledFirstNav(item)"
          popper-class="eu-nav-pop-wrapper"
          trigger="hover"
          @show="onNavPopperShow(index)"
          :append-to-body="false"
          @mouseenter.native="firstMenuHover[index] = true"
          @mouseleave.native="firstMenuHover[index] = false"
        >
          <!-- 一级菜单Item -->
          <template #reference>
            <first-sidebar-item
              :item="item"
              :class="{ hover: firstMenuHover[index] }"
            />
          </template>
          <!-- 二级菜单弹出层 -->
          <div class="eu-nav-pop-inner">
            <second-sidebar
              ref="popSecondSidebar"
              :second-nav-list="item.children.filter(m => !m.hidden)"
              :root-path="item.path"
              class="eu-nav-pop-scroll-wrapper"
              @item-click="onItemClick(index, $event)"
            />
          </div>
        </el-popover>
      </ul>
    </nav>
    <!-- 二级菜单 -->
    <second-sidebar :second-nav-list="secondNavList" class="eu-nav-sidebar__second" />
  </div>
</template>

<style scoped lang="scss">
.eu-nav__column {
  display: inherit;
  width: inherit;
}

// 一级菜单
.eu-nav-sidebar__first {
  width: var(--sidebar-first-width, 124px);
  background-color: var(--theme-nav-first-bg);
  height: 100%;
  display: flex;
  flex-direction: column;
  .eu-nav-sidebar__first-list {
    flex: 1;
    font-size: 14px;
    overflow-y: auto;
    padding: 12px 0;
    &::-webkit-scrollbar {
      width: 0;
    }
  }
}
// 二级菜单
.eu-nav-sidebar__second {
  width: var(--sidebar-second-width, 140px);
  background-color: var(--theme-nav-second-bg);
  padding: 16px 0 20px;
  display: flex;
  flex-direction: column;
  position: relative;
  height: calc(100% - 51px);
  transition: width .15s linear;
  border-left: 1px solid var(--color-border);
}

// 二级菜单pop层
.eu-nav-pop-inner {
  background-color: var(--theme-nav-second-bg);
  font-size: 14px;
  font-weight: 400;
  border-radius: 2px;
  padding: 12px 0;
}
.eu-nav-pop-scroll-wrapper {
  ::v-deep {
    .eu-nav-scroll {
      max-height: 650px;
    }
  }
}
</style>

<style lang="scss">
// 二级菜单pop层样式
.eu-nav-pop-wrapper {
  font-size: 14px;
  line-height: 20px;
  padding: 0 !important;
}
</style>
