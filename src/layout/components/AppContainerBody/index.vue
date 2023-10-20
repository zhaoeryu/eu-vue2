<template>
  <section id="app-container__body">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedRoutes" :max="keepAliveMaxNum">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
import { defaultSetting } from '@/settings'
export default {
  name: 'AppContainerBody',
  data() {
    return {
      keepAliveMaxNum: defaultSetting.keepAliveMaxNum,
    }
  },
  computed: {
    cachedRoutes() {
      return this.$store.getters['tabsView/visitedViews']
        .filter(item => item.name && item.meta.keepAlive)
        .map(item => item.name)
    },
    key() {
      return this.$route.path
    },
  },
}
</script>

<style lang='scss' scoped>
#app-container__body {
  width: 100%;
  box-sizing: border-box;
  flex-grow: 1;
  position: relative;
}
.eu-layout-horizontal {
  #app-container__body {
    margin-left: 10%;
    margin-right: 10%;
  }
}

/* fade-transform */
.fade-transform--move,
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all .3s;
}

.fade-transform-enter {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
