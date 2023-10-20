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
  'list|25': [{
    // 属性 id 是一个自增数，起始值为 1，每次增 1
    'id|+1': 100,
    dictKey: '@word(3, 5)',
    remark: '@cparagraph(1)',
    status: '@integer(0, 1)'
  }]
})

const detailDictData = Mock.mock({
  'list|25': [{
    // 属性 id 是一个自增数，起始值为 1，每次增 1
    'id|+1': 1,
    'pid|+1': 100,
    dictKey: '@ctitle(3, 5)',
    dictValue: '@integer(0, 999)',
    dictSort: '@integer(0, 999)',
    status: '@integer(0, 1)',
    remark: '@ctitle(3, 5)'
  }]
})

Mock.mock(/api\/system\/dict\/list/, 'get', options => {
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
Mock.mock(/api\/system\/dict$/, 'post', options => {
  const body = JSON.parse(options.body)
  body.id = ID_GEN.gen()
  arr.list.unshift(body)
  return {
    code: 0,
    msg: 'success'
  }
})

Mock.mock(/api\/system\/dict$/, 'put', options => {
  const body = JSON.parse(options.body)
  arr.list = arr.list.map(item => {
    if (item.id === body.id) {
      return body
    }
    return item
  })
  return {
    code: 0,
    msg: 'success'
  }
})
Mock.mock(/api\/system\/dict\/batch-delete/, 'delete', options => {
  const ids = JSON.parse(options.body)
  console.log(ids)
  arr.list = arr.list.filter(item => !ids.includes(item.id))
  return {
    code: 0,
    msg: 'success'
  }
})
Mock.mock(/api\/system\/dict$/, 'delete', options => {
  const { id } = JSON.parse(options.body)
  console.log(id)
  arr.list = arr.list.filter(item => item.id !== id)
  return {
    code: 0,
    msg: 'success'
  }
})

Mock.mock(/api\/system\/dict\/detail\/list/, 'get', options => {
  // 从options.url 解析请求参数
  const queryParams = getQueryParams(options.url)
  return {
    code: 0,
    msg: 'success',
    data: {
      total: detailDictData.list.length,
      list: detailDictData.list.slice((queryParams.page - 1) * queryParams.size, queryParams.page * queryParams.size)
    }
  }
})

Mock.mock(/api\/system\/dict\/detail$/, 'post', options => {
  const body = JSON.parse(options.body)
  body.id = ID_GEN.gen()
  detailDictData.list.unshift(body)
  return {
    code: 0,
    msg: 'success'
  }
})

Mock.mock(/api\/system\/dict\/detail$/, 'put', options => {
  const body = JSON.parse(options.body)
  detailDictData.list = detailDictData.list.map(item => {
    if (item.id === body.id) {
      return body
    }
    return item
  })
  return {
    code: 0,
    msg: 'success'
  }
})

Mock.mock(/api\/system\/dict\/detail$/, 'delete', options => {
  const { id } = JSON.parse(options.body)
  console.log(id)
  detailDictData.list = detailDictData.list.filter(item => item.id !== id)
  return {
    code: 0,
    msg: 'success'
  }
})

Mock.mock(/api\/system\/dict\/detail\/batch/, 'delete', options => {
  const ids = JSON.parse(options.body)
  console.log(ids)
  detailDictData.list = detailDictData.list.filter(item => !ids.includes(item.id))
  return {
    code: 0,
    msg: 'success'
  }
})
