import WS, { MSG_CMD, checkCmd } from '@/utils/ws'

const ws = new WS({ path: '/ws' })

/**
 * 监听器
 */
const listeners = {}

/**
 * 订阅消息
 * @param {Number} cmd 消息类型
 * @param {function} callback 服务端来消息时触发的回调
 */
function subscribe(cmd, callback) {
  checkCmd(cmd)

  if (!listeners[cmd]) {
    listeners[cmd] = new Set()
  }
  listeners[cmd].add(callback)
}

/**
 * 取消订阅
 * @param {Number} cmd 消息类型
 * @param {function} callback 服务端来消息时触发的回调
 */
function unsubscribe(cmd, callback) {
  checkCmd(cmd)

  if (!listeners[cmd]) {
    return
  }
  listeners[cmd].delete(callback)
}

ws.onmessage((event) => {
  const response = JSON.parse(event.data)
  const cmd = response.cmd

  if (!listeners[cmd] || listeners[cmd].size < 1) {
    return
  }

  listeners[cmd].forEach((callback) => {
    try {
      callback(response.data)
    } catch (e) { console.error(e) }
  })
})

/**
 * 给服务端发送消息
 * @param {Number} cmd 消息类型
 * @param {Object} data 给服务端发送的数据
 */
function sendMessage(cmd, data) {
  checkCmd(cmd)
  ws.sendMessage(cmd, data)
}

/**
 * 建立连接
 */
function connect() {
  ws.connect()
}

/**
 * 关闭连接
 */
function close() {
  ws.close()
}


export default {
  subscribe,
  unsubscribe,
  sendMessage,
  connect,
  close,
  MSG_CMD
}
