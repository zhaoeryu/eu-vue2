<template>
  <el-dialog
    :title="pageTitle"
    :visible.sync="show"
    width="90%"
    top="3vh"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <div v-loading="loading" style="position: relative;">
      <el-tabs v-model="activeName">
        <el-tab-pane label="表配置" name="table">
          <div style="display: flex;justify-content: center;">
            <el-form ref="form" :model="tableForm" :rules="tableRules" label-width="150px">
              <el-row>
                <el-col :span="12">
                  <el-form-item prop="tableComment" label="表注释">
                    <el-input v-model="tableForm.tableComment" placeholder="请输入表注释"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="packageName" label="包路径">
                    <template #label>
                      <span>包路径</span>
                      <el-tooltip class="item" effect="dark" content="生成代码所在的包路径，默认：cn.eu.business" placement="top">
                        <i class="el-icon-info"></i>
                      </el-tooltip>
                    </template>
                    <el-input v-model="tableForm.packageName" placeholder="请输入包路径"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="moduleName" label="模块名">
                    <template #label>
                      <span>模块名</span>
                      <el-tooltip class="item" effect="dark" content="生成代码所在的模块名，例如：eu-admin、eu-oss等，默认：eu-admin" placement="top">
                        <i class="el-icon-info"></i>
                      </el-tooltip>
                    </template>
                    <el-input v-model="tableForm.moduleName" placeholder="请输入模块名"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="funcGroup" label="功能分组">
                    <template #label>
                      <span>功能分组</span>
                      <el-tooltip class="item" effect="dark" placement="top">
                        <template #content>
                          <p>对功能进行分组，例如：功能分组=oss</p>
                          <ul>
                            <li>请求路径：/api/<strong>oss</strong>/test</li>
                            <li>权限字符串：<strong>oss</strong>:test:del</li>
                            <li>生成文件路径：api/<strong>oss</strong>/test.js</li>
                          </ul>
                        </template>
                        <i class="el-icon-info"></i>
                      </el-tooltip>
                    </template>
                    <el-input v-model="tableForm.funcGroup" placeholder="请输入功能分组"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="author" label="作者">
                    <el-input v-model="tableForm.author" placeholder="请输入作者"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="delShowField" label="删除时显示的字段">
                    <template #label>
                      <span>删除时显示的字段</span>
                      <el-tooltip class="item" effect="dark" placement="top">
                        <template #content>
                          <p>确认要删除"${ row.$delShowField }"吗？</p>
                        </template>
                        <i class="el-icon-info"></i>
                      </el-tooltip>
                    </template>
                    <el-select v-model="tableForm.delShowField" placeholder="请选择删除时显示的字段" filterable clearable>
                      <el-option v-for="item in fieldOptions" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="detailHeaderFieldKey" label="详情页头部字段">
                    <el-select v-model="tableForm.detailHeaderFieldKey" placeholder="请选择删除时显示的字段" filterable clearable>
                      <el-option v-for="item in fieldOptions" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="crudEditMode" label="crud编辑模式">
                    <el-radio-group v-model="tableForm.crudEditMode">
                      <el-radio label="dialog">弹窗</el-radio>
                      <el-radio label="page">页面</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="genMode" label="生成模式">
                    <el-radio-group v-model="tableForm.genMode">
                      <el-radio :label="0">本地生成</el-radio>
                      <el-radio :label="1">下载</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="列配置" name="column">
          <el-table
            ref="table"
            :data="list"
            style="width: 100%"
          >
            <el-table-column prop="columnSort" label="序号" width="50"></el-table-column>
            <el-table-column prop="columnName" label="字段名"></el-table-column>
            <el-table-column prop="columnType" label="db字段类型"></el-table-column>
            <el-table-column prop="javaType" label="java字段类型"></el-table-column>
            <el-table-column prop="javaField" label="java字段名"></el-table-column>
            <el-table-column prop="columnComment" label="描述">
              <template #default="{ row }">
                <el-input v-model="row.columnComment" placeholder="输入描述" maxlength="32"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="excelExport" label="导出" width="50">
              <template #default="{ row }">
                <el-checkbox v-model="row.excelExport"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column prop="tableShow" label="列表" width="50">
              <template #default="{ row }">
                <el-checkbox v-model="row.tableShow"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column prop="formShow" label="表单" width="50">
              <template #default="{ row }">
                <el-checkbox v-model="row.formShow"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column prop="notNull" label="不为空" width="60">
              <template #default="{ row }">
                <el-checkbox v-model="row.notNull"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column prop="queryType" label="查询方式" width="100">
              <template #default="{ row }">
                <el-select v-model="row.queryType" placeholder="选择查询方式" clearable>
                  <el-option v-for="item in queryTypeList" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="formType" label="表单类型" width="110">
              <template #default="{ row }">
                <el-select v-model="row.formType" placeholder="选择表单类型" clearable>
                  <el-option v-for="item in formTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="areaQuery" label="区域查询" width="80">
              <template #default="{ row }">
                <el-checkbox v-model="row.areaQuery"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column prop="tableHeaderQuery" label="表头查询" width="80">
              <template #default="{ row }">
                <el-checkbox v-model="row.tableHeaderQuery"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column prop="defaultVisible" label="表格可见" width="80">
              <template #default="{ row }">
                <el-checkbox v-model="row.defaultVisible"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column prop="dict" label="关联字典">
              <template #default="{ row }">
                <el-select v-model="row.dictKey" placeholder="选择关联字典" clearable>
                  <el-option
                    v-for="item in dictList"
                    :key="item.dictKey"
                    :label="item.remark || item.dictKey"
                    :value="item.dictKey"
                  >
                    <span style="float: left">{{ item.remark || item.dictKey }}</span>
                    <span v-if="item.remark" style="float: right; color: #8492a6; font-size: 13px">&nbsp;&nbsp;{{ item.dictKey }}</span>
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <div style="position: absolute;top: 0;right: 0;">
        <el-button
          type="warning"
          icon="el-icon-refresh"
          plain
          @click="onSync"
        >同 步</el-button>
        <el-button
          type="primary"
          icon="el-icon-finished"
          :loading="formLoading"
          @click="onSave"
        >保 存</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { tableInfo, syncTable, saveTable, saveColumns, queryTypeList, formTypeList } from '@/api/system/generate'
