<script>
import MSelectPulldown from '@/components/MSelectPulldown/index.vue'
export default {
  components: {
    MSelectPulldown
  },
  props: {
    value: {
      type: [Number, String]
    },
    clearable: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    queryParams: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      localValue: this.value,
      page: {
        enabled: true,
        page: 1,
        size: 10,
        total: 0
      }
    };
  },
  watch: {
    value(newValue) {
      this.localValue = newValue
    }
  },
  methods: {
    onItemChecked(checkedItem) {
      this.$message.success(JSON.stringify(checkedItem))
      this.$emit('input', checkedItem.id)
    },
    loadData(keyword) {
      console.log('loadData', keyword, JSON.stringify(this.page))
      return new Promise((resolve) => {
        setTimeout(() => {
          const list = []
          // 填充30条测试数据
          for (let i = 0; i < 10; i++) {
            list.push({
              id: i,
              username: `测试${i}`,
              groupName: '分组' + i % 4
            })
          }
          resolve({
            data: list
          })
          this.page.total = 30
        }, 300)
      })
    },
    onSearch(keyword) {
      console.log('onSearch', keyword)
    }
  }
}
</script>

<template>
  <m-select-pulldown
    v-model="localValue"
    :disabled="disabled"
    :clearable="clearable"
    :loadData="loadData"
    :page="page"
    :field="{ value: 'id', label: 'username' }"
    :group="{ enabled: false, groupField: 'groupName' }"
    :placeholder="placeholder"
    @checked="onItemChecked"
    @search="onSearch"
  >
  </m-select-pulldown>
</template>

<style scoped lang="scss">

</style>