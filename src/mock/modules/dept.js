const Mock = require('mockjs')
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
    {
      id: 100,
      name: '上海分',
      status: '@integer(0, 1)',
      sort: '@integer(0, 100)',
      parentId: null,
    },
    {
      id: 1001,
      name: '人事部',
      status: '@integer(0, 1)',
      sort: '@integer(0, 100)',
      parentId: 100
    },
    {
      id: 1002,
      name: '行政部',
      status: '@integer(0, 1)',
      sort: '@integer(0, 100)',
      parentId: 100
    },
    {
      id: 1003,
      name: '财务部',
      status: '@integer(0, 1)',
      sort: '@integer(0, 100)',
      parentId: 100
    },
    {
      id: 200,
      name: '北京分',
      status: '@integer(0, 1)',
      sort: '@integer(0, 100)',
      parentId: null
    },
    {
      id: 2000,
      name: '研发部',
      status: '@integer(0, 1)',
      sort: '@integer(0, 100)',
      parentId: 200
    },
    {
      id: 2001,
      name: '行政部',
      status: '@integer(0, 1)',
      sort: '@integer(0, 100)',
      parentId: 200
    }
  ]
})

Mock.mock(/api\/system\/dept\/list/, 'get', () => {
  // 从options.url 解析请求参数
  return {
    code: 0,
    msg: 'success',
    data: arr.list
  }
})

Mock.mock(/api\/system\/dept/, 'post', options => {
  const data = JSON.parse(options.body)
  data.id = ID_GEN.gen()
  arr.list.unshift(data)
  return {
    code: 0,
    msg: 'success'
  }
})

Mock.mock(/api\/system\/dept/, 'put', options => {
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

Mock.mock(/api\/system\/dept$/, 'delete', options => {
  const { id } = JSON.parse(options.body)
  arr.list = arr.list.filter(item => item.id !== id)
  return {
    code: 0,
    msg: 'success'
  }
})

Mock.mock(/api\/system\/dept\/batch/, 'delete', options => {
  const { ids } = JSON.parse(options.body)
  arr.list = arr.list.filter(item => !ids.includes(item.id))
  return {
    code: 0,
    msg: 'success'
  }
})
