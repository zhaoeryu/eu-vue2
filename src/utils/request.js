import axios from 'axios'
import { getToken } from '@/utils/auth'
import { EU_FRONT_KEY, REQUEST_HEADER_TOKEN } from '@/utils/constants'
import errorCode from '@/utils/errorCode'
import { Message, Loading } from 'element-ui'
import { blobValidate } from '@/utils/index'
import { saveAs } from 'file-saver'
import { defaultSetting } from '@/settings'
import qs from 'qs'
import i18n, { i18nConvertConnector } from '@/plugins/i18n'

export const commonReqHeaders = {
  'X-Eu-Front': EU_FRONT_KEY,
  'X-Eu-Front-Version': defaultSetting.version,
  'Accept-Language': i18nConvertConnector(i18n.locale)
}

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

let downloadLoadingInstance;

const service = axios.create({
  baseURL: defaultSetting.BASE_API,
  // baseURL:  '/',
  timeout: 20 * 1000,
  // 4种不同形式
  //1.qs.stringify({ids: [1, 2, 3]}, { indices: false }) --形式： ids=1&ids=2&ids=3
  //2.qs.stringify({ids: [1, 2, 3]}, {arrayFormat: ‘indices‘}) --形式：      ids[0]=1&ids[1]=2&ids[2]=3
  //3.qs.stringify({ids: [1, 2, 3]}, {arrayFormat: ‘brackets‘})  --形式：ids[]=1&ids[]=2&ids[]=3
  //4.qs.stringify({ids: [1, 2, 3]}, {arrayFormat: ‘repeat‘})  --形式： ids=1&ids=2&ids=3
  paramsSerializer: params => qs.stringify(params, { indices: false }),
  headers: { ...commonReqHeaders }
})

service.interceptors.request.use(config => {
  if (getToken()) {
    config.headers[REQUEST_HEADER_TOKEN] = getToken()
  }

  return config
}, error => {
  console.error(error)
  Promise.reject(error)
})

service.interceptors.response.use(res => {
  // 未设置状态码则默认成功状态
  const code = res.data.code || 200
  // 获取错误信息
  const message = res.data.msg || errorCode[code] || errorCode['default']
  // 二进制数据则直接返回
  if (res.request.responseType ===  'blob' || res.request.responseType ===  'arraybuffer') {
    return res.data
  }
  // 如果是成功状态则直接返回
  if (code === 200) {
    return res.data
  }
  if (code === 401) {
    if (!res.config.silent) {
      showMessage(res, { message, type: 'warning' })
    }
    return Promise.reject(message)
  } else if (code === 600) {
    // 警告消息
    showMessage(res, { message, type: 'warning' })
  } else if (code === 500) {
    // 错误消息
    showMessage(res, { message, type: 'error' })
  } else {
    showMessage(res, { message, type: 'error' })
  }
  return Promise.reject(message)
}, error => {
  let { message } = error;
  if (message === 'Network Error') {
    message = i18n.t('request.error.network');
  } else if (message.includes('timeout')) {
    message = i18n.t('request.error.timeout');
  } else if (message.includes('Request failed with status code')) {
    message = i18n.t('request.error.failed', { msg: message.substr(message.length - 3) });
  }
  Message({ message: message, type: 'error', duration: 5 * 1000 })
  return Promise.reject(error)
})

// 通用下载方法
export function download(url, params, filename, config) {
  downloadLoadingInstance = Loading.service({ text: i18n.t('request.download.loading'), spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)', })
  return service.post(url, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      [REQUEST_HEADER_TOKEN]: getToken()
    },
    responseType: 'blob',
    ...config
  }).then(async (data) => {
    const isBlob = blobValidate(data);
    if (isBlob) {
      const blob = new Blob([data])
      saveAs(blob, filename)
    } else {
      const resText = await data.text();
      const rspObj = JSON.parse(resText);
      const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
      if (rspObj.code === 200) {
        Message.success(errMsg || i18n.t('request.download.success'))
      } else {
        Message.error(errMsg);
      }
    }
    downloadLoadingInstance.close();
  }).catch((r) => {
    console.error(r)
    Message.error(i18n.t('request.download.error'))
    downloadLoadingInstance.close();
  })
}

function showMessage(res, messageOptions) {
  /*
   * 调用的地方可以通过设置 silent 属性来控制是否显示错误消息
   * 例如：
   * request({
   *   url: '/api/system/menu',
   *   method: 'get',
   *   silent: true
   * })
   */
  if (res.config.silent) {
    // 静默不处理
    return
  }
  Message(messageOptions)
}

export default service
