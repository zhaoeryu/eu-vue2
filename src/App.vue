<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { watermark } from 'watermark-dom'
import { mapGetters } from 'vuex'
import { darkMode } from '@/utils/darkMode'
import { defaultSetting } from '@/settings'
export default {
  name: 'App',
  computed: {
    ...mapGetters({
      enabledWatermark: 'settings/enabledWatermark',
      darkMode: 'settings/darkMode',
    }),
  },
  watch: {
    enabledWatermark: {
      handler(val) {
        if (val) {
          // 加载水印
          const username = defaultSetting.title
          watermark.load({
            watermark_txt: username,
            watermark_alpha: 0.05
          });
        } else {
          watermark.load({
            watermark_txt: ' ',
            watermark_alpha: 0.05
          });
        }
      },
      immediate: true
    },
    darkMode: {
      handler(val) {
        darkMode(val)
      },
      immediate: true
    }
  },
}
</script>

<style lang="scss" scoped>
#app {
  height: 100%;
}
</style>
