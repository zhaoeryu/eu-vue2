import Vue from 'vue'

// 建议放在element-ui后面，可以覆盖element-ui样式
import '@/assets/styles/index.scss'
import '@/assets/icons'

// Loading
import EuLoading from '@/components/EuLoading'
Vue.component('EuLoading', EuLoading)

// CornerDecoration
import MCornerDecoration from '@/components/MCornerDecoration'
Vue.component('MCornerDecoration', MCornerDecoration)

// 富文本
import EuEditor from '@/components/EuEditor'
Vue.component('EuEditor', EuEditor)

// 组件
import MBlockHeader from '@/components/MBlockHeader/index.vue'
Vue.component('MBlockHeader', MBlockHeader)

// 上传文件
import UploadFile from '@/components/UploadFile/index.vue'
Vue.component('UploadFile', UploadFile)

// 分页
import Pagination from '@/components/Pagination'
Vue.component('Pagination', Pagination)

// el-table 列设置
import TableColumnSettingDialog from '@/components/TableColumnSettingDialog/index.vue'
Vue.component('TableColumnSettingDialog', TableColumnSettingDialog)

import QueryExpandWrapper from '@/components/Crud/QueryExpandWrapper/index.vue'
import EuTableToolbar from '@/components/Crud/EuTableToolbar/index.vue'
Vue.component('QueryExpandWrapper', QueryExpandWrapper)
Vue.component('EuTableToolbar', EuTableToolbar)

import ContentBlock from '@/components/ContentLayout/ContentBlock.vue'
import ContentFooter from '@/components/ContentLayout/ContentFooter.vue'
import ContentLayout from '@/components/ContentLayout/ContentLayout.vue'
import ContentBlockHeader from '@/components/ContentLayout/ContentBlockHeader.vue'
Vue.component(ContentBlock.name, ContentBlock)
Vue.component(ContentFooter.name, ContentFooter)
Vue.component(ContentLayout.name, ContentLayout)
Vue.component(ContentBlockHeader.name, ContentBlockHeader)

// 指令
import directive from '@/directive'
Vue.use(directive)

// 通用下载
import { download } from '@/utils/request'
Vue.prototype.download = download

// element-ui datetime 快捷选项
import DataTimeRangePickerOptions from '@/utils/elementUI_DataTimeRange_PickerOptions'
Vue.prototype.$DataTimeRangePickerOptions = DataTimeRangePickerOptions

// 枚举工具方法
import {
  enumsParse,
  enumsParseLabel,
  enumsConvertToList
} from '@/utils/enums'
import businessEnums from '@/utils/business-enums'
Vue.prototype.$enumsParse = enumsParse
Vue.prototype.$enumsParseLabel = enumsParseLabel
Vue.prototype.$enumsConvertToList = enumsConvertToList
Vue.prototype.$enums = businessEnums

// 默认系统配置
import { defaultSetting } from '@/settings'
Vue.prototype.defaultSetting = defaultSetting

// 权限方法
import { hasPermission, hasRole } from '@/utils/permission'
Vue.prototype.$permission = hasPermission
Vue.prototype.$role = hasRole

// 打开表格列设置Dialog
import { openNewWindow, openTableColumnSettingDialog } from '@/utils/eu'
import { EU_TABLE_COLUMN_FIELD_OPERATION } from '@/utils/constants'
Vue.prototype.$openTableColumnSettingDialog = openTableColumnSettingDialog

Vue.prototype.$tableColumnField = {
  operation: EU_TABLE_COLUMN_FIELD_OPERATION
}

Vue.prototype.$openNewWindow = openNewWindow

// 导入自定义的表单组件
import mFormItemComponents from '@/utils/m-form-item-components'
Object.keys(mFormItemComponents).forEach(key => {
  Vue.component(key, mFormItemComponents[key])
})