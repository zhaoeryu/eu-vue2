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
Vue.prototype.$enumsParse = enumsParse
Vue.prototype.$enumsParseLabel = enumsParseLabel
Vue.prototype.$enumsConvertToList = enumsConvertToList

// 默认系统配置
import { defaultSetting } from '@/settings'
Vue.prototype.defaultSetting = defaultSetting

// 权限方法
import { hasPermission, hasRole } from '@/utils/permission'
Vue.prototype.$permission = hasPermission
Vue.prototype.$role = hasRole

// 打开表格列设置Dialog
import { openTableColumnSettingDialog } from '@/utils/eu'
Vue.prototype.$openTableColumnSettingDialog = openTableColumnSettingDialog
