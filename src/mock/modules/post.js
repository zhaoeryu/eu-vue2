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
    { id: 1, name: '总裁', code: 'ceo', status: 0 },
    { id: 2, name: '副总裁', code: 'ap', status: 1 },
    { id: 3, name: '总经理', code: 'hr', status: 1 },
    { id: 4, name: '副总经理', code: 'am', status: 1 },
    { id: 5, name: '前台', code: 'qt', status: 1 },
  ]
})

Mock.mock(/api\/system\/post\/list/, 'get', options => {
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

Mock.mock(/api\/system\/post$/, 'post', options => {
  const data = JSON.parse(options.body)
  data.id = ID_GEN.gen()
  arr.list.unshift(data)
  return {
    code: 0,
    msg: 'success'
  }
})

Mock.mock(/api\/system\/post/, 'put', options => {
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

Mock.mock(/api\/system\/post/, 'delete', options => {
  const { id } = JSON.parse(options.body)
  arr.list = arr.list.filter(item => item.id !== id)
  return {
    code: 0,
    msg: 'success'
  }
})
Mock.mock(/api\/system\/post\/batch/, 'delete', options => {
  const { ids } = JSON.parse(options.body)
  arr.list = arr.list.filter(item => !ids.includes(item.id))
  return {
    code: 0,
    msg: 'success'
  }
})
