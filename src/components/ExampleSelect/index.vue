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
              age: 18 + i
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
    },
    async fetchObject(value) {
      return await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: value,
            username: `测试${value}`,
            age: 18 + value
          })
        }, 300)
      })
    }
  }
}
</script>

<template>
  <m-select-pulldown
    ref="pulldown"
    v-model="localValue"
    :disabled="disabled"
    :clearable="clearable"
    :fetch-options="loadData"
    :fetch-object="fetchObject"
    :page="page"
    :field="{ value: 'id', label: 'username' }"
    :placeholder="placeholder"
    @checked="onItemChecked"
    @search="onSearch"
  >
    <template #content="{ list }">
      <div
        v-for="(item, index) in list"
        :key="index"
        class="item padding-sm cursor"
        :class="{ 'active': item.id === localValue }"
        @click="$refs.pulldown.onItemChecked(item)"
      >
        <div class="flex justify-between">
          <div>
            {{ item.username }}
          </div>
          <div>
            <span class="label">age：</span>
            <span>{{ item.age }}</span>
          </div>
        </div>
      </div>
    </template>
  </m-select-pulldown>
</template>

<style scoped lang="scss">
.item {
  background: var(--color-fill-2);
  border-radius: 4px;
  position: relative;
  overflow: hidden;

  &.active::after {
    content: '';
    position: absolute;
    top: -1.7em;
    left: -1.7em;
    width: 3.5em;
    height: 3.5em;
    transform: rotate(45deg);
    background: var(--color-success);
  }

  &.active::before {
    content: '◉';
    position: absolute;
    top: 0.2em;
    left: 0.2em;
    color: var(--color-white);
    z-index: 1;
  }

  &~& {
    margin-top: 12px;
  }
}

.label {
  font-size: 12px;
  color: var(--color-text-3);
}
</style>