<template>
  <el-dialog :title="$t('crud.TableColumnSettingDialog.title')" :visible.sync="show" :close-on-click-modal="false" width="560px" append-to-body>
    <div class="table-column-setting-wrapper">
      <div class="table-column-setting-header">
        <div>{{ $t('crud.TableColumnSettingDialog.column1') }}</div>
        <div>{{ $t('crud.TableColumnSettingDialog.column2') }}</div>
        <div>{{ $t('crud.TableColumnSettingDialog.column3') }}</div>
        <div>{{ $t('crud.TableColumnSettingDialog.column4') }}</div>
      </div>
      <ul class="table-column-setting-content">
        <li v-for="item in list" v-show="item.enabled" :key="item.id">
          <div>{{ item.label }}</div>
          <el-switch v-model="item.visible" :active-value="true" :inactive-value="false" />
          <div>
            <svg-icon icon-class="drag" />
          </div>
          <div class="fixed">
            <i v-if="!item.fixed || item.fixed === 'right'" class="vxe-icon-fixed-left" @click="onFixed(item, 'left')"></i>
            <i v-if="item.fixed === 'left'" class="vxe-icon-fixed-left-fill active" @click="onFixed(item, '')"></i>
            <i v-if="!item.fixed || item.fixed === 'left'" class="vxe-icon-fixed-right" @click="onFixed(item, 'right')"></i>
            <i v-if="item.fixed === 'right'" class="vxe-icon-fixed-right-fill active" @click="onFixed(item, '')"></i>
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
import XEUtils from 'xe-utils'
export default {
  name: 'VxeTableColumnSettingDialog',
  data() {
    return {
      show: false,
      list: [],
      refTable: null
    }
  },
  methods: {
    open(refTable) {
      Object.assign(this.$data, this.$options.data())
      if (!refTable) {
        throw new Error('请传入el-table的ref')
      }
      this.refTable = refTable
      const { collectColumn } = refTable.getTableColumn();

      let columns = collectColumn.map(column => {
        return {
          id: column.id,
          label: column.title,
          property: column.property,
          visible: column.visible,
          enabled: this.columnFilter(column),
          order: column.sortNumber,
          renderWidth: column.renderWidth,
          fixed: column.fixed
        }
      })

      columns.sort((a, b) => {
        return a.order - b.order
      })

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

            // 设置order
            this.list.forEach((column, index) => {
              column.order = index + 1
            })
          }
        })
      })
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
    onRestore() {
      // 持久化
      this.$store.dispatch('table/resetTableConfig', this.refTable._x_fingerprint).then(() => {
        // 重新渲染表格
        this.refTable.reloadColumn(XEUtils.clone(this.refTable._x_originList, true))
      }).finally(() => {
        this.show = false
      })
    },
    onSave() {
      const refTable = this.refTable
      const { collectColumn } = refTable.getTableColumn();
      const map = {}
      collectColumn.forEach(column => {
        map[column.id] = column
      })

      const storeData = {
        fixedData: {},
        visibleData: {},
        sortData: {},
        resizableData: {}
      }

      this.list.forEach(item => {
        const column = map[item.id]
        if (!item.enabled) {
          return
        }
        storeData.visibleData[column.property] = item.visible
        storeData.sortData[column.property] = item.order
        storeData.fixedData[column.property] = item.fixed
        storeData.resizableData[column.property] = item.renderWidth

        // 判断该列是否有子级, 子级显示状态与父级一致
        if (column.children && column.children.length) {
          column.children.forEach(child => {
            storeData.visibleData[child.property] = item.visible
          })
        }
      })

      // 持久化
      this.$store.dispatch('table/saveTableConfig', {
        fingerprint: this.refTable._x_fingerprint,
        config: storeData
      }).then(() => {
        // 渲染表格
        this.reRenderTable()
      })

      this.show = false
    },
    /**
     * 重新渲染表格
     */
    reRenderTable() {
      const refTable = this.refTable
      refTable.restoreCustomStorage()
      this.$nextTick(() => {
        refTable.refreshColumn()
      })
    },
    onFixed(item, fixed) {
      this.list.find(column => column === item).fixed = fixed
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

    svg {
      width: 1.5em;
      height: 1.5em;
    }

    .fixed {
      font-size: 16px;
      i {
        cursor: pointer;
        display: inline-block;

        &:hover {
          color: var(--color-primary);
        }
        &.active {
          color: var(--color-primary);
        }
      }
      i ~ i {
        padding-left: 10px;
      }
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
