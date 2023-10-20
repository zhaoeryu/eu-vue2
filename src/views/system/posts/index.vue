<template>
  <div class="page-container">
    <div class="page-body">
      <query-expand-wrapper :show="isQueryShow">
        <el-form :model="queryParams" :inline="true">
          <el-form-item label="岗位名称">
            <el-input v-model="queryParams.postName" placeholder="输入要查找的岗位名称" />
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
            add: ['system:post:add'],
            del: ['system:post:del'],
            export: ['system:post:export'],
            import: ['system:post:import'],
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
          <el-table-column type="selection"></el-table-column>
          <el-table-column prop="postName" label="岗位名称"></el-table-column>
          <el-table-column prop="code" label="岗位编码"></el-table-column>
          <el-table-column prop="status" label="状态">
            <template #default="{ row }">
              <el-tag v-if="row.status === 0">正常</el-tag>
              <el-tag v-else-if="row.status === 1" type="danger">停用</el-tag>
            </template>
          </el-table-column>
          <el-table-column v-permissions="['system:post:edit', 'system:post:del']" label="操作">
            <template #default="{ row }">
              <el-button v-permissions="['system:post:edit']" type="text" @click="onRowUpdate(row)">修改</el-button>
              <el-button v-permissions="['system:post:del']" type="text" @click="onRowDelete(row)">删除</el-button>
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

    <post-edit-dialog ref="postEditDialog" @complete="onRefresh" />

    <import-dialog
      ref="importDialog"
      upload-url="/api/system/post/import"
      tpl-export-url="/api/system/post/export-template"
      @complete="onRefresh"
    >
      <template #importTip>
        <li>状态字段可选项：正常、禁用</li>
      </template>
    </import-dialog>
  </div>
</template>

<script>
import { page, batchDel } from '@/api/system/post'
import PostEditDialog from '@/views/system/posts/PostEditDialog.vue'
import QueryExpandWrapper from '@/components/Crud/QueryExpandWrapper/index.vue'
import EuTableToolbar from '@/components/Crud/EuTableToolbar/index.vue'
import ImportDialog from '@/components/ImportDialog/index.vue'
export default {
  name: 'Posts',
  components: { ImportDialog, EuTableToolbar, QueryExpandWrapper, PostEditDialog },
  data() {
    return {
      loading: false,
      list: [],
      total: 0,

      queryParams: {
        postName: null,
        page: 1,
        size: 10
      },

      isQueryShow: true,
      multipleDisabled: true,
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
      this.$refs.postEditDialog.open({
        status: 0
      })
    },
    onExport() {
      this.download('/api/system/post/export', this.queryParams, `post_${new Date().getTime()}.xlsx`)
    },
    onImport() {
      this.$refs.importDialog.open()
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
      this.$refs.postEditDialog.open(row)
    },
    onRowDelete(row) {
      this.$confirm(`确认要删除"${ row.postName }"吗？`, '提示', {
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
    }
  },
}
</script>
