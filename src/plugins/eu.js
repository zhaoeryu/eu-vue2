import Vue from 'vue'

// 建议放在element-ui后面，可以覆盖element-ui样式
import '@/assets/styles/index.scss'
import '@/assets/icons'

import EuLoading from '@/components/EuLoading'
import MCornerDecoration from '@/components/MCornerDecoration'
import EuEditor from '@/components/EuEditor'
import MBlockHeader from '@/components/MBlockHeader/index.vue'
import UploadFile from '@/components/UploadFile/index.vue'
import Pagination from '@/components/Pagination'
import TableColumnSettingDialog from '@/components/TableColumnSettingDialog/index.vue'
import QueryExpandWrapper from '@/components/Crud/QueryExpandWrapper/index.vue'
import EuTableToolbar from '@/components/Crud/EuTableToolbar/index.vue'
import ContentBlock from '@/components/ContentLayout/ContentBlock.vue'
import ContentFooter from '@/components/ContentLayout/ContentFooter.vue'
import ContentLayout from '@/components/ContentLayout/ContentLayout.vue'
import ContentBlockHeader from '@/components/ContentLayout/ContentBlockHeader.vue'

const components = [
  EuLoading,
  MCornerDecoration,
  EuEditor,
  MBlockHeader,
  UploadFile,
  Pagination,
  TableColumnSettingDialog,
  QueryExpandWrapper,
  EuTableToolbar,
  ContentBlock,
  ContentFooter,
  ContentLayout,
  ContentBlockHeader,
]

components.forEach(component => {
  Vue.component(component.name, component)
})

// 导入自定义的表单组件
import mFormItemComponents from '@/utils/m-form-item-components'
Object.keys(mFormItemComponents).forEach(key => {
  Vue.component(key, mFormItemComponents[key])
})

// 指令
import directive from '@/directive'
Vue.use(directive)

import { download } from '@/utils/request'
import DataTimeRangePickerOptions from '@/utils/elementUI_DataTimeRange_PickerOptions'
import {
  enumsParse,
  enumsParseLabel,
  enumsConvertToList
} from '@/utils/enums'
import businessEnums from '@/utils/business-enums'
import { defaultSetting } from '@/settings'
import { hasPermission, hasRole } from '@/utils/permission'
import { openNewWindow, openTableColumnSettingDialog } from '@/utils/eu'
import { EU_TABLE_COLUMN_FIELD_OPERATION } from '@/utils/constants'

Vue.prototype.download = download
Vue.prototype.$DataTimeRangePickerOptions = DataTimeRangePickerOptions
Vue.prototype.$enumsParse = enumsParse
Vue.prototype.$enumsParseLabel = enumsParseLabel
Vue.prototype.$enumsConvertToList = enumsConvertToList
Vue.prototype.$enums = businessEnums
Vue.prototype.defaultSetting = defaultSetting
Vue.prototype.$permission = hasPermission
Vue.prototype.$role = hasRole
Vue.prototype.$openTableColumnSettingDialog = openTableColumnSettingDialog
Vue.prototype.$tableColumnField = {
  operation: EU_TABLE_COLUMN_FIELD_OPERATION
}
Vue.prototype.$openNewWindow = openNewWindow
