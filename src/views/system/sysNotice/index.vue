<template>
  <div class="page-container">
    <div class="page-body">
      <query-expand-wrapper :show="isQueryShow">
        <el-form :model="queryParams" :inline="true">
          <el-form-item :label="$t('sysNotice.query.title')" prop="title">
            <el-input v-model="queryParams.title" :placeholder="$t('sysNotice.query.title.placeholder')" clearable />
          </el-form-item>
          <el-form-item :label="$t('sysNotice.query.type')" prop="type">
            <el-select v-model="queryParams.type" :placeholder="$t('sysNotice.query.type.placeholder')" clearable filterable>
              <el-option v-for="item in noticeTypeEnums" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('sysNotice.query.status')" prop="status">
            <el-select v-model="queryParams.status" :placeholder="$t('sysNotice.query.status.placeholder')" clearable filterable>
              <el-option :label="$t('sysNotice.query.status.normal')" :value="0" />
              <el-option :label="$t('sysNotice.query.status.disabled')" :value="1" />
            </el-select>
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
          <el-table-column prop="title" :label="$t('sysNotice.column.title')"></el-table-column>
          <el-table-column prop="type" :label="$t('sysNotice.column.type')">
            <template #default="{ row }">
              <el-tag>{{ parseRowType(row) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="description" :label="$t('sysNotice.column.description')"></el-table-column>
          <el-table-column prop="status" :label="$t('sysNotice.column.status')">
            <template #default="{ row }">
              <el-tag v-if="row.status === 0">{{ $t('sysNotice.column.status.normal') }}</el-tag>
              <el-tag v-else type="danger">{{ $t('sysNotice.column.status.disabled') }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" :label="$t('sysNotice.column.createTime')"></el-table-column>
          <el-table-column prop="updateTime" :label="$t('sysNotice.column.updateTime')"></el-table-column>
          <el-table-column v-permissions="['system:sysNotice:edit', 'system:sysNotice:del']" :label="$t('general.column.operation')">
            <template #default="{ row }">
              <el-button v-permissions="['system:sysNotice:edit']" type="text" @click="onRowUpdate(row)">{{ $t('general.edit') }}</el-button>
              <el-button v-permissions="['system:sysNotice:del']" type="text" @click="onRowDelete(row)">{{ $t('general.del') }}</el-button>
              <el-button type="text" @click="onRowDetail(row)">{{ $t('sysNotice.button.detail') }}</el-button>
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
import SysNoticeViewDialog from '@/views/system/sysNotice/SysNoticeViewDialog.vue'
import { NoticeTypeEnums } from '@/utils/enums'
export default {
  name: 'SysNotice',
  components: { SysNoticeViewDialog, SysNoticeEditDialog },
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
      this.$download('/api/system/sysNotice/export', this.queryParams, `通知公告_${new Date().getTime()}.xlsx`)
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
      this.$refs.sysNoticeEditDialog.open(row)
    },
    onRowDelete(row) {
      this.$confirm(this.$t('general.confirm.delete.message', {
        key: row.title
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