import { page as dictPage } from '@/api/system/dict'

export default {
  name: 'GenerateSettingDrawer',
  data() {
    return {
      show: false,

      loading: false,
      list: [],

      gen: {},

      activeName: 'column',

      tableForm: {},
      tableRules: {},

      formLoading: false,

      queryTypeList: [],
      dictList: [],
      formTypeList: []
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

      this.onLoadParams()
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
    onLoadParams() {
      // 查询方式
      queryTypeList().then(res => {
        this.queryTypeList = res.data || []
      })
      // 字典
      dictPage({
        // 正常状态的字典
        status: 0,
        // 查询全部
        size: 999
      }).then(res => {
        this.dictList = res.data.records || []
      })
      // 表单类型
      formTypeList().then(res => {
        this.formTypeList = res.data || []
      })
    },
    onSave() {
      // 保存表配置
      if (this.activeName === 'table') {
        this.$refs.form.validate(valid => {
          if (!valid) {
            return
          }
          this.formLoading = true
          saveTable(this.tableForm).then(() => {
            this.$message.success('保存成功')
            this.onRefresh()
          }).finally(() => {
            this.formLoading = false
          })
        })
        return
      }

      // 保存字段配置
      this.formLoading = true
      saveColumns(this.list).then(() => {
        this.$message.success('保存成功')
        this.onRefresh()
      }).finally(() => {
        this.formLoading = false
      })
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
    }
  }
}
</script>

<style lang='scss' scoped>
::v-deep {
  .el-drawer__header {
    margin-bottom: 12px;
  }
}
</style>
