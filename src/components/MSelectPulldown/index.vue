<script>
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
        label: null
      })
    },
    group: {
      type: Object,
      default: () => ({
        enabled: false,
        groupField: null,
        sortField: null
      })
    },
    loadData: Function,
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
      localPage: { ...this.page }
    }
  },
  watch: {
    page: {
      handler(newPage) {
        this.localPage = { ...newPage };
      },
      deep: true
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
        list = this.list.filter(item => item[this.field.label].includes(this.keyword))
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
        const groupField = item[this.group.groupField] || '未知'
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
    },
    checkedItem() {
      return this.list.find(item => item[this.field.value] === this.value) || {}
    },
    showLabel() {
      return this.checkedItem?.[this.field.label]
    }
  },
  mounted() {
    this.onQuery()
  },
  methods: {
    onShow() {
      if (this.disabled) {
        return
      }
      this.$refs.xDown.showPanel(this.$refs.pullDownReference)
    },
    onQuery(isForcedRefresh = false) {
      if (!isForcedRefresh && this.list.length) {
        return
      }
      this.loading = true
      this.loadData(this.keyword).then(res => {
        this.list = res.data
      }).finally(() => {
        this.loading = false
      })
    },
    onItemChecked(row) {
      this.$emit('input', row[this.field.value])
      this.$emit('checked', row)
      this.$refs.xDown.hidePanel()
    },
    onClear() {
      this.$emit('input', null)
      this.$emit('checked', {})
    }
  }
}
</script>

<template>
  <div>
    <div
      ref="pullDownReference"
      class="pulldown-reference-wrapper"
    >
      <div class="cursor" style="flex: 1;" @click="onShow">
        <template v-if="$scopedSlots.reference">
          <slot name="reference" :checkedItem="checkedItem"></slot>
        </template>
        <template v-else>
          <el-input 
            v-model="showLabel" 
            size="mini" 
            :placeholder="placeholder" 
            readonly 
          />
        </template>
      </div>
      <div v-if="clearable && value && !disabled" @click="onClear" class="pulldown__clearable">
        <i class="el-icon-circle-close cursor" />
      </div>
    </div>
    <div style="position:fixed;">
      <vxe-pulldown ref="xDown" :transfer="true">
        <template #dropdown>
          <div class="m-dropdown flex flex-direction padding-df" :style="{
            width: width,
          }">
            <div class="header flex justify-between padding-bottom-df">
              <template v-if="page.enabled">
                <el-input v-model="keyword" style="width: 250px;" size="mini" placeholder="请输入" @change="$emit('search', keyword)" />
                <el-button type="primary" size="mini" @click="onQuery(true)">查询</el-button>
              </template>
              <template v-else>
                <el-button type="primary" size="mini" plain @click="onQuery(true)">刷新</el-button>
                <el-input v-model="keyword" style="width: 250px;" size="mini" placeholder="请输入" @change="$emit('search', keyword)" />
              </template>
            </div>
            <div
              class="flex-sub margin-top-xs"
              :style="{minHeight: '300px', maxHeight: '300px', overflowY: 'auto'}"
            >
              <eu-loading v-if="loading" style="height: 300px;" />
              <template v-else-if="filterList.length">
                <template v-if="$scopedSlots.content">
                  <slot name="content" :groupList="groupList"></slot>
                </template>
                <template v-else-if="group.enabled">
                  <div v-for="(group, groupIndex) in groupList" :key="groupIndex">
                    <div class="text-sm padding-xs text-bold">{{ group.label }}</div>
                    <div class="flex" style="flex-wrap: wrap;">
                      <div
                        v-for="item in group.children"
                        :key="item[field.value]"
                        class="m-dropdown__item padding-xs margin-right-sm margin-vertical-xs"
                        style="font-size: 13px;"
                        :class="value === item[field.value] ? 'active' : ''"
                        @click="onItemChecked(item)"
                      >
                        {{ item[field.label] || '-' }}
                      </div>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="flex" style="flex-wrap: wrap;">
                    <div
                      v-for="(item, index) in filterList"
                      :key="index"
                      class="m-dropdown__item padding-xs margin-right-sm margin-vertical-xs"
                      :class="value === item[field.value] ? 'active' : ''"
                      @click="onItemChecked(item)"
                    >
                      {{ item[field.label] || '-' }}
                    </div>
                  </div>
                </template>
              </template>
              <template v-else>
                <el-empty style="width: 100%;" :image-size="120" description="暂无数据" />
              </template>
            </div>
            <pagination
              v-if="page.enabled && filterList.length"
              :total="page.total"
              :page.sync="localPage.page"
              :limit.sync="localPage.size"
              :layout="'total, prev, pager, next'"
              @pagination="onQuery(true)"
            />
          </div>
        </template>
      </vxe-pulldown>
    </div>
  </div>
</template>

<style scoped lang="scss">
.m-dropdown {
  width: 500px;
  background-color: var(--color-bg-2);
  box-shadow: 0 0 6px 2px rgba(0, 0, 0, 0.1);
  padding-bottom: 6px;
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
  .m-dropdown__item {
    cursor: pointer;
    border-radius: 2px;
    background-color: var(--color-fill-2);
    &.active {
      color: var(--color-primary);
      background-color: rgba(var(--primary), .2) !important;
    }
    &:not(.active):hover {
      color: var(--color-primary);
      background-color: rgba(var(--primary), .1) !important;
    }
  }
}
.pulldown-reference-wrapper {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 2px;
  line-height: 32px;
  box-sizing: border-box;
  height: 32px;
}
.el-icon-circle-close:hover {
  color: var(--color-primary);
}
.pulldown__clearable {
  position: absolute;
  right: 0.5em;
}
</style>
