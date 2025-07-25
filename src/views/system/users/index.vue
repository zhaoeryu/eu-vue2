<template>
  <div class="page-container">
    <el-row :gutter="16">
      <el-col :md="4" :sm="6" :xs="24">
        <div class="page-body">
          <el-input :placeholder="$t('user.query.deptKeyword.placeholder')" v-model="deptFilterKeyword" style="margin-bottom: 12px;"></el-input>
          <el-tree
            ref="deptTree"
            v-loading="deptLoading"
            :data="deptTree"
            :props="{ label: 'deptName', children: 'children' }"
            node-key="id"
            default-expand-all
            :highlight-current="true"
            :expand-on-click-node="false"
            :filter-node-method="onFilterNode"
            @node-click="onDeptTreeClick"
          ></el-tree>
        </div>
      </el-col>
      <el-col :md="20" :sm="18" :xs="24">
        <div class="page-body">
          <query-expand-wrapper :show="isQueryShow">
            <el-form :model="queryParams" :inline="true">
              <el-form-item :label="$t('user.query.nickname')">
                <el-input v-model="queryParams.nickname" :placeholder="$t('user.query.nickname.placeholder')" clearable />
              </el-form-item>
              <el-form-item :label="$t('user.query.mobile')">
                <el-input v-model="queryParams.mobile" :placeholder="$t('user.query.mobile.placeholder')" clearable />
              </el-form-item>
              <el-form-item :label="$t('user.query.username')">
                <el-input v-model="queryParams.username" :placeholder="$t('user.query.username.placeholder')" clearable />
              </el-form-item>
              <el-form-item :label="$t('user.query.lastActiveTime')">
                <el-date-picker
                  v-model="queryParams.lastActiveTime"
                  type="datetimerange"
                  :picker-options="$DataTimeRangePickerOptions"
                  range-separator="~"
                  :start-placeholder="$t('user.query.lastActiveTime.start-placeholder')"
                  :end-placeholder="$t('user.query.lastActiveTime.end-placeholder')"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  align="right">
                </el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="onQuery">{{ $t('general.query.search') }}</el-button>
                <el-button icon="el-icon-refresh" @click="onRefresh">{{ $t('general.query.reset') }}</el-button>
              </el-form-item>
            </el-form>
          </query-expand-wrapper>

          <div v-loading="loading">
            <eu-table-toolbar
              :multiple-disabled="multipleDisabled"
              :opt-show="{
                sort: false
              }"
              :permission="{
                add: ['system:user:add'],
                del: ['system:user:del'],
                export: ['system:user:export'],
                import: ['system:user:import'],
              }"
              :ref-table="$refs.table"
              @add="onAdd"
              @batchDel="onBatchDel"
              @export="onExport"
              @import="onImport"
              @refresh="onRefresh"
              :searchToggle.sync="isQueryShow"
            />
            <el-table
              ref="table"
              :data="list"
              @selection-change="onSelectionChange"
              style="width: 100%"
            >
              <el-table-column type="selection" label="#" :selectable="onSelectable"></el-table-column>
              <el-table-column prop="username" :label="$t('user.column.username')" width="100"></el-table-column>
              <el-table-column prop="nickname" :label="$t('user.column.nickname')" width="100"></el-table-column>
              <el-table-column prop="deptId" :label="$t('user.column.deptId')">
                <template #default="{ row }">
                  <span>{{ convertToDeptName(row.deptId) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="mobile" :label="$t('user.column.mobile')"></el-table-column>
              <el-table-column prop="status" :label="$t('user.column.status')" width="80">
                <template v-slot:default="{ row }">
                  <el-switch v-model="row.status" :disabled="row.admin === 1" :active-value="0" :inactive-value="1" @change="onStatusChange(row)" />
                </template>
              </el-table-column>
              <el-table-column prop="lastActiveTime" :label="$t('user.column.lastActiveTime')"></el-table-column>
              <el-table-column :label="$t('general.column.operation')" fixed="right" width="150">
                <template v-slot:default="{ row }">
                  <template v-if="row.admin !== 1">
                    <el-button v-permissions="['system:user:edit']" type="text" @click="onRowUpdate(row)">{{ $t('general.edit') }}</el-button>
                    <el-button v-permissions="['system:user:del']" type="text" @click="onRowDelete(row)">{{ $t('general.del') }}</el-button>
                    <el-dropdown v-permissions="['system:user:resetPwd', 'system:user:assignRole']" @command="(command) => onHandleCommand(command, row)" trigger="click" style="margin-left: 10px;">
                      <el-button type="text">{{ $t('user.column.operation.more') }}</el-button>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-permissions="['system:user:resetPwd']" command="handleResetPwd" icon="el-icon-key">
                          {{ $t('user.column.operation.resetPwd') }}</el-dropdown-item>
                        <el-dropdown-item v-permissions="['system:user:assignRole']" command="handleAuthRole" icon="el-icon-circle-check">
                          {{ $t('user.column.operation.assignRole') }}</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
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
        </div>
      </el-col>
    </el-row>

    <user-edit-dialog ref="userEditDialog" @complete="onRefresh" />

    <import-dialog
      ref="importDialog"
      upload-url="/api/system/user/import"
      tpl-export-url="/api/system/user/export-template"
      @complete="onRefresh"
    />

    <assign-role-dialog
      ref="assignRoleDialog"
      @success="onRefresh"
    />
    <reset-password-dialog ref="resetPasswordDialog" />

  </div>
</template>

<script>
import {
  page,
  updateStatus,
  batchDel,
  getUserInfo
} from '@/api/system/user'
import { list as deptList } from '@/api/system/dept'
import { getParentFieldsByLeafId, handleTreeData } from '@/utils'
import ImportDialog from '@/components/ImportDialog/index.vue'
import AssignRoleDialog from '@/views/system/users/AssignRoleDialog.vue'
import UserEditDialog from '@/views/system/users/UserEditDialog.vue'
import ResetPasswordDialog from '@/views/system/users/ResetPasswordDialog.vue'
export default {
  name: 'Users',
  components: { ResetPasswordDialog, UserEditDialog, AssignRoleDialog, ImportDialog },
  data() {
    return {
      list: [],
      total: 0,
      loading: false,
      isQueryShow: true,

      queryParams: {
        deptId: null,
        nickname: null,
        mobile: null,
        username: null,
        lastActiveTime: null,

        page: 1,
        size: 10,
      },

      multipleDisabled: true,

      deptTree: [],
      deptLoading: false,
      deptFilterKeyword: null,

      deptList: [],

    }
  },
  watch: {
    // 根据名称筛选部门树
    deptFilterKeyword(val) {
      this.$refs.deptTree.filter(val);
    }
  },
  mounted() {
    this.onRefresh()
    this.onDeptQuery()
  },
  methods: {
    onSelectable(row) {
      return row.admin !== 1
    },
    onFilterNode(value, node) {
      if (!value) {
        return true
      }
      return node.deptName.indexOf(value) !== -1;
    },
    onDeptTreeClick(node) {
      this.queryParams.deptId = node.id
      this.queryParams.page = this.$options.data().queryParams.page
      this.queryParams.size = this.$options.data().queryParams.size
      this.onQuery()
    },
    onDeptQuery() {
      this.deptLoading = true
      deptList().then(res => {
        this.deptList = res.data
        this.deptTree = handleTreeData(this.deptList)
      }).finally(() => {
        this.deptLoading = false
      })
    },
    onQuery() {
      this.loading = true
      page(this.queryParams).then(res => {
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
    onHandleCommand(command, row) {
      switch (command) {
        case 'handleResetPwd':
          this.$refs.resetPasswordDialog.open(row.id)
          break;
        case 'handleAuthRole':
          this.onAssignRoles(row);
          break;
        default:
          break;
      }
    },
    onAssignRoles(row) {
      this.$refs.assignRoleDialog.open(row.id)
    },
    onRowDelete(row) {
      this.$confirm(this.$t('general.confirm.delete.message', { key: row.nickname }), this.$t('general.confirm.title'), {
        confirmButtonText: this.$t('general.confirm.confirm'),
        cancelButtonText: this.$t('general.confirm.cancel'),
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            batchDel([row.id]).then(() => {
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
    onRowUpdate(row) {
      // 加载用户的岗位和角色
      getUserInfo(row.id).then(res => {
        const data = JSON.parse(JSON.stringify(row))
        data._deptIds = getParentFieldsByLeafId(this.deptTree, row.deptId, {
          fieldKey: 'id'
        })
        data.postIds = res.data.postIds || []
        data.roleIds = res.data.roleIds || []
        this.$refs.userEditDialog.open(data, this.deptTree)
      })
    },
    onSelectionChange(selection) {
      this.multipleDisabled = !selection.length
    },
    onAdd() {
      this.$refs.userEditDialog.open({
        sex: 1,
        status: 0
      }, this.deptTree)
    },
    onBatchDel() {
      const ids = this.$refs.table.selection.map(item => item.id)
      this.$confirm(this.$t('general.confirm.delete.batch.message', { length: ids.length }), this.$t('general.confirm.title'), {
        confirmButtonText: this.$t('general.confirm.confirm'),
        cancelButtonText: this.$t('general.confirm.cancel'),
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            batchDel(ids).then(() => {
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
    convertToDeptName(deptId) {
      return getParentFieldsByLeafId(this.deptTree, deptId, { fieldKey: 'deptName' }).join('/')
    },
    onStatusChange(row) {
      const status = row.status
      this.$confirm(this.$t('user.confirm.toggleStatus.message', {
        status: status === 0 ? '启用' : '禁用',
        nickname: row.nickname
      }), this.$t('general.confirm.title'), {
        confirmButtonText: this.$t('general.confirm.confirm'),
        cancelButtonText: this.$t('general.confirm.cancel'),
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            updateStatus({
              id: row.id,
              status
            }).then(() => {
              this.$message.success(this.$t('user.confirm.toggleStatus.success', {
                status: status === 0 ? '启用' : '禁用'
              }))
              done()
              this.onRefresh()
            }).finally(() => {
              instance.confirmButtonLoading = false;
            })
          } else {
            done()
          }
        }
      }).catch(() => {
        row.status = status === 0 ? 1 : 0
      });
    },
    onExport() {
      this.download('/api/system/user/export', this.queryParams, `user_${new Date().getTime()}.xlsx`)
    },
    onImport() {
      this.$refs.importDialog.open()
    }
  },
}
</script>
