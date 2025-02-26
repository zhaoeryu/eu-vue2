import { TABLE_FINGERPRINT } from '@/utils/vxe-table'
import XEUtils from 'xe-utils';

export default function TableColumnSettingMixin(refTableNames) {
  return {
    data() {
      const self = this
      let initialized = false
      const customConfig = {
        storage: true,
        restoreStore ({ id }) {
          const fingerprint = TABLE_FINGERPRINT(self, id)
          const cacheConfig = self.$store.getters['table/tableConfig'](fingerprint)
          if (!initialized) {
            const refTable = self.$refs[id]
            if (refTable) {
              refTable._x_originList = XEUtils.clone(refTable.staticColumns, true)
              initialized = true
            }
          }
          if (!cacheConfig) {
            return {}
          }
          return cacheConfig
        },
        updateStore ({ id, storeData }) {
          const fingerprint = TABLE_FINGERPRINT(self, id)
          // 持久化
          self.$store.dispatch('table/saveTableConfig', {
            fingerprint: fingerprint,
            config: storeData
          }).then(() => {
            // console.log('save success')
          })
        }
      }
      return {
        customConfig
      }
    },
    mounted() {
      refTableNames.forEach(refTableName => {
        const refTable = this.$refs[refTableName]
        if (refTable) {
          refTable._x_fingerprint = TABLE_FINGERPRINT(this, refTableName)
        }
      })
    }
  }
}
