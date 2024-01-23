<template>
  <div class="page-container">
    <div class="page-body">
      <query-expand-wrapper :show="isQueryShow">
        <el-form :model="queryParams" :inline="true">
          <el-form-item :label="$t('job.query.jobName')">
            <el-input v-model="queryParams.jobName" :placeholder="$t('job.query.jobName.placeholder')" />
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
            export: false,
            import: false,
            sort: false
          }"
          :permission="{
            add: ['system:job:add'],
            del: ['system:job:del'],
          }"
          :ref-table="$refs.table"
          @add="onAdd"
          @batchDel="onBatchDel"
          @export="onExport"
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
          <el-table-column prop="jobName" :label="$t('job.column.jobName')"></el-table-column>
          <el-table-column prop="jobGroup" :label="$t('job.column.jobGroup')"></el-table-column>
          <el-table-column prop="cron" :label="$t('job.column.cron')"></el-table-column>
          <!--        <el-table-column prop="misfirePolicy" label="执行策略">-->
          <!--          <template #default="{ row }">-->
          <!--            <el-tag v-if="row.misfirePolicy === 0">默认</el-tag>-->
          <!--            <el-tag v-else-if="row.misfirePolicy === 1" type="primary">立即触发执行</el-tag>-->
          <!--            <el-tag v-else-if="row.misfirePolicy === 2" type="primary">触发一次执行</el-tag>-->
          <!--            <el-tag v-else-if="row.misfirePolicy === 3" type="primary">不触发立即执行</el-tag>-->
          <!--          </template>-->
          <!--        </el-table-column>-->
          <!--        <el-table-column prop="concurrent" label="允许并发">-->
          <!--          <template #default="{ row }">-->
          <!--            <el-tag v-if="row.concurrent === 0">否</el-tag>-->
          <!--            <el-tag v-else-if="row.concurrent === 1" type="danger">是</el-tag>-->
          <!--          </template>-->
          <!--        </el-table-column>-->
          <el-table-column :label="$t('job.column.invokeClassName')">
            <template #default="{ row }">
              <span v-if="row.invokeClassName">{{ row.invokeClassName }}</span>
              <span v-else>[Spring] {{ row.springBeanName }}</span>
            </template>
          </el-table-column>
          <!--        <el-table-column prop="springBeanName" label="SpringBean"></el-table-column>-->
          <el-table-column prop="methodName" :label="$t('job.column.methodName')">
            <template #default="{ row }">
              <span>{{ row.methodName }}</span>
              <template v-if="row.methodParams">
                <span>( {{ row.methodParams }} )</span>
              </template>
            </template>
          </el-table-column>
          <!--        <el-table-column prop="pauseAfterFailure" label="失败后暂停">-->
          <!--          <template #default="{ row }">-->
          <!--            <el-tag v-if="row.pauseAfterFailure === 0">否</el-tag>-->
          <!--            <el-tag v-else-if="row.pauseAfterFailure === 1" type="danger">是</el-tag>-->
          <!--          </template>-->
          <!--        </el-table-column>-->
          <!--        <el-table-column prop="alarmEmail" label="告警邮箱"></el-table-column>-->
          <el-table-column prop="status" :label="$t('job.column.status')">
            <template #default="{ row }">
              <el-switch v-model="row.status" :active-value="0" :inactive-value="1" @change="onStatusChange(row)" />
            </template>
          </el-table-column>
          <el-table-column v-permissions="['system:job:run', 'system:job-log:list', 'system:job:edit', 'system:job:del']" :label="$t('general.column.operation')" width="200">
            <template #default="{ row }">
              <el-button v-permissions="['system:job:run']" type="text" @click="onRowRun(row)">
                {{ $t('job.column.operation.exec') }}</el-button>
              <el-button v-permissions="['system:job-log:list']" type="text" @click="onRowLog(row)">
                {{ $t('job.column.operation.log') }}</el-button>
              <el-button v-permissions="['system:job:edit']" type="text" @click="onRowUpdate(row)">
                {{ $t('general.edit') }}</el-button>
              <el-button v-permissions="['system:job:del']" type="text" @click="onRowDelete(row)">
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
    </div>

    <job-edit-dialog ref="jobEditDialog" @complete="onRefresh" />

    <job-log ref="jobLog" />
  </div>
</template>

<script>
import { page, batchDel, execJob, pauseOrResume } from '@/api/system/job'
import JobLog from '@/views/system/jobs/JobLog.vue'
import JobEditDialog from '@/views/system/jobs/JobEditDialog.vue'
import QueryExpandWrapper from '@/components/Crud/QueryExpandWrapper/index.vue'
import EuTableToolbar from '@/components/Crud/EuTableToolbar/index.vue'
export default {
  name: 'Jobs',
  components: { EuTableToolbar, QueryExpandWrapper, JobEditDialog, JobLog },
  data() {
    return {
      loading: false,
      list: [],
      total: 0,

      queryParams: {
        jobName: null,
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
      this.$refs.jobEditDialog.open({
        status: 0
      })
    },
    onExport() {
      this.download('/api/system/job/export', this.queryParams, `job_${new Date().getTime()}.xlsx`)
    },
    onBatchDel() {
      const ids = this.$refs.table.selection.map(item => item.id)
      this.$confirm(this.$t('job.message.delete.batch.confirm', { length: ids.length }), this.$t('general.confirm.title'), {
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
      this.$refs.jobEditDialog.open(row)
    },
    onRowDelete(row) {
      this.$confirm(this.$t('job.message.delete.confirm', { jobName: row.jobName }), this.$t('general.confirm.title'), {
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
    onRowRun(row) {
      this.$confirm(this.$t('job.message.exec.confirm'), this.$t('general.confirm.title'), {
        confirmButtonText: this.$t('general.confirm.confirm'),
        cancelButtonText: this.$t('general.confirm.cancel'),
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            execJob(row.id).then(() => {
              this.$message.success(this.$t('job.message.exec.success'))
              done()
            }).finally(() => {
              instance.confirmButtonLoading = false;
            })
          } else {
            done()
          }
        }
      });
    },
    onStatusChange(row) {
      const status = row.status
      this.$confirm(this.$t('job.message.status.confirm', { status: status === 0 ? '恢复' : '暂停', jobName: row.jobName }), this.$t('general.confirm.title'), {
        confirmButtonText: this.$t('general.confirm.confirm'),
        cancelButtonText: this.$t('general.confirm.cancel'),
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            pauseOrResume(row).then(() => {
              this.$message.success(this.$t('job.message.exec.success'))
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
    onRowLog(row) {
      this.$refs.jobLog.open(row)
    }
  },
}
</script>
