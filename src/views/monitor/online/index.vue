<template>
  <div class="page-container">
    <div class="page-body">
      <div class="query-wrapper">
        <el-form :model="queryParams" :inline="true">
          <el-form-item label="用户昵称">
            <el-input v-model="queryParams.nickname" placeholder="输入要查找的用户昵称" />
          </el-form-item>
        </el-form>
        <div>
          <el-button type="primary" icon="el-icon-search" @click="onQuery">查询</el-button>
          <el-button icon="el-icon-refresh" plain @click="onRefresh">重置</el-button>
        </div>
      </div>
      <el-divider />
      <div v-loading="loading">
        <el-table
          :data="list"
          style="width: 100%"
        >
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="username" label="登录名"></el-table-column>
          <el-table-column prop="nickname" label="用户昵称"></el-table-column>
          <el-table-column prop="deptName" label="部门"></el-table-column>
          <el-table-column prop="loginIp" label="登录IP"></el-table-column>
          <el-table-column prop="loginRegion" label="登录地点"></el-table-column>
          <el-table-column prop="loginTime" label="登录时间" width="150"></el-table-column>
          <el-table-column prop="browser" label="浏览器"></el-table-column>
          <el-table-column prop="os" label="操作系统"></el-table-column>
          <el-table-column v-permissions="['monitor:online:logout', 'monitor:online:kickout']" label="操作" fixed="right" width="140">
            <template #default="{ row }">
              <el-button v-permissions="['monitor:online:logout']" type="text" @click="onLogout(row)">强制注销</el-button>
              <el-button v-permissions="['monitor:online:kickout']" type="text" @click="onKictout(row)">踢Ta下线</el-button>
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
      this.$confirm(`确认要强制注销"${ row.username }"吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            onlineLogout(row.id).then(() => {
              this.$message.success('强制注销Ta下线成功')
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
      this.$confirm(`确认要踢"${ row.username }"下线吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            onlineKickout(row.id).then(() => {
              this.$message.success('踢Ta下线成功')
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
