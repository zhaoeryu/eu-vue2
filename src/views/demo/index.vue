<template>
  <div class="page-container">
    <div class="page-body">
      <query-expand-wrapper :show="isQueryShow">
        <el-form :model="queryParams" :inline="true">
          <el-form-item label="Name" prop="name">
            <el-input v-model="queryParams.name" placeholder="请输入Name" clearable />
          </el-form-item>
          <el-form-item label="Sex" prop="sex">
            <el-select v-model="queryParams.sex" placeholder="请选择性别" clearable>
              <el-option
                v-for="item in sexList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="onQuery">{{ $t('general.query.search') }}</el-button>
            <el-button icon="el-icon-refresh" plain @click="onQuery">{{ $t('general.query.reset') }}</el-button>
          </el-form-item>
        </el-form>
      </query-expand-wrapper>
      <div>
        <eu-table-toolbar
          :multiple-disabled="multipleDisabled"
          :sort.sync="queryParams.sort"
          :ref-table="$refs.table"
          :searchToggle.sync="isQueryShow"
        >
          <template v-if="!multipleDisabled" #left>
            <span style="display: inline-block;padding-right: 1em;">
              已选{{ selectedTotal.count }}，合计Number: {{ selectedTotal.num || '-' }}
            </span>
          </template>
        </eu-table-toolbar>
        <vxe-table
          id="table"
          border
          resizable
          show-overflow
          ref="table"
          :loading="loading"
          :data="list"
          :row-config="{isHover: true}"
          @checkbox-all="onSelectionChange"
          @checkbox-change="onSelectionChange"
          :custom-config="customConfig"
        >
          <vxe-column type="checkbox" width="40" fixed="left"></vxe-column>
          <vxe-column type="seq" min-width="60" fixed="left"></vxe-column>
          <vxe-colgroup
            title="Group Name"
            field="group_name"
          >
            <vxe-column
              field="name"
              title="Name"
              min-width="100"
              :visible="true"
            >
              <template #header>
                <el-input
                  v-model="queryParams.name"
                  clearable
                  :placeholder="$t('general.placeholder.enter.search')"
                  @change="onQuery"
                  style="width: 100%;"
                />
              </template>
            </vxe-column>
          </vxe-colgroup>
          <vxe-colgroup
            title="Group Role"
            field="group_role"
            :visible="true"
          >
            <vxe-column
              field="role"
              title="Role"
              min-width="100"
            >
              <template #header>
                <el-select
                  v-model="queryParams.role"
                  clearable
                  style="width: 100%;"
                  @change="onQuery"
                  filterable
                >
                  <el-option
                    v-for="item in roleOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </template>
            </vxe-column>
          </vxe-colgroup>
          <vxe-colgroup
            title="Group Sex"
            field="group_sex"
          >
            <vxe-column
              field="sex"
              title="Sex"
              min-width="100"
            >
              <template #header>
                <el-select
                  v-model="queryParams.sex"
                  clearable
                  style="width: 100%;"
                  @change="onQuery"
                >
                  <el-option
                    v-for="item in sexList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </template>
              <template #default="{ row }">
                <span>{{ formatterSex(row.sex) }}</span>
              </template>
            </vxe-column>
          </vxe-colgroup>
          <vxe-colgroup
            title="Group Date"
            field="group_date"
          >
            <vxe-column
              field="date12"
              title="Date"
              min-width="150"
            >
              <template #header>
                <el-date-picker
                  v-model="queryParams.date"
                  type="daterange"
                  range-separator="-"
                  format="MM-dd"
                  value-format="yyyy-MM-dd"
                  clearable
                  @change="onQuery"
                  style="width: 100%;"
                >
                </el-date-picker>
              </template>
            </vxe-column>
          </vxe-colgroup>
          <vxe-column
            field="sex2"
            title="多选下拉"
            min-width="100"
          >
            <template #default="{ row }">
              <span>{{ formatMultiSex(row.sex2) }}</span>
            </template>
          </vxe-column>
          <vxe-column
            field="num1"
            title="Number"
            min-width="100"
          >
          </vxe-column>
          <vxe-column
            field="address"
            title="Address"
            min-width="100"
          >
          </vxe-column>
          <vxe-column field="age" title="Age" min-width="100"></vxe-column>
          <vxe-column field="name2" title="Name2" min-width="100" :visible="false"></vxe-column>
          <vxe-column field="name3" title="Name3" min-width="100" :visible="false"></vxe-column>
          <vxe-column field="name4" title="name4" min-width="100"></vxe-column>
          <vxe-column field="name5" title="name5" min-width="100"></vxe-column>
          <vxe-column field="name6" title="name6" min-width="100"></vxe-column>
          <vxe-column field="name7" title="name7" min-width="100"></vxe-column>
          <vxe-column field="name8" title="name8" min-width="100"></vxe-column>
          <vxe-column :field="$tableColumnField.operation" :title="$t('general.column.operation')" min-width="130" :show-overflow="false" fixed="right">
            <template #default>
              <el-button type="text">{{ $t('general.edit') }}</el-button>
              <el-button type="text">{{ $t('general.del') }}</el-button>
              <el-button type="text">{{ $t('sysNotice.button.detail') }}</el-button>
            </template>
          </vxe-column>
        </vxe-table>
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
import EuTableToolbar from '@/components/Crud/EuTableToolbar/index.vue'
import TableColumnSettingMixin from '@/mixins/TableColumnSettingMixin'
import QueryExpandWrapper from '@/components/Crud/QueryExpandWrapper/index.vue'

