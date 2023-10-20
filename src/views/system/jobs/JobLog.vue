<template>
  <el-dialog :title="title" :visible.sync="show" width="1200px" top="7vh">
    <div class="query-wrapper">
      <el-form :model="queryParams" :inline="true">
        <el-form-item label="执行时间">
          <el-date-picker
            v-model="queryParams.startTime"
            type="datetime"
            placeholder="选择开始时间"
            align="left"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions">
          </el-date-picker>
          <span> ~ </span>
          <el-date-picker
            v-model="queryParams.endTime"
            type="datetime"
            placeholder="选择结束时间"
            align="left"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onQuery">查询</el-button>
          <el-button icon="el-icon-refresh" plain @click="onRefresh">重置</el-button>
        </el-form-item>
      </el-form>
      <div>
        <el-button v-permissions="['system:job-log:export']" type="warning" icon="el-icon-download" plain @click="onExport">导出</el-button>
      </div>
    </div>
    <div v-loading="loading">
      <el-table
        :data="list"
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="160"></el-table-column>
        <el-table-column prop="jobName" label="任务名称"></el-table-column>
        <el-table-column label="执行类">
          <template #default="{ row }">
            <span v-if="row.invokeClassName">{{ row.invokeClassName }}</span>
            <span v-else>[Spring] {{ row.springBeanName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="methodName" label="执行方法">
          <template #default="{ row }">
            <span>{{ row.methodName }}</span>
            <template v-if="row.methodParams">
              <span>( {{ row.methodParams }} )</span>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="success" label="执行结果">
          <template #default="{ row }">
            <el-tag v-if="row.success" type="success">成功</el-tag>
            <el-tag v-else type="danger">失败</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="执行时间" width="280">
          <template #default="{ row }">
            <span>{{ row.startTime }} ~ {{ row.endTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="执行时长">
          <template #default="{ row }">
            <span>{{ row.execTime }}ms</span>
          </template>
        </el-table-column>
        <el-table-column v-permissions="['system:job-log:del']" label="操作">
          <template #default="{ row }">
            <el-button v-permissions="['system:job-log:del']" type="text" @click="onRowDelete(row)">删除</el-button>
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
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周前',
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
      return `执行日志 - ${this.job.jobName}`
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
      this.download('/api/system/job-log/export', this.queryParams, `jobLog_${new Date().getTime()}.xlsx`)
    },
    onRowDelete(row) {
      this.$confirm(`确认要删除"${ row.id }"吗？`, '提示', {
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
  }
}
</script>
