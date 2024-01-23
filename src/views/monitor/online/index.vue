<template>
  <div class="page-container">
    <div class="page-body">
      <div class="query-wrapper">
        <el-form :model="queryParams" :inline="true">
          <el-form-item :label="$t('monitor.online.query.nickname.label')">
            <el-input v-model="queryParams.nickname" :placeholder="$t('monitor.online.query.nickname.placeholder')" />
          </el-form-item>
        </el-form>
        <div>
          <el-button type="primary" icon="el-icon-search" @click="onQuery">{{ $t('monitor.online.query.search') }}</el-button>
          <el-button icon="el-icon-refresh" plain @click="onRefresh">{{ $t('monitor.online.query.reset') }}</el-button>
        </div>
      </div>
      <el-divider />
      <div v-loading="loading">
        <el-table
          :data="list"
          style="width: 100%"
        >
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="username" :label="$t('monitor.online.column.username')"></el-table-column>
          <el-table-column prop="nickname" :label="$t('monitor.online.column.nickname')"></el-table-column>
          <el-table-column prop="deptName" :label="$t('monitor.online.column.deptName')"></el-table-column>
          <el-table-column prop="loginIp" :label="$t('monitor.online.column.loginIp')"></el-table-column>
          <el-table-column prop="loginRegion" :label="$t('monitor.online.column.loginRegion')"></el-table-column>
          <el-table-column prop="loginTime" :label="$t('monitor.online.column.loginTime')" width="150"></el-table-column>
          <el-table-column prop="browser" :label="$t('monitor.online.column.browser')"></el-table-column>
          <el-table-column prop="os" :label="$t('monitor.online.column.os')"></el-table-column>
          <el-table-column v-permissions="['monitor:online:logout', 'monitor:online:kickout']" :label="$t('monitor.online.column.operation')" fixed="right" width="140">
            <template #default="{ row }">
              <el-button v-permissions="['monitor:online:logout']" type="text" @click="onLogout(row)">
                {{ $t('monitor.online.column.operation.logout') }}</el-button>
              <el-button v-permissions="['monitor:online:kickout']" type="text" @click="onKictout(row)">
                {{ $t('monitor.online.column.operation.kickout') }}</el-button>
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
  </div>
</template>

<script>
import { onlineList, onlineKickout, onlineLogout } from '@/api/system/user'
export default {
  name: 'OnlineUser',
  data() {
    return {
      loading: false,
      list: [],
      total: 0,

      queryParams: {
        nickname: null,
        page: 1,
        size: 10
      }
    }
  },
  mounted() {
    this.onRefresh()
  },
  methods: {
    onQuery() {
      this.loading = true
      onlineList(this.queryParams).then(res => {
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
    onLogout(row) {
      this.$confirm(this.$t('monitor.online.logout.confirm', { username: row.username }), this.$t('monitor.online.logout.title'), {
        confirmButtonText: this.$t('monitor.online.logout.confirmButtonText'),
        cancelButtonText: this.$t('monitor.online.logout.cancelButtonText'),
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            onlineLogout(row.id).then(() => {
              this.$message.success(this.$t('monitor.online.logout.success'))
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
    onKictout(row) {
      this.$confirm(this.$t('monitor.online.kickout.confirm', { username: row.username }), this.$t('monitor.online.kickout.title'), {
        confirmButtonText: this.$t('monitor.online.kickout.confirmButtonText'),
        cancelButtonText: this.$t('monitor.online.kickout.cancelButtonText'),
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            onlineKickout(row.id).then(() => {
              this.$message.success(this.$t('monitor.online.kickout.success'))
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
