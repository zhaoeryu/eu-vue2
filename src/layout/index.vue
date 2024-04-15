<template>
  <div id="eu-layout" :class="{
    mobile: isMobileDevice,
    'sidebar-collapsed': sidebarCollapsed,
    'eu-nav-second-sidebar-hidden': isSecondNavHidden,
    'eu-tabs-fixed': theme.showTabsBar && theme.fixedTabsBar,
    ['eu-layout_'+theme.layout]: true
  }">
    <!-- Header Nav -->
    <header-nav-bar @themeconfig="themeConfigShow=true" />
    <!-- container -->
    <div id="app-container">
      <!-- aside -->
      <sidebar />
      <!-- main -->
      <main id="app-container__main">
        <app-container-tabs v-if="theme.showTabsBar" />
        <!-- 头部 -->
        <app-container-header v-if="curRouteMeta.showHeader" />
        <!-- 内容区域 -->
        <app-container-body />
        <!-- 底部 -->
        <app-container-footer v-if="curRouteMeta.showFooter" />
      </main>
    </div>

    <!-- 主题配置 -->
    <theme-config :show.sync="themeConfigShow" />
    <!-- 回到顶部 -->
    <el-backtop ref="elBackTop" :target="backTopSelector"></el-backtop>
  </div>
</template>

<script>
import Sidebar from '@/layout/components/Sidebar/index.vue'
import ThemeConfig from '@/layout/components/ThemeConfig/index.vue'
import AppContainerBody from '@/layout/components/AppContainerBody/index.vue'
import AppContainerFooter from '@/layout/components/AppContainerFooter/index.vue'
import HeaderNavBar from '@/layout/components/HeaderNavBar/index.vue'
import AppContainerHeader from '@/layout/components/AppContainerHeader/index.vue'
import ResizeHandler from '@/layout/mixins/ResizeHandler'
import { mapGetters } from 'vuex'
import AppContainerTabs from '@/layout/components/AppContainerTabs/index.vue'

export default {
  name: 'Layout',
  mixins: [ResizeHandler],
  components: { AppContainerTabs, AppContainerHeader, HeaderNavBar, AppContainerFooter, AppContainerBody, ThemeConfig, Sidebar },
  data() {
    return {
      themeConfigShow: false
    }
  },
  computed: {
    ...mapGetters({
      routes: 'routes/routes',
      isMobileDevice: 'settings/isMobileDevice',
      theme: 'settings/theme',
      sidebarCollapsed: 'settings/sidebarCollapsed'
    }),
    backTopSelector() {
      return '#app-container__main'
    },
    curRouteMeta() {
      const route = this.$route
      return route.meta || {}
    },
    isSecondNavHidden() {
      const activeFirstMenu = this.$route.matched.find(item => item.parent === undefined)
      const activeFirstMenuPath = activeFirstMenu.path === '' ? '/' : activeFirstMenu.path
      const secondNavList = (this.routes.find(item => item.path === activeFirstMenuPath)?.children || []).filter(item => !item.hidden)
      const isNotMultiChildren = secondNavList.length < 2
      const route = this.$route.matched.find(item => item.parent === undefined)
      const isAlwaysShow = route?.meta?.alwaysShow
      return isNotMultiChildren && !isAlwaysShow
    }
  }
}
</script>

<style lang='scss' scoped>
#eu-layout {
  position: relative;
}
#app-container {
  box-sizing: border-box;
  padding-top: 50px;
}
#app-container__main {
  margin-left: var(--sidebar-width);
  box-sizing: border-box;
  height: calc(100vh - 50px);
  width: calc(100vw - var(--sidebar-width));
  overflow: auto;

  display: flex;
  flex-direction: column;
}
.sidebar-collapsed {
  // 折叠情况下菜单栏的宽度
  --sidebar-width: var(--sidebar-collapse-width) !important;
}

#eu-layout {
  // 分栏布局
  &.eu-layout_column {
    // 不折叠并且二级菜单隐藏情况下的菜单栏宽度
    &:not(.sidebar-collapsed).eu-nav-second-sidebar-hidden {
      --sidebar-width: var(--sidebar-first-width);
    }
  }
  // 侧边布局
  &.eu-layout_vertical {
    --sidebar-width: var(--sidebar-vertical-width);
  }
}

// 固定TabsBar
.eu-tabs-fixed {
  #app-container__tabs {
    width: calc(100vw - var(--sidebar-width));
    position: fixed;
    top: 50px;
    z-index: 10;
  }
  #app-container__main {
    height: calc(100vh - 50px - 38px);
    margin-top: 38px;
  }
}
</style>
