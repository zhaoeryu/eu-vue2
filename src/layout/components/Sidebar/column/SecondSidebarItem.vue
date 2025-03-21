<script>
import AppLink from '@/layout/components/Sidebar/Link.vue'
import { isExternal } from '@/utils'

export default {
  name: 'SecondSidebarItem',
  components: { AppLink },
  props: {
    rootPath: {
      type: String,
      required: false
    },
    item: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isOpened: true
    }
  },
  computed: {
    fullRootPath() {
      // 如果没有传上级菜单的路径，则返回当前激活的一级菜单
      const prefix = this.rootPath ? this.rootPath : this.activeFirstMenu
      // 检查rootPath是否以/结尾，如果不是则加上/
      return prefix.replace(/\/$/, '') + '/'
    },
    isActive() {
      // 1、最后一层菜单，直接比较路径
      // 2、非最后一层菜单，判断当前路径是否以该菜单的路径开头
      return this.resolvedPath === this.activeMenu || this.activeMenu.startsWith(this.resolvedPath)
    },
    /**
     * 当前Item处理后的路径（如果item.path以/开头，则去掉/）
     * @returns {string}
     */
    curItemPath() {
      return this.item.path.replace(/^\//, '')
    },
    /**
     * 当前激活的菜单
     * @returns {string}
     */
    activeMenu() {
      const route = this.$route
      return route.path
    },
    /**
     * 当前激活的一级菜单
     * @returns {string}
     */
    activeFirstMenu() {
      const route = this.$route.matched.find(item => item.parent === undefined)
      return route.path
    },
    /**
     * 解析后的路径
     * @returns {*|string}
     */
    resolvedPath() {
      if (this.item.fullPath) {
        // 如果设置了自定义的路径，则直接返回
        return this.item.fullPath
      }
      return isExternal(this.curItemPath) ? this.curItemPath : this.fullRootPath + this.curItemPath
    },
    hasChildren() {
      return this.item.children && (this.item.children.filter(m => !m.hidden)).length
    }
  }
}
</script>

<template>
  <li
    :class="{
      'active': isActive,
      'eu-submenu': hasChildren,
      'eu-menu-item': !hasChildren,
      'is-opened': isOpened,
    }"
    @click="$emit('item-click', item)"
  >
    <!-- 有子菜单 -->
    <template v-if="hasChildren">
      <div class="eu-submenu__title" @click="isOpened = !isOpened">
        <i class="el-icon-arrow-right"></i>
        <span>{{ item.meta.title }}</span>
      </div>
      <ul class="eu-submenu__body">
        <second-sidebar-item
          v-for="child in (item.children.filter(m => !m.hidden))"
          :key="child.path"
          :item="child"
          :root-path="resolvedPath"
          @item-click="$emit('item-click', $event)"
        />
      </ul>
    </template>
    <!-- 没有子菜单 -->
    <app-link v-else :to="resolvedPath">
      <span>{{ item.meta.title }}</span>
      <el-tag v-if="item.meta.badge" type="danger" effect="dark">{{ item.meta.badge }}</el-tag>
      <span v-else-if="item.meta.dot" class="eu-dot eu-dot-error">
        <span></span>
      </span>
    </app-link>
  </li>
</template>

<style scoped lang="scss">
li {
  font-size: 14px;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  position: relative;
  &.eu-menu-item {
    height: 36px;
    border-radius: 6px;
    margin: 0 8px 4px;
    display: flex;
    align-items: center;
    padding: 0 8px;
    >a {
      color: var(--theme-nav-second-color);
      display: flex;
      align-items: center;
      width: 100%;
      height: 100%;
    }
    &.active {
      background-color: var(--theme-nav-second-active-bg);
      >a {
        color: var(--theme-nav-second-active-color);
      }
    }
    &:not(.active):hover {
      background-color: var(--theme-nav-second-hover-bg);
      >a {
        color: var(--theme-nav-second-hover-color);
      }
    }
  }
  &.eu-submenu {
    &>.eu-submenu__title {
      height: 32px;
      line-height: 32px;
      padding: 0 8px;
      color: var(--theme-nav-second-color);
      .el-icon-arrow-right {
        transform: rotate(0deg);
        transition: transform .3s;
        font-size: 12px;
        font-weight: bold;
        margin-right: 4px;
      }
    }
    &>.eu-submenu__body {
      max-height: 0;
      overflow: hidden;
      transition: max-height .3s cubic-bezier(0, 1, 0, 1);
      &>.eu-menu-item {
        margin-left: 16px;
      }
    }
    &.is-opened {
      &>.eu-submenu__body {
        max-height: 1000px;
        transition: max-height .8s ease-in-out;
      }
      &>.eu-submenu__title>.el-icon-arrow-right {
        transform: rotate(90deg);
      }
    }
    &.active {
      .eu-submenu__title {
        color: var(--theme-nav-second-active-color);
      }
    }
    &>.eu-submenu__body {
      &>:not(.eu-menu-item) {
        margin-left: 8px;
      }
    }
  }
}

.el-tag {
  position: absolute;
  right: 4px;
  height: 16px;
  padding-right: 4px;
  padding-left: 4px;
  line-height: 16px;
  border: 0;
}
.eu-dot {
  position: absolute;
  right: 4px;
}
</style>
