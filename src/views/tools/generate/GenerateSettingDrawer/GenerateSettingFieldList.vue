<template>
  <vxe-table
    id="table"
    ref="table"
    border
    resizable
    show-overflow
    keep-source
    style="width: 100%"
    :data="list"
    :row-config="{isHover: true}"
    :edit-config="{
      trigger: 'click',
      mode: 'cell',
      showStatus: true,
      autoClear: false
    }"
  >
    <vxe-column field="columnSort" title="序号" min-width="50" fixed="left"></vxe-column>
    <vxe-colgroup title="数据库字段" field="group_db" fixed="left">
      <vxe-column field="columnName" title="字段名" min-width="100"></vxe-column>
      <vxe-column field="columnType" title="字段类型" min-width="100"></vxe-column>
      <vxe-column field="columnComment" title="注释" min-width="100"></vxe-column>
    </vxe-colgroup>
    <vxe-colgroup title="Java配置" field="group_java">
      <vxe-column field="javaField" title="字段名" min-width="100"></vxe-column>
      <vxe-column field="javaType" title="字段类型" min-width="100"></vxe-column>
      <vxe-column field="finalColumnComment" title="注释" min-width="120" :edit-render="{ placeholder: '请点击填写...' }">
        <template #edit="{ row }">
          <vxe-input v-model="row.finalColumnComment" placeholder="请填写" max-length="32" />
        </template>
      </vxe-column>
      <vxe-column field="excelExport" title="导出" min-width="50">
        <template #default="{ row }">
          <vxe-checkbox v-model="row.excelExport" />
        </template>
      </vxe-column>
    </vxe-colgroup>
    <vxe-colgroup title="列表配置" field="group_table">
      <vxe-column field="tableShow" title="列表" min-width="50">
        <template #default="{ row }">
          <vxe-checkbox v-model="row.tableShow" />
        </template>
      </vxe-column>
      <vxe-column field="defaultVisible" title="可见性" min-width="50">
        <template #default="{ row }">
          <vxe-checkbox v-model="row.defaultVisible" />
        </template>
      </vxe-column>
      <vxe-column field="tableShowField" title="表格字段" min-width="120" :edit-render="{ placeholder: '请点击填写...' }">
        <template #edit="{ row }">
          <vxe-input v-model="row.tableShowField" placeholder="请填写" max-length="32" />
        </template>
      </vxe-column>
      <vxe-column field="queryType" title="查询方式" min-width="100" :edit-render="{ placeholder: '请点击选择...' }">
        <template #edit="{ row }">
          <el-select v-model="row.queryType" placeholder="请选择" clearable>
            <el-option v-for="item in queryTypeList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </template>
      </vxe-column>
      <vxe-column field="areaQuery" title="区域查询" min-width="60">
        <template #default="{ row }">
          <vxe-checkbox v-model="row.areaQuery" />
        </template>
      </vxe-column>
      <vxe-column field="tableHeaderQuery" title="表头查询" min-width="60">
        <template #default="{ row }">
          <vxe-checkbox v-model="row.tableHeaderQuery" />
        </template>
      </vxe-column>
    </vxe-colgroup>
    <vxe-colgroup title="表单配置" field="group_form">
      <vxe-column field="formShow" title="表单" min-width="50">
        <template #default="{ row }">
          <vxe-checkbox v-model="row.formShow" />
        </template>
      </vxe-column>
      <vxe-column field="formType" title="表单类型" min-width="100" :edit-render="{ placeholder: '请点击选择...' }">
        <template #edit="{ row }">
          <el-select v-model="row.formType" placeholder="选择表单类型" clearable>
            <el-option v-for="item in formTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </template>
      </vxe-column>
      <vxe-column field="notNull" title="必填" min-width="50">
        <template #default="{ row }">
          <vxe-checkbox v-model="row.notNull" />
        </template>
      </vxe-column>
    </vxe-colgroup>
    <vxe-colgroup title="数据源配置" field="group_datasource">
      <vxe-column field="dictKey" title="字典" min-width="120" :edit-render="{ placeholder: '请点击选择...' }">
        <template #edit="{ row }">
          <el-select v-model="row.dictKey" placeholder="请选择" clearable>
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
      </vxe-column>
      <vxe-column field="enumKey" title="枚举" min-width="120" :edit-render="{ placeholder: '请点击选择...' }">
        <template #edit="{ row }">
          <el-select v-model="row.enumKey" placeholder="请选择" clearable>
            <el-option
              v-for="item in Object.keys($enums)"
              :key="item"
              :label="item"
              :value="item"
            >
              <span>{{ item }}</span>
            </el-option>
          </el-select>
        </template>
      </vxe-column>
    </vxe-colgroup>
    <vxe-column title="操作" width="60" fixed="right">
      <template #default="{ row }">
        <el-popover
          placement="left"
          width="200"
          v-model="row._sort_visible">
          <div class="padding-bottom-sm">
            <vxe-input v-model="row._sort" placeholder="想插入的序号" type="number" />
          </div>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="row._sort_visible = false">取消</el-button>
            <el-button type="primary" size="mini" @click="onRowSort(row)">确定</el-button>
          </div>
          <el-button slot="reference" type="text">设置排序</el-button>
        </el-popover>
      </template>
    </vxe-column>
  </vxe-table>
</template>

<script>
import { queryTypeList, formTypeList } from '@/api/system/generate'
import { page as dictPage } from '@/api/system/dict'
import mFormItemComponents from '@/utils/m-form-item-components'

export default {
  name: 'GenerateSettingFieldList',
  inject: ['list'],
  data() {
    return {
      queryTypeList: [],
      dictList: [],
      formTypeList: []
    }
  },
  mounted() {
    this.onLoadParams()
  },
  methods: {
    /**
     * 行排序处理
     * @param {Object} row 需要排序的行对象，row._sort为目标序号
     */
    onRowSort(row) {
      // 转换为数字，防止输入字符串
      const targetSort = Number(row._sort);

      // 校验目标序号合法性
      if (
        isNaN(targetSort) ||
        targetSort < 1 ||
        targetSort > this.list.length
      ) {
        this.$message.warning('请输入有效的排序序号');
        return;
      }

      // 隐藏排序输入框
      row._sort_visible = false;

      // 找到当前行在list中的索引
      const oldIndex = this.list.findIndex(item => item === row);
      if (oldIndex === -1) {
        return;
      }

      // 如果目标位置和当前索引一样，无需移动
      if (oldIndex === targetSort - 1) {
        return;
      }

      // 移除当前行
      const [movedRow] = this.list.splice(oldIndex, 1);

      // 计算插入位置
      // 目标序号-1为目标索引
      let insertIndex = targetSort - 1;
      // 如果是从上往下移动（oldIndex < insertIndex），
      // 由于移除后数组变短，插入点要-1
      if (oldIndex < insertIndex) {
        insertIndex = insertIndex - 1;
      }
      // 这样无论是上移还是下移，移动后的字段都在目标位置的上方
      this.list.splice(insertIndex, 0, movedRow);

      // 重新赋值columnSort
      this.list.forEach((item, idx) => {
        item.columnSort = idx + 1;
        delete item._sort
      });
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
      // 自定义表单类型
      this.formTypeList = Object.keys(mFormItemComponents).map(item => ({
        label: item,
        value: item
      }))
      // 表单类型
      formTypeList().then(res => {
        this.formTypeList = [...(res.data || []), ...this.formTypeList]
      })
    },
  }
}
</script>

<style lang='scss' scoped>

</style>
