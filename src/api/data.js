import request from '@/utils/request'

// 卡车类型
export function truckType() {
  return request({
    url: '/misc/types/truck',
    method: 'get'
  })
}

// 所有省份
export function provinceList() {
  return request({
    url: '/misc/geo/province/list',
    method: 'get'
  })
}

// 所有式
export function cityList() {
  return request({
    url: '/misc/geo/city/list',
    method: 'get'
  })
}

// 所有区
export function districtList(data) {
  return request({
    url: '/misc/geo/district/search',
    method: 'post',
    data
  })
}
