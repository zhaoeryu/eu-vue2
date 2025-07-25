<template>
  <el-drawer
    :title="pageTitle"
    :visible.sync="show"
    size="800px"
    direction="rtl"
  >
    <query-expand-wrapper :show="isQueryShow">
      <el-form :model="queryParams" :inline="true">
        <el-form-item :label="$t('dict.detail.query.dictKey')" prop="dictKey">
          <el-input v-model="queryParams.dictKey" :placeholder="$t('dict.detail.query.dictKey.placeholder')" maxlength="30" />
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
        <el-table-column prop="dictLabel" :label="$t('dict.detail.column.dictLabel')"></el-table-column>
        <el-table-column prop="dictValue" :label="$t('dict.detail.column.dictValue')"></el-table-column>
        <el-table-column prop="sortNum" :label="$t('dict.detail.column.sortNum')"></el-table-column>
        <el-table-column prop="status" :label="$t('dict.detail.column.status')">
          <template #default="{ row }">
            <el-tag v-if="row.status === 0">{{ $t('dict.detail.column.status.normal') }}</el-tag>
            <el-tag v-else type="danger">{{ $t('dict.detail.column.status.disable') }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" :label="$t('dict.detail.column.remark')"></el-table-column>
        <el-table-column v-permissions="['system:dict-detail:edit', 'system:dict-detail:del']" :label="$t('general.column.operation')">
          <template #default="{ row }">
            <el-button v-permissions="['system:dict-detail:edit']" type="text" @click="onRowUpdate(row)">
              {{ $t('general.edit') }}</el-button>
            <el-button v-permissions="['system:dict-detail:del']" type="text" @click="onRowDelete(row)">
              {{ $t('general.del') }}</el-button>
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
import ImportDialog from '@/components/ImportDialog/index.vue'

export default {
  name: 'DictDetailDrawer',
  components: { ImportDialog, DictDetailEditDialog },
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
        size: 10,
        sort: 'sort_num,asc'
      },

      isQueryShow: true,
      multipleDisabled: true
    }
  },
  computed: {
    pageTitle() {
      return this.$t('dict.detail.title') + `${this.dictKey ? ` - ${this.dictKey}` : ''}`
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
      this.$confirm(this.$t('dict.detail.confirm.delete.title', { dictLabel: row.dictLabel }), {
        title: this.$t('general.confirm.title'),
        confirmButtonText: this.$t('general.confirm.confirm'),
        cancelButtonText: this.$t('general.confirm.cancel'),
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            batchDel([row.id]).then(() => {
              this.$message({
                type: 'success',
                message: this.$t('general.confirm.delete.success')
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
      this.$confirm(this.$t('dict.detail.confirm.delete.batch.title', { length: ids.length }), {
        title: this.$t('general.confirm.title'),
        confirmButtonText: this.$t('general.confirm.confirm'),
        cancelButtonText: this.$t('general.confirm.cancel'),
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            batchDel(ids).then(() => {
              this.$message({
                type: 'success',
                message: this.$t('general.confirm.delete.success')
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
