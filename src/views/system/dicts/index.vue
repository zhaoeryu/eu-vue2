<template>
  <div class="page-container">
    <div class="page-body">
      <query-expand-wrapper :show="isQueryShow">
        <el-form :model="queryParams" :inline="true">
          <el-form-item label="字典KEY" prop="dictKey">
            <el-input v-model="queryParams.dictKey" placeholder="输入要查找的字典KEY" />
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
            add: ['system:dict:add'],
            del: ['system:dict:del'],
            export: ['system:dict:export'],
            import: ['system:dict:import'],
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
          <el-table-column prop="dictKey" label="字典KEY"></el-table-column>
          <el-table-column prop="remark" label="备注"></el-table-column>
          <el-table-column prop="status" label="是否启用">
            <template #default="{ row }">
              <el-tag v-if="row.status === 0">正常</el-tag>
              <el-tag v-else type="danger">禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column v-permissions="['system:dict-detail:list', 'system:dict:edit', 'system:dict:del']" label="操作">
            <template #default="{ row }">
              <el-button v-permissions="['system:dict-detail:list']" type="text" @click="onRowDetail(row)">详情</el-button>
              <el-button v-permissions="['system:dict:edit']" type="text" @click="onRowUpdate(row)">修改</el-button>
              <el-button v-permissions="['system:dict:del']" type="text" @click="onRowDelete(row)">删除</el-button>
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

    <dict-edit-dialog ref="dictEditDialog" @complete="onRefresh" />

    <dict-detail-drawer ref="detailDrawer" />

    <import-dialog
      ref="importDialog"
      upload-url="/api/system/dict/import"
      tpl-export-url="/api/system/dict/export-template"
      @complete="onRefresh"
    />
  </div>
</template>

<script>
import DictDetailDrawer from '@/views/system/dicts/DictDetailDrawer.vue'
import { page, batchDel } from '@/api/system/dict'
import DictEditDialog from '@/views/system/dicts/DictEditDialog.vue'
import QueryExpandWrapper from '@/components/Crud/QueryExpandWrapper/index.vue'
import EuTableToolbar from '@/components/Crud/EuTableToolbar/index.vue'
import ImportDialog from '@/components/ImportDialog/index.vue'

export default {
  name: 'Dicts',
  components: { ImportDialog, EuTableToolbar, QueryExpandWrapper, DictEditDialog, DictDetailDrawer },
  data() {
    return {
      loading: false,
      list: [],
      total: 0,

      queryParams: {
        dictKey: null,
        page: 1,
        size: 10,
      },

      isQueryShow: true,
      multipleDisabled: true
    }
  },
  mounted() {
    this.onRefresh()
  },
  methods: {
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
    onAdd() {
      this.$refs.dictEditDialog.open({
        status: 0
      })
    },
    onExport() {
      this.download('/api/system/dict/export', this.queryParams, `dict_${new Date().getTime()}.xlsx`)
    },
    onImport() {
      this.$refs.importDialog.open()
    },
    onBatchDel() {
      const ids = this.$refs.table.selection.map(item => item.id)
      this.$confirm(`确定删除选中的${ids.length}个字典吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        batchDel(ids).then(() => {
          this.$message.success('删除成功！')
          this.onRefresh()
        })
      })
    },
    onSelectionChange(selection) {
      this.multipleDisabled = !selection.length
    },
    onRowUpdate(row) {
      this.$refs.dictEditDialog.open(row)
    },
    onRowDetail(row) {
      this.$refs.detailDrawer.open(row.id, row.dictKey)
    },
    onRowDelete(row) {
      this.$confirm(`确定要删除字典"${ row.dictKey }"吗？`, {
        title: '提示',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        batchDel([row.id]).then(() => {
          this.$message.success('删除成功！')
          this.onRefresh()
        })
      }).catch(() => {
        // nothing
      })
    }
  },
}
</script>
