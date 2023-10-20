<template>
  <div class="page-container">
    <div class="page-body">
      <div class="query-wrapper">
        <el-form :model="queryParams" :inline="true">
          <el-form-item label="部门名称">
            <el-input v-model="queryParams.deptName" placeholder="输入要查找的部门名称" />
          </el-form-item>
        </el-form>
        <div>
          <el-button icon="el-icon-sort" plain @click="onExpandCollapse">{{ isExpandAll ? '全部折叠' : '全部展开' }}</el-button>
          <el-button v-permissions="['system:dept:add']" type="primary" icon="el-icon-plus" plain @click="onAdd">添加部门</el-button>
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
          <el-table-column prop="deptName" label="部门名称" width="180"></el-table-column>
          <el-table-column prop="status" label="状态">
            <template #default="{ row }">
              <el-tag v-if="row.status === 0">正常</el-tag>
              <el-tag v-else-if="row.status === 1" type="danger">禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="sortNum" label="排序"></el-table-column>
          <el-table-column v-permissions="['system:dept:add', 'system:dept:edit', 'system:dept:del']" label="操作" width="130">
            <template #default="{ row }">
              <el-button v-permissions="['system:dept:add']" type="text" @click="onRowAdd(row)">新增</el-button>
              <el-button v-permissions="['system:dept:edit']" type="text" @click="onRowEdit(row)">修改</el-button>
              <el-button v-permissions="['system:dept:del']" type="text" @click="onRowDelete(row)">删除</el-button>
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
      this.$confirm(`确定要删除"${ row.deptName }"${row.children && row.children.length ? '以及它下面的所有部门吗' : ''}吗？`, {
        title: '提示',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            // 删除当前菜单以及该菜单下所有子菜单
            const nodeIds = [row.id, ...getChildrenFields(row, { fieldKey: 'id' })]
            batchDel(nodeIds).then(() => {
              this.$message.success('删除成功')
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

