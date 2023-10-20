<template>
  <div class="page-container">
    <el-row :gutter="16">
      <el-col :md="4" :sm="6" :xs="24">
        <div class="page-body">
          <el-input placeholder="输入关键字进行过滤" v-model="deptFilterKeyword" style="margin-bottom: 12px;"></el-input>
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
              <el-form-item label="用户名称">
                <el-input v-model="queryParams.nickname" placeholder="输入要查找的用户名称" clearable />
              </el-form-item>
              <el-form-item label="手机号">
                <el-input v-model="queryParams.mobile" placeholder="输入要查找的手机号" clearable />
              </el-form-item>
              <el-form-item label="登录名">
                <el-input v-model="queryParams.username" placeholder="输入要查找的登录名" clearable />
              </el-form-item>
              <el-form-item label="最后活跃时间">
                <el-date-picker
                  v-model="queryParams.lastActiveTime"
                  type="datetimerange"
                  :picker-options="$DataTimeRangePickerOptions"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  align="right">
                </el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="onQuery">查询</el-button>
                <el-button icon="el-icon-refresh" @click="onRefresh">重置</el-button>
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
                  <el-switch v-model="row.status" :disabled="row.username === 'admin'" :active-value="0" :inactive-value="1" @change="onStatusChange(row)" />
                </template>
              </el-table-column>
              <el-table-column prop="lastActiveTime" label="最后活跃时间"></el-table-column>
              <el-table-column label="操作" fixed="right" width="150">
                <template v-slot:default="{ row }">
                  <template v-if="row.username !== 'admin'">
                    <el-button v-permissions="['system:user:edit']" type="text" @click="onRowUpdate(row)">修改</el-button>
                    <el-button v-permissions="['system:user:del']" type="text" @click="onRowDelete(row)">删除</el-button>
                    <el-dropdown v-permissions="['system:user:resetPwd', 'system:user:assignRole']" @command="(command) => onHandleCommand(command, row)" trigger="click" style="margin-left: 10px;">
                      <el-button type="text">更多</el-button>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-permissions="['system:user:resetPwd']" command="handleResetPwd" icon="el-icon-key">重置密码</el-dropdown-item>
                        <el-dropdown-item v-permissions="['system:user:assignRole']" command="handleAuthRole" icon="el-icon-circle-check">分配角色</el-dropdown-item>
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

  </div>
</template>

<script>
import {
  page,
  updateStatus,
  resetPwd,
  batchDel,
  getUserInfo
} from '@/api/system/user'
import { list as deptList } from '@/api/system/dept'
import { getParentFieldsByLeafId, handleTreeData } from '@/utils'
import ImportDialog from '@/components/ImportDialog/index.vue'
import AssignRoleDialog from '@/views/system/users/AssignRoleDialog.vue'
import UserEditDialog from '@/views/system/users/UserEditDialog.vue'
import QueryExpandWrapper from '@/components/Crud/QueryExpandWrapper/index.vue'
import EuTableToolbar from '@/components/Crud/EuTableToolbar/index.vue'
export default {
  name: 'Users',
  components: { EuTableToolbar, QueryExpandWrapper, UserEditDialog, AssignRoleDialog, ImportDialog },
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
      return row.username !== 'admin'
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
          this.onResetPassword(row);
          break;
        case 'handleAuthRole':
          this.onAssignRoles(row);
          break;
        default:
          break;
      }
    },
    onResetPassword(row) {
      this.$prompt(`请输入"${ row.nickname }"的新密码`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        inputPattern: /^.{6,20}$/,
        inputErrorMessage: '用户密码长度必须介于 6 ~ 20 之间',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            resetPwd(row.id, instance.inputValue).then(() => {
              this.$message.success(`密码重置成功，新密码是：${instance.inputValue}`);
              done()
            }).finally(() => {
              instance.confirmButtonLoading = false;
            })
          } else {
            done()
          }
        }
      })
    },
    onAssignRoles(row) {
      this.$refs.assignRoleDialog.open(row.id)
    },
    onRowDelete(row) {
      this.$confirm(`确认要删除"${ row.nickname }"吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            batchDel([row.id]).then(() => {
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
      this.$confirm(`确认要删除选中的${ids.length}条记录吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            batchDel(ids).then(() => {
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
    convertToDeptName(deptId) {
      return getParentFieldsByLeafId(this.deptTree, deptId, { fieldKey: 'deptName' }).join('/')
    },
    onStatusChange(row) {
      const status = row.status
      this.$confirm(`确认要${status === 0 ? '启用' : '禁用'}"${ row.nickname }"吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            updateStatus({
              id: row.id,
              status
            }).then(() => {
              this.$message.success(`${status === 0 ? '启用' : '禁用'}成功`)
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
