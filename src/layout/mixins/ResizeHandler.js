import store from '@/store'
import { DeviceTypeEnums } from '@/utils/enums'
const COLLAPSE_WIDTH = 1180
const MOBILE_WIDTH = 992
export default {
  beforeMount() {
    window.addEventListener('resize', this.$_resizeHandler)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.$_resizeHandler)
  },
  mounted() {
    const isMobile = this.$_isMobile()
    store.dispatch('settings/toggleDevice', isMobile ? DeviceTypeEnums.MOBILE : DeviceTypeEnums.DESKTOP)
    store.dispatch('settings/toggleCollapsed', this.$_isCollapse())
  },
  methods: {
    // use $_ for mixins properties
    // https://vuejs.org/v2/style-guide/index.html#Private-property-names-essential
    $_isMobile() {
      const rect = document.body.getBoundingClientRect()
      return rect.width - 1 < MOBILE_WIDTH
    },
    $_isCollapse() {
      const rect = document.body.getBoundingClientRect()
      return rect.width - 1 < COLLAPSE_WIDTH
    },
    $_resizeHandler() {
      if (!document.hidden) {
        const isMobile = this.$_isMobile()
        store.dispatch('settings/toggleDevice', isMobile ? DeviceTypeEnums.MOBILE : DeviceTypeEnums.DESKTOP)
        store.dispatch('settings/toggleCollapsed', this.$_isCollapse())
      }
    }
  }
}
