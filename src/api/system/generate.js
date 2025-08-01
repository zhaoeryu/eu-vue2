import request from '@/utils/request'

export function page(params) {
  return request({
    url: '/api/gen/page',
    method: 'get',
    params
  })
}
export function preview(params) {
  return request({
    url: '/api/gen/preview',
    method: 'get',
    params
  })
}
export function tableInfo(params) {
  return request({
    url: '/api/gen/tableInfo',
    method: 'get',
    params
  })
}
export function syncTable(params) {
  return request({
    url: '/api/gen/sync',
    method: 'post',
    params
  })
}
export function save(data) {
  return request({
    url: '/api/gen/save',
    method: 'post',
    data
  })
}
export function queryTypeList() {
  return request({
    url: '/api/gen/queryType',
    method: 'get'
  })
}
export function formTypeList() {
  return request({
    url: '/api/gen/formType',
    method: 'get'
  })
}