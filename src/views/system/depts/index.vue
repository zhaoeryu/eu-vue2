<template>
  <div class="page-container">
    <div class="page-body">
      <div class="query-wrapper">
        <el-form :model="queryParams" :inline="true">
          <el-form-item :label="$t('dept.page.query.form.deptName')">
            <el-input v-model="queryParams.deptName" :placeholder="$t('dept.page.query.form.deptName.placeholder')" />
          </el-form-item>
        </el-form>
        <div>
          <el-button icon="el-icon-sort" plain @click="onExpandCollapse">{{ isExpandAll ? $t('dept.page.query.collapseAll') : $t('dept.page.query.expandAll') }}</el-button>
          <el-button v-permissions="['system:dept:add']" type="primary" icon="el-icon-plus" plain @click="onAdd">
            {{ $t('dept.page.query.add') }}</el-button>
        </div>
      </div>
      <el-divider />
      <div v-loading="loading">
        <el-table
          v-if="refreshTable"
          :data="treeTable"
          style="width: 100%;"
          row-key="id"
          border
          :default-expand-all="isExpandAll"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        >
          <el-table-column prop="deptName" :label="$t('dept.page.column.deptName')" width="180"></el-table-column>
          <el-table-column prop="status" :label="$t('dept.page.column.status')">
            <template #default="{ row }">
              <el-tag v-if="row.status === 0">{{ $t('dept.page.column.status.normal') }}</el-tag>
              <el-tag v-else-if="row.status === 1" type="danger">{{ $t('dept.page.column.status.disabled') }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="sortNum" :label="$t('dept.page.column.sortNum')"></el-table-column>
          <el-table-column v-permissions="['system:dept:add', 'system:dept:edit', 'system:dept:del']" :label="$t('dept.page.column.operation')" width="130">
            <template #default="{ row }">
              <el-button v-permissions="['system:dept:add']" type="text" @click="onRowAdd(row)">{{ $t('general.add') }}</el-button>
              <el-button v-permissions="['system:dept:edit']" type="text" @click="onRowEdit(row)">{{ $t('general.edit') }}</el-button>
              <el-button v-permissions="['system:dept:del']" type="text" @click="onRowDelete(row)">{{ $t('general.del') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <dept-edit-dialog ref="deptEditDialog" @complete="onRefresh" />

  </div>
</template>

<script>
import { list, batchDel } from '@/api/system/dept'
import { getChildrenFields, getParentFieldsByLeafId, handleTreeData } from '@/utils'
import DeptEditDialog from '@/views/system/depts/DeptEditDialog.vue'
export default {
  name: 'Depts',
  components: { DeptEditDialog },
  data() {
    return {
      refreshTable: true,
      isExpandAll: true,
      list: [],
      originList: [],
      loading: false,

      queryParams: {
        deptName: null
      }
    }
  },
  computed: {
    treeTable(){
      const searchValue = this.queryParams.deptName;
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
    //  树形表格过滤
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
      const data = {
        status: 0
      }
      this.$refs.deptEditDialog.open(data, this.list)
    },
    onRowAdd(row) {
      const data = {
        status: 0,
        _parentIds: getParentFieldsByLeafId(this.treeTable, row.id, {
          fieldKey: 'id',
        })
      }
      this.$refs.deptEditDialog.open(data, this.list)
    },
    onRowEdit(row) {
      const data = JSON.parse(JSON.stringify(row))
      data._parentIds = getParentFieldsByLeafId(this.treeTable, row.parentId, {
        fieldKey: 'id',
      })
      this.$refs.deptEditDialog.open(data, this.list)
    },
    onRowDelete(row) {
      this.$confirm(this.$t('dept.page.delete.confirm.message', { deptName: row.deptName }), {
        title: this.$t('general.confirm.title'),
        confirmButtonText: this.$t('general.confirm.confirm'),
        cancelButtonText: this.$t('general.confirm.cancel'),
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            // 删除当前菜单以及该菜单下所有子菜单
            const nodeIds = [row.id, ...getChildrenFields(row, { fieldKey: 'id' })]
            batchDel(nodeIds).then(() => {
              this.$message.success(this.$t('dept.page.delete.success'))
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

