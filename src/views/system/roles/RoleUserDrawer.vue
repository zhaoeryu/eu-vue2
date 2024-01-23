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
      let title = this.$t('role.userDrawer.title')
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
      this.$confirm(this.$t('role.userDrawer.cancelAuthConfirm', {
        length: ids.length
      }), this.$t('general.confirm.title'), {
        confirmButtonText: this.$t('general.confirm.confirm'),
        cancelButtonText: this.$t('general.confirm.cancel'),
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            cancelAuth({
              roleId: this.roleId,
              userIds: ids
            }).then(() => {
              this.$message.success(this.$t('general.confirm.delete.success'))
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
      this.$confirm(this.$t('role.userDrawer.cancelAuthConfirm.single', {
        username: row.username
      }), this.$t('general.confirm.title'), {
        confirmButtonText: this.$t('general.confirm.confirm'),
        cancelButtonText: this.$t('general.confirm.cancel'),
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            cancelAuth({
              roleId: this.roleId,
              userIds: [row.id]
            }).then(() => {
              this.$message.success(this.$t('role.userDrawer.cancelAuthSuccess'))
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
          <el-form-item :label="$t('role.userDrawer.query.nickname')">
            <el-input v-model="queryParams.nickname" :placeholder="$t('role.userDrawer.query.nickname.placeholder')" clearable />
          </el-form-item>
          <el-form-item :label="$t('role.userDrawer.query.mobile')">
            <el-input v-model="queryParams.mobile" :placeholder="$t('role.userDrawer.query.mobile.placeholder')" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="onQuery">{{ $t('general.query.search') }}</el-button>
            <el-button icon="el-icon-refresh" plain @click="onRefresh">{{ $t('general.query.reset') }}</el-button>
          </el-form-item>
        </el-form>
      </query-expand-wrapper>

      <div v-loading="loading">
        <eu-table-toolbar
          :opt-show="{
            add: false,
            del: false,
            export: false,
            sort: false,
            import: false
          }"
          :ref-table="$refs.table"
          @refresh="onRefresh"
          :searchToggle.sync="isQueryShow"
        >
          <template #left>
            <template v-permissions="['system:user:assignRole']">
              <el-button type="primary" icon="el-icon-plus" plain @click="onAdd">{{ $t('role.userDrawer.button.addAuthUser') }}</el-button>
              <el-button :disabled="multipleDisabled" type="danger" icon="el-icon-delete" plain @click="onBatchDel">{{ $t('role.userDrawer.button.batch.cancelAuth') }}</el-button>
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
          <el-table-column prop="username" :label="$t('role.userDrawer.column.username')" width="100"></el-table-column>
          <el-table-column prop="nickname" :label="$t('role.userDrawer.column.nickname')" width="100"></el-table-column>
          <el-table-column prop="deptId" :label="$t('role.userDrawer.column.deptId')">
            <template #default="{ row }">
              <span>{{ convertToDeptName(row.deptId) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="mobile" :label="$t('role.userDrawer.column.mobile')"></el-table-column>
          <el-table-column prop="status" :label="$t('role.userDrawer.column.status')" width="80">
            <template v-slot:default="{ row }">
              <el-tag :type="row.status === 0 ? 'success' : 'danger'">{{ row.status === 0 ? $t('role.userDrawer.column.status.normal') : $t('role.userDrawer.column.status.disable') }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="lastActiveTime" :label="$t('role.userDrawer.column.lastActiveTime')"></el-table-column>
          <el-table-column v-permissions="['system:user:assignRole']" :label="$t('general.column.operation')" fixed="right" width="150">
            <template v-slot:default="{ row }">
              <el-button type="text" size="small" @click="onCancelAuth(row)">{{ $t('role.userDrawer.button.cancelAuth.title') }}</el-button>
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
