<template>
  <div class="page-container">
    <div class="page-body">
      <query-expand-wrapper :show="isQueryShow">
        <el-form :model="queryParams" :inline="true">
          <el-form-item prop="menuName" :label="$t('menu.query.menuName')">
            <el-input v-model="queryParams.menuName" :placeholder="$t('menu.query.menuName.placeholder')" maxlength="20" />
          </el-form-item>
        </el-form>
      </query-expand-wrapper>
      <div v-loading="loading">
        <eu-table-toolbar
          :multiple-disabled="multipleDisabled"
          :opt-show="{
            del: false,
            export: false,
            import: false,
            sort: false
          }"
          :permission="{
            add: ['system:menu:add']
          }"
          :ref-table="$refs.table"
          @add="onAdd"
          @refresh="onRefresh"
          :searchToggle.sync="isQueryShow"
        >
          <template #right>
            <el-button icon="el-icon-sort" plain @click="onExpandCollapse">{{ isExpandAll ? $t('menu.query.expandAll') : $t('menu.query.collapseAll') }}</el-button>
          </template>
        </eu-table-toolbar>
        <el-table
          v-if="refreshTable"
          ref="table"
          :data="treeTable"
          style="width: 100%;"
          row-key="id"
          border
          :default-expand-all="isExpandAll"
          :tree-props="{children: 'children'}"
        >
          <el-table-column prop="menuName" :label="$t('menu.column.menuName')" width="180"></el-table-column>
          <el-table-column prop="menuType" :label="$t('menu.column.menuType')" width="100">
            <template #default="{ row }">
              <el-tag v-if="row.menuType === 1" type="info">{{ $t('const.MenuTypeEnums.DIR') }}</el-tag>
              <el-tag v-else-if="row.menuType === 2">{{ $t('const.MenuTypeEnums.MENU') }}</el-tag>
              <el-tag v-else-if="row.menuType === 3" type="success">{{ $t('const.MenuTypeEnums.BUTTON') }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="menuIcon" :label="$t('menu.column.menuIcon')" width="60">
            <template slot-scope="{ row }" v-if="row.menuIcon">
              <svg-icon :icon-class="row.menuIcon"/>
            </template>
          </el-table-column>
          <el-table-column prop="sortNum" :label="$t('menu.column.sortNum')" width="90"></el-table-column>
          <el-table-column prop="path" :label="$t('menu.column.path')"></el-table-column>
          <el-table-column prop="permission" :label="$t('menu.column.permission')"></el-table-column>
          <el-table-column prop="status" :label="$t('menu.column.status')" width="70">
            <template #default="{ row }">
              <el-tag v-if="row.status === 0">{{ $t('menu.column.status.normal') }}</el-tag>
              <el-tag v-else-if="row.status === 1" type="danger">{{ $t('menu.column.status.disabled') }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="visible" :label="$t('menu.column.visible')" width="70">
            <template #default="{ row }">
              <el-tag v-if="row.visible === true">{{ $t('menu.column.visible.true') }}</el-tag>
              <el-tag v-else-if="row.visible === false" type="warning">{{ $t('menu.column.visible.false') }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="cache" :label="$t('menu.column.cache')" width="70">
            <template #default="{ row }">
              <el-tag v-if="row.cache === true">{{ $t('menu.column.cache.true') }}</el-tag>
              <el-tag v-else-if="row.cache === false" type="warning">{{ $t('menu.column.cache.false') }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="dot" label="dot" width="70">
            <template #default="{ row }">
              <el-tag v-if="row.dot === true">{{ $t('menu.column.dot.true') }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="badge" label="badge" width="80">
            <template #default="{ row }">
              <el-tag v-if="row.badge" class="el-tag__badge" type="danger" effect="dark">{{ row.badge }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column v-permissions="['system:menu:add', 'system:menu:edit', 'system:menu:del']" :label="$t('general.column.operation')" width="130">
            <template #default="{ row }">
              <el-button v-permissions="['system:menu:add']" type="text" @click="onRowAdd(row)">{{ $t('general.add') }}</el-button>
              <el-button v-permissions="['system:menu:edit']" type="text" @click="onRowUpdate(row)">{{ $t('general.edit') }}</el-button>
              <el-button v-permissions="['system:menu:del']" type="text" @click="onRowDelete(row)">{{ $t('general.del') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <menu-edit-dialog ref="menuEditDialog" @complete="onRefresh" />
  </div>
</template>

<script>
import { list, batchDel } from '@/api/system/menu'
import { handleTreeData, getChildrenFields, getParentFieldsByLeafId } from '@/utils'
import MenuEditDialog from '@/views/system/menus/MenuEditDialog.vue'

export default {
  name: 'Menus',
  components: { MenuEditDialog },
  data() {
    return {
      refreshTable: true,
      isExpandAll: true,
      list: [],
      originList: [],
      loading: false,

      queryParams: {
        menuName: null
      },

      isQueryShow: true,
      multipleDisabled: true
    }
  },
  computed: {
    treeTable(){
      const searchValue = this.queryParams.menuName;
      if(searchValue){
        let treeData = this.list
        let handleTreeData = this.handleTreeData2(treeData, searchValue)
        return handleTreeData
      }
      return this.list
    }
  },
  mounted() {
    this.onRefresh()
  },
  methods: {
    // 树形表格过滤
    handleTreeData2(treeData, searchValue) {
      if (!treeData || treeData.length === 0) {
        return [];
      }
      const array = [];
      for (let i = 0; i < treeData.length; i += 1) {
        let match = false;
        for(let pro in treeData[i]){
          if(typeof(treeData[i][pro])=='string'){
            match |= treeData[i][pro].includes(searchValue);
            if(match) {
              break;
            }
          }
        }
        if (this.handleTreeData2(treeData[i].children, searchValue).length > 0 || match ) {
          array.push({
            ...treeData[i],
            children: this.handleTreeData2(treeData[i].children, searchValue),
          });
        }
      }
      return array;
    },
    onRefresh() {
      this.onQuery()
    },
    onQuery() {
      this.loading = true
      list(this.queryParams).then(res => {
        this.originList = res.data
        this.list = handleTreeData(this.originList)
      }).finally(() => {
        this.loading = false
      })
    },
    onExpandCollapse() {
      this.refreshTable = false
      this.isExpandAll = !this.isExpandAll
      this.$nextTick(() => {
        this.refreshTable = true
      })
    },
    onAdd() {
      this.$refs.menuEditDialog.open({
        menuType: 1,
        status: 0,
        visible: true
      }, this.list)
    },
    onSelectionChange(selection) {
      this.multipleDisabled = !selection.length
    },
    onRowAdd(row) {
      this.$refs.menuEditDialog.open({
        menuType: 2,
        status: 0,
        visible: true,
        _parentIds: getParentFieldsByLeafId(this.treeTable, row.id, {
          fieldKey: 'id'
        })
      }, this.list)
    },
    onRowUpdate(row) {
      this.$refs.menuEditDialog.open(Object.assign(row, {
        // 从指定的叶子节点中获取所有父节点
        _parentIds: getParentFieldsByLeafId(this.treeTable, row.parentId, {
          fieldKey: 'id'
        })
      }), this.list)
    },
    /**
     * 删除行
     * @param {Object} row 行数据
     * @returns {void}
     */
    onRowDelete(row) {
      this.$confirm(this.$t('menu.confirm.delete', {
        menuName: row.menuName
      }), {
        title: this.$t('general.confirm.title'),
        confirmButtonText: this.$t('general.confirm.confirm'),
        cancelButtonText: this.$t('general.confirm.cancel'),
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            // 删除当前菜单以及该菜单下所有子菜单
            const menuIds = [row.id, ...getChildrenFields(row, { fieldKey: 'id' })]
            batchDel(menuIds).then(() => {
              this.$message.success(this.$t('general.confirm.delete.success'))
              done()
              this.onRefresh()
            }).finally(() => {
              instance.confirmButtonLoading = false
            })
          } else {
            done()
          }
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.el-tag__badge {
  height: 16px;
  padding-right: 4px;
  padding-left: 4px;
  line-height: 16px;
  border: 0;
}
.page-body {
  .svg-icon {
    height: 32px;
    width: 1.5em;
  }
}
</style>
