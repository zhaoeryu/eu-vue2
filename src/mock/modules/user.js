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

const USER_BASIC = {
  'id|+1': 1,
  username: '@first',
  nickname: '@cname',
  avatar: require('@/assets/demo/avatar.png'),
  dept: '研发部',
  mobile: '@integer(13000000000, 18999999999)',
  email: '@first' + '@last' + '@eubackend.com',
  'sex|1': [0, 1],
  'status|1': [0, 1],
  lastLoginTime: '@datetime',
  lastLoginAddress: '@province - @city - @county',
  lastLoginIp: '@ip',
  prevLoginTime: '@datetime',
  prevLoginAddress: '@province - @city - @county',
  password: '123456',
  remark: '@cparagraph',
  passwordResetTime: '@datetime',
  createTime: '@datetime',
  postIds: [1, 2, 3],
  roleIds: [1, 2, 3],
  deptId: 2000
}

const arr = Mock.mock({
  'list|25': [
    USER_BASIC
  ]
})

arr.list.push(Object.assign({}, arr.list[0], {
  id: 10086,
  username: 'admin',
  password: 'admin123'
}))

Mock.mock(/api\/system\/user\/list/, 'get', options => {
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

Mock.mock(/api\/system\/user$/, 'post', options => {
  const data = JSON.parse(options.body)
  data.id = ID_GEN.gen()
  arr.list.unshift(data)
  return {
    code: 0,
    msg: 'success'
  }
})

Mock.mock(/api\/system\/user/, 'put', options => {
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

Mock.mock(/api\/system\/user$/, 'delete', options => {
  const { id } = JSON.parse(options.body)
  arr.list = arr.list.filter(item => item.id !== id)
  return {
    code: 0,
    msg: 'success'
  }
})

Mock.mock(/api\/auth\/login/, 'post', options => {
  const data = JSON.parse(options.body)
  const user = arr.list.find(item => item.username === data.username && item.password === data.password)
  if (user) {
    return {
      code: 0,
      msg: 'success',
      data: {
        token: user.id
      }
    }
  } else {
    return {
      code: 500,
      msg: '用户名或密码错误'
    }
  }
})

Mock.mock(/api\/auth\/info/, 'get', () => {
  const user = arr.list.find(item => item.id === 10086)
  return {
    code: 0,
    msg: 'success',
    data: {
      user,
      roles: ['admin'],
      permissions: ['*:*:*']
    }
  }
})

Mock.mock(/api\/system\/user\/batch/, 'delete', options => {
  const { ids } = JSON.parse(options.body)
  arr.list = arr.list.filter(item => !ids.includes(item.id))
  return {
    code: 0,
    msg: 'success'
  }
})
