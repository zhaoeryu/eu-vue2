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
      this.$confirm(this.$t('role.addAuthUserDialog.confirm', {
        length: userIds.length
      }), this.$t('general.confirm.title'), {
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            batchAssignRole({
              roleId: this.roleId,
              userIds
            }).then(() => {
              this.$message.success(this.$t('role.addAuthUserDialog.success'))
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
  <el-dialog :title="$t('role.addAuthUserDialog.title')" :visible.sync="show" width="1000px" @close="onDialogClose" append-to-body>
    <div>
      <div class="page-body query-wrapper">
        <el-form :model="queryParams" :inline="true">
          <el-form-item :label="$t('role.addAuthUserDialog.query.nickname')">
            <el-input v-model="queryParams.nickname" :placeholder="$t('role.addAuthUserDialog.query.nickname.placeholder')" clearable />
          </el-form-item>
          <el-form-item :label="$t('role.addAuthUserDialog.query.mobile')">
            <el-input v-model="queryParams.mobile" :placeholder="$t('role.addAuthUserDialog.query.mobile.placeholder')" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="onQuery">{{ $t('general.query.search') }}</el-button>
            <el-button icon="el-icon-refresh" plain @click="onRefresh">{{ $t('general.query.reset') }}</el-button>
          </el-form-item>
        </el-form>
        <div v-permissions="['system:user:assignRole']">
          <el-button :disabled="multipleDisabled" type="primary" icon="el-icon-plus" plain @click="onBatchAuth">{{ $t('role.addAuthUserDialog.button.batchAuth') }}</el-button>
        </div>
      </div>
      <el-table
        ref="table"
        :data="list"
        @selection-change="onSelectionChange"
        style="width: 100%"
      >
        <el-table-column type="selection" :selectable="onSelectable"></el-table-column>
        <el-table-column prop="username" :label="$t('role.addAuthUserDialog.column.username')" width="100"></el-table-column>
        <el-table-column prop="nickname" :label="$t('role.addAuthUserDialog.column.nickname')" width="100"></el-table-column>
        <el-table-column prop="deptId" :label="$t('role.addAuthUserDialog.column.deptId')">
          <template #default="{ row }">
            <span>{{ convertToDeptName(row.deptId) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="mobile" :label="$t('role.addAuthUserDialog.column.mobile')"></el-table-column>
        <el-table-column prop="status" :label="$t('role.addAuthUserDialog.column.status')" width="80">
          <template v-slot:default="{ row }">
            <el-tag :type="row.status === 0 ? 'success' : 'danger'">{{ row.status === 0 ? $t('role.addAuthUserDialog.column.status.normal') : $t('role.addAuthUserDialog.column.status.disable') }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastActiveTime" :label="$t('role.addAuthUserDialog.column.lastActiveTime')"></el-table-column>
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
