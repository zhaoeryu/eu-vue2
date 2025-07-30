<template>
  <div class="page-container">
    <div class="page-body">
      <query-expand-wrapper>
        <el-form :model="queryParams" :inline="true">
          <el-form-item label="表名称">
            <el-input v-model="queryParams.tableName" placeholder="输入要查找的表名称" clearable />
          </el-form-item>
          <el-form-item label="表描述">
            <el-input v-model="queryParams.tableComment" placeholder="输入要查找的表描述" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="onQuery">查询</el-button>
            <el-button icon="el-icon-refresh" plain @click="onRefresh">重置</el-button>
          </el-form-item>
        </el-form>
      </query-expand-wrapper>
      <div v-loading="loading">
        <el-table
          ref="table"
          :data="list"
          style="width: 100%"
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column prop="tableName" label="表名称"></el-table-column>
          <el-table-column prop="tableComment" label="表描述"></el-table-column>
          <el-table-column prop="createTime" label="表创建时间"></el-table-column>
          <el-table-column prop="updateTime" label="最近一次更新"></el-table-column>
          <el-table-column v-permissions="['tools:generate:preview', 'tools:generate:config', 'tools:generate:sync', 'tools:generate:generate']" label="操作">
            <template #default="{ row }">
              <el-button v-permissions="['tools:generate:preview']" type="text" @click="onRowPreview(row)">预览</el-button>
              <el-button v-permissions="['tools:generate:config']" type="text" @click="onRowSetting(row)">配置</el-button>
              <el-button v-permissions="['tools:generate:sync']" type="text" @click="onRowSync(row)">同步</el-button>
              <el-button v-permissions="['tools:generate:generate']" type="text" :loading="row._genLoading" @click="onRowGen(row)">生成</el-button>
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

    <generate-preview ref="generatePreview" />
    <generate-setting-drawer ref="generateSettingDrawer" />
  </div>
</template>

<script>
import { page, syncTable } from '@/api/system/generate'
import GeneratePreview from '@/views/tools/generate/GeneratePreview.vue'
import GenerateSettingDrawer from '@/views/tools/generate/GenerateSettingDrawer/index.vue'
export default {
  name: 'Generate',
  components: { GenerateSettingDrawer, GeneratePreview },
  data() {
    return {
      loading: false,
      list: [],
      total: 0,

      queryParams: {
        tableName: null,
        tableComment: null,
        page: 1,
        size: 10
      },
    }
  },
  computed: {

  },
  mounted() {
    this.onRefresh()
  },
  methods: {
    onQuery() {
      this.loading = true
      page(this.queryParams).then(res => {
        this.list = res.data.records.map(item => {
          item._genLoading = false
          return item
        })
        this.total = res.data.total
      }).finally(() => {
        this.loading = false
      })
    },
    onRefresh() {
      this.queryParams = this.$options.data().queryParams
      this.onQuery()
    },
    onRowPreview(row) {
      this.$refs.generatePreview.open(row)
    },
    onRowSetting(row) {
      this.$refs.generateSettingDrawer.open(row)
    },
    onRowSync(row) {
      this.$confirm('同步后会覆盖已配置信息，确定要同步吗？', {
        title: '提示',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            syncTable({
              tableName: row.tableName,
            }).then(() => {
              this.$message.success('同步成功')
              this.onRefresh()
            }).finally(() => {
              instance.confirmButtonLoading = false
            })
          }
          done()
        }
      })
    },
    onRowGen(row) {
      row._genLoading = true
      this.download('/api/gen/gen', {
        tableName: row.tableName
      }, `${row.tableName}.zip`).finally(() => {
        row._genLoading = false
      })
    }
  },
}
</script>
