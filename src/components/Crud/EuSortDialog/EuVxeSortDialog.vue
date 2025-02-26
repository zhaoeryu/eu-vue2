<script>
import Sortable from 'sortablejs'
import { camelCaseToUnderline } from '@/utils'

export default {
  name: 'EuVxeSortDialog',
  props: {
    value: Array || String
  },
  data() {
    return {
      show: false,
      columns: [
        // { fieldName: 'create_time', fieldLabel: '创建时间', sort: 'desc' },
        // { fieldName: 'last_active_time', fieldLabel: '最后活跃时间', sort: 'desc' },
      ],
      sortResult: []
    }
  },
  methods: {
    open(refTable) {
      Object.assign(this.$data, this.$options.data())
      this.show = true

      // 获取表格列配置
      const { tableColumn } = refTable.getTableColumn()
      const _columns = tableColumn.filter(item => this.columnFilter(item))
        .filter(item => item && item.field && item.title)
        .map(item => {
          return {
            property: item.field,
            label: item.title
          }
        })
        .map(column => {
          const columnName = camelCaseToUnderline(column.property)
          return {
            fieldName: columnName,
            fieldLabel: column.label,
            sort: this.sortResult.find(item => item.fieldName === columnName)?.sort
          }
        })

      // 初始化排序项
      let _sort = []
      if (typeof this.value === 'string') {
        _sort.push(this.value)
      } else if (Array.isArray(this.value)) {
        _sort = this.value
      }
      this.sortResult = _sort.map(item => {
        const column = _columns.find(column => column.fieldName === item.split(',')[0]) || {
          fieldName: item.split(',')[0],
        }
        return {
          ...column,
          sort: item.split(',')[1]
        }
      })

      // 设置选项禁用
      _columns.forEach(column => {
        column.checked = !!this.sortResult.find(item => item.fieldName === column.fieldName)
      })
      this.columns = _columns

      this.initSortable()
    },
    columnFilter(column) {
      if (!column) {
        return false
      }
      if (['seq', 'checkbox', 'radio'].includes(column.type)) {
        return false
      }
      if (!column.title && !column.property) {
        return false
      }
      const ignoreColumns = [
        this.$tableColumnField.operation
      ]
      return !ignoreColumns.includes(column.property);
    },
    initSortable() {
      this.$nextTick(() => {
        const el = this.$el.querySelector('.sort-column-content')
        new Sortable(el, {
          animation: 200,
          ghostClass: 'sortable-ghost',
          dragClass: 'sortable-drag',
          onEnd: evt => {
            const item = this.sortResult[evt.oldIndex]
            this.sortResult.splice(evt.oldIndex, 1)
            this.sortResult.splice(evt.newIndex, 0, item)
          }
        })
      })
    },
    onSave() {
      const res = this.sortResult.map(item => `${item.fieldName},${item.sort}`)
      this.$emit('input', res)
      this.$emit('complete')
      this.show = false
    },
    onCommand(fieldName) {
      const item = this.columns.find(item => item.fieldName === fieldName)
      const newItem = { ...item }
      if (!newItem.sort) {
        newItem.sort = 'desc'
      }
      item.checked = true
      this.sortResult.push(newItem)
    },
    onClear() {
      this.sortResult = []
      this.columns.forEach(item => {
        item.checked = false
      })
    }
  }
}
</script>

<template>
  <el-dialog
    :title="$t('crud.EuSortDialog.title')"
    :visible.sync="show"
    width="560px"
    append-to-body
  >
    <div style="padding: 20px;min-height: 200px;">
      <el-dropdown
        trigger="click"
        size="medium"
        placement="bottom-start"
        @command="onCommand"
      >
        <div style="cursor: pointer;" class="text-primary">
          <i style="font-weight: bold;" class="el-icon-plus"></i>
          <span>&nbsp;{{ $t('crud.EuSortDialog.addRuleBtn') }}</span>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="(item, index) in columns"
            :command="item.fieldName"
            :key="index"
            :disabled="item.checked"
          >{{ item.fieldLabel }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="sort-column-wrapper">
        <ul class="sort-column-content">
          <li v-for="(item, index) in sortResult" :key="item.fieldName">
            <div>{{ item.fieldLabel }}</div>
            <el-radio-group v-model="item.sort" size="mini">
              <el-radio-button label="asc">{{ $t('crud.EuSortDialog.asc') }}</el-radio-button>
              <el-radio-button label="desc">{{ $t('crud.EuSortDialog.desc') }}</el-radio-button>
            </el-radio-group>
            <div class="handle">
              <svg-icon icon-class="drag" />
              <i style="cursor: pointer;vertical-align: 0.15em;" class="el-icon-delete" @click="sortResult.splice(index, 1)"></i>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <template #footer>
      <el-button @click="onClear">{{ $t('crud.EuSortDialog.clear') }}</el-button>
      <div>
        <el-button @click="show = false">{{ $t('crud.EuSortDialog.cancel') }}</el-button>
        <el-button type="primary" class="eu-submit-btn" @click="onSave">{{ $t('crud.EuSortDialog.submit') }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
::v-deep .el-dialog__footer {
  border-top: 1px solid var(--color-border-1);
  display: flex;
  justify-content: space-between;
}
.el-dropdown-menu__item {
  min-width: 250px;
}


::v-deep .el-dialog__body {
  padding: 0;
}
.sort-column-wrapper {
  padding: 24px 0;
  color: var(--color-text-1);
}
.sort-column-content {
  li {
    display: flex;
    height: 40px;
    align-items: center;
    justify-content: flex-start;
    padding: 0 20px;
    cursor: move;
    user-select: none;
    >:first-child {
      flex: 2;
      text-align: left;
    }
    &:not(:first-child) {
      box-shadow: 0 -1px 0 0 var(--color-border-1);
      flex: 1;
      text-align: right;
    }
    .handle {
      padding-left: 12px;
      >i {
        padding-left: 12px;
        font-weight: bold;
        font-size: 16px;
      }
      >svg {
        width: 1.5em;
        height: 1.5em;
      }
    }
  }
}
.sortable-drag {
  background-color: var(--color-secondary-hover);
}
</style>
