import Vue from 'vue'

// 重置样式
import 'normalize.css/normalize.css'

// 复制到剪切板
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

// JS工具类
import loadsh from 'loadsh'
Vue.prototype._ = loadsh

const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)
require('dayjs/locale/zh-cn')
dayjs.locale('zh-cn')
Vue.prototype.dayjs = dayjs

// nprogress进度条
import 'nprogress/nprogress.css'

// 完整导入 UI 组件库
import VxeUI from 'vxe-pc-ui'
import 'vxe-pc-ui/lib/style.css'

// 完整导入 表格库
import VxeUITable from 'vxe-table'
import 'vxe-table/lib/style.css'

VxeUI.setConfig({
  emptyCell: '　',
  table: {
    size: 'mini',
  },
  form: {
    size: 'mini'
  }
})

Vue.use(VxeUI)
Vue.use(VxeUITable)
