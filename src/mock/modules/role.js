const Mock = require('mockjs')
import { getQueryParams } from '@/utils'
import FlakeId from 'flakeid'
const ID_GEN = new FlakeId({
  mid: 1,
  timeOffset: (2022-1970)*31536000*1000
})

//延时200-600毫秒请求到数据
Mock.setup({
  timeout: '200-600'
})

const arr = Mock.mock({
  list: [
    { id: 1, roleKey: 'admin', name: '超级管理员', desc: '拥有网站的所有权限,建议开发者使用', usersCount: 1, status: 1 },
    { id: 2, roleKey: 'manager', name: '管理员', desc: '建议网站管理员使用', usersCount: 5, status: 0 },
    { id: 3, roleKey: 'common', name: '普通用户', desc: '建议网站普通用户使用', usersCount: 57, status: 1 }
  ]
})

Mock.mock(/api\/system\/role\/list/, 'get', options => {
  // 从options.url 解析请求参数
  const queryParams = getQueryParams(options.url)
  return {
    code: 0,
    msg: 'success',
    data: {
      total: arr.list.length,
      list: arr.list.slice((queryParams.page - 1) * queryParams.size, queryParams.page * queryParams.size)
    }
  }
})

Mock.mock(/api\/system\/role$/, 'post', options => {
  const data = JSON.parse(options.body)
  data.id = ID_GEN.gen()
  arr.list.unshift(data)
  return {
    code: 0,
    msg: 'success'
  }
})

Mock.mock(/api\/system\/role/, 'put', options => {
  const data = JSON.parse(options.body)
  arr.list = arr.list.map(item => {
    if (item.id === data.id) {
      return data
    }
    return item
  })
  return {
    code: 0,
    msg: 'success'
  }
})

Mock.mock(/api\/system\/role/, 'delete', options => {
  const { id } = JSON.parse(options.body)
  arr.list = arr.list.filter(item => item.id !== id)
  return {
    code: 0,
    msg: 'success'
  }
})
Mock.mock(/api\/system\/role\/batch/, 'delete', options => {
  const { ids } = JSON.parse(options.body)
  arr.list = arr.list.filter(item => !ids.includes(item.id))
  return {
    code: 0,
    msg: 'success'
  }
})
