<script>
import { list as deptList } from '@/api/system/dept'
import { getParentFieldsByLeafId, handleTreeData } from '@/utils'
import { batchAssignRole, roleUserList } from '@/api/system/user'

export default {
  name: 'AddAuthUserDialog',
  data() {
    return {
      show: false,
      loading: false,

      list: [],
      total: 0,
      queryParams: {
        roleId: null,
        hasRole: 0,
        page: 1,
        size: 10
      },
      multipleDisabled: true,

      deptTree: [],
      roleId: null
    }
  },
  methods: {
    open(roleId) {
      Object.assign(this.$data, this.$options.data())
      this.roleId = roleId
      this.show = true
      this.onDeptQuery()
      this.onRefresh()
    },
    onDialogClose() {
      Object.assign(this.$data, this.$options.data())
    },
    onSelectionChange(selection) {
      this.multipleDisabled = !selection.length
    },
    onSelectable(row) {
      return !!row.id
    },
    onDeptQuery() {
      deptList().then(res => {
        this.deptTree = handleTreeData(res.data || [])
      })
    },
    convertToDeptName(deptId) {
      return getParentFieldsByLeafId(this.deptTree, deptId, { fieldKey: 'deptName' }).join('/')
    },
    onQuery() {
      this.loading = true
      this.queryParams.roleId = this.roleId
      roleUserList(this.queryParams).then(res => {
        this.list = res.data.records
        this.total = res.data.total
      }).finally(() => {
        this.loading = false
      })
    },
    onRefresh() {
      this.queryParams = this.$options.data().queryParams
      this.onQuery()
    },
    onBatchAuth() {
      const userIds = this.$refs.table.selection.map(item => item.id)
      this.$confirm(`确定要给这 ${userIds.length} 个用户分配角色吗？`, '提示', {
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            batchAssignRole({
              roleId: this.roleId,
              userIds
            }).then(() => {
              this.$message.success('授权成功')
              done()
              this.show = false
              this.$emit('complete')
            }).finally(() => {
              instance.confirmButtonLoading = false;
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

<template>
  <el-dialog title="授权用户" :visible.sync="show" width="1000px" @close="onDialogClose" append-to-body>
    <div>
      <div class="page-body query-wrapper">
        <el-form :model="queryParams" :inline="true">
          <el-form-item label="用户名称">
            <el-input v-model="queryParams.nickname" placeholder="输入要查找的用户名称" clearable />
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="queryParams.mobile" placeholder="输入要查找的手机号" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="onQuery">查询</el-button>
            <el-button icon="el-icon-refresh" plain @click="onRefresh">重置</el-button>
          </el-form-item>
        </el-form>
        <div v-permissions="['system:user:assignRole']">
          <el-button :disabled="multipleDisabled" type="primary" icon="el-icon-plus" plain @click="onBatchAuth">批量授权</el-button>
        </div>
      </div>
      <el-table
        ref="table"
        :data="list"
        @selection-change="onSelectionChange"
        style="width: 100%"
      >
        <el-table-column type="selection" :selectable="onSelectable"></el-table-column>
        <el-table-column prop="username" label="登录名" width="100"></el-table-column>
        <el-table-column prop="nickname" label="用户昵称" width="100"></el-table-column>
        <el-table-column prop="deptId" label="部门">
          <template #default="{ row }">
            <span>{{ convertToDeptName(row.deptId) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="mobile" label="手机号码"></el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template v-slot:default="{ row }">
            <el-tag :type="row.status === 0 ? 'success' : 'danger'">{{ row.status === 0 ? '正常' : '禁用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastActiveTime" label="最后活跃时间"></el-table-column>
      </el-table>
      <pagination
        :total="total"
        :page.sync="queryParams.page"
        :limit.sync="queryParams.size"
        @pagination="onQuery"
      />
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">

</style>
