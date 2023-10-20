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
