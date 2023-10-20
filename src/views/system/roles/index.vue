<template>
  <div class="page-container">
    <div class="page-body">
      <query-expand-wrapper :show="isQueryShow">
        <el-form :model="queryParams" :inline="true">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="queryParams.roleName" placeholder="输入要查找的角色名称" maxlength="20" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="onQuery">查询</el-button>
            <el-button icon="el-icon-refresh" plain @click="onRefresh">重置</el-button>
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
            add: ['system:role:add'],
            del: ['system:role:del'],
            export: ['system:role:export'],
            import: ['system:role:import'],
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
          <el-table-column type="selection" :selectable="onSelectable"></el-table-column>
          <el-table-column prop="roleName" label="角色名称"></el-table-column>
          <el-table-column prop="description" label="角色描述"></el-table-column>
          <el-table-column prop="roleKey" label="权限字符串"></el-table-column>
          <el-table-column prop="status" label="状态">
            <template #default="{ row }">
              <el-tag v-if="row.status === 0">正常</el-tag>
              <el-tag v-else-if="row.status === 1" type="danger">禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column v-permissions="['system:role:edit', 'system:role:del']" label="操作" width="220">
            <template #default="{ row }">
              <template v-if="row.roleKey !== 'admin'">
                <el-button v-permissions="['system:role:edit']" type="text" @click="onRowUpdate(row)">修改</el-button>
                <el-button v-permissions="['system:role:del']" type="text" @click="onRowDelete(row)">删除</el-button>
                <el-button v-permissions="['system:role:edit']" type="text" @click="onRowRoleMember(row)">分配用户</el-button>
                <el-button v-permissions="['system:role:edit']" type="text" @click="onRowDataScope(row)">数据权限</el-button>
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

    <role-edit-dialog ref="roleEditDialog" @complete="onRefresh" />

    <role-user-drawer ref="roleUserDrawer" />
    <data-scope-dialog ref="dataScopeDialog" @complete="onRefresh" />
    <import-dialog
      ref="importDialog"
      upload-url="/api/system/role/import"
      tpl-export-url="/api/system/role/export-template"
      @complete="onRefresh"
    >
      <template #importTip>
        <li>状态字段可选项：正常、禁用</li>
      </template>
    </import-dialog>
  </div>
</template>

<script>
import { page, batchDel } from '@/api/system/role'
import RoleUserDrawer from '@/views/system/roles/RoleUserDrawer.vue'
import RoleEditDialog from '@/views/system/roles/RoleEditDialog.vue'
import DataScopeDialog from '@/views/system/roles/DataScopeDialog.vue'
import QueryExpandWrapper from '@/components/Crud/QueryExpandWrapper/index.vue'
import EuTableToolbar from '@/components/Crud/EuTableToolbar/index.vue'
import ImportDialog from '@/components/ImportDialog/index.vue'

export default {
  name: 'Roles',
  components: { ImportDialog, EuTableToolbar, QueryExpandWrapper, DataScopeDialog, RoleEditDialog, RoleUserDrawer },
  data() {
    return {
      loading: false,
      list: [],
      total: 0,
      queryParams: {
        roleName: null,
        page: 1,
        size: 10,
      },
      isQueryShow: true,
      multipleDisabled: true,
    }
  },

  mounted() {
    this.onRefresh()
  },
  methods: {
    onSelectable(row) {
      return row.roleKey !== 'admin'
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
    onExport() {
      this.download('/api/system/role/export', this.queryParams, `role_${new Date().getTime()}.xlsx`)
    },
    onImport() {
      this.$refs.importDialog.open()
    },
    onAdd() {
      this.$refs.roleEditDialog.open({
        status: 0
      })
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
    onSelectionChange(selection) {
      this.multipleDisabled = !selection.length
    },
    onRowUpdate(row) {
      this.$refs.roleEditDialog.open(row)
    },
    onRowDelete(row) {
      this.$confirm(`确认要删除"${ row.roleName }"吗？`, '提示', {
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
    onRowRoleMember(row) {
      this.$refs.roleUserDrawer.open(row)
    },
    onRowDataScope(row) {
      this.$refs.dataScopeDialog.open(row)
    }
  },
}
</script>

<style lang='scss' scoped>

</style>
