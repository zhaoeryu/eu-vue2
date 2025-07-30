<template>
  <eu-drawer
    :title="pageTitle"
    :visible.sync="show"
    size="90%"
    append-to-body
  >
    <div class="padding-sm">
      <eu-loading v-if="loading" style="height: 300px;" />

      <template v-else>
        <m-block-header title="表配置" :background="false" />
        <generate-setting-table ref="generateSettingTable" />

        <m-block-header title="字段配置" :background="false" />
        <generate-setting-field-list ref="generateSettingFieldList" />
      </template>
    </div>

    <generate-preview ref="generatePreview" />

    <template #footer-right>
      <el-button :loading="formLoading" @click="onSync">同步</el-button>
      <el-button :loading="formLoading" @click="onGenerate">生成</el-button>
      <el-button @click="onPreviewCode">代码预览</el-button>
      <el-button class="eu-submit-btn" type="primary" :loading="formLoading" @click="onSave">保存</el-button>
    </template>
  </eu-drawer>
</template>

<script>
import { tableInfo, syncTable, save } from '@/api/system/generate'
import GeneratePreview from '@/views/tools/generate/GeneratePreview.vue'
import GenerateSettingFieldList from './GenerateSettingFieldList.vue'
import GenerateSettingTable from './GenerateSettingTable.vue'
import { computed } from 'vue'

export default {
  name: 'GenerateSettingDrawer',
  components: {
    GeneratePreview,
    GenerateSettingFieldList,
    GenerateSettingTable,
  },
  data() {
    return {
      show: false,

      loading: false,
      list: [],
      gen: {},
      tableForm: {},
      formLoading: false,
    }
  },
  provide() {
    return {
      list: computed(() => this.list),
      form: computed(() => this.tableForm),
    }
  },
  computed: {
    pageTitle() {
      return '生成配置 - ' + this.gen.tableName
    },
    fieldOptions() {
      return this.list.map(item => item.javaField)
    }
  },
  methods: {
    open(row) {
      Object.assign(this.$data, this.$options.data())
      this.show = true
      this.gen = row

      this.onRefresh()
    },
    onRefresh() {
      this.loading = true
      tableInfo({
        tableName: this.gen.tableName
      }).then(res => {
        this.loading = false
        this.tableForm = res.data.table
        this.list = res.data.columns
      }).catch(() => {
        this.loading = false
      })
    },
    async onSave() {
      try {
        // 数据校验
        await this.$refs.generateSettingTable.validate()

        // 保存数据到服务器
        this.formLoading = true
        await save({
          table: this.tableForm,
          columns: this.list
        })

        // 保存成功，刷新数据
        this.$message.success('保存成功')
        this.onRefresh()
      } catch (err) {
        console.error(err)
      } finally {
        this.formLoading = false
      }
    },
    onSync() {
      this.$confirm('同步后会覆盖已配置信息，确定要同步吗？', {
        title: '提示',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            syncTable({
              tableName: this.gen.tableName,
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
    onPreviewCode() {
      this.$refs.generatePreview.open({
        tableName: this.gen.tableName
      })
    },
    async onGenerate() {
      try {
        await this.onSave()

        this.download('/api/gen/gen', {
          tableName: this.gen.tableName
        }, `${this.gen.tableName}.zip`)
      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
