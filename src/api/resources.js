import request from '@/utils/request'
import requestJSON from '@/utils/requestJSON'

// driver List
export function driverList() {
  return request({
    url: '/api/supply/driver/my',
    method: 'get'
  })
}

// driver add
export function driverAdd(data) {
  return request({
    url: '/api/supply/driver/add',
    method: 'post',
    data
  })
}

// driver edit
export function driverEdit(id, data) {
  return request({
    url: '/api/supply/driver/' + id,
    method: 'patch',
    data
  })
}

// Truck List
export function truckList() {
  return request({
    url: '/api/supply/trucks/my',
    method: 'get'
  })
}

// Truck add
export function truckAdd(data) {
  return request({
    url: '/api/supply/trucks/add',
    method: 'post',
    data
  })
}

// Truck edit
export function truckEdit(data) {
  return request({
    url: '/api/supply/trucks/modify',
    method: 'post',
    data
  })
}

// 列出当前所有线路
export function getRoute(params) {
  return request({
    url: '/api/supply/ftl/my',
    method: 'get',
    params
  })
}

// 提交新线路
export function addRoute(data) {
  return requestJSON({
    url: '/api/supply/ftl/add',
    method: 'post',
    data
  })
}

// 修改线路
export function updateRoute(id, data) {
  return requestJSON({
    url: '/api/supply/ftl/update/' + id,
    method: 'post',
    data
  })
}

// 获取佛历年
export function getBcYear() {
  return request({
    url: '/misc/date/bc/year',
    method: 'get'
  })
}

// 获取当月天数
export function getBcDay(year, month) {
  return request({
    url: `/misc/date/bc/days?bcYear=${year}&month=${month}`,
    method: 'get'
  })
}