export default {
  name: 'Demo',
  mixins: [TableColumnSettingMixin(['table'])],
  components: { QueryExpandWrapper, EuTableToolbar },
  data() {
    const sexList = [
      { label: '男', value: '1' },
      { label: '女', value: '0' }
    ]
    const roleOptions = [
      { label: 'Develop', value: 'Develop' },
      { label: 'Designer', value: 'Designer' },
      { label: 'Test', value: 'Test' },
      { label: 'PM', value: 'PM' }
    ]
    const formatterSex = cellValue => {
      const item = sexList.find(item => item.value === cellValue)
      return item ? item.label : ''
    }
    const sexFilterMethod = ({ option, row, column }) => {
      if (option.data) {
        return row[column.field] === option.data
      }
      return true
    }
    return {
      total: 0,
      multipleDisabled: true,

      isQueryShow: true,
      queryParams: {
        name: null,
        role: null,
        sex: null,
        date: null,

        page: 1,
        size: 10,
      },
      loading: false,
      list: [],
      sexList,
      formatterSex,
      sexFilterMethod,
      roleOptions,
      selectedTotal: {
        count: null,
        num: null
      }
    }
  },
  mounted() {
    this.onQuery()
  },
  methods: {
    // 前端分页
    onQuery() {
      console.log('queryParams', this.queryParams)
      this.loading = true

      setTimeout(() => {
        this.list = [
          {
            id: 10001,
            name: 'Test1',
            name2: 'Test1',
            name3: 'Test1',
            name4: 'Test1',
            name5: 'Test1',
            name6: 'Test1',
            name7: 'Test1',
            name8: 'Test1',
            nickname: 'T1',
            role: 'Develop',
            sex: '0',
            sex2: ['0'],
            num1: 40,
            age: 28,
            address: 'Shenzhen',
            date12: '',
            date13: ''
          },
          {
            id: 10002,
            name: 'Test2',
            name2: 'Test2',
            name3: 'Test2',
            name4: 'Test2',
            name5: 'Test2',
            name6: 'Test2',
            name7: 'Test2',
            name8: 'Test2',
            nickname: 'T2',
            role: 'Designer',
            sex: '1',
            sex2: ['0', '1'],
            num1: 44,
            age: 22,
            address: 'Guangzhou',
            date12: '',
            date13: '2020-08-20'
          },
          {
            id: 10003,
            name: 'Test3',
            name2: 'Test3',
            name3: 'Test3',
            name4: 'Test3',
            name5: 'Test3',
            name6: 'Test3',
            name7: 'Test3',
            name8: 'Test3',
            nickname: 'T3',
            role: 'Test',
            sex: '0',
            sex2: ['1'],
            num1: 200,
            age: 32,
            address: 'Shanghai',
            date12: '2020-09-10',
            date13: ''
          },
          {
            id: 10004,
            name: 'Test4',
            name2: 'Test4',
            name3: 'Test4',
            name4: 'Test4',
            name5: 'Test4',
            name6: 'Test4',
            name7: 'Test4',
            name8: 'Test4',
            nickname: 'T4',
            role: 'Designer',
            sex: '1',
            sex2: ['1'],
            num1: 30,
            age: 23,
            address: 'Shenzhen',
            date12: '',
            date13: '2020-12-04'
          },
          {
            id: 10005,
            name: 'Test5',
            name2: 'Test5',
            name3: 'Test5',
            name4: 'Test5',
            name5: 'Test5',
            name6: 'Test5',
            name7: 'Test5',
            name8: 'Test5',
            nickname: 'T5',
            role: 'Develop',
            sex: '0',
            sex2: ['1', '0'],
            num1: 20,
            age: 30,
            address: 'Shanghai',
            date12: '2020-09-20',
            date13: ''
          },
          {
            id: 10006,
            name: 'Test6',
            name2: 'Test6',
            name3: 'Test6',
            name4: 'Test6',
            name5: 'Test6',
            name6: 'Test6',
            name7: 'Test6',
            name8: 'Test6',
            nickname: 'T6',
            role: 'Designer',
            sex: '1',
            sex2: ['0'],
            num1: 10,
            age: 21,
            address: 'Shenzhen',
            date12: '',
            date13: ''
          },
          {
            id: 10007,
            name: 'Test7',
            name2: 'Test7',
            name3: 'Test7',
            name4: 'Test7',
            name5: 'Test7',
            name6: 'Test7',
            name7: 'Test7',
            name8: 'Test7',
            nickname: 'T7',
            role: 'Develop',
            sex: '0',
            sex2: ['0'],
            num1: 5,
            age: 29,
            address: 'Shenzhen',
            date12: '2020-01-02',
            date13: '2020-09-20'
          },
          {
            id: 10008,
            name: 'Test8',
            name2: 'Test8',
            name3: 'Test8',
            name4: 'Test8',
            name5: 'Test8',
            name6: 'Test8',
            name7: 'Test8',
            name8: 'Test8',
            nickname: 'T8',
            role: 'PM',
            sex: '1',
            sex2: ['0'],
            num1: 2,
            age: 35,
            address: 'Shenzhen',
            date12: '',
            date13: ''
          },
          {
            id: 10009,
            name: 'Test9',
            name2: 'Test9',
            name3: 'Test9',
            name4: 'Test9',
            name5: 'Test9',
            name6: 'Test9',
            name7: 'Test9',
            name8: 'Test9',
            nickname: 'T9',
            role: 'Designer',
            sex: '1',
            sex2: ['0'],
            num1: 60,
            age: 26,
            address: 'Shenzhen',
            date12: '',
            date13: ''
          },
          {
            id: 100010,
            name: 'Test10',
            name2: 'Test10',
            name3: 'Test10',
            name4: 'Test10',
            name5: 'Test10',
            name6: 'Test10',
            name7: 'Test10',
            name8: 'Test10',
            nickname: 'T10',
            role: 'Develop',
            sex: '0',
            sex2: ['0'],
            num1: 55,
            age: 32,
            address: 'Shenzhen',
            date12: '',
            date13: ''
          },
        ]
        this.total = 99
        this.loading = false
      }, 500)
    },
    formatMultiSex(values) {
      if (values) {
        return values.map(val => this.formatterSex(val)).join(',')
      }
      return ''
    },
    onSelectionChange({ records }) {
      this.multipleDisabled = !records.length

      this.selectedTotal.count = records.length
      this.selectedTotal.num = records.reduce((total, record) => total + record.num1, 0)
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
