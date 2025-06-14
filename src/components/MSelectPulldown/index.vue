<script>
import { PopupManager } from 'element-ui/lib/utils/popup'
export default {
  name: 'MSelectPulldown',
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
    page: {
      type: Object,
      default: () => ({
        enabled: false,
        page: 1,
        size: 10,
        total: 0
      })
    },
    field: {
      type: Object,
      default: () => ({
        value: null,
        label: null,
        labelFn: null
      })
    },
    group: {
      type: Object,
      default: () => ({
        enabled: false,
        field: null,
        sortField: null
      })
    },
    fetchOptions: Function,
    fetchObject: Function,
    minHeight: {
      type: String,
      default: '300px'
    },
    maxHeight: {
      type: String,
      default: '300px'
    },
    width: {
      type: String,
      default: '500px'
    }
  },
  data() {
    return {
      loading: false,
      keyword: '',
      list: [],
      localPage: {},

      isFocused: false,
      isHovered: false,

      displayValue: null
    }
  },
  watch: {
    page: {
      handler(newPage) {
        this.localPage = newPage;
      },
      immediate: true
    },
    localPage: {
      handler(newLocalPage) {
        this.$emit('update:page', newLocalPage);
      },
      deep: true
    }
  },
  computed: {
    filterList() {
      let list = this.list
      if (this.keyword && !this.page.enabled) {
        if (this.field.labelFn) {
          list = list.filter(item => {
            const label = this.field.labelFn(item)
            if (label) {
              return label.includes(this.keyword)
            }
            return false
          })
        } else {
          list = this.list.filter(item => item[this.field.label].includes(this.keyword))
        }
      }
      return list
    },
    groupList() {
      let list = this.filterList

      if (!this.group.enabled) {
        return list
      }

      const _tmpGroupList = []
      list.forEach(item => {
        const groupField = item[this.group.field] || '未知'
        const _group = _tmpGroupList.find(group => group.label === groupField)
        if (_group) {
          _group.children.push(item)
          return
        }
        _tmpGroupList.push({
          label: groupField,
          sort: item[this.group.sortField] || 99,
          children: [item]
        })
      })
      const sortField = this.group.sortField ? 'sort' : 'label'
      return _tmpGroupList.sort((a, b) => a[sortField] - b[sortField])
    }
  },
  mounted() {
    this.onQuery()
    // this.$nextTick(() => {
    //   this.$refs.xDown.hidePanel = () => {}
    // })
  },
  methods: {
    onShow() {
      if (this.disabled) {
        return
      }
      this.onQuery()
      this.$refs.xDown.showPanel(this.$refs.pullDownReference)
      // 使用ElementUI的ZIndex，避免该组件在ElementUI的dialog/drawer中遮罩层层级问题
      this.$nextTick(() => {
        this.$refs.xDown.reactData.panelIndex = PopupManager.nextZIndex()
      })
    },
    async onQuery(isForcedRefresh = false) {
      if (!isForcedRefresh && this.list.length) {
        return
      }
      this.loading = true
      try {
        const ms = isForcedRefresh ? 100 : 0
        const res = await this.withMinDuration(this.fetchOptions, ms)
        let records = res.data || []
        this.list = records
        
        // 显示值处理
        this.displayValueHandle(records)
      } finally {
        this.loading = false
      }
    },
    async displayValueHandle(records) {
      // 判断是否需要加载显示值
      if (this._.isNil(this.displayValue) && !this._.isNil(this.value)) {
        // 当有id，没有显示值时，加载显示值
        // 看看本次请求的结果，是否包含当前选中的id
        const foundItem = records.find(item => item[this.field.value] === this.value)
        if (foundItem) {
          this.displayValue = foundItem[this.field.label]
        } else {
          const objRes = await this.fetchObject(this.value)
          if (objRes.data) {
            this.displayValue = objRes.data[this.field.label]
          }
        }
      }
    },
    /**
     * 确保异步操作至少执行指定的最小时间
     * @param {Function} fn - 要执行的异步函数
     * @param {number} minDuration - 最小执行时间（毫秒），默认300ms
     * @returns {Promise<any>} 返回fn的执行结果
     * @throws {Error} 如果fn执行出错，将抛出原始错误
     */
    async withMinDuration(fn, minDuration = 100) {
      const startTime = performance.now();
      let result;
      let error = null;

      try {
        result = await fn(this.keyword);
      } catch (err) {
        error = err
      }

      const elapsedTime = performance.now() - startTime;
      const remainingTime = Math.max(0, minDuration - elapsedTime);

      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }

      if (error) {
        throw error;
      }

      return result;
    },
    onItemChecked(row) {
      this.displayValue = row[this.field.label]
      this.$emit('input', row[this.field.value])
      this.$emit('checked', row)
      this.$refs.xDown.hidePanel()
    },
    onClear() {
      this.onItemChecked({})
      this.isFocused = false
    },
    onFocus() {
      this.onShow()
      this.isFocused = true
    },
    onBlur() {
      this.isFocused = false
    },
    onSearchChange() {
      this.$emit('search', this.keyword)
      if (!this.page.enabled) {
        return
      }
      this.onQuery(true)
    },
    onShowPanel({ visible }) {
      if (visible) {
        this.$nextTick(() => {
          this.$refs.xDown.$refs.refPulldownPanel.style.width = this.width
          this.$refs.xDown.$refs.refPulldownPanel.style.minWidth = this.width
          this.$refs.xDown.$refs.refPulldownPanel.style.maxWidth = this.width
        })
      }
    }
  }
}
</script>

