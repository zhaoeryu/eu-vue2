import { getToken } from '@/utils/auth'

const WS_DEFAULT_CONFIG = {
  baseUrl: process.env.VUE_APP_WS_API,
  path: '/ws',
  // 日志输出开关
  logEnabled: true,
  // 心跳开关
  keepAliveEnabled: true,
  // 心跳间隔(ms)
  keepAliveInterval: 30 * 1000,
  // 重连开关
  reconnectEnabled: true,
  // 重连等待时间(ms)
  reconnectTimeout: 5 * 1000,
  // 重连最大尝试次数, -1：无限重连
  reconnectMaxRetry: -1
}

/**
 * 消息类型
 */
export const MSG_CMD = {
  // 第一次(或重连)初始化连接
  CONNECT: 1,
  // 客户端保持心跳
  KEEPALIVE: 2,
  TEXT_MESSAGE: 3
}

/**
 * 检查消息类型
 * @param {Number} cmd 消息类型
 */
export function checkCmd(cmd) {
  if (!Object.values(MSG_CMD).includes(cmd)) {
    throw new Error('无效的消息类型')
  }
}

/**
 * WebSocket 操作工具类
 * @param {Object} options 可选项
 * @returns {WS}
 * @constructor
 */
const WS = function (options) {

  const mergeOptions = Object.assign({}, WS_DEFAULT_CONFIG, options)

  const WebSocket = window.WebSocket || window.MozWebSocket

  // websocket连接实例
  this._connection = null
  this._connectionPromiseResolve = null
  this._connectionPromise = new Promise((resolve) => { this._connectionPromiseResolve = resolve })
  // 当前重连次数
  this._reconnectRetry = 0
  // 心跳定时器
  this._keepAliveTimer = null

  function log(msg, ...args) {
    if (mergeOptions.logEnabled) {
      if (args.length === 0) {
        console.log(msg)
      } else {
        console.log(msg, args)
      }
    }
  }

  /**
   * 建立连接
   */
  this.connect = () => {
    if (!WebSocket) {
      console.error('您的浏览器不支持WebSocket协议,无法进行连接')
      return
    }
    if (this._connection) {
      return
    }

    // 是否打开重连，解决手动关闭后，再次打开无法重连开关被关闭的问题
    if (options.reconnectEnabled || WS_DEFAULT_CONFIG.reconnectEnabled) {
      mergeOptions.reconnectEnabled = true
    }

    log('[ws]开始连接')

    // 开始连接
    this._connection = new WebSocket(mergeOptions.baseUrl + mergeOptions.path + '?token=' + getToken())

    // 事件监听
    this._connection.onopen = this._onopen
    this._connection.onclose = this._onclose
    this._connection.onmessage = this._onmessage
  }

  /**
   * 连接打开时
   * @param {Object} event websocket api 原生事件对象
   */
  this._onopen = (event) => {
    log('[ws]连接已打开')

    this._connectionPromiseResolve(this._connection)

    this._reconnectRetry = 0
    this.sendMessage(MSG_CMD.CONNECT, {})

    // 开始心跳
    if (mergeOptions.keepAliveEnabled) {
      this._keepAlive()
    }

    mergeOptions.onopen && mergeOptions.onopen(event)
  }
  this.onopen = (callback) => {
    mergeOptions.onopen = callback
  }

  /**
   * 重连
   */
  this._reconnect = () => {
    if (this._connection && this._connection.readyState === WebSocket.OPEN) {
      return
    }

    this._connectionPromise = new Promise((resolve) => { this._connectionPromiseResolve = resolve })
    this._connection = null

    this._reconnectRetry = (this._reconnectRetry || 0) + 1
    if (this._reconnectRetry > mergeOptions.reconnectMaxRetry && mergeOptions.reconnectMaxRetry !== -1) {
      // 超过最大重连次数
      return
    }

    log('[ws]尝试第 %d 次重新连接', this._reconnectRetry)

    setTimeout(() => {
      this.connect()
    }, mergeOptions.reconnectTimeout)
  }

  /**
   * 心跳
   */
  this._keepAlive = () => {
    if (!mergeOptions.keepAliveEnabled) {
      // 心跳未启用
      return
    }
    this._keepAliveTimer = setTimeout(() => {
      this.sendMessage(MSG_CMD.KEEPALIVE, {})
      this._keepAlive()
    }, mergeOptions.keepAliveInterval)
  }

  /**
   * 连接关闭时
   * @param {Object} event websocket api 原生事件对象
   * @private
   */
  this._onclose = (event) => {
    log('[ws]连接已关闭')
    // 清除心跳定时器
    if (this._keepAliveTimer) {
      clearTimeout(this._keepAliveTimer)
      this._keepAliveTimer = null
    }

    // 尝试重连
    if (mergeOptions.reconnectEnabled) {
      this._reconnect()
    }

    mergeOptions.onclose && mergeOptions.onclose(event)
  }

  this.onclose = (callback) => {
    mergeOptions.onclose = callback
  }

  /**
   * 关闭连接
   */
  this.close = () => {
    // 关闭重连开关
    mergeOptions.reconnectEnabled = false
    // 关闭连接
    if (this._connection && this._connection.readyState === WebSocket.OPEN) {
      this._connection.close()
    }
  }

  this._onmessage = (event) => {
    mergeOptions.onmessage && mergeOptions.onmessage(event)
  }
  this.onmessage = (callback) => {
    mergeOptions.onmessage = callback
  }

  /**
   * 发送消息
   * @param {Number} cmd 消息类型
   * @param {Object} data 发送给服务器的数据
   */
  this.sendMessage = (cmd, data) => {
    checkCmd(cmd)

    data = data || {}
    const payload = JSON.stringify({
      cmd,
      data
    })

    this._connectionPromise.then(connection => {
      connection.send(payload)
    })
  }

  return this
}

export default WS
