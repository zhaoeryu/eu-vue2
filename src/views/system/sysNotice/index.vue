<template>
  <div class="page-container">
    <div class="page-body">
      <query-expand-wrapper :show="isQueryShow">
        <el-form :model="queryParams" :inline="true">
          <el-form-item label="标题" prop="title">
            <el-input v-model="queryParams.title" placeholder="请输入标题" clearable />
          </el-form-item>
          <el-form-item label="公告类型" prop="type">
            <el-select v-model="queryParams.type" placeholder="请选择公告类型" clearable filterable>
              <el-option v-for="item in noticeTypeEnums" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="公告状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="请选择公告状态" clearable filterable>
              <el-option label="正常" :value="0" />
              <el-option label="禁用" :value="1" />
            </el-select>
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
            import: false
          }"
          :permission="{
            add: ['system:sysNotice:add'],
            del: ['system:sysNotice:del'],
            export: ['system:sysNotice:export'],
          }"
          :sort.sync="queryParams.sort"
          :ref-table="$refs.table"
          @add="onAdd"
          @batchDel="onBatchDel"
          @export="onExport"
          @refresh="onRefresh"
          :searchToggle.sync="isQueryShow"
          @sort="onSortComplete"
        />
        <el-table
          ref="table"
          :data="list"
          @selection-change="onSelectionChange"
          style="width: 100%"
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column prop="title" label="标题"></el-table-column>
          <el-table-column prop="type" label="公告类型">
            <template #default="{ row }">
              <el-tag>{{ parseRowType(row) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="公告描述"></el-table-column>
          <el-table-column prop="status" label="公告状态">
            <template #default="{ row }">
              <el-tag v-if="row.status === 0">正常</el-tag>
              <el-tag v-else type="danger">禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间"></el-table-column>
          <el-table-column prop="updateTime" label="修改时间"></el-table-column>
          <el-table-column v-permissions="['system:sysNotice:edit', 'system:sysNotice:del']" label="操作">
            <template #default="{ row }">
              <el-button v-permissions="['system:sysNotice:edit']" type="text" @click="onRowUpdate(row)">修改</el-button>
              <el-button v-permissions="['system:sysNotice:del']" type="text" @click="onRowDelete(row)">删除</el-button>
              <el-button type="text" @click="onRowDetail(row)">详情</el-button>
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

    <sys-notice-edit-dialog ref="sysNoticeEditDialog" @complete="onRefresh" />
    <sys-notice-view-dialog ref="sysNoticeViewDialog" />

  </div>
</template>

<script>
import { page, batchDel } from '@/api/system/sysNotice'
import SysNoticeEditDialog from './SysNoticeEditDialog.vue'
import QueryExpandWrapper from '@/components/Crud/QueryExpandWrapper/index.vue'
import EuTableToolbar from '@/components/Crud/EuTableToolbar/index.vue'
import SysNoticeViewDialog from '@/views/system/sysNotice/SysNoticeViewDialog.vue'
import { NoticeTypeEnums } from '@/utils/enums'
export default {
  name: 'SysNotice',
  components: { SysNoticeViewDialog, EuTableToolbar, QueryExpandWrapper, SysNoticeEditDialog },
  data() {
    return {
      loading: false,
      list: [],
      total: 0,

      queryParams: {
        title: null,
        type: null,
        status: null,
        page: 1,
        size: 10,
        sort: ['create_time,desc']
      },

      isQueryShow: true,
      multipleDisabled: true,

      noticeTypeEnums: NoticeTypeEnums
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
      this.$refs.sysNoticeEditDialog.open({
        status: 0
      })
    },
    onExport() {
      this.download('/api/system/sysNotice/export', this.queryParams, `通知公告_${new Date().getTime()}.xlsx`)
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
      this.$refs.sysNoticeEditDialog.open(row)
    },
    onRowDelete(row) {
      this.$confirm(`确认要删除"${ row.title }"吗？`, '提示', {
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
    parseRowType(row) {
      return this.$enumsParseLabel(NoticeTypeEnums, row.type, '')
    },
    onRowDetail(row) {
      this.$refs.sysNoticeViewDialog.open(row)
    },
    onSortComplete() {
      this.queryParams.page = this.$options.data().queryParams.page
      this.onQuery()
    }
  },
}
</script>
