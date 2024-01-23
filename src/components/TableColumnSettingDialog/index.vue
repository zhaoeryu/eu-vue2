<template>
  <el-dialog :title="$t('crud.TableColumnSettingDialog.title')" :visible.sync="show" :close-on-click-modal="false" width="560px" append-to-body>
    <div class="table-column-setting-wrapper">
      <div class="table-column-setting-header">
        <div>{{ $t('crud.TableColumnSettingDialog.column1') }}</div>
        <div>{{ $t('crud.TableColumnSettingDialog.column2') }}</div>
        <div>{{ $t('crud.TableColumnSettingDialog.column3') }}</div>
      </div>
      <ul class="table-column-setting-content">
        <li v-for="item in list" v-show="item.enabled" :key="item.id">
          <div>{{ item.label }}</div>
          <el-switch v-model="item.visible" :active-value="true" :inactive-value="false" />
          <div class="handle">
            <i class="el-icon-sort"></i>
          </div>
        </li>
      </ul>
    </div>
    <template #footer>
      <el-button @click="onRestore"><div>{{ $t('crud.TableColumnSettingDialog.reset') }}</div></el-button>
      <div>
        <el-button @click="show = false"><div>{{ $t('crud.TableColumnSettingDialog.cancel') }}</div></el-button>
        <el-button type="primary" @click="onSave"><div>{{ $t('crud.TableColumnSettingDialog.submit') }}</div></el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import Sortable from 'sortablejs';
export default {
  name: 'TableColumnSettingDialog',
  data() {
    return {
      show: false,
      list: [],
      refTable: null
    }
  },
  methods: {
    open(refTable, { ignoreColumns = [] } = {}) {
      Object.assign(this.$data, this.$options.data())
      if (!refTable) {
        throw new Error('请传入el-table的ref')
      }
      this.refTable = refTable

      let isNeedSort = false
      refTable.$children.map(item => item.columnConfig).filter(item => item).forEach((column, index) => {
        if (column._eu_visible === undefined) {
          column._eu_visible = true
        }
        if (column._eu_order !== undefined) {
          isNeedSort = true
        }
        if (column._eu_enabled === undefined) {
          column._eu_enabled = this.columnFilter(column, ignoreColumns)
          column._eu_order = index
        }
      })
      const fullColumns = refTable.$children.map(item => item.columnConfig).filter(item => item)

      let columns = fullColumns.map(column => {
        return {
          id: column.id,
          label: column.label,
          property: column.property,
          visible: column._eu_visible,
          enabled: column._eu_enabled || false,
          order: column._eu_order
        }
      })

      if (isNeedSort) {
        columns.sort((a, b) => {
          return a.order - b.order
        })
      }

      if (!refTable._x_originList) {
        refTable._x_originList = JSON.parse(JSON.stringify(columns))
      }
      this.list = columns
      this.show = true

      this.initSortable()
    },
    initSortable() {
      this.$nextTick(() => {
        const el = this.$el.querySelector('.table-column-setting-content')
        new Sortable(el, {
          animation: 200,
          ghostClass: 'sortable-ghost',
          dragClass: 'sortable-drag',
          onEnd: evt => {
            const item = this.list[evt.oldIndex]
            this.list.splice(evt.oldIndex, 1)
            this.list.splice(evt.newIndex, 0, item)
          }
        })
      })
    },
    columnFilter(column, ignoreColumns) {
      return column && column.type === 'default' && column.property && !ignoreColumns.includes(column.property)
    },
    onRestore() {
      this.list = JSON.parse(JSON.stringify(this.refTable._x_originList))
    },
    onSave() {
      const refTable = this.refTable

      const map = {}
      refTable.store.states._columns.forEach(column => {
        try {
          map[column.id] = column
        } catch (e) {
          console.log(column)
        }
      })

      refTable.store.states._columns.length = 0

      this.list.forEach((column, index) => {
        const vm = refTable.$children.find(e => e.prop === column.property)
        const columnConfig = vm.columnConfig
        columnConfig._eu_visible = column.visible
        columnConfig._eu_enabled = column.enabled
        if (columnConfig._eu_enabled) {
          columnConfig._eu_order = index
        }

        if (columnConfig._eu_visible) {
          refTable.store.commit('insertColumn', map[column.id] || columnConfig, index, null)
        }
      })

      refTable.store.updateColumns()

      this.show = false
    }
  }
}
</script>

<style lang='scss' scoped>
::v-deep .el-dialog__body {
  padding: 0;
}
.table-column-setting-wrapper {
  max-height: 460px;
  overflow-y: auto;
  padding: 24px;
  color: var(--color-text-1);
}
.table-column-setting-header {
  font-weight: 500;
  font-size: 12px;
  display: flex;
  height: 40px;
  align-items: center;
  justify-content: flex-start;
  padding: 0 20px;
  >div {
    flex: 1;
  }
  >:first-child {
    flex: 2;
  }
}
.table-column-setting-content {
  li {
    font-size: 12px;
    display: flex;
    height: 40px;
    align-items: center;
    justify-content: flex-start;
    padding: 0 20px;
    box-shadow: 0 -1px 0 0 var(--color-border-1);
    cursor: move;
    user-select: none;
    >div {
      flex: 1;
    }
    >:first-child {
      flex: 2;
    }
  }
}
.sortable-drag {
  background-color: var(--color-secondary-hover);
}
::v-deep .el-dialog__footer {
  border-top: 1px solid var(--color-border-1);
  display: flex;
  justify-content: space-between;
}
</style>
