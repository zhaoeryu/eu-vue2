<template>
  <footer id="app-container__footer">
    <span v-html="defaultSetting.copyright"></span>
  </footer>
</template>

<script>

import { defaultSetting } from '@/settings'

export default {
  name: 'AppContainerFooter',
  computed: {
    defaultSetting() {
      return defaultSetting
    }
  }
}
</script>

<style lang='scss' scoped>
#app-container__footer {
  text-align: center;
  color: #c8c9cc;
  height: 50px;
  line-height: 50px;
  font-size: 14px;
}
</style>
