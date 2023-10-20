<template>
  <div id="app-container__tabs">
    <el-tabs
      v-model="tabActive"
      type="card"
      class="tabs-content eu-tabs-content-smart"
      @tab-click="onTabClick"
      @tab-remove="onTabRemove"
    >
      <el-tab-pane
        v-for="item in visitedViews"
        :key="item.path"
        :label="item.meta.title"
        :name="item.path"
        :closable="!isAffix(item)"
      ></el-tab-pane>
    </el-tabs>

    <el-dropdown @command="onDropdown" a="123">
      <span class="eu-tabs-more" @mouseenter="moreIconMouseenter = true" @mouseleave="moreIconMouseenter = false">
        <span class="eu-tabs-more-icon" :class="{ 'eu-tabs-more-icon__mouse-enter': moreIconMouseenter }">
          <i class="el-icon-menu"></i>
        </span>
      </span>
      <el-dropdown-menu slot="dropdown" class="tabs-more" a="456">
        <el-dropdown-item command="refresh">
          <i class="el-icon-refresh"></i>
          刷新
        </el-dropdown-item>
        <el-dropdown-item command="closeOther">
          <i class="el-icon-close"></i>
          关闭其他
        </el-dropdown-item>
        <el-dropdown-item command="closeLeft">
          <i class="el-icon-back"></i>
          关闭左侧
        </el-dropdown-item>
        <el-dropdown-item command="closeRight">
          <i class="el-icon-right"></i>
          关闭右侧
        </el-dropdown-item>
        <el-dropdown-item command="closeAll">
          <i class="el-icon-close"></i>
          关闭全部
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import path from 'path'
export default {
  name: 'AppContainerTabs',
  data() {
    return {
      tabActive: '',
      moreIconMouseenter: false,
    }
  },
  computed: {
    ...mapGetters({
      visitedViews: 'tabsView/visitedViews',
      routes: 'routes/sidebarRoutes'
    })
  },
  watch: {
    $route: {
      handler(route) {
        this.initAffixTabs()
        this.$store.dispatch('tabsView/addVisitedView', route)
        this.tabActive = this.visitedViews.find(item => item.path === this.$route.path)?.path || ''
      },
      immediate: true,
    },
  },
  methods: {
    isActive(route) {
      return route.path === this.$route.path
    },
    isAffix(tab) {
      return tab.meta && tab.meta.affix
    },
    initAffixTabs() {
      const affixTabs = this.filterAffixTabs(this.routes)
      for (const tab of affixTabs) {
        if (tab.path) {
          this.$store.dispatch('tabsView/addVisitedView', tab)
        }
      }
    },
    filterAffixTabs(routes) {
      let tabs = []
      routes.forEach(route => {
        if (route.meta && route.meta.affix && route.meta.isChildMeta !== true) {
          tabs.push(route)
        }
        if (route.children) {
          const tempTabs = this.filterAffixTabs(route.children)
          if (tempTabs.length >= 1) {
            tabs = [...tabs, ...tempTabs]
          }
        }
      })
      return tabs
    },
    onTabClick(tab) {
      this.$router.push(tab.name)
    },
    onTabRemove(tab) {
      const view = this.visitedViews.find(item => item.path === tab)
      this.$store.dispatch('tabsView/delVisitedView', view).then(visitedViews => {
        if (this.isActive(view)) {
          const latestView = visitedViews.slice(-1)[0]
          if (latestView) {
            this.$router.push(latestView.path)
          } else {
            this.$router.push('/')
          }
        }
      })
    },
    onDropdown(command) {
      switch (command) {
        case 'refresh':
          this.onPageRefresh()
          break;
        case 'closeOther':
          this.closeOtherTabs()
          break;
        case 'closeLeft':
          this.closeLeftTabs()
          break;
        case 'closeRight':
          this.closeRightTabs()
          break;
        case 'closeAll':
          this.closeAllTabs()
          break;
      }
      this.moreIconMouseenter = false
    },
    onPageRefresh() {
      window.location.reload()
    },
    closeOtherTabs() {
      const view = this.visitedViews.find(item => item.path === this.$route.path)
      this.$store.dispatch('tabsView/delOthersVisitedViews', view).then(() => {
        // do something
      })
    },
    closeLeftTabs() {
      const view = this.visitedViews.find(item => item.path === this.$route.path)
      this.$store.dispatch('tabsView/delLeftVisitedViews', view).then(() => {
        // do something
      })
    },
    closeRightTabs() {
      const view = this.visitedViews.find(item => item.path === this.$route.path)
      this.$store.dispatch('tabsView/delRightVisitedViews', view).then(() => {
        // do something
      })
    },
    closeAllTabs() {
      this.$store.dispatch('tabsView/delAllVisitedViews').then(visitedViews => {
        const latestView = visitedViews.slice(-1)[0]
        if (latestView) {
          this.$router.push(latestView.path)
        } else {
          this.$router.push('/')
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
#app-container__tabs {
  max-height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--theme-base-second-bg);
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  margin-left: 1px;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 4px;
  .tabs-content {
    width: calc(100% - 20px - 20px);
  }
  .eu-tabs-more {
    box-sizing: border-box;
    display: block;
    text-align: left;
    position: relative;
    .eu-tabs-more-icon {
      display: inline-block;
      cursor: pointer;
      transition: transform .3s ease-out;
      font-size: 20px;
    }
    .eu-tabs-more-icon__mouse-enter {
      transform: rotate(90deg);
      color: var(--color-primary);
    }
    //&:hover:after {
    //  position: absolute;
    //  bottom: 0;
    //  left: 0;
    //  height: 0;
    //  content: "";
    //}
  }
  .eu-tabs-content-smart {
    height: 34px;
    ::v-deep {
      .el-tabs__nav-next,.el-tabs__nav-prev {
        line-height: 34px;
        &.is-disabled {
          cursor: not-allowed;
        }
      }
      .el-tabs__header {
        border-bottom: 0;
        .el-tabs__nav {
          border: 0;
          .el-tabs__item {
            border: 0;
            line-height: 34px;
            height: 34px;
            position: relative;
            transition: padding .3s cubic-bezier(.645,.045,.355,1)!important;
            margin-right: 5px;
            border-radius: 2px 2px 0 0;
            user-select: none;
            &:after {
              content: '';
              position: absolute;
              bottom: 0;
              left: 0;
              height: 2px;
              width: 0;
              transition: all .3s cubic-bezier(.645,.045,.355,1),border 0s,color .1s,font-size 0s;
              background-color: var(--color-primary) !important;
            }
            &.is-active {
              background: rgba(21,91,212,.08) !important;
              color: var(--color-primary) !important;
              &:after {
                width: 100%;
              }
            }
            &:not(.is-active):hover {
              background-color: rgba(21,91,212,.08);
              color: var(--color-primary) !important;
              &:after {
                width: 100%;
                transition: all .3s cubic-bezier(.645,.045,.355,1),border 0s,color .1s,font-size 0s;
              }
            }
          }
        }
      }
    }
  }
}

.eu-fixed-tabs {
  #app-container__tabs {
    position: fixed;
    top: 0;
    left: var(--sidebar-width, 264px);
    right: 0;
    z-index: 3;
    transition: left .15s linear;
  }
}
</style>
