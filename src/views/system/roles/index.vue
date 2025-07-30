<template>
  <div class="page-container">
    <div class="page-body">
      <query-expand-wrapper :show="isQueryShow">
        <el-form :model="queryParams" :inline="true">
          <el-form-item :label="$t('role.query.roleName')" prop="roleName">
            <el-input v-model="queryParams.roleName" :placeholder="$t('role.query.roleName.placeholder')" maxlength="20" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="onQuery">{{ $t('general.query.search') }}</el-button>
            <el-button icon="el-icon-refresh" plain @click="onRefresh">{{ $t('general.query.reset') }}</el-button>
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
          <el-table-column prop="roleName" :label="$t('role.column.roleName')"></el-table-column>
          <el-table-column prop="description" :label="$t('role.column.description')"></el-table-column>
          <el-table-column prop="roleKey" :label="$t('role.column.roleKey')"></el-table-column>
          <el-table-column prop="status" :label="$t('role.column.status')">
            <template #default="{ row }">
              <el-tag v-if="row.status === 0">{{ $t('role.column.status.normal') }}</el-tag>
              <el-tag v-else-if="row.status === 1" type="danger">{{ $t('role.column.status.disable') }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column v-permissions="['system:role:edit', 'system:role:del']" :label="$t('general.column.operation')" width="220">
            <template #default="{ row }">
              <template v-if="row.roleKey !== 'admin'">
                <el-button v-permissions="['system:role:edit']" type="text" @click="onRowUpdate(row)">{{ $t('general.edit') }}</el-button>
                <el-button v-permissions="['system:role:del']" type="text" @click="onRowDelete(row)">{{ $t('general.del') }}</el-button>
                <el-button v-permissions="['system:role:edit']" type="text" @click="onRowRoleMember(row)">{{ $t('role.button.roleMember') }}</el-button>
                <el-button v-permissions="['system:role:edit']" type="text" @click="onRowDataScope(row)">{{ $t('role.button.dataScope') }}</el-button>
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
        <li>{{ $t('role.importDialog.tip') }}</li>
      </template>
    </import-dialog>
  </div>
</template>

<script>
import { page, batchDel } from '@/api/system/role'
import RoleUserDrawer from '@/views/system/roles/RoleUserDrawer.vue'
import RoleEditDialog from '@/views/system/roles/RoleEditDialog.vue'
import DataScopeDialog from '@/views/system/roles/DataScopeDialog.vue'
import ImportDialog from '@/components/ImportDialog/index.vue'

export default {
  name: 'Roles',
  components: { ImportDialog, DataScopeDialog, RoleEditDialog, RoleUserDrawer },
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
      this.$download('/api/system/role/export', this.queryParams, `role_${new Date().getTime()}.xlsx`)
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
      this.$confirm(this.$t('general.confirm.delete.batch.message', {
        length: ids.length
      }), this.$t('general.confirm.title'), {
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
    onSelectionChange(selection) {
      this.multipleDisabled = !selection.length
    },
    onRowUpdate(row) {
      this.$refs.roleEditDialog.open(row)
    },
    onRowDelete(row) {
      this.$confirm(this.$t('general.confirm.delete.message', {
        key: row.roleName
      }), this.$t('general.confirm.title'), {
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
