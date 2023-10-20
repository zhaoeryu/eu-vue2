<script>
import AddAuthUserDialog from '@/views/system/roles/AddAuthUserDialog.vue'
import { cancelAuth, roleUserList } from '@/api/system/user'
import { list as deptList } from '@/api/system/dept'
import { getParentFieldsByLeafId, handleTreeData } from '@/utils'
import QueryExpandWrapper from '@/components/Crud/QueryExpandWrapper/index.vue'
import EuTableToolbar from '@/components/Crud/EuTableToolbar/index.vue'

export default {
  name: 'RoleUserDrawer',
  components: { EuTableToolbar, QueryExpandWrapper, AddAuthUserDialog },
  data() {
    return {
      show: false,

      queryParams: {
        nickname: null,
        mobile: null,
        roleId: null,
        hasRole: 1,
        page: 1,
        size: 10
      },
      loading: false,
      total: 0,
      list: [],
      isQueryShow: true,
      multipleDisabled: true,

      deptTree: [],

      roleId: null,
      role: {}
    }
  },
  computed: {
    title() {
      let title = '分配用户'
      if (this.role.roleName) {
        title += ` - ${this.role.roleName}`
      }
      return title
    }
  },
  methods: {
    open(role) {
      Object.assign(this.$data, this.$options.data())
      this.role = role
      this.roleId = role.id
      this.show = true

      this.onDeptQuery()
      this.onRefresh()
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
    onSelectionChange(selection) {
      this.multipleDisabled = !selection.length
    },
    onAdd() {
      this.$refs.addAuthUserDialog.open(this.roleId)
    },
    onBatchDel() {
      const ids = this.$refs.table.selection.map(item => item.id)
      this.$confirm(`确认要取消授权选中的${ids.length}条记录吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            cancelAuth({
              roleId: this.roleId,
              userIds: ids
            }).then(() => {
              this.$message.success('删除成功')
              done()
              this.onRefresh()
            }).finally(() => {
              instance.confirmButtonLoading = false;
            })
          } else {
            done()
          }
        }
      });
    },
    onSelectable(row) {
      return row.username !== 'admin'
    },
    onDeptQuery() {
      deptList().then(res => {
        this.deptTree = handleTreeData(res.data || [])
      })
    },
    convertToDeptName(deptId) {
      return getParentFieldsByLeafId(this.deptTree, deptId, { fieldKey: 'deptName' }).join('/')
    },
    onCancelAuth(row) {
      this.$confirm(`确认要取消授权用户【${row.username}】吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            cancelAuth({
              roleId: this.roleId,
              userIds: [row.id]
            }).then(() => {
              this.$message.success('取消授权成功')
              done()
              this.onRefresh()
            }).finally(() => {
              instance.confirmButtonLoading = false;
            })
          } else {
            done()
          }
        }
      });
    }
  }
}
</script>

<template>
  <el-drawer
    :title="title"
    :visible.sync="show"
    size="900px"
    direction="rtl"
  >
    <div class="page-container">
      <query-expand-wrapper :show="isQueryShow">
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
      </query-expand-wrapper>

      <div v-loading="loading">
        <eu-table-toolbar
          :opt-show="{
            add: false,
            del: false,
            export: false,
            sort: false
          }"
          :ref-table="$refs.table"
          @refresh="onRefresh"
          :searchToggle.sync="isQueryShow"
        >
          <template #left>
            <template v-permissions="['system:user:assignRole']">
              <el-button type="primary" icon="el-icon-plus" plain @click="onAdd">添加授权用户</el-button>
              <el-button :disabled="multipleDisabled" type="danger" icon="el-icon-delete" plain @click="onBatchDel">批量取消授权</el-button>
            </template>
          </template>
        </eu-table-toolbar>
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
          <el-table-column v-permissions="['system:user:assignRole']" label="操作" fixed="right" width="150">
            <template v-slot:default="{ row }">
              <el-button type="text" size="small" @click="onCancelAuth(row)">取消授权</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          :total="total"
          :page.sync="queryParams.page"
          :limit.sync="queryParams.size"
          @pagination="onQuery"
        />
      </div>

      <add-auth-user-dialog ref="addAuthUserDialog" @complete="onRefresh" />
    </div>
  </el-drawer>
</template>

<style scoped lang="scss">

</style>
