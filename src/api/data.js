import request from '@/utils/request'

// 卡车类型
export function getTruckType() {
  return request({
    url: '/misc/types/truck',
    method: 'get'
  })
}

// 货物属性
export function getGoodsProperty() {
  return request({
    url: '/misc/property/list',
    method: 'get'
  })
}

// 寄件人列表
export function getSenderList() {
  return request({
    url: '/api/demand/order/search/sender/list',
    method: 'get'
  })
}

// ftlLine
export function myAccount(applyType) {
  return request({
    url: 'api/member/finance/account/my/' + applyType,
    method: 'get'
  })
}

// 运输公司列表
export function getTransportList() {
  return request({
    url: '/api/demand/order/search/transport/list',
    method: 'get'
  })
}

// 所有省份
export function getProvinceList() {
  return request({
    url: '/misc/geo/province/list',
    method: 'get'
  })
}

// 所有市
export function getCityList() {
  return request({
    url: '/misc/geo/city/list',
    method: 'get'
  })
}

// 省份分区
export function getProvinceArea() {
  return request({
    url: '/misc/geo/area/province',
    method: 'get'
  })
}

// 所有包含区
export function findDistrictList(data) {
  return request({
    url: '/misc/geo/district/search',
    method: 'post',
    data
  })
}

// 所有包含区
export function findDistrictFullList(data, data2) {
  return request({
    url: '/misc/geo/district/search/fullname',
    method: 'post',
    data,
    params: data2
  })
}

// 收费服务翻译
export function getExtraServer() {
  return request({
    url: '/misc/types/extra/service',
    method: 'get'
  })
}
