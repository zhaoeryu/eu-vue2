<template>
  <el-drawer
    :title="pageTitle"
    :visible.sync="show"
    size="800px"
    direction="rtl"
  >
    <query-expand-wrapper :show="isQueryShow">
      <el-form :model="queryParams" :inline="true">
        <el-form-item label="字典KEY" prop="dictKey">
          <el-input v-model="queryParams.dictKey" placeholder="输入要查找的字典KEY" maxlength="30" />
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
          add: ['system:dict-detail:add'],
          del: ['system:dict-detail:del'],
          export: ['system:dict-detail:export'],
          import: ['system:dict-detail:import'],
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
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="dictLabel" label="字典Label"></el-table-column>
        <el-table-column prop="dictValue" label="字典Value"></el-table-column>
        <el-table-column prop="sortNum" label="字典排序"></el-table-column>
        <el-table-column prop="status" label="是否启用">
          <template #default="{ row }">
            <el-tag v-if="row.status === 0">正常</el-tag>
            <el-tag v-else type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column v-permissions="['system:dict-detail:edit', 'system:dict-detail:del']" label="操作">
          <template #default="{ row }">
            <el-button v-permissions="['system:dict-detail:edit']" type="text" @click="onRowUpdate(row)">修改</el-button>
            <el-button v-permissions="['system:dict-detail:del']" type="text" @click="onRowDelete(row)">删除</el-button>
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

    <dict-detail-edit-dialog ref="dictDetailEditDialog" @complete="onRefresh" />
    <import-dialog
      ref="importDialog"
      :req-data="{
        dictId,
        dictKey
      }"
      upload-url="/api/system/dict-detail/import"
      tpl-export-url="/api/system/dict-detail/export-template"
      @complete="onRefresh"
    />
  </el-drawer>
</template>

<script>
import { page, batchDel } from '@/api/system/dictDetail'
import DictDetailEditDialog from '@/views/system/dicts/DictDetailEditDialog.vue'
import QueryExpandWrapper from '@/components/Crud/QueryExpandWrapper/index.vue'
import EuTableToolbar from '@/components/Crud/EuTableToolbar/index.vue'
import ImportDialog from '@/components/ImportDialog/index.vue'

export default {
  name: 'DictDetailDrawer',
  components: { ImportDialog, EuTableToolbar, QueryExpandWrapper, DictDetailEditDialog },
  data() {
    return {
      show: false,
      dictId: null,
      dictKey: null,
      loading: false,

      list: [],
      total: 0,
      queryParams: {
        dictKey: null,
        page: 1,
        size: 10
      },

      isQueryShow: true,
      multipleDisabled: true
    }
  },
  computed: {
    pageTitle() {
      return `字典详情${this.dictKey ? ` - ${this.dictKey}` : ''}`
    }
  },
  methods: {
    open(dictId, dictKey) {
      // 重置组件数据
      Object.assign(this.$data, this.$options.data())

      this.dictId = dictId
      this.dictKey = dictKey
      this.show = true

      this.onRefresh()
    },
    onQuery() {
      this.loading = true
      const reqPayload = {
        pid: this.dictId,
        ...this.queryParams
      }
      page(reqPayload).then(res => {
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
    onAdd() {
      this.$refs.dictDetailEditDialog.open({
        pid: this.dictId,
        status: 0,
        dictKey: this.dictKey
      })
    },
    onExport() {
      this.download('/api/system/dict-detail/export', {
        pid: this.dictId,
        ...this.queryParams
      }, `dictDetail_${new Date().getTime()}.xlsx`)
    },
    onImport() {
      this.$refs.importDialog.open()
    },
    onSelectionChange(selection) {
      this.multipleDisabled = !selection.length
    },
    onRowUpdate(row) {
      this.$refs.dictDetailEditDialog.open(row)
    },
    onRowDelete(row) {
      this.$confirm(`确定要删除字典"${ row.dictLabel }"吗？`, {
        title: '提示',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            batchDel([row.id]).then(() => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.onRefresh()
            }).finally(() => {
              instance.confirmButtonLoading = false
            })
          }
          done()
        }
      })
    },
    onBatchDel() {
      const ids = this.$refs.table.selection.map(item => item.id)
      this.$confirm(`确定要删除选中的${ids.length}个字典吗？`, {
        title: '提示',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            batchDel(ids).then(() => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.onRefresh()
            }).finally(() => {
              instance.confirmButtonLoading = false
            })
          }
          done()
        }
      })
    }
  },
}
</script>

<style lang='scss' scoped>
::v-deep .el-drawer__body {
  padding: 0 16px 16px;
}
</style>
