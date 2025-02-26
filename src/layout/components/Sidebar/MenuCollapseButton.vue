<script>
import { mapGetters } from 'vuex'

export default {
  name: 'MenuCollapseButton',
  data() {
    return {}
  },
  computed: {
    ...mapGetters({
      sidebarCollapsed: 'settings/sidebarCollapsed'
    }),
  },
  methods: {
    onNavFold() {
      this.$store.dispatch('settings/toggleCollapsed', !this.sidebarCollapsed)
    }
  }
}
</script>

<template>
  <div class="eu-nav-switch-trigger" @click="onNavFold">
    <i class="el-icon-arrow-left"></i>
  </div>
</template>

<style scoped lang="scss">
.eu-nav-switch-trigger {
  width: 15px;
  height: 50px;
  position: absolute;
  right: -15px;
  top: calc(var(--layout-header-nav-height) + 54px);
  transform: translateY(-50%);
  background-color: var(--color-fill-3);
  border-radius: 0 5px 5px 0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all .15s ease;
  box-sizing: content-box;
  >i {
    color: var(--color-text-3);
    font-size: 16px;
  }
  &:hover {
    right: -23px;
    padding-left: 8px;
  }
}
// 折叠菜单
.sidebar-collapsed {
  .eu-nav-switch-trigger {
    >i {
      transform: rotate(180deg);
    }
  }
}
</style>
