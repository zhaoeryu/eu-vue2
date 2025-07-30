<template>
  <el-dialog :title="title" :visible.sync="show" width="1200px" top="7vh">
    <div class="query-wrapper">
      <el-form :model="queryParams" :inline="true">
        <el-form-item :label="$t('job.log.query.execTime')">
          <el-date-picker
            v-model="queryParams.startTime"
            type="datetime"
            :placeholder="$t('job.log.query.startTime.placeholder')"
            align="left"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions">
          </el-date-picker>
          <span> ~ </span>
          <el-date-picker
            v-model="queryParams.endTime"
            type="datetime"
            :placeholder="$t('job.log.query.endTime.placeholder')"
            align="left"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onQuery">{{ $t('general.query.search') }}</el-button>
          <el-button icon="el-icon-refresh" plain @click="onRefresh">{{ $t('general.query.reset') }}</el-button>
        </el-form-item>
      </el-form>
      <div>
        <el-button v-permissions="['system:job-log:export']" type="warning" icon="el-icon-download" plain @click="onExport">
          {{ $t('crud.EuTableToolbar.export') }}</el-button>
      </div>
    </div>
    <div v-loading="loading">
      <el-table
        :data="list"
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="160"></el-table-column>
        <el-table-column prop="jobName" :label="$t('job.log.column.jobName')"></el-table-column>
        <el-table-column :label="$t('job.log.column.invokeClassName')">
          <template #default="{ row }">
            <span v-if="row.invokeClassName">{{ row.invokeClassName }}</span>
            <span v-else>[Spring] {{ row.springBeanName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="methodName" :label="$t('job.log.column.methodName')">
          <template #default="{ row }">
            <span>{{ row.methodName }}</span>
            <template v-if="row.methodParams">
              <span>( {{ row.methodParams }} )</span>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="success" :label="$t('job.log.column.success')">
          <template #default="{ row }">
            <el-tag v-if="row.success" type="success">{{ $t('job.log.column.success.true') }}</el-tag>
            <el-tag v-else type="danger">{{ $t('job.log.column.success.false') }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('job.log.column.startTime')" width="280">
          <template #default="{ row }">
            <span>{{ row.startTime }} ~ {{ row.endTime }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('job.log.column.execTime')">
          <template #default="{ row }">
            <span>{{ row.execTime }}ms</span>
          </template>
        </el-table-column>
        <el-table-column v-permissions="['system:job-log:del']" :label="$t('general.column.operation')">
          <template #default="{ row }">
            <el-button v-permissions="['system:job-log:del']" type="text" @click="onRowDelete(row)">
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
  </el-dialog>
</template>

<script>
import { batchDel, page } from '@/api/system/jobLog'
import i18n from '@/plugins/i18n'

export default {
  name: 'JobLog',
  data() {
    return {
      show: false,

      loading: false,
      list: [],
      total: 0,
      queryParams: {
        jobId: null,
        startTime: null,
        endTime: null,
        page: 1,
        size: 10,
        sort: ['create_time,desc'],
      },

      job: {},

      pickerOptions: {
        shortcuts: [{
          text: i18n.t('job.log.pickerOptions.shortcuts.today'),
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: i18n.t('job.log.pickerOptions.shortcuts.yesterday'),
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: i18n.t('job.log.pickerOptions.shortcuts.lastWeek'),
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      }
    }
  },
  computed: {
    title() {
      return `${this.$t('job.log.title')} - ${this.job.jobName}`
    }
  },
  methods: {
    open(job) {
      Object.assign(this.$data, this.$options.data())
      this.show = true
      this.job = job
      this.queryParams.jobId = job.id
      this.onRefresh()
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
      this.$download('/api/system/job-log/export', this.queryParams, `jobLog_${new Date().getTime()}.xlsx`)
    },
    onRowDelete(row) {
      this.$confirm(this.$t('job.log.message.delete.confirm', { id: row.id }), this.$t('general.confirm.title'), {
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
  }
}
</script>