<template>
  <vxe-pulldown
    ref="xDown"
    :transfer="true"
    :show-popup-shadow="true"
    class-name="m-pulldown"
    popup-class-name="m-pulldown-popup"
    @visible-change="onShowPanel"
  >
    <template #default>
      <slot name="default"></slot>
      <el-input
        v-if="!$scopedSlots.default"
        ref="pullDownReference"
        v-model="displayValue"
        :disabled="disabled"
        :placeholder="placeholder"
        readonly
        style="width: 100%;"
        @focus="onFocus"
        @blur="onBlur"
        @mouseenter.native="isHovered = true"
        @mouseleave.native="isHovered = false"
      >
        <span v-if="(isFocused || isHovered) && clearable && !disabled && !_.isNil(value)" slot="suffix" @click="onClear" style="font-size: 16px;line-height: 28px;">
          <i class="el-icon-circle-close" style="margin-left: 5px;cursor: pointer;"></i>
        </span>
      </el-input>
    </template>
    <template #header>
      <slot name="header"></slot>
      <div v-if="!$scopedSlots.header" class="header flex justify-between padding-sm">
        <div>
          <slot name="search-prepend"></slot>
          <el-input
            v-model="keyword"
            style="width: 250px;"
            size="mini"
            placeholder="请输入"
            clearable
            @change="onSearchChange"
          />
          <slot name="search-append"></slot>
        </div>
        <el-button
          class="margin-left-sm"
          type="primary"
          size="mini"
          @click="onQuery(true)"
        >{{ page.enabled ? '查询' : '刷新' }}</el-button>
      </div>
    </template>
    <template #footer>
      <slot name="footer"></slot>
      <pagination
        v-if="!$scopedSlots.footer && page.enabled && filterList.length"
        :total="page.total"
        :page.sync="localPage.page"
        :limit.sync="localPage.size"
        :layout="'total, prev, pager, next'"
        class="padding-sm"
        @pagination="onQuery(true)"
      />
    </template>
    <template #dropdown>
      <slot name="dropdown"></slot>
      <div
        v-if="!$scopedSlots.dropdown"
        class="m-dropdown flex flex-direction padding-sm"
      >
        <div
          class="flex-sub m-dropdown-content"
          :style="{ minHeight: minHeight, maxHeight: maxHeight, overflowY: 'auto' }"
        >
          <eu-loading
            v-if="loading"
            style="height: 300px;"
          />
          <template v-else-if="filterList.length">
            <slot
              name="content"
              :groupList="groupList"
              :list="filterList"
            ></slot>
          </template>
          <template v-else>
            <slot name="empty"></slot>
            <el-empty
              v-if="!$scopedSlots.empty"
              style="width: 100%;"
              :image-size="120"
              description="暂无数据"
            />
          </template>
        </div>
      </div>
    </template>
  </vxe-pulldown>
</template>

<style scoped lang="scss">
@import "~@/assets/styles/mixin.scss";
.m-pulldown {
  display: block;
}
.header {
  position: relative;
  &:after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1px;
    background-color: var(--color-border);
  }
}
.m-dropdown {
  background-color: var(--color-bg-2);
}
.m-dropdown-content {
  @include scrollBar;
}
</style>
